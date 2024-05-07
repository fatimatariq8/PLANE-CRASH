// Loading Script: 

// CONSTRAINTS
CREATE CONSTRAINT ON (c:City) ASSERT c.Name IS UNIQUE
CREATE CONSTRAINT ON (o:Operator) ASSERT o.Name IS UNIQUE
CREATE CONSTRAINT ON (cl:CrashLocation) ASSERT cl.Name IS UNIQUE
CREATE CONSTRAINT ON (a:AircraftType) ASSERT a.Make IS UNIQUE

// OPERATOR AND CITY NODES 
// LOAD CSV
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row

// CREATE OPERATOR NODES
MERGE (op:Operator {Name: row.GradeType})

// CREATE CITY NODES
WITH row, [row.c1, row.c2, row.c3, row.c4, row.c5, row.c6, row.c7] AS cities
UNWIND cities AS cityName
WITH DISTINCT cityName
WHERE cityName IS NOT NULL
MERGE (city:City {Name: cityName})


// OPERATED AT RELATIONSHIP:
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
// Connect Operator to RouteStart
WITH row
MATCH (op:Operator {Name: row.GradeType})
MATCH (rs:City {Name: row.c1})
MERGE (op)-[ot:OPERATED_AT {OperatorName: row.Operator}]->(rs)
SET ot.Date = row.Date,
    ot.Time = row.Time,
    ot.Location = row.Location,
    ot.Route = row.Route,
    ot.Registration = row.Registration,
    ot.`cn/ln` = row.`cn/ln`,
    ot.Flight = row.FlightNo,
    ot.Aboard = row.Aboard,
    ot.Fatalities = row.Fatalities,
    ot.Ground = row.Ground,
    ot.Summary = row.Summary


// FLIGHT TO RS:
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
WITH row, [row.c1, row.c2, row.c3, row.c4, row.c5, row.c6, row.c7] AS cities
UNWIND range(0, size(cities) - 2) AS idx
WITH row, cities[idx] AS startCity, cities[idx + 1] AS endCity
MATCH (start:City {Name: startCity})
MATCH (end:City {Name: endCity})
CREATE (start)-[:FLIGHT_TO {flightID: row.ID}]->(end)

// CRASH LOCATION NODE
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
MERGE (cl:CrashLocation {Name: row.`Crash Location`})


// CRASHED AT RS
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
WITH row, [row.c1, row.c2, row.c3, row.c4, row.c5, row.c6, row.c7] AS cities
WITH row, [city IN cities WHERE city <> ''] AS filteredCities
WITH row, filteredCities[size(filteredCities) - 1] AS lastCity
MATCH (cl:CrashLocation {Name: row.`Crash Location`})
MATCH (end:City {Name: lastCity})
MERGE (end)-[:CRASHED_At {flightID: row.ID}]->(cl)


// AIRCRAFT TYPE 
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
MERGE (at:AircraftType {Make: row.ACType})
SET at.Operator = row.GradeType,
    at.class = toInteger(row.Class)


// WITHIN RS
LOAD CSV WITH HEADERS FROM 'file:///plane_crash_data.csv' AS row
// Connect Operator to AircraftType
WITH row
MATCH (op:Operator {Name: row.GradeType})
MATCH (at:AircraftType {Make: row.ACType})
MERGE (at)-[:WITHIN]->(op)



