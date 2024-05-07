

// // import React, { useEffect, useState } from 'react';
// // import { getSession } from './neo';

// // const MyComponent = () => {
// //   const [cityCount, setCityCount] = useState(null);
// //   const [crashCount, setCrashCount] = useState(null);

// //   const handleRunQuery = (query, setter) => {
// //     const session = getSession();

// //     session.run(query)
// //       .then(result => {
// //         setter(result.records[0].get('count').toInt());
// //       })
// //       .catch(error => {
// //         console.error(error);
// //       })
// //       .finally(() => {
// //         session.close();
// //       });
// //   };

// //   return (
// //     <div>
// //       <div>
// //         <button onClick={() => handleRunQuery('MATCH (n:City) RETURN count(n) as count', setCityCount)}>Run City Query</button>
// //         {cityCount !== null && <div>Total Cities: {cityCount}</div>}
// //       </div>
// //       <div>
// //         <button onClick={() => handleRunQuery('MATCH (n:Crash) RETURN count(n) as count', setCrashCount)}>Run Crash Query</button>
// //         {crashCount !== null && <div>Total Crashes: {crashCount}</div>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MyComponent;

// import React, { useState } from 'react';
// import { getSession } from './neo';

// const MyComponent = () => {
//   const [predictions, setPredictions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRunQuery = () => {
//     setIsLoading(true);
//     const session = getSession();

//     session.run(`CALL gds.beta.pipeline.linkPrediction.predict.stream('linkp', {
//       modelName: 'lp-pipeline-model1',
//       topN: 5,
//       threshold: 0.5
//     })
//     YIELD node1, node2, probability
//     RETURN gds.util.asNode(node1).Name AS city1, gds.util.asNode(node2).Name AS city2, probability
//     ORDER BY probability DESC, city1`)
//       .then(result => {
//         setPredictions(result.records.map(record => ({
//           city1: record.get('city1'),
//           city2: record.get('city2'),
//           probability: record.get('probability')
//         })));
//       })
//       .catch(error => {
//         console.error(error);
//       })
//       .finally(() => {
//         setIsLoading(false);
//         session.close();
//       });
//   };

//   const handleCancel = () => {
//     setPredictions([]);
//   };

//   return (
//     <div>
//       <button onClick={handleRunQuery}>Run Link Prediction Query</button>
//       <button onClick={handleCancel}>Cancel</button>
//       {isLoading && <div>Loading...</div>}
//       {predictions.length > 0 &&
//         <div>
//           <h2>Link Predictions</h2>
//           <ul>
//             {predictions.map((prediction, index) => (
//               <li key={index}>{prediction.city1} - {prediction.city2}: {prediction.probability}</li>
//             ))}
//           </ul>
//         </div>
//       }
//     </div>
//   );
// };

// export default MyComponent;


import React, { useState } from 'react';
import { getSession } from './neo';

