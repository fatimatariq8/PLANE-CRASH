// Link Prediction:

CALL gds.graph.project(
  'linkp',
  'City',
  {
    FLIGHT_TO:{properties:['flightID'],
    orientation: 'UNDIRECTED'
    }
  }
)

CALL gds.graph.project(
  'fullGraph',
  ['City', 'Operator', 'CrashLocation'],
  {
    FLIGHT_TO: {
      orientation: 'UNDIRECTED',
      properties: ['flightID']
    },
    OPERATED_AT: {},
    CRASHED_At: {properties: ['flightID']}
  }
)

//pipeline1 (link pred pipeline for linkp projection)

CALL gds.beta.pipeline.linkPrediction.create('pipe')

CALL gds.beta.pipeline.linkPrediction.addNodeProperty('pipe', 'fastRP', {
  mutateProperty: 'embedding',
  embeddingDimension: 256,
  randomSeed: 42
})

CALL gds.beta.pipeline.linkPrediction.addFeature('pipe', 'hadamard', {
  nodeProperties: ['embedding']
}) YIELD featureSteps

CALL gds.beta.pipeline.linkPrediction.configureSplit('pipe', {
  testFraction: 0.25,
  trainFraction: 0.6,
  validationFolds: 3
})

YIELD splitConfig

CALL gds.beta.pipeline.linkPrediction.addLogisticRegression('pipe')
YIELD parameterSpace

CALL gds.beta.pipeline.linkPrediction.addRandomForest('pipe', {numberOfDecisionTrees: 20})
YIELD parameterSpace

CALL gds.alpha.pipeline.linkPrediction.addMLP('pipe',
{hiddenLayerSizes: [16, 8], penalty: 0.5, patience: 5, learningRate: 0.01, classWeights: [0.55, 0.45], focusWeight: {range: [0.0, 0.1]}})
YIELD parameterSpace

CALL gds.alpha.pipeline.linkPrediction.configureAutoTuning('pipe', {
  maxTrials: 10
}) 
YIELD autoTuningConfig

CALL gds.beta.pipeline.linkPrediction.train.estimate('linkp', {
  pipeline: 'pipe',
  modelName: 'lp-pipeline-model',
  targetRelationshipType: 'FLIGHT_TO'
})
YIELD requiredMemory

CALL gds.beta.pipeline.linkPrediction.train('linkp', {
  pipeline: 'pipe',
  modelName: 'lp-pipeline-model',
  metrics: ['AUCPR', 'OUT_OF_BAG_ERROR'],
  targetRelationshipType: 'FLIGHT_TO',
  randomSeed: 42
}) 
YIELD modelInfo, modelSelectionStats

RETURN
  modelInfo.bestParameters AS winningModel,
  modelInfo.metrics.AUCPR.train.avg AS avgTrainScore,
  modelInfo.metrics.AUCPR.outerTrain AS outerTrainScore,
  modelInfo.metrics.AUCPR.test AS testScore,
  [cand IN modelSelectionStats.modelCandidates | cand.metrics.AUCPR.validation.avg] AS validationScores

CALL gds.beta.pipeline.linkPrediction.predict.stream.estimate('linkp', {
  modelName: 'lp-pipeline-model',
  topN: 5,
  threshold: 0.5
})
YIELD requiredMemory

CALL gds.beta.pipeline.linkPrediction.predict.stream('linkp', {
  modelName: 'lp-pipeline-model',
  topN: 5,
  threshold: 0.5
})
YIELD node1, node2, probability
RETURN gds.util.asNode(node1).Name AS city1, gds.util.asNode(node2).Name AS city2, probability
ORDER BY probability DESC, city1

CALL gds.beta.pipeline.linkPrediction.predict.mutate('linkp', {
  modelName: 'lp-pipeline-model',
  relationshipTypes: ['FLIGHT_TO'],
  mutateRelationshipType: 'FLIGHT_EXHAUSTIVE_PREDICTED',
  threshold: 0.5
}) 
YIELD relationshipsWritten, samplingStats

CALL gds.beta.pipeline.linkPrediction.predict.mutate('linkp', {
  modelName: 'lp-pipeline-model',
  relationshipTypes: ['FLIGHT_TO'],
  mutateRelationshipType: 'FLIGHT_APPROX_PREDICTED',
  sampleRate: 0.5,
  topK: 1,
  randomJoins: 2,
  maxIterations: 3,
  // necessary for deterministic results
  concurrency: 1,
  randomSeed: 42
})
YIELD relationshipsWritten, samplingStats
