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

function escapeSpecialChars(string) {
    let output = string;
    output = output.replace("(", "\(");
    output = output.replace(")", "\)");
    output = output.replace("[", "\[");
    output = output.replace("]", "\]");
    output = output.replace("{", "\{");
    output = output.replace("}", "\}");
    output = output.replace("'", "\'");
    output = output.replace(",", "\,");
    output = output.replace("&", "\&");
    output = output.replace("=", "\=");
    output = output.replace("?", "\?");
    output = output.replace("-", "\-");
    output = output.replace(";", "\;");
    output = output.replace("~", "\~");
    output = output.replace("|", "\|");
    output = output.replace("$", "\$");
    output = output.replace(">", "\>");
    output = output.replace("*", "\*");
    output = output.replace("%", "\%");
    output = output.replace("_", "\_");

    return output;
}

async function login(username, userPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT userID, admin FROM User_2 WHERE username = :username AND userPassword = :userPassword`,
            [ escapeSpecialChars(username), escapeSpecialChars(userPassword) ]
        );
        return result.rows;
    }).catch((error) => {
        return [];
    });
}

async function insertUser(username, email, password, birthDate) {
    if (!/[a-zA-Z0-9+-_~]+@[a-zA-Z]+\.[a-z]+/.test(email)) {
        return false;
    }

    if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(birthDate)) {
        return false;
    }

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
            [userID, birthDate, email, escapeSpecialChars(password), escapeSpecialChars(username)],
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
            [watchlistID, escapeSpecialChars(name), userID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function getWatchlistsForUser(userID) {
    if (isNaN(userID)) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT w.watchlistID, w.name, w.userID
                                                FROM Watchlist w
                                                WHERE w.userID = :userID
                                                ORDER BY w.watchlistID ASC`,
            [userID]
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getContentInWatchlist(watchlistID) {
    if (isNaN(watchlistID)) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT c2.contentID, c2.title, c2.releaseDate, c2.ageRating
                                                FROM Watchlist w, Collects c, Content_2 c2
                                                WHERE w.watchlistID = :watchlistID AND w.watchlistID = c.watchlistID AND
                                                    c.contentID = c2.contentID
                                                ORDER BY c2.contentID ASC`, [watchlistID]);

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function adddContentToWatchlist(watchlistID, contentID) {
    if (isNaN(watchlistID) || isNaN(contentID)) {
        return false;
    }

    const widexists = await connection.execute(`SELECT * FROM Watchlist WHERE watchlistID = :watchlistID`, [watchlistID]);
    if (widexists.rows.length === 0) {
        return 404;
    }

    const cidexists = await connection.execute(`SELECT * FROM Content_2 WHERE contentID = :contentID`, [contentID]);
    if (cidexists.rows.length === 0) {
        return 404;
    }

    const entryexists = await connection.execute(`SELECT * FROM Collects 
                                                WHERE watchlistID = :watchlistID AND contentID = :contentID`, 
                                                [watchlistID, contentID]);
    if (entryexists.rows.length === 1) {
        return 400;
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`INSERT INTO Collects(watchlistID, contentID) VALUES
                                                (:watchlistID, :contentID)`, [watchlistID, contentID], { autoCommit: true });

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return 0;
    });
}

async function deleteContentFromWatchlist(watchlistID, contentID) {
    if (isNaN(watchlistID) || isNaN(contentID)) {
        return 0;
    }

    const widexists = await connection.execute(`SELECT * FROM Watchlist WHERE watchlistID = :watchlistID`, [watchlistID]);
    if (widexists.rows.length === 0) {
        return 404;
    }

    const cidexists = await connection.execute(`SELECT * FROM Content_2 WHERE contentID = :contentID`, [contentID]);
    if (cidexists.rows.length === 0) {
        return 404;
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`DELETE FROM Collects 
                                                WHERE watchlistID = :watchlistID AND contentID = :contentID`, 
                                                [watchlistID, contentID], { autoCommit: true });

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return 0;
    });
}

async function deleteWatchlist(watchlistID) {
    if (isNaN(watchlistID)) {
        return false;
    }

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
    if (isNaN(watchlistID) || isNaN(userID)) {
        return false;
    }

    return await withOracleDB(async (connection) => {
        let result;
        if (name) {
            result = await connection.execute(
                `UPDATE Watchlist SET name = :name WHERE watchlistID = :watchlistID`,
                [escapeSpecialChars(name), watchlistID],
                { autoCommit: true }
            );
        }

        if (userID) {
            result = await connection.execute(
                `UPDATE Watchlist SET userID = :userID WHERE watchlistID = :watchlistID`,
                [userID, watchlistID],
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
                                                c.contentID = m.contentID`, [userID], { autoCommit: true });
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
    if (isNaN(seasonNumber)) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT t.numSeasons, Count(*) as seasonCount 
                                                FROM TVShow_1 t GROUP BY t.numSeasons 
                                                HAVING t.numSeasons >= :seasonNumber`, [seasonNumber]);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getUltimateReviewers(age) {
    if (isNaN(age)) {
        return -1;
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT DISTINCT u.userID, u.username 
                                                FROM User_2 u, User_3 u3 WHERE u3.age <= :age AND NOT EXISTS 
                                                (SELECT c.contentID FROM Content_2 c WHERE NOT EXISTS 
                                                    (SELECT r.reviewID 
                                                    FROM Review_2 r 
                                                    WHERE c.contentID = r.contentID AND r.userID = u.userID))`, [age]);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function getMostPopularGenre(userID) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ca.genreName, COUNT(*) as genreCount
                                                FROM Watchlist w, Collects c, CategorizedAs ca
                                                WHERE w.userID = :userID AND c.watchlistID = w.watchlistID AND ca.contentID = c.contentID
                                                GROUP BY genreName
                                                ORDER BY genreCount DESC`, [userID]);
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function searchServices(name, country, order) {
    return await withOracleDB(async (connection) => {
        let result;
        let nameSearchTerm = "%" + escapeSpecialChars(name) + "%";
        let countrySearchTerm = "%" + escapeSpecialChars(country) + "%";
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

async function searchMovies(contentID, duration, lengthType, ageRating, title, releaseDate, ageRestricted, and) {
    if (contentID !== null && contentID !== "" && duration !== null && duration !== "" && ageRestricted !== null && ageRestricted !== "") {
        if (isNaN(contentID) || isNaN(duration) || isNaN(ageRestricted)) {
            return [-1];
        }
    }

    if (releaseDate !== null && releaseDate !== "") {
        if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(releaseDate)) {
            return [-1];
        }
    }

    return await withOracleDB(async (connection) => {
        let result;
        if (and) {
            result = await connection.execute(`SELECT DISTINCT m2.contentID, m2.duration, m1.lengthType, c2.ageRating, c2.title, c2.releaseDate, c1.ageRestricted
                                            FROM Movie_1 m1, Movie_2 m2, Content_1 c1, Content_2 c2
                                            WHERE m2.contentID = :contentID AND m2.duration <= :duration AND m1.lengthType = :lengthType
                                            AND c2.ageRating = :ageRating AND c2.title = :title AND c2.releaseDate <= 
                                            TO_DATE(:releaseDate, 'yyyy-mm-dd') AND c1.ageRestricted = :ageRestricted AND m1.duration = m2.duration
                                            AND c2.contentID = m2.contentID AND c2.ageRating = c1.ageRating
                                            ORDER BY m2.contentID`,
                                            [contentID, duration, escapeSpecialChars(lengthType), escapeSpecialChars(ageRating),
                                                escapeSpecialChars(title), releaseDate, ageRestricted]);
        } else {
            result = await connection.execute(`SELECT DISTINCT m2.contentID, m2.duration, m1.lengthType, c2.ageRating, c2.title, c2.releaseDate, c1.ageRestricted
                                            FROM Movie_1 m1, Movie_2 m2, Content_1 c1, Content_2 c2
                                            WHERE (m2.contentID = :contentID OR m2.duration <= :duration OR m1.lengthType = :lengthType
                                            OR c2.ageRating = :ageRating OR c2.title = :title OR c2.releaseDate <=
                                            TO_DATE(:releaseDate, 'yyyy-mm-dd') OR c1.ageRestricted = :ageRestricted) AND m1.duration = m2.duration
                                            AND c2.contentID = m2.contentID AND c2.ageRating = c1.ageRating
                                            ORDER BY m2.contentID`,
                                            [contentID, duration, escapeSpecialChars(lengthType), escapeSpecialChars(ageRating),
                                                escapeSpecialChars(title), releaseDate, ageRestricted]);
        }

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function getGenreCountByAverageRuntime(releaseDate) {
    if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(releaseDate)) {
        return [];
    }

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT ca.genreName, Count(*) as genreCount 
                                                FROM Movie_2 m2, Content_2 c2, CategorizedAs ca 
                                                WHERE ca.contentID = m2.contentID AND c2.contentID = m2.contentID AND c2.releaseDate <= 
                                                TO_DATE(:releaseDate, 'yyyy-mm-dd') AND m2.duration <= (SELECT Avg(m.duration) 
                                                                                                        FROM Movie_2 m) 
                                                GROUP BY ca.genreName`,
                                             [releaseDate]);
        return result.rows;
    }).catch(() => {
        return [];
    });

}

// Only uses names pulled from the database, selected from dropdowns. User cannot input values directly.
async function viewTable(tableName, attributes) {
    return await withOracleDB(async (connection) => {
        let queryString = "SELECT " + attributes.join(", ") + " FROM " + tableName;
        
        const result = await connection.execute(queryString);
        return result.rows;
    }).catch(() => {
        return -1;
    });
}

async function getTableNames() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT table_name FROM user_tables`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

// Query adapted from baretta on StackOverflow
// https://stackoverflow.com/questions/452464/how-can-i-get-column-names-from-a-table-in-oracle
async function getAttributeNames(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT column_name FROM user_tab_columns WHERE table_name = :tableName`, [tableName]);
        return result.rows;
    }).catch(() => {
        return [];
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
    getContentInWatchlist,
    adddContentToWatchlist,
    deleteContentFromWatchlist,
    countWatchlist,
    countMovies,
    countReviews,
    countSeries,
    countServices,
    countShowsBySeasons,
    searchServices,
    getUltimateReviewers,
    getMostPopularGenre,
    searchMovies,
    getGenreCountByAverageRuntime,
    viewTable,
    getTableNames,
    getAttributeNames
};