const MyComponent = () => {
  const [predictions, setPredictions] = useState([]);
  const [classifications, setClassification] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nodeCount, setNodeCount] = useState(null);
  const [operatorCount, setOperatorCount] = useState(null);
  const [cityCount, setCityCount] = useState(null);
  const [crashCityCount, setCrashCityCount] = useState(null);
  const [aircraftCount, setAircraftCount] = useState(null);
  const [aircraftOperatorRelationshipCount, setAircraftOperatorRelationshipCount] = useState(null);
  const [operatorStartCityRelationshipCount, setOperatorStartCityRelationshipCount] = useState(null);
  const [cityToCityRelationshipCount, setCityToCityRelationshipCount] = useState(null);
  const [mostFrequentCrashedCities, setMostFrequentCrashedCities] = useState([]);
  const [mostFrequentCrashSites, setMostFrequentCrashSites] = useState([]);
  const [mostFrequentCrashingOperatorType, setMostFrequentCrashingOperatorType] = useState([]);
  const [mostFrequentCrashingAircraftTypes, setMostFrequentCrashingAircraftTypes] = useState([]);
  const [leastFrequentCrashedCities, setLeastFrequentCrashedCities] = useState([]);
  const [leastFrequentCrashRouteStartingCities, setLeastFrequentCrashRouteStartingCities] = useState([]);
  const [leastFrequentCrashSiteCities, setLeastFrequentCrashSiteCities] = useState([]);
  const [leastFrequentCrashingAircraftTypes, setLeastFrequentCrashingAircraftTypes] = useState([]);
  const [datesWithMaxAccidents, setDatesWithMaxAccidents] = useState([]);
  const [worstAccidents, setWorstAccidents] = useState([]);
  const [leastFrequentCrashingOperatorType, setLeastFrequentCrashingOperatorType] = useState([]);
  const [mostCommonCityAndCrashCityAffiliation, setMostCommonCityAndCrashCityAffiliation] = useState([]);
  const [mostCommonOperatorAndAircraftTypeAffiliation, setMostCommonOperatorAndAircraftTypeAffiliation] = useState([]);
  const [mostCommonCityToCityRouteAffiliation, setMostCommonCityToCityRouteAffiliation] = useState([]);
  const [sccResults, setSccResults] = useState([]);
  const [wccResults, setWccResults] = useState([]);
  const [louvainResults, setLouvainResults] = useState([]);
  const [closenessResults, setClosenessResults] = useState([]);
  const [degreeResults, setDegreeResults] = useState([]);
  const [betweennessResults, setBetweennessResults] = useState([]);



  const handleRunQuery = () => {
    setIsLoading(true);
    const session = getSession();

    session.run(`CALL gds.beta.pipeline.linkPrediction.predict.stream('linkp', {
      modelName: 'lp-pipeline-model',
      topN: 5,
      threshold: 0.5
    })
    YIELD node1, node2, probability
    RETURN gds.util.asNode(node1).Name AS city1, gds.util.asNode(node2).Name AS city2, probability
    ORDER BY probability DESC, city1`)
      .then(result => {
        setPredictions(result.records.map(record => ({
          city1: record.get('city1'),
          city2: record.get('city2'),
          probability: record.get('probability')
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        session.close();
      });
  };

  const handleRunQuery1 = () => {
    setIsLoading(true);
    const session = getSession();

    session.run(`CALL gds.beta.pipeline.nodeClassification.predict.stream('class', {
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
      ORDER BY confidence desc
    `)
      .then(result => {
        setClassification(result.records.map(record => ({
          actype: record.get('classifiedAircraft'),
          predictedClass: record.get('predictedClass'),
          confidence: record.get('confidence')
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        session.close();
      });
  };

  const handleCancel = () => {
    setPredictions([]);
    setClassification([]);
    setNodeCount(null);
    setOperatorCount(null);
    setCityCount(null);
    setCrashCityCount(null);
    setAircraftCount(null);
    setAircraftOperatorRelationshipCount(null);
    setOperatorStartCityRelationshipCount(null);
    setCityToCityRelationshipCount(null);
    setMostFrequentCrashedCities([]);
    setMostFrequentCrashSites([]);
    setMostFrequentCrashingOperatorType([]);
    setMostFrequentCrashingAircraftTypes([]);
    setLeastFrequentCrashedCities([]);
    setLeastFrequentCrashRouteStartingCities([]);
    setLeastFrequentCrashSiteCities([]);
    setLeastFrequentCrashingAircraftTypes([]);
    setDatesWithMaxAccidents([]);
    setWorstAccidents([]);
    setMostCommonCityAndCrashCityAffiliation([]);
    setMostCommonOperatorAndAircraftTypeAffiliation([]);
    setMostCommonCityToCityRouteAffiliation([]);
    setSccResults([]);
    setWccResults([]);
    setLouvainResults([]);
    setClosenessResults([]);
    setDegreeResults([]);
    setBetweennessResults([]);
  };

  const getNodeCount = () => {
    const session = getSession();

    session.run(`MATCH (a) RETURN count(a) as count`)
      .then(result => {
        setNodeCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getOperatorCount = () => {
    const session = getSession();

    session.run(`MATCH (o:Operator) RETURN count(o) as count`)
      .then(result => {
        setOperatorCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getCityCount = () => {
    const session = getSession();

    session.run(`MATCH (c:City) RETURN count(c) as count`)
      .then(result => {
        setCityCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getCrashCityCount = () => {
    const session = getSession();

    session.run(`MATCH (cl:CrashLocation) RETURN count(cl) as count`)
      .then(result => {
        setCrashCityCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getAircraftCount = () => {
    const session = getSession();

    session.run(`MATCH (ac:AircraftType) RETURN count(ac) as count`)
      .then(result => {
        setAircraftCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getAircraftOperatorRelationshipCount = () => {
    const session = getSession();

    session.run(`MATCH (a)-[w:WITHIN]-(b) RETURN count(w) as count`)
      .then(result => {
        setAircraftOperatorRelationshipCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getOperatorStartCityRelationshipCount = () => {
    const session = getSession();

    session.run(`MATCH (a)-[oa:OPERATED_AT]-(b) RETURN count(oa) as count`)
      .then(result => {
        setOperatorStartCityRelationshipCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getCityToCityRelationshipCount = () => {
    const session = getSession();

    session.run(`MATCH (a)-[ft:FLIGHT_TO]-(b) RETURN count(ft) as count`)
      .then(result => {
        setCityToCityRelationshipCount(result.records[0].get('count').toInt());
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getMostFrequentCrashedCities = () => {
    const session = getSession();

    session.run(`
      MATCH (a:City)-[ft:FLIGHT_TO]->(b)
      RETURN a.Name as City, count(ft) as count
      ORDER BY count DESC
      LIMIT 5
    `)
      .then(result => {
        setMostFrequentCrashedCities(result.records.map(record => ({
          name: record.get('City'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getMostFrequentCrashSites = () => {
    const session = getSession();

    session.run(`
    MATCH (:City)-[ca:CRASHED_At]-(a:CrashLocation)
    RETURN a.Name as City, count(ca) as count
    ORDER BY count DESC
    LIMIT 5
    
    `)
      .then(result => {
        setMostFrequentCrashSites(result.records.map(record => ({
          name: record.get('City'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  

  const getLeastFrequentCrashedCities = () => {
    const session = getSession();

    session.run(`
      MATCH (a:City)-[ft:FLIGHT_TO]->(b)
      RETURN a.Name as City, count(ft) as count
      ORDER BY count ASC
      LIMIT 5
    `)
      .then(result => {
        setLeastFrequentCrashedCities(result.records.map(record => ({
          name: record.get('City'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getLeastFrequentCrashRouteStartingCities = () => {
    const session = getSession();

    session.run(`
      MATCH (:Operator)-[oa:OPERATED_AT]->(a:City)
      RETURN a.Name as City, count(oa) as count
      ORDER BY count ASC
      LIMIT 5
    `)
      .then(result => {
        setLeastFrequentCrashRouteStartingCities(result.records.map(record => ({
          name: record.get('City'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getLeastFrequentCrashSiteCities = () => {
    const session = getSession();

    session.run(`
      MATCH (:City)-[ca:CRASHED_At]-(a:CrashLocation)
      RETURN a.Name as City, count(ca) as count
      ORDER BY count ASC
      LIMIT 5
    `)
      .then(result => {
        setLeastFrequentCrashSiteCities(result.records.map(record => ({
          name: record.get('City'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };



  const getLeastFrequentCrashingOperatorType = () => {
    const session = getSession();

    session.run(`
      MATCH (o:Operator)-[oa:OPERATED_AT]->(:City)
      RETURN o.Name as Operator, count(oa) as count
      ORDER BY count ASC
    `)
      .then(result => {
        setLeastFrequentCrashingOperatorType(result.records.map(record => ({
          name: record.get('Operator'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };


  const getLeastFrequentCrashingAircraftTypes = () => {
    const session = getSession();

    session.run(`
      MATCH (ac:AircraftType)-[w:WITHIN]->(:Operator)
      RETURN ac.Make as Make, count(w) as count
      ORDER BY count ASC
      LIMIT 5
    `)
      .then(result => {
        setLeastFrequentCrashingAircraftTypes(result.records.map(record => ({
          name: record.get('Make'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getDatesWithMaxAccidents = () => {
    const session = getSession();
  
    session.run(`
      MATCH (:Operator)-[oa:OPERATED_AT]->(:City)
      WITH oa, split(oa.Date, "/") AS parts
      RETURN parts[2] AS Year, count(oa) AS CrashCount
      ORDER BY CrashCount DESC
      LIMIT 5
    `)
      .then(result => {
        const records = result.records.map(record => ({
          year: record.get('Year'),
          crashCount: record.get('CrashCount').toNumber()
        }));
        setDatesWithMaxAccidents(records);
      })
      .catch(error => {
        console.error('Error running query:', error);
      });
  };
  

  const getWorstAccidents = () => {
    const session = getSession();
  
    session.run(`
      MATCH (o:Operator)-[oa:OPERATED_AT]->(:City)
      RETURN oa.Route as Route, oa.Fatalities as fatalities
      ORDER BY fatalities DESC
      LIMIT 5
    `)
      .then(result => {
        console.log(result.records); // Log the records to see their structure
        setWorstAccidents(result.records.map(record => ({
          route: record.get('Route'),
          fatal: record.get('fatalities')
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getMostFrequentCrashingOperatorType = () => {
    const session = getSession();

    session.run(`
      MATCH (a:Operator)-[oa:OPERATED_AT]->(:City)
      RETURN a.Name as Operator, count(oa) as count
      ORDER BY count DESC
    `)
      .then(result => {
        setMostFrequentCrashingOperatorType(result.records.map(record => ({
          name: record.get('Operator'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getMostFrequentCrashingAircraftTypes = () => {
    const session = getSession();

    session.run(`
      MATCH (ac:AircraftType)-[w:WITHIN]->(:Operator)
      RETURN ac.Make as Make, count(w) as count
      ORDER BY count DESC
      LIMIT 5
    `)
      .then(result => {
        setMostFrequentCrashingAircraftTypes(result.records.map(record => ({
          name: record.get('Make'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };

  const getMostCommonCityAndCrashCityAffiliation = () => {
    const session = getSession();
  
    session.run(`
      MATCH (c:City)-[ca:CRASHED_At]->(cl:CrashLocation)
      RETURN c.Name as City, cl.Name as CrashSite, count(ca) as count
      ORDER BY count DESC
      LIMIT 5
    `)
      .then(result => {
        setMostCommonCityAndCrashCityAffiliation(result.records.map(record => ({
          city: record.get('City'),
          crashSite: record.get('CrashSite'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getMostCommonOperatorAndAircraftTypeAffiliation = () => {
    const session = getSession();
  
    session.run(`
      MATCH (o:Operator)<-[w:WITHIN]-(at:AircraftType)
      RETURN o.Name as Operator, at.Make as Make, count(w) as count
      ORDER BY count DESC
      LIMIT 5
    `)
      .then(result => {
        setMostCommonOperatorAndAircraftTypeAffiliation(result.records.map(record => ({
          operator: record.get('Operator'),
          make: record.get('Make'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getMostCommonCityToCityRouteAffiliation = () => {
    const session = getSession();
  
    session.run(`
      MATCH (c1:City)<-[ft:FLIGHT_TO]-(c2:City)
      RETURN c1.Name as City1, c2.Name as City2, count(ft) as count
      ORDER BY count DESC
      LIMIT 5
    `)
      .then(result => {
        setMostCommonCityToCityRouteAffiliation(result.records.map(record => ({
          city1: record.get('City1'),
          city2: record.get('City2'),
          count: record.get('count').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getStronglyConnectedComponents = () => {
    const session = getSession();
  
    session.run(`
      CALL gds.scc.stream('graph1')
      YIELD nodeId, componentId
      WITH componentId, count(nodeId) AS componentSize, collect(gds.util.asNode(nodeId).Name) as CityNames
      RETURN componentId, componentSize, CityNames
      ORDER BY componentSize desc
      limit 5
    `)
      .then(result => {
        setSccResults(result.records.map(record => ({
          componentId: record.get('componentId').toInt(),
          componentSize: record.get('componentSize').toInt(),
          cityNames: record.get('CityNames')
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getWeaklyConnectedComponents = () => {
    const session = getSession();
  
    session.run(`
      CALL gds.wcc.stream('graph1')
      YIELD nodeId, componentId
      WITH componentId, count(nodeId) AS componentSize, collect(gds.util.asNode(nodeId).Name) as CityNames
      RETURN componentId, componentSize, CityNames
      ORDER BY size(CityNames) ASC
      limit 5
    `)
      .then(result => {
        setWccResults(result.records.map(record => ({
          componentId: record.get('componentId').toInt(),
          componentSize: record.get('componentSize').toInt(),
          cityNames: record.get('CityNames')
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getLouvainModularity = () => {
    const session = getSession();
  
    session.run(`
      CALL gds.louvain.stream('graph1')
      YIELD nodeId, communityId
      RETURN gds.util.asNode(nodeId).Name AS name, communityId
      ORDER BY communityId DESC
      limit 5
    `)
      .then(result => {
        setLouvainResults(result.records.map(record => ({
          name: record.get('name'),
          communityId: record.get('communityId').toInt()
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        session.close();
      });
  };
  
  const getClosenessCentrality = () => {
    const session = getSession();
  
    session.run(`
      CALL gds.closeness.stream('graph1')
      YIELD nodeId, score
      RETURN gds.util.asNode(nodeId).Name AS name, score
      ORDER BY score DESC
      LIMIT 5
    `)
      .then(result => {
        setClosenessResults(result.records.map(record => ({
          name: record.get('name'),
          score: record.get('score').toFixed(4)
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getDegreeCentrality = () => {
    const session = getSession();
  
    session.run(`
      CALL gds.degree.stream('graph1')
      YIELD nodeId, score
      RETURN gds.util.asNode(nodeId).Name AS name, score
      ORDER BY score DESC
      LIMIT 5
    `)
      .then(result => {
        setDegreeResults(result.records.map(record => ({
          name: record.get('name'),
          score: record.get('score').toFixed(4)
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        session.close();
      });
  };
  
  const getBetweennessCentrality = () => {
    setIsLoading(true);
    const session = getSession();
  
    session.run(`
      CALL gds.betweenness.stream('graph1')
      YIELD nodeId, score
      RETURN gds.util.asNode(nodeId).Name AS name, score
      ORDER BY score DESC
      LIMIT 5
    `)
      .then(result => {
        setBetweennessResults(result.records.map(record => ({
          name: record.get('name'),
          score: record.get('score').toFixed(4)
        })));
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
        session.close();
      });
  };
  

return (
  <div>
    <div>
      <h3 style={{ textDecoration: 'underline', marginBottom: '10px' }} > Link Prediction for Route: </h3>
      <button onClick={handleRunQuery}>Run Link Prediction Query</button>
      <button onClick={handleCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
      {predictions.length > 0 &&
        <div>
          <h2>Link Predictions</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City 1</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City 2</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Probability</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{prediction.city1}</td>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{prediction.city2}</td>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{prediction.probability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

    </div>

    <div>
      <h3 style={{ textDecoration: 'underline', marginBottom: '10px' }} > Node Classification for Aircraft Type: </h3>
      <button onClick={handleRunQuery1}>Run Node Classification Query</button>
      <button onClick={handleCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
      {classifications.length > 0 &&
        <div>
          <h2>Aircraft Classifications</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Classified Aircraft</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Predicted Class</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Confidence (%)</th>
              </tr>
            </thead>
            <tbody>
              {classifications.map((classification, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{classification.actype}</td>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{String(classification.predictedClass)}</td>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{classification.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }


    </div>
      

    {/* Graph Statistics */}
    <div>
    <h3 style={{ textDecoration: 'underline', marginTop: '30px' }}>Graph Statistics: </h3>
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '-5px' }}>Node Count</h4>
        <button onClick={getNodeCount} >Get Node Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {nodeCount !== null && <div>Total Nodes: {nodeCount}</div>}
      </div>
      <div >
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}> Operator Count</h4>
        <button onClick={getOperatorCount}>Get Operator Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {operatorCount !== null && <div>Total Operators: {operatorCount}</div>}
      </div>
      {/* Add other query buttons and results here */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>City Count</h4>
        <button onClick={getCityCount}>Get City Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {cityCount !== null && <div>Total Cities: {cityCount}</div>}
      </div>
      <div>
      <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Crash Locations Count</h4>
        <button onClick={getCrashCityCount}>Get Crash City Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {crashCityCount !== null && <div>Total Crash Cities: {crashCityCount}</div>}
      </div>
      <div>
      <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Aircraft Count</h4>
        <button onClick={getAircraftCount}>Get Aircraft Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {aircraftCount !== null && <div>Total Aircrafts: {aircraftCount}</div>}
      </div>
      <div>
      <h4 style={{ marginBottom: '5px', marginTop: '15px' }}> Aircraft to Operator Relationship Count</h4>
        <button onClick={getAircraftOperatorRelationshipCount}>Get Aircraft to Operator Relationship Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {aircraftOperatorRelationshipCount !== null && <div>Total Aircraft to Operator Relationships: {aircraftOperatorRelationshipCount}</div>}
      </div>
      <div>
      <h4 style={{ marginBottom: '5px', marginTop: '15px' }}> Operator to Start City Relationship Count</h4>
        <button onClick={getOperatorStartCityRelationshipCount}>Get Operator to Start City in Route Relationship Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {operatorStartCityRelationshipCount !== null && <div>Total Operator to Start City in Route Relationships: {operatorStartCityRelationshipCount}</div>}
      </div>
      <div>
      <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>City to City Relationship Count</h4>
        <button onClick={getCityToCityRelationshipCount}>Get City to City in Route Relationship Count</button>
        <button onClick={handleCancel}>Cancel</button>
        {cityToCityRelationshipCount !== null && <div>Total City to City in Route Relationships: {cityToCityRelationshipCount}</div>}
      </div>
    </div>

    {/* contxt Statistics */}
    <div>
      <h3 style={{ textDecoration: 'underline', marginTop: '30px' }}>Contextual Queries: </h3>
      
      {/* Most Frequent Crashed Cities */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Frequent Crash Starting Cities</h4>
        <button onClick={getMostFrequentCrashedCities}>Get Most Frequent Crash Starting Cities</button>
        <button onClick={handleCancel}>Cancel</button>
        {mostFrequentCrashedCities.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {mostFrequentCrashedCities.map(city => (
              <tr key={city.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      
      {/* Most Frequent Crash Route Starting Cities */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Frequent Crash Sites</h4>
        <button onClick={getMostFrequentCrashSites}>Get Most Frequent Crash Sites</button>
      <button onClick={handleCancel}>Cancel</button>
        {mostFrequentCrashSites.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {mostFrequentCrashSites.map(city => (
              <tr key={city.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      
      {/* Most Frequent Crashing Operator Type */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Frequent Crashing Operator Type</h4>
        <button onClick={getMostFrequentCrashingOperatorType}>Get Most Frequent Crashing Operator Type</button>
        <button onClick={handleCancel}>Cancel</button>
        {mostFrequentCrashingOperatorType.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Operator</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {mostFrequentCrashingOperatorType.map(operator => (
              <tr key={operator.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{operator.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{operator.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      
      {/* Most Frequent Crashing Aircraft Types */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Frequent Crashing Aircraft Types</h4>
        <button onClick={getMostFrequentCrashingAircraftTypes}>Get Most Frequent Crashing Aircraft Types</button>
        <button onClick={handleCancel}>Cancel</button>
        {mostFrequentCrashingAircraftTypes.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Aircraft Type</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {mostFrequentCrashingAircraftTypes.map(make => (
              <tr key={make.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{make.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{make.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      

      
      {/* Least Frequent Crash Route Starting Cities */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Least Frequent Crash Route Starting Cities</h4>
        <button onClick={getLeastFrequentCrashRouteStartingCities}>Get Least Frequent Crash Route Starting Cities</button>
        <button onClick={handleCancel}>Cancel</button>
        {leastFrequentCrashRouteStartingCities.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {leastFrequentCrashRouteStartingCities.map(city => (
              <tr key={city.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      
      {/* Least Frequent Crash Site Cities */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Least Frequent Crash Site Cities</h4>
        <button onClick={getLeastFrequentCrashSiteCities}>Get Least Frequent Crash Site Cities</button>
        <button onClick={handleCancel}>Cancel</button>
        {leastFrequentCrashSiteCities.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {leastFrequentCrashSiteCities.map(city => (
              <tr key={city.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{city.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      
      {/* Least Frequent Crashing Aircraft Types */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Least Frequent Crashing Aircraft Types</h4>
        <button onClick={getLeastFrequentCrashingAircraftTypes}>Get Least Frequent Crashing Aircraft Types</button>
        <button onClick={handleCancel}>Cancel</button>
        {leastFrequentCrashingAircraftTypes.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Aircraft Type</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {leastFrequentCrashingAircraftTypes.map(make => (
              <tr key={make.name} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{make.name}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{make.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      
      {/* Dates with Max Accidents */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Dates with Max Accidents</h4>
        <button onClick={getDatesWithMaxAccidents}>Get Dates with Max Accidents</button>
        <button onClick={handleCancel}>Cancel</button>
        {datesWithMaxAccidents.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Year</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Count</th>
            </tr>
          </thead>
          <tbody>
            {datesWithMaxAccidents.map(acc => (
              <tr key={acc.year} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', textAlign: 'left' }}>{acc.year}</td>
                <td style={{ padding: '8px', textAlign: 'left' }}>{acc.crashCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      
      {/* Worst Accidents */}
      <div>
        <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Worst Accidents</h4>
        <button onClick={getWorstAccidents}>Get Worst Accidents</button>
        <button onClick={handleCancel}>Cancel</button>
        {worstAccidents.length > 0 && (
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Route</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Fatalities</th>
              </tr>
            </thead>
            <tbody>
              {worstAccidents.map(accident => (
                <tr key={accident.route} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{accident.route}</td>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{accident.fatal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {/* Relational Questions */}
<div>
  <h3 style={{ textDecoration: 'underline', marginTop: '30px' }}>Relational Queries: </h3>

  {/* Most Common City and Crash City Affiliation */}
  <div>
    <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Common City and Crash City Affiliation</h4>
    <button onClick={getMostCommonCityAndCrashCityAffiliation}>Get Most Common City and Crash City Affiliation</button>
    <button onClick={handleCancel}>Cancel</button>
    {mostCommonCityAndCrashCityAffiliation.length > 0 && (
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Crash Site</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {mostCommonCityAndCrashCityAffiliation.map(entry => (
            <tr key={entry.city + entry.crashSite} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.city}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.crashSite}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

  {/* Most Common Operator and Aircraft Type Affiliation */}
  <div>
    <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Common Operator and Aircraft Type Affiliation</h4>
    <button onClick={getMostCommonOperatorAndAircraftTypeAffiliation}>Get Most Common Operator and Aircraft Type Affiliation</button>
    <button onClick={handleCancel}>Cancel</button>
    {mostCommonOperatorAndAircraftTypeAffiliation.length > 0 && (
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Operator</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Make</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {mostCommonOperatorAndAircraftTypeAffiliation.map(entry => (
            <tr key={entry.operator + entry.make} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.operator}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.make}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

  {/* Most Common City to City Route Affiliation */}
  <div>
    <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Most Common City to City Route Affiliation</h4>
    <button onClick={getMostCommonCityToCityRouteAffiliation}>Get Most Common City to City Route Affiliation</button>
    <button onClick={handleCancel}>Cancel</button>
    {mostCommonCityToCityRouteAffiliation.length > 0 && (
      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City 1</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City 2</th>
            <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Count</th>
          </tr>
        </thead>
        <tbody>
          {mostCommonCityToCityRouteAffiliation.map(entry => (
            <tr key={entry.city1 + entry.city2} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.city1}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.city2}</td>
              <td style={{ padding: '8px', textAlign: 'left' }}>{entry.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</div>

      {/* Community Detection Analysis */}
      <div>
        <h3 style={{ textDecoration: 'underline', marginTop: '30px' }}>Community Detection Analysis: </h3>
        
        {/*Strongly Connected Components*/
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Strongly Connected Components</h4>
          <button onClick={getStronglyConnectedComponents}>Get Strongly Connected Components</button>
          <button onClick={handleCancel}>Cancel</button>
          {sccResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Component ID</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Component Size</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City Names</th>
                </tr>
              </thead>
              <tbody>
                {sccResults.map(result => (
                  <tr key={result.componentId} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.componentId}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.componentSize}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.cityNames.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>}

        {/* Weakly Connected Components
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Weakly Connected Components</h4>
          <button onClick={getWeaklyConnectedComponents}>Get Weakly Connected Components</button>
          <button onClick={handleCancel}>Cancel</button>
          {wccResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Component ID</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Component Size</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>City Names</th>
                </tr>
              </thead>
              <tbody>
                {wccResults.map(result => (
                  <tr key={result.componentId} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.componentId}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.componentSize}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.cityNames.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> */}

        {/* Louvain Modularity
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Louvain Modularity</h4>
          <button onClick={getLouvainModularity}>Get Louvain Modularity</button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoading && <div>Loading...</div>}
          {louvainResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Node Name</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Community ID</th>
                </tr>
              </thead>
              <tbody>
                {louvainResults.map(result => (
                  <tr key={result.name} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.name}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.communityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div> */}
      </div>

    {/* Centrality Analysis */}
    <div>
        <h3 style={{ textDecoration: 'underline', marginTop: '30px' }}>Centrality Analysis: </h3>
        
        {/* Closeness Centrality */}
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Closeness Centrality</h4>
          <button onClick={getClosenessCentrality}>Get Closeness Centrality</button>
          <button onClick={handleCancel}>Cancel</button>
          {closenessResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Node Name</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {closenessResults.map(result => (
                  <tr key={result.name} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.name}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Degree Centrality */}
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Degree Centrality</h4>
          <button onClick={getDegreeCentrality}>Get Degree Centrality</button>
          <button onClick={handleCancel}>Cancel</button>
          {degreeResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Node Name</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {degreeResults.map(result => (
                  <tr key={result.name} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.name}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Betweenness Centrality */}
        <div>
          <h4 style={{ marginBottom: '5px', marginTop: '15px' }}>Betweenness Centrality</h4>
          <button onClick={getBetweennessCentrality}>Get Betweenness Centrality</button>
          <button onClick={handleCancel}>Cancel</button>
          {isLoading && <div>Loading...</div>}
          {betweennessResults.length > 0 && (
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Node Name</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Score</th>
                </tr>
              </thead>
              <tbody>
                {betweennessResults.map(result => (
                  <tr key={result.name} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.name}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{result.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>


    {/* Cancel button */}
    <button onClick={handleCancel} style={{ marginTop: '20px' }}>Cancel All</button>
  </div>
);
};

export default MyComponent;