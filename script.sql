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
  admin INTEGER,
  CHECK (admin = 0 OR admin = 1),
  FOREIGN KEY (birthDate) REFERENCES User_3(birthDate)
);
grant select on User_2 to public;

CREATE TABLE Content_1 (
  ageRating VARCHAR(10) PRIMARY KEY,
  ageRestricted INTEGER,
  CHECK (ageRestricted = 0 OR ageRestricted = 1)
);
grant select on Content_1 to public;

CREATE TABLE Content_2 (
  contentID INTEGER PRIMARY KEY,
  ageRating VARCHAR(10),
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


INSERT INTO User_2(userID, birthdate, email, userPassword, username, admin) VALUES
(1, TO_DATE('19980101', 'yyyymmdd'), 'user1@example.com', 'password1', 'user1', 1);

INSERT INTO User_2(userID, birthdate, email, userPassword, username, admin) VALUES
(2, TO_DATE('19930210', 'yyyymmdd'), 'user2@example.com', 'password2', 'user2', 0);

INSERT INTO User_2(userID, birthdate, email, userPassword, username, admin) VALUES
(3, TO_DATE('20100320', 'yyyymmdd'), 'user3@example.com', 'password3', 'user3', 0);

INSERT INTO User_2(userID, birthdate, email, userPassword, username, admin) VALUES
(4, TO_DATE('19830415', 'yyyymmdd'), 'user4@example.com', 'password4', 'user4', 0);

INSERT INTO User_2(userID, birthdate, email, userPassword, username, admin) VALUES
(5, TO_DATE('20130525', 'yyyymmdd'), 'user5@example.com', 'password5', 'user5', 0);


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
(11, 'PG', 'Movie A', TO_DATE('20150101', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(12, 'PG-13', 'Movie B', TO_DATE('20140201', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(13, 'R', 'Movie C', TO_DATE('20130301', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(14, 'G', 'Movie D', TO_DATE('20120401', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(15, 'NR', 'Movie E', TO_DATE('20110501', 'yyyymmdd'));

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

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(16, 'PG', 'Show A', TO_DATE('20200101', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(17, 'PG-13', 'Show B', TO_DATE('20200201', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(18, 'R', 'Show C', TO_DATE('20200301', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(19, 'G', 'Show D', TO_DATE('20200401', 'yyyymmdd'));

INSERT INTO Content_2(contentID, ageRating, title, releaseDate) VALUES
(20, 'NR', 'Show E', TO_DATE('20200501', 'yyyymmdd'));


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
(6, 1, 'Did not like this at all.', 1, 2);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(7, 1, 'Did not like this at all.', 1, 3);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(8, 1, 'Did not like this at all.', 1, 4);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(9, 1, 'Did not like this at all.', 1, 5);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(10, 1, 'Did not like this at all.', 1, 6);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(11, 1, 'Did not like this at all.', 1, 7);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(12, 1, 'Did not like this at all.', 1, 8);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(13, 1, 'Did not like this at all.', 1, 9);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(14, 1, 'Did not like this at all.', 1, 10);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(17, 1, 'Did not like this at all.', 1, 11);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(18, 1, 'Did not like this at all.', 1, 12);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(19, 1, 'Did not like this at all.', 1, 13);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(20, 1, 'Did not like this at all.', 1, 14);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(21, 1, 'Did not like this at all.', 1, 15);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(22, 1, 'Did not like this at all.', 1, 16);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(23, 1, 'Did not like this at all.', 1, 17);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(24, 1, 'Did not like this at all.', 1, 18);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(25, 1, 'Did not like this at all.', 1, 19);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(26, 1, 'Did not like this at all.', 1, 20);


INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(101, 1, 'Did not like this at all.', 3, 1);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(102, 1, 'Did not like this at all.', 3, 2);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(103, 1, 'Did not like this at all.', 3, 3);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(104, 1, 'Did not like this at all.', 3, 4);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(105, 1, 'Did not like this at all.', 3, 5);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(106, 1, 'Did not like this at all.', 3, 6);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(107, 1, 'Did not like this at all.', 3, 7);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(108, 1, 'Did not like this at all.', 3, 8);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(109, 1, 'Did not like this at all.', 3, 9);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(110, 1, 'Did not like this at all.', 3, 10);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(111, 1, 'Did not like this at all.', 3, 11);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(112, 1, 'Did not like this at all.', 3, 12);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(113, 1, 'Did not like this at all.', 3, 13);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(114, 1, 'Did not like this at all.', 3, 14);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(115, 1, 'Did not like this at all.', 3, 15);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(116, 1, 'Did not like this at all.', 3, 16);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(117, 1, 'Did not like this at all.', 3, 17);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(118, 1, 'Did not like this at all.', 3, 18);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(119, 1, 'Did not like this at all.', 3, 19);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(120, 1, 'Did not like this at all.', 3, 20);



INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(2, 2, 'Could be better.', 2, 2);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(15, 2, 'Could be better.', 2, 3);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(16, 2, 'Could be better.', 2, 4);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(3, 3, 'It was bad but had some redeeming qualities.', 3, 3);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(4, 4, 'Not great, but not bad either', 4, 4);

INSERT INTO Review_2(reviewID, score, reviewText, userID, contentID) VALUES
(5, 5, 'Enjoyed it!', 5, 5);


INSERT INTO Movie_1(duration, lengthType) VALUES
(120, 'Medium');

INSERT INTO Movie_1(duration, lengthType) VALUES
(125, 'Medium');

INSERT INTO Movie_1(duration, lengthType) VALUES
(90, 'Short');

INSERT INTO Movie_1(duration, lengthType) VALUES
(100, 'Short');

INSERT INTO Movie_1(duration, lengthType) VALUES
(150, 'Long');

INSERT INTO Movie_1(duration, lengthType) VALUES
(160, 'Long');

INSERT INTO Movie_1(duration, lengthType) VALUES
(180, 'Long');

INSERT INTO Movie_1(duration, lengthType) VALUES
(110, 'Medium');

INSERT INTO Movie_1(duration, lengthType) VALUES
(95, 'Short');

INSERT INTO Movie_1(duration, lengthType) VALUES
(80, 'Short');


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

INSERT INTO Movie_2(contentID, duration) VALUES
(11, 80);

INSERT INTO Movie_2(contentID, duration) VALUES
(12, 100);

INSERT INTO Movie_2(contentID, duration) VALUES
(13, 180);

INSERT INTO Movie_2(contentID, duration) VALUES
(14, 125);

INSERT INTO Movie_2(contentID, duration) VALUES
(15, 160);


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

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(16, 1);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(17, 2);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(18, 1);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(19, 3);

INSERT INTO TVShow_1(contentID, numSeasons) VALUES
(20, 1);


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

INSERT INTO Country(countryName) VALUES
('China');


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
(6, 1, 2, 40, 'Getting Out');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(6, 1, 3, 40, 'Growing Up');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 1, 1, 45, 'The Beginning');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 1, 2, 45, 'The Reunion');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 1, 3, 45, 'The Fallout');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 2, 1, 45, 'The Ultimatum');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 2, 2, 45, 'The Dispute');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 2, 3, 45, 'The Resolution');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 3, 1, 45, 'The Acceptance');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 3, 2, 45, 'The Denoument');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(7, 3, 3, 45, 'The End');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 1, 1, 42, 'Twist and Turns');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 2, 1, 42, 'Give Me Everything');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 3, 1, 42, 'Simplicity');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 4, 1, 42, 'What Goes Up...');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(8, 5, 1, 42, '...Must Come Down');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(9, 1, 1, 50, 'A New Beginning');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(9, 1, 2, 50, 'In The City');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(9, 2, 1, 50, 'Bring It Back');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(9, 2, 3, 50, 'Letting Go');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 1, 1, 48, 'The Investigation');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 1, 2, 48, 'Unexpected Events');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 2, 1, 48, 'On The Trail');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 2, 2, 48, 'The Suspect');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 3, 1, 48, 'Cold Trail');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 3, 2, 48, 'A New Lead');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(10, 4, 1, 48, 'The Culprit is Caught');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(16, 1, 1, 40, 'Pilot Episode');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(17, 1, 1, 40, 'Pilot');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(17, 2, 1, 40, 'Reborn');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(18, 1, 1, 40, 'Pilot Episode');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(19, 1, 1, 40, 'Pilot Episode');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(19, 2, 1, 40, 'New Beginnings');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(19, 3, 1, 40, 'End of it All');

