const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`
};


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertUser(username, email, password, birthDate) {
    return await withOracleDB(async (connection) => {
        let date = new Date();
        let year = date.getFullYear();
        let age = year - birthDate.getFullYear();
        let ageLock = fale;
        if ( age <= 13) {
            ageLock = true;
        }
        let userID = Math.random() * 4294967296;

        const result1 = await connection.execute(
            `INSERT IGNORE INTO User_1 (age, ageLock) VALUES (:age, :ageLock)`,
            [age, ageLock],
            { autoCommit: true }
        );

        const result3 = await connection.execute(
            `INSERT IGNORE INTO User_3 (birthDate, name) VALUES (:birthDate, :age)`,
            [birthDate, age],
            { autoCommit: true }
        );

        const result2 = await connection.execute(
            `INSERT INTO User_3 (userID, birthDate, email, userPassword, username) VALUES (:userID, :birthDate, :email, :password, :username)`,
            [userID, birthDate, email, password, username],
            { autoCommit: true }
        );

        return result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    testOracleConnection
};