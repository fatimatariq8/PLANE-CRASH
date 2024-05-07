// GraphStatisticsQueries.js
export const getNodeCountQuery = `
MATCH (a)
RETURN count(a) as nodeCount
`;

export const getOperatorCountQuery = `
MATCH (o:Operator)
RETURN count(o) as operatorCount
`;

export const getCityCountQuery = `
MATCH (c:City)
RETURN count(c) as cityCount
`;

export const getCrashCityCountQuery = `
MATCH (cl:CrashLocation)
RETURN count(cl) as crashCityCount
`;

export const getAircraftCountQuery = `
MATCH (ac:AircraftType)
RETURN count(ac) as aircraftCount
`;

export const getAircraftOperatorRelationshipCountQuery = `
MATCH (a)-[w:WITHIN]-(b)
RETURN count(w) as aircraftOperatorRelationshipCount
`;

export const getOperatorStartCityRelationshipCountQuery = `
MATCH (a)-[oa:OPERATED_AT]-(b)
RETURN count(oa) as operatorStartCityRelationshipCount
`;

export const getCityToCityRelationshipCountQuery = `
MATCH (a)-[ft:FLIGHT_TO]-(b)
RETURN count(ft) as cityToCityRelationshipCount
`;
