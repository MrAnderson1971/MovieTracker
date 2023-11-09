-- drop table Review_1;
-- drop table Review_2;
-- drop table User_1;
-- drop table User_2;
-- drop table User_3;
-- drop table Content_1;
-- drop table Content_2;
-- drop table Movie_1;
-- drop table Movie_2;
-- drop table TVShow_1;
-- drop table TVShow_2;
-- drop table Watchlist;
-- drop table Language;
-- drop table Genre;
-- drop table Country;
-- drop table Episode;
-- drop table TranslatedAs;
-- drop table Collects;
-- drop table CategorizedAs;
-- drop table Has;
-- drop table AvailableIn;

drop table AVAILABLEIN cascade constraints;
drop table CATEGORIZEDAS cascade constraints;
drop table COLLECTS cascade constraints;
drop table CONTENT_1 cascade constraints;
drop table CONTENT_2 cascade constraints;
drop table COUNTRY cascade constraints;
drop table EPISODE cascade constraints;
drop table GENRE cascade constraints;

drop table HAS cascade constraints;
drop table LANGUAGE cascade constraints;
drop table MOVIE_1 cascade constraints;
drop table MOVIE_2 cascade constraints;
drop table REVIEW_1 cascade constraints;
drop table REVIEW_2 cascade constraints;
drop table STREAMINGSERVICE cascade constraints;

drop table TVSHOW_1 cascade constraints;
drop table TVSHOW_2 cascade constraints;
drop table USER_1 cascade constraints;
drop table USER_2 cascade constraints;
drop table USER_3 cascade constraints;
drop table WATCHLIST cascade constraints;
drop table TRANSLATEDAS cascade constraints;



CREATE TABLE User_1 (
  age INTEGER PRIMARY KEY, 
  ageLock INTEGER,
  CHECK (ageLock = 0 OR ageLock = 1)
);
grant select on User_1 to public;

CREATE TABLE User_3 (  
  birthDate DATE PRIMARY KEY,
  age INTEGER,
  FOREIGN KEY (age) REFERENCES User_1(age)
);
grant select on User_3 to public;

CREATE TABLE User_2 (
  userID INTEGER PRIMARY KEY,
  birthDate DATE,
  email VARCHAR(255) UNIQUE,
  userPassword VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  FOREIGN KEY (birthDate) REFERENCES User_3(birthDate)
);
grant select on User_2 to public;

CREATE TABLE Content_1 (
  ageRating CHAR(10) PRIMARY KEY,
  ageRestricted INTEGER,
  CHECK (ageRestricted = 0 OR ageRestricted = 1)
);
grant select on Content_1 to public;

CREATE TABLE Content_2 (
  contentID INTEGER PRIMARY KEY,
  ageRating CHAR(10),
  title VARCHAR(255) NOT NULL,
  releaseDate DATE NOT NULL,
  UNIQUE (title, releaseDate),
  FOREIGN KEY (ageRating) REFERENCES Content_1(ageRating)
);
grant select on Content_2 to public;

CREATE TABLE Review_1 (
  score INTEGER PRIMARY KEY, 
  category VARCHAR(255)
);
grant select on Review_1 to public;

