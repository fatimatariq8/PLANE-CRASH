// Node Classification:

// We can only work w numerical properties when it comes to node classification
Node: AircraftType
Properties: Make, Operator
// As our properties are not numerical, we first make them numerical.
// makeNum corresponds to Make, class corresponds to Operator class has already been loaded. 
// New csv for the makeNum of every Make

// 1. LOAD makeNum from make.csv

LOAD CSV WITH HEADERS FROM 'file:///make.csv' AS row
MERGE (at:AircraftType {Make: row.ACType})
SET at.MakeNum = toInteger(row.MakeNum)

// 2) We need to make some nodes unknown 

MATCH (a:AircraftType)
WITH a
LIMIT 40
SET a:UnknownAircraftType
REMOVE a.class

// 3) need to remove aircrafttype as their label

MATCH (a:UnknownAircraftType)
REMOVE a:AircraftType

// Now we start 
// Graph projection:
CALL gds.graph.project('class', {
    AircraftType: { properties: ['MakeNum', 'class'] },
    UnknownAircraftType: { properties: 'MakeNum' }
  },
  '*'
)

// Pipeline:
CALL gds.beta.pipeline.nodeClassification.create('pipe2')
CALL gds.beta.pipeline.nodeClassification.addNodeProperty('pipe2', 'scaleProperties', {
  nodeProperties: 'MakeNum',
  scaler: 'Mean',
  mutateProperty:'scaledSizes'
})
YIELD name, nodePropertySteps

CALL gds.beta.pipeline.nodeClassification.selectFeatures('pipe2', ['scaledSizes', 'MakeNum'])
YIELD name, featureProperties

CALL gds.beta.pipeline.nodeClassification.configureSplit('pipe2', {
  testFraction: 0.2,
  validationFolds: 5
})
YIELD splitConfig

CALL gds.beta.pipeline.nodeClassification.addLogisticRegression('pipe2')
YIELD parameterSpace

CALL gds.beta.pipeline.nodeClassification.addRandomForest('pipe2', {numberOfDecisionTrees: 10})
YIELD parameterSpace

CALL gds.alpha.pipeline.nodeClassification.addMLP('pipe2', {classWeights: [0.4,0.3,0.3], focusWeight: 0.5})
YIELD parameterSpace

CALL gds.beta.pipeline.nodeClassification.addLogisticRegression('pipe2', {maxEpochs: 500, penalty: {range: [1e-4, 1e2]}})
YIELD parameterSpace
RETURN parameterSpace.RandomForest AS randomForestSpace, parameterSpace.LogisticRegression AS logisticRegressionSpace, parameterSpace.MultilayerPerceptron AS MultilayerPerceptronSpace

CALL gds.alpha.pipeline.nodeClassification.configureAutoTuning('pipe2', {
  maxTrials: 2
}) 
YIELD autoTuningConfig

CALL gds.beta.pipeline.nodeClassification.train.estimate('class', {
  pipeline: 'pipe2',
  targetNodeLabels: ['AircraftType'],
  modelName: 'nc-model',
  targetProperty: 'class',
  randomSeed: 2,
  metrics: [ 'ACCURACY' ]
})
YIELD requiredMemory

CALL gds.beta.pipeline.nodeClassification.train('class', {
  pipeline: 'pipe2',
  targetNodeLabels: ['AircraftType'],
  modelName: 'nc-pipeline-model',
  targetProperty: 'class',
  randomSeed: 1227,
  metrics: ['ACCURACY']
}) 
YIELD modelInfo, modelSelectionStats
RETURN
  modelInfo.bestParameters AS winningModel,
  modelInfo.metrics.ACCURACY.train.avg AS avgTrainScore,
  modelInfo.metrics.ACCURACY.outerTrain AS outerTrainScore,
  modelInfo.metrics.ACCURACY.test AS testScore,
  [cand IN modelSelectionStats.modelCandidates | cand.metrics.ACCURACY.validation.avg] AS validationScores

CALL gds.beta.pipeline.nodeClassification.predict.stream('class', {
  modelName: 'nc-pipeline-model',
  includePredictedProbabilities: true,
  targetNodeLabels: ['UnknownAircraftType']
})
YIELD nodeId, predictedClass, predictedProbabilities
WITH gds.util.asNode(nodeId) AS aircraftNode, predictedClass, predictedProbabilities
RETURN
  aircraftNode.Make AS classifiedAircraft,
  predictedClass,
  floor(predictedProbabilities[predictedClass] * 100) AS confidence
  ORDER BY classifiedAircraft

CALL gds.beta.pipeline.nodeClassification.predict.mutate('class', {
  targetNodeLabels: ['UnknownAircraftType'],
  modelName: 'nc-pipeline-model',
  mutateProperty: 'predictedClass',
  predictedProbabilityProperty: 'predictedProbabilities'
}) 
YIELD nodePropertiesWritten