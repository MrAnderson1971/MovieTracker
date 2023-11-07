const oracledb = require('oracledb');
const { randomUUID } = require('crypto'); // If using Node.js' crypto


// Function to run a block of create table statements
async function createTables(createTableStatements) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: 'ora_bchu01',
            password: 'a27539022',
            connectionString: 'localhost:1521/orclpdb1'
        });

        let plsqlBlock = `BEGIN\n`;
        createTableStatements.forEach(statement => {
            const safeSqlStatement = statement.replace(/'/g, "''");
            plsqlBlock += `EXECUTE IMMEDIATE '${safeSqlStatement}';\n`;
        });
        plsqlBlock += `END;`;

        await connection.execute(plsqlBlock, [], { autoCommit: true });

        console.log('Tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

const createTableStatements = [
    `CREATE TABLE Review_1 (
    score INTEGER (score >= 1 AND score <= 10) PRIMARY KEY,
    category VARCHAR(100)
     )`,
    `CREATE TABLE Review_2 (
    reviewID INTEGER PRIMARY KEY,
    score INTEGER NOT NULL,
    reviewText VARCHAR(100),
    userID INTEGER NOT NULL,
    contentID INTEGER NOT NULL,
    FOREIGN KEY (score) REFERENCES Review_1(score),
    FOREIGN KEY (userID) REFERENCES User_2(userID),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
     )`
`CREATE TABLE User_1 (
    age INTEGER PRIMARY KEY,
    ageLock BOOLEAN
);`,
`CREATE TABLE User_3 (
    birthDate DATE PRIMARY KEY,
    age INTEGER,
    FOREIGN KEY (age) REFERENCES User_1(age)
);`,
`CREATE TABLE User_2 (
    userID INTEGER PRIMARY KEY,
    birthDate DATE,
    email VARCHAR(255) UNIQUE,
    userPassword VARCHAR(255),
    username VARCHAR(255) UNIQUE,
    FOREIGN KEY (birthDate) REFERENCES User_3(birthDate)
);`,
`CREATE TABLE Content_1 (
    ageRating CHAR(10) PRIMARY KEY,
    ageRestricted BOOLEAN
);`,
`CREATE TABLE Content_2 (
    contentID INTEGER PRIMARY KEY,
    ageRating CHAR(10),
    title VARCHAR(255) NOT NULL,
    releaseDate DATE NOT NULL,
    UNIQUE (title, releaseDate),
    FOREIGN KEY (ageRating) REFERENCES Content_1(ageRating)
);`,
`CREATE TABLE Movie_1 (
    duration INTEGER PRIMARY KEY,
    lengthType VARCHAR(255)
);`,
`CREATE TABLE Movie_2 (
    contentID INTEGER PRIMARY KEY,
    duration INTEGER,
    FOREIGN KEY (duration) REFERENCES Movie_1(duration),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE TVShow_2 (
    numSeasons INTEGER PRIMARY KEY,
    seriesType VARCHAR(255)
);`,
`CREATE TABLE TVShow_1 (
    contentID INTEGER PRIMARY KEY,
    numSeasons INTEGER,
    FOREIGN KEY (numSeasons) REFERENCES TVShow_2(numSeasons),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE Watchlist (
    watchlistID INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contentID INTEGER NOT NULL,
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE Language (
    languageName VARCHAR(255) PRIMARY KEY
);`,
`CREATE TABLE Genre (
    genreName VARCHAR(255) PRIMARY KEY
);`,
`CREATE TABLE Country (
    countryName VARCHAR(255) PRIMARY KEY
);`,
`CREATE TABLE StreamingService (
    streamingServiceName VARCHAR(255) PRIMARY KEY
);`,
`CREATE TABLE Episode (
    contentID INTEGER,
    season INTEGER,
    episode INTEGER,
    duration INTEGER,
    title VARCHAR(255),
    PRIMARY KEY (contentID, season, episode),
    FOREIGN KEY (contentID) REFERENCES TVShow_1(contentID)
);`,
`    CREATE TABLE TranslatedAs (
        languageName VARCHAR(255),
    contentID INTEGER,
    audio BOOLEAN,
    subtitles BOOLEAN,
    PRIMARY KEY (languageName, contentID),
    FOREIGN KEY (languageName) REFERENCES Language(languageName),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE Writes (
    userID INTEGER,
    reviewID INTEGER PRIMARY KEY,
    FOREIGN KEY (userID) REFERENCES User_2(userID),
    FOREIGN KEY (reviewID) REFERENCES Review_2(reviewID)
);`,
`CREATE TABLE Creates (
    watchlistID INTEGER,
    userID INTEGER,
    PRIMARY KEY (watchlistID, userID),
    FOREIGN KEY (watchlistID) REFERENCES Watchlist(watchlistID),
    FOREIGN KEY (userID) REFERENCES User_2(userID)
);`,
`CREATE TABLE Collects (
    watchlistID INTEGER,
    contentID INTEGER,
    PRIMARY KEY (watchlistID, contentID),
    FOREIGN KEY (watchlistID) REFERENCES Watchlist(watchlistID),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE CategorizedAs (
    genreName VARCHAR(255),
    contentID INTEGER,
    PRIMARY KEY (genreName, contentID),
    FOREIGN KEY (genreName) REFERENCES Genre(genreName),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE Has (
    streamingServiceName VARCHAR(255),
    contentID INTEGER,
    PRIMARY KEY (streamingServiceName, contentID),
    FOREIGN KEY (streamingServiceName) REFERENCES StreamingService(streamingServiceName),
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);`,
`CREATE TABLE AvailableIn (
    countryName VARCHAR(255),
    streamingServiceName VARCHAR(255),
    PRIMARY KEY (countryName, streamingServiceName),
    FOREIGN KEY (countryName) REFERENCES Country(countryName),
    FOREIGN KEY (streamingServiceName) REFERENCES StreamingService(streamingServiceName)
);`,
`CREATE TABLE LeftOn (
    contentID INTEGER,
    reviewID INTEGER PRIMARY KEY,
    FOREIGN KEY (contentID) REFERENCES Content_2(contentID),
    FOREIGN KEY (reviewID) REFERENCES Review_2(reviewID)
);`
];

async function error(err) {
    console.error("Transaction failed, rolling back...", err);
    await dbConnection.execute("ROLLBACK");
    throw err;
}

async function insertReview(dbConnection, score, text, category, userID, contentID) {
    try {
        const reviewID = randomUUID();
        const sqlInsertReview1 = `INSERT INTO Review_1(score, category) VALUES (:score, :category)`;
        const sqlInsertReview2 = `INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES (:reviewID, :score, :text, :userID, :contentID)`;

        // Start a transaction
        await dbConnection.execute('BEGIN');

        await Promise.all([dbConnection.execute(sqlInsertReview1, {score: score, category: category}, {autoCommit: false}),
            dbConnection.execute(sqlInsertReview2, {reviewID: reviewID, score: score, text: text, userID: userID, contentID: contentID}, {autoCommit: false})]);

        // If both inserts are successful, commit the transaction
        await dbConnection.execute('COMMIT');
    } catch (err) {
        await error(err);
    }
}

async function insertUser(dbConnection, age, ageLock, birthdate, email, password, username) {
    try {
        const userID = randomUUID();
        const sqlInsertUser1 = `INSERT INTO User_1(age, ageLock) VALUES (:age, :ageLock)`;
        const sqlInsertUser2 = `INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES (:userID, :birthdate, :email, :password, :username)`;
        const sqlInsertUser3 = `INSERT INTO User_3(birthdate, age) VALUES (:birthdate, :age)`;
        await dbConnection.execute('BEGIN');
        await Promise.all([dbConnection.execute(sqlInsertUser1, {age: age, ageLock: ageLock}, {autoCommit: false}),
            dbConnection.execute(sqlInsertUser2, {userID: userID, birthdate: birthdate, email: email, userPassword: password, username: username}, {autoCommit: false}),
            dbConnection.execute(sqlInsertUser3, {birthdate: birthdate, age: age}, {autoCommit: false})]);
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertWatchlist(dbConnection, name) {
    try {
        const watchlistID = randomUUID();
        await dbConnection.execute('BEGIN');
        await dbConnection.execute(`INSERT INTO Watchlist(watchListID, name) VALUES (:watchlistID, :name)`, {watchlistID: watchlistID, name: name}, {autoCommit: false});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertMovie(dbConnection, ageRating, ageRestricted, title, releaseDate, duration, lengthType) {
    try {
        const contentID = randomUUID();
        await dbConnection.execute("BEGIN");
        const sqlInsertMovie1 = `INSERT INTO Movie_1(duration, lengthType) VALUES (:duration, :lengthType)`;
        const sqlInsertMovie2 = `INSERT INTO Movie_2(contentID, duration) VALUES (:contentID, :duration)`;
        await Promise.all([dbConnection.execute(sqlInsertMovie1, {duration: duration, lengthType: lengthType}, {autoCommit: false}),
            dbConnection.execute(sqlInsertMovie2, {contentID: contentID, duration: duration}, {autoCommit: false})]);
        await insertContent(dbConnection, contentID, ageRating, ageRestricted, title, releaseDate);
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertTVShow(dbConnection, ageRating, ageRestricted, title, releaseDate, numSeasons, seriesType) {
    try {
        const contentID = randomUUID();
        await dbConnection.execute("BEGIN");
        const sqlInsertTVShow2 = `INSERT INTO TVShow_2(numSeasons, seriesType) VALUES (:numSeasons, :seriesType)`;
        const sqlInsertTVShow1 = `INSERT INTO TVShow_1(contentID, numSeasons) VALUES (:contentID, :numSeasons)`;
        await Promise.all([dbConnection.execute(sqlInsertTVShow2, {numSeasons: numSeasons, seriesType: seriesType}, {autoCommit: false}),
            dbConnection.execute(sqlInsertTVShow1, {contentID: contentID, numSeasons: numSeasons}, {autoCommit: false})]);
        await insertContent(dbConnection, contentID, ageRating, ageRestricted, title, releaseDate);
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertContent(dbConnection, contentID, ageRating, ageRestricted, title, releaseDate) {
        const sqlInsertContent1 = `INSERT INTO Content_1(ageRating, ageRestricted) VALUES (:ageRating, :ageRestricted)`;
        const sqlInsertContent2 = `INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES (:contentID, :ageRating, :title, :releaseDate)`;
        await Promise.all([dbConnection.execute(sqlInsertContent1, {ageRating: ageRating, ageRestricted: ageRestricted}, {autoCommit: false}),
            dbConnection.execute(sqlInsertContent2, {contentID: contentID, ageRating: ageRating, title: title, releaseDate: releaseDate}, {autoCommit: false})]);
}

async function insertLanguage(dbConnection, languageName) {
    try {
        await dbConnection.execute("BEGIN");
        await dbConnection.execute(`INSERT INTO Language(languageName) VALUES (:languageName)`, {languageName: languageName});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertCountry(dbConnection, countryName) {
    try {
        await dbConnection.execute("BEGIN");
        await dbConnection.execute(`INSERT INTO Country(countryName) VALUES (:countryName)`, {countryName: countryName}, {autoCommit: false});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertGenre(dbConnection, genreName) {
    try {
        await dbConnection.execute("BEGIN");
        await dbConnection.execute(`INSERT INTO Genre(genreName) VALUES (:genreName)`, {genreName: genreName}, {autoCommit: false});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertStreamingService(dbConnection, streamingServiceName) {
    try {
        await dbConnection.execute("BEGIN");
        await dbConnection.execute(`INSERT INTO StreamingService(streamingServiceName) VALUES (:streamingServiceName)`, {streamingServiceName: streamingServiceName}, {autoCommit: false});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

async function insertEpisode(dbConnection, contentID, season, episode, duration, title) {
    try {
        await dbConnection.execute("BEGIN");
        await dbConnection.execute(`INSERT INTO Episode(conetnID, season, duration, title) VALUES (:contentID, :season, :episode, :duration, :title)`,
            {contentID: contentID, season: season, episode: episode, duration: duration, title: title}, {autoCommit: false});
        await dbConnection.execute("COMMIT");
    } catch (err) {
        await error(err);
    }
}

// Run the create tables function
createTables(createTableStatements);
