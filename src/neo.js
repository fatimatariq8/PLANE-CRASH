import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'fatimatariq'));

const getSession = () => driver.session();

export { driver, getSession };
