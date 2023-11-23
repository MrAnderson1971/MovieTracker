/*
    Code adapted from the demo project files
*/

const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMax: 1
};


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
let poolMade = false;
async function withOracleDB(action) {
    let connection;
    try {
        if (!poolMade) {
            await oracledb.createPool(dbConfig);
            pool = oracledb.getPool();
            poolMade = true;
        }
        connection = await pool.getConnection();
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

async function login(username, userPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID, admin FROM User_2 WHERE username = :username AND userPassword = :userPassword`,
            [ username, userPassword ]
        );
        return result.rows;
    }).catch((error) => {
        return [];
    });
}

async function insertUser(username, email, password, birthDate) {
    return await withOracleDB(async (connection) => {
        let date = new Date();
        let year = date.getFullYear();
        let age = year - Number(birthDate.substring(0, birthDate.indexOf("-")));
        let ageLock = 0;
        if ( age <= 13) {
            ageLock = 1;
        }
        let userID = Math.random() * 4294967296;

        const userExists1 = await connection.execute(`SELECT 1 FROM User_1 WHERE age = :age`, [age]);

        if (userExists1.rows.length === 0) {
            await connection.execute(
                `INSERT INTO User_1 (age, ageLock) VALUES (:age, :ageLock)`,
                [age, ageLock],
                { autoCommit: true }
            );
        }

        const userExists3 = await connection.execute(`SELECT 1 FROM User_3 WHERE birthDate = TO_DATE(:birthdate, 'yyyy-mm-dd')`, [birthDate])
        if (userExists3.rows.length === 0) {
            await connection.execute(
                `INSERT INTO User_3 (birthDate, age) VALUES (TO_DATE(:birthDate, 'yyyy-mm-dd'), :age)`,
                [birthDate, age],
                { autoCommit: true }
            );
        }

        const result2 = await connection.execute(
            `INSERT INTO User_2 (userID, birthDate, email, userPassword, username) 
            VALUES (:userID, TO_DATE(:birthDate, 'yyyy-mm-dd'), :email, :password, :username)`,
            [userID, birthDate, email, password, username],
            { autoCommit: true }
        );

        return result2.rowsAffected && result2.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function createWatchlist(name, userID) {
    return await withOracleDB(async (connection) => {
        let watchlistID = Math.random() * 4294967296;

        const result = await connection.execute(
            `INSERT INTO Watchlist (watchlistID, name, userID)
            VALUES (:watchlistID, :name, :userID)`,
            [watchlistID, name, userID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getWatchlistsForUser(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT w.watchlistID, w.name, c.contentID
                                                FROM Watchlist w, Collects c
                                                WHERE w.userID = :userID and w.watchlistID = c.watchlistID
                                                ORDER BY w.watchlistID ASC`,
            [userID],
            { autoCommit: true }
        );

        return result.rows;
    }).catch(() => {
        return false;
    });
}

async function deleteWatchlist(watchlistID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Watchlist WHERE watchlistID = :watchlistID`,
            [watchlistID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateWatchlist(watchlistID, name, userID) {
    return await withOracleDB(async (connection) => {
        if (name) {
            const result = await connection.execute(
                `UPDATE Watchlist SET name = :name WHERE watchlistID = :watchlistID`,
                [watchlistID],
                { autoCommit: true }
            );
        }

        if (userID) {
            const result = await connection.execute(
                `UPDATE Watchlist SET userID = :userID WHERE watchlistID = :watchlistID`,
                [watchlistID],
                { autoCommit: true }
            );
        }

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countWatchlist(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*) FROM Watchlist WHERE userID = :userID`, [userID]);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function countMovies(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*) 
                                                FROM Watchlist w, Collects c, Movie_2 m
                                                WHERE w.userID = :userID AND c.watchlistID = w.watchlistID AND
                                                c.contentID = m.contentID`, [userID]);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function countSeries(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*) 
                                                FROM Watchlist w, Collects c, TVShow_1 t
                                                WHERE w.userID = :userID AND c.watchlistID = w.watchlistID AND
                                                c.contentID = t.contentID`, [userID]);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function countReviews(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*) FROM Review_2 WHERE userID = :userID`, [userID]);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function countServices() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*) FROM StreamingService`);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function countShowsBySeasons(seasonNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT Count(*)
                                                FROM TVShow_1 t
                                                GROUP BY t.numSeasons
                                                HAVING t.numSeasons > :seasons`);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function getUltimateReviewers() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT userID
                                                FROM User_2 u
                                                WHERE NOT EXISTS ((SELECT c.contentID
                                                                  FROM Content_2 c)
                                                                  EXCEPT (SELECT r.reviewID
                                                                  FROM Review_2 r
                                                                  WHERE r.userID = u.userID)))`);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function getMostPopularGenre() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT genreName, COUNT(*) as genreCount
FROM CategorizedAs
GROUP BY genreName
ORDER BY genreCount DESC
`);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function searchServices(name, country, order) {
    return await withOracleDB(async (connection) => {
        let result;
        let nameSearchTerm = "%" + name + "%";
        let countrySearchTerm = "%" + country + "%";
        switch (order) {
            case 0:
            result = await connection.execute(`SELECT s.streamingServiceName, a.countryName
                                            FROM StreamingService s, AvailableIn a
                                            WHERE s.streamingServiceName LIKE :nameSearchTerm AND 
                                            a.CountryName LIKE :countrySearchTerm AND
                                            s.streamingServiceName = a.streamingServiceName
                                            ORDER BY s.streamingServiceName ASC`, [nameSearchTerm, countrySearchTerm]);
            break;
            case 1:
            result = await connection.execute(`SELECT s.streamingServiceName, a.countryName
                                            FROM StreamingService s, AvailableIn a
                                            WHERE s.streamingServiceName LIKE :nameSearchTerm AND 
                                            a.CountryName LIKE :countrySearchTerm AND
                                            s.streamingServiceName = a.streamingServiceName
                                            ORDER BY s.streamingServiceName DESC`, [nameSearchTerm, countrySearchTerm]);
            break;
            case 2:
            result = await connection.execute(`SELECT s.streamingServiceName, a.countryName
                                            FROM StreamingService s, AvailableIn a
                                            WHERE s.streamingServiceName LIKE :nameSearchTerm AND 
                                            a.CountryName LIKE :countrySearchTerm AND
                                            s.streamingServiceName = a.streamingServiceName
                                            ORDER BY a.countryName ASC`, [nameSearchTerm, countrySearchTerm]);
            break;
            case 3:
            result = await connection.execute(`SELECT s.streamingServiceName, a.countryName
                                            FROM StreamingService s, AvailableIn a
                                            WHERE s.streamingServiceName LIKE :nameSearchTerm AND 
                                            a.CountryName LIKE :countrySearchTerm AND
                                            s.streamingServiceName = a.streamingServiceName
                                            ORDER BY a.countryName DESC`, [nameSearchTerm, countrySearchTerm]);
            default:
        }

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function viewTable(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        let queryString = `SELECT `;
        for (a in attributes) {
            queryString = queryString + a + ` `;
        }
        queryString = queryString + ` FROM ` + tableName;

        const result = await connection.execute(queryString);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    login,
    insertUser,
    createWatchlist,
    deleteWatchlist,
    updateWatchlist,
    getWatchlistsForUser,
    countWatchlist,
    countMovies,
    countSeries,
    countReviews,
    countSeries,
    countServices,
    countShowsBySeasons,
    searchServices,
    getUltimateReviewers,
    getMostPopularGenre,
    viewTable
};
