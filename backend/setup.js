const oracledb = require('oracledb');

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

// Your CREATE TABLE statements
const createTableStatements = [
    `CREATE TABLE Review_2 (
        reviewID INTEGER PRIMARY KEY,
    score INTEGER,
    reviewText VARCHAR(255),
    FOREIGN KEY (score) REFERENCES Review_1(score)
);`,
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
    name VARCHAR(255) NOT NULL
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

// Run the create tables function
createTables(createTableStatements);