INSERT INTO Episode(contentID, season, episode, duration, title) VALUES
(20, 1, 1, 40, 'Pilot Episode');


INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 1, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Spanish', 1, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('French', 2, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('German', 3, 1, 0);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 4, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 5, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 6, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 7, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 8, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 9, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Chinese', 10, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Spanish', 11, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('French', 12, 0, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('German', 13, 1, 0);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 14, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 15, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 16, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 17, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 18, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('English', 19, 1, 1);

INSERT INTO TranslatedAs(languageName, contentID, audio, subtitles) VALUES
('Chinese', 20, 0, 1);



INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 1);

INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 2);

INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 4);

INSERT INTO Collects(watchlistID, contentID) VALUES
(1, 5);

INSERT INTO Collects(watchlistID, contentID) VALUES
(2, 3);

INSERT INTO Collects(watchlistID, contentID) VALUES
(2, 6);

INSERT INTO Collects(watchlistID, contentID) VALUES
(3, 4);

INSERT INTO Collects(watchlistID, contentID) VALUES
(3, 1);

INSERT INTO Collects(watchlistID, contentID) VALUES
(3, 10);

INSERT INTO Collects(watchlistID, contentID) VALUES
(3, 9);

INSERT INTO Collects(watchlistID, contentID) VALUES
(4, 7);

INSERT INTO Collects(watchlistID, contentID) VALUES
(4, 8);


INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 1);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 2);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 3);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 4);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Romance', 5);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 6);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 7);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 8);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 9);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Romance', 10);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 11);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 12);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 13);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Comedy', 14);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 15);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 16);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Romance', 17);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Action', 18);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Drama', 19);

INSERT INTO CategorizedAs(genreName, contentID) VALUES
('Romance', 20);


INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 1);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 5);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 6);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 7);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 8);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 9);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 11);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 12);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 13);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 14);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 15);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 16);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 17);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 18);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 19);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Netflix', 20);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Amazon Prime', 2);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Amazon Prime', 3);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Amazon Prime', 4);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Amazon Prime', 5);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 3);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 1);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 6);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 7);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Disney+', 8);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 4);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 6);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 8);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 9);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('Hulu', 10);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 10);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 1);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 3);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 4);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 6);

INSERT INTO Has(streamingServiceName, contentID) VALUES
('HBO Max', 9);


INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('UK', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Canada', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Australia', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('India', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('China', 'Netflix');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'Amazon Prime');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('UK', 'Amazon Prime');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Canada', 'Amazon Prime');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Australia', 'Amazon Prime');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Canada', 'Disney+');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'Disney+');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('UK', 'Disney+');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('China', 'Disney+');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('Australia', 'Hulu');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'Hulu');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('UK', 'Hulu');

INSERT INTO AvailableIn(countryName, streamingServiceName) VALUES
('USA', 'HBO Max');