CREATE TABLE Review_2 (
  reviewID INTEGER PRIMARY KEY,
  score INTEGER,
  CHECK (score >= 1 AND score <= 10),
  reviewText VARCHAR(255),
  userID INTEGER NOT NULL,
  contentID INTEGER NOT NULL,
  FOREIGN KEY (score) REFERENCES Review_1(score),
  FOREIGN KEY (userID) REFERENCES User_2(userID),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on Review_2 to public;

CREATE TABLE Movie_1 (
  duration INTEGER PRIMARY KEY,
  lengthType VARCHAR(255)
);
grant select on Movie_1 to public;

CREATE TABLE Movie_2 (
  contentID INTEGER PRIMARY KEY,
  duration INTEGER,
  FOREIGN KEY (duration) REFERENCES Movie_1(duration),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on Movie_2 to public;


CREATE TABLE TVShow_2 (
  numSeasons INTEGER PRIMARY KEY,
  seriesType VARCHAR(255)
);
grant select on TVShow_2 to public;

CREATE TABLE TVShow_1 (
  contentID INTEGER PRIMARY KEY,
  numSeasons INTEGER,
  FOREIGN KEY (numSeasons) REFERENCES TVShow_2(numSeasons),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on TVShow_1 to public;


CREATE TABLE Watchlist (
  watchlistID INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  userID INTEGER NOT NULL,
  FOREIGN KEY (userID) REFERENCES User_2(userID)
);
grant select on Watchlist to public;

CREATE TABLE Language (
  languageName VARCHAR(255) PRIMARY KEY
);
grant select on Language to public;

CREATE TABLE Genre (
  genreName VARCHAR(255) PRIMARY KEY
);
grant select on Genre to public;

CREATE TABLE Country (
  countryName VARCHAR(255) PRIMARY KEY
);
grant select on Country to public;

CREATE TABLE StreamingService (
  streamingServiceName VARCHAR(255) PRIMARY KEY
);
grant select on StreamingService to public;

CREATE TABLE Episode (
  contentID INTEGER,
  season INTEGER,
  episode INTEGER,
  duration INTEGER,
  title VARCHAR(255),
  PRIMARY KEY (contentID, season, episode),
  FOREIGN KEY (contentID) REFERENCES TVShow_1(contentID)
);
grant select on Episode to public;

CREATE TABLE TranslatedAs (
  languageName VARCHAR(255),
  contentID INTEGER,
  audio INTEGER,
  subtitles INTEGER,
  CHECK (audio = 0 OR audio = 1),
  CHECK (subtitles = 0 OR subtitles = 1),
  PRIMARY KEY (languageName, contentID),
  FOREIGN KEY (languageName) REFERENCES Language(languageName),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on TranslatedAs to public;

CREATE TABLE Collects (
  watchlistID INTEGER,
  contentID INTEGER,
  PRIMARY KEY (watchlistID, contentID),
  FOREIGN KEY (watchlistID) REFERENCES Watchlist(watchlistID) ON DELETE CASCADE,
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on Collects to public;

CREATE TABLE CategorizedAs (
  genreName VARCHAR(255),
  contentID INTEGER,
  PRIMARY KEY (genreName, contentID),
  FOREIGN KEY (genreName) REFERENCES Genre(genreName),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on CategorizedAs to public;

CREATE TABLE Has (
  streamingServiceName VARCHAR(255),
  contentID INTEGER,
  PRIMARY KEY (streamingServiceName, contentID),
  FOREIGN KEY (streamingServiceName) REFERENCES StreamingService(streamingServiceName),
  FOREIGN KEY (contentID) REFERENCES Content_2(contentID)
);
grant select on Has to public;

CREATE TABLE AvailableIn (
  countryName VARCHAR(255),
  streamingServiceName VARCHAR(255),
  PRIMARY KEY (countryName, streamingServiceName),
  FOREIGN KEY (countryName) REFERENCES Country(countryName),
  FOREIGN KEY (streamingServiceName) REFERENCES StreamingService(streamingServiceName)
);
grant select on AvailableIn to public;


INSERT INTO User_1(age, ageLock) VALUES
(13, 1);

INSERT INTO User_1(age, ageLock) VALUES
(30, 0);

INSERT INTO User_1(age, ageLock) VALUES
(10, 1);

INSERT INTO User_1(age, ageLock) VALUES
(40, 0);

INSERT INTO User_1(age, ageLock) VALUES
(25, 0);


INSERT INTO User_3(birthdate, age) VALUES
(TO_DATE('19980101', 'yyyymmdd'), 25);

INSERT INTO User_3(birthdate, age) VALUES
(TO_DATE('19930210', 'yyyymmdd'), 30);

INSERT INTO User_3(birthdate, age) VALUES
(TO_DATE('20100320', 'yyyymmdd'), 13);

INSERT INTO User_3(birthdate, age) VALUES
(TO_DATE('19830415', 'yyyymmdd'), 40);

INSERT INTO User_3(birthdate, age) VALUES
(TO_DATE('20130525', 'yyyymmdd'), 10);


INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES
(1, TO_DATE('19980101', 'yyyymmdd'), 'user1@example.com', 'password1', 'user1');

INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES
(2, TO_DATE('19930210', 'yyyymmdd'), 'user2@example.com', 'password2', 'user2');

INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES
(3, TO_DATE('20100320', 'yyyymmdd'), 'user3@example.com', 'password3', 'user3');

INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES
(4, TO_DATE('19830415', 'yyyymmdd'), 'user4@example.com', 'password4', 'user4');

INSERT INTO User_2(userID, birthdate, email, userPassword, username) VALUES
(5, TO_DATE('20130525', 'yyyymmdd'), 'user5@example.com', 'password5', 'user5');


INSERT INTO Content_1(ageRating, ageRestricted) VALUES
('PG', 0);

INSERT INTO Content_1(ageRating, ageRestricted) VALUES
('PG-13', 1);

INSERT INTO Content_1(ageRating, ageRestricted) VALUES
('R', 1);

INSERT INTO Content_1(ageRating, ageRestricted) VALUES
('G', 0);

INSERT INTO Content_1(ageRating, ageRestricted) VALUES
('NR', 0);


INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(1, 'PG', 'Movie 1', TO_DATE('20220101', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(2, 'PG-13', 'Movie 2', TO_DATE('20220201', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(3, 'R', 'Movie 3', TO_DATE('20220301', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(4, 'G', 'Movie 4', TO_DATE('20220401', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(5, 'NR', 'Movie 5', TO_DATE('20220501', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(6, 'PG', 'Show 1', TO_DATE('20220101', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(7, 'PG-13', 'Show 2', TO_DATE('20220201', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(8, 'R', 'Show 3', TO_DATE('20220301', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(9, 'G', 'Show 2', TO_DATE('20220401', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(10, 'NR', 'Show 5', TO_DATE('20220501', 'yyyymmdd'));


INSERT INTO Review_1(score, category) VALUES
(1, 'Terrible');

INSERT INTO Review_1(score, category) VALUES
(2, 'Poor');

INSERT INTO Review_1(score, category) VALUES
(3, 'Bad');

INSERT INTO Review_1(score, category) VALUES
(4, 'Average');

INSERT INTO Review_1(score, category) VALUES
(5, 'Good');


INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(1, 1, 'Did not like this at all.', 1, 1);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(2, 2, 'Could be better.', 2, 2);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(3, 3, 'It was bad but had some redeeming qualities.', 3, 3);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(4, 4, 'Not great, but not bad either', 4, 4);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(5, 5, 'Enjoyed it!', 5, 5);


INSERT INTO Movie_1(duration, lengthType) VALUES
(120, 'Medium');

INSERT INTO Movie_1(duration, lengthType) VALUES
(90, 'Short');

INSERT INTO Movie_1(duration, lengthType) VALUES
(150, 'Long');

INSERT INTO Movie_1(duration, lengthType) VALUES
(110, 'Medium');

INSERT INTO Movie_1(duration, lengthType) VALUES
(95, 'Short');


INSERT INTO Movie_2(contentID, duration) VALUES
(1, 120);

INSERT INTO Movie_2(contentID, duration) VALUES
(2, 90);

INSERT INTO Movie_2(contentID, duration) VALUES
(3, 150);

INSERT INTO Movie_2(contentID, duration) VALUES
(4, 110);

INSERT INTO Movie_2(contentID, duration) VALUES
(5, 95);


INSERT INTO TVShow_2(numSeasons, seriesType) VALUES
(1, 'Mini-Series');

INSERT INTO TVShow_2(numSeasons, seriesType) VALUES
(3, 'Longform');

INSERT INTO TVShow_2(numSeasons, seriesType) VALUES
(5, 'Longform');

INSERT INTO TVShow_2(numSeasons, seriesType) VALUES
(2, 'Longform');

INSERT INTO TVShow_2(numSeasons, seriesType) VALUES
(4, 'Longform');


INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(6, 1);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(7, 3);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(8, 5);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(9, 2);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(10, 4);


INSERT INTO Watchlist(watchlistID, name, userID) VALUES
(1, 'Summer Binge List', 1);

INSERT INTO Watchlist(watchlistID, name, userID) VALUES
(2, 'Drama Favorites', 2);

INSERT INTO Watchlist(watchlistID, name, userID) VALUES
(3, 'Weekend Chill', 3);

INSERT INTO Watchlist(watchlistID, name, userID) VALUES
(4, 'Documentary Picks', 4);

INSERT INTO Watchlist(watchlistID, name, userID) VALUES
(5, 'Family Night', 5);


INSERT INTO Language(languageName) VALUES
('English');

INSERT INTO Language(languageName) VALUES
('Spanish');

INSERT INTO Language(languageName) VALUES
('French');

INSERT INTO Language(languageName) VALUES
('German');

INSERT INTO Language(languageName) VALUES
('Chinese');


INSERT INTO Genre(genreName) VALUES
('Drama');

INSERT INTO Genre(genreName) VALUES
('Comedy');

INSERT INTO Genre(genreName) VALUES
('Action');

INSERT INTO Genre(genreName) VALUES
('Thriller');

INSERT INTO Genre(genreName) VALUES
('Romance');


INSERT INTO Country(countryName) VALUES
('USA');

INSERT INTO Country(countryName) VALUES
('UK');

INSERT INTO Country(countryName) VALUES
('Canada');

INSERT INTO Country(countryName) VALUES
('Australia');

INSERT INTO Country(countryName) VALUES
('India');


INSERT INTO StreamingService(streamingServiceName) VALUES
('Netflix');

INSERT INTO StreamingService(streamingServiceName) VALUES
('Amazon Prime');

INSERT INTO StreamingService(streamingServiceName) VALUES
('Disney+');

INSERT INTO StreamingService(streamingServiceName) VALUES
('Hulu');

INSERT INTO StreamingService(streamingServiceName) VALUES
('HBO Max');


INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(6, 1, 1, 40, 'Pilot Episode');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 1, 2, 45, 'The Reunion');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 1, 3, 42, 'Twist and Turns');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(9, 2, 1, 50, 'A New Beginning');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 2, 2, 48, 'Unexpected Events');


INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 1, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Spanish', 1, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('French', 2, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('German', 3, 1, 0);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Chinese', 4, 0, 1);


INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 1);

INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 2);

INSERT INTO Collects(watchlistID, contentID) VALUES
(2, 3);

INSERT INTO Collects(watchlistID, contentID) VALUES
(3, 4);

INSERT INTO Collects(watchlistID, contentID) VALUES
(4, 5);


INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 1);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 2);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 3);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Thriller', 4);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Romance', 5);


INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 1);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Amazon Prime', 2);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 3);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 4);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 5);


INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('UK', 'Amazon Prime');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Canada', 'Disney+');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Australia', 'Hulu');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('India', 'HBO Max');
