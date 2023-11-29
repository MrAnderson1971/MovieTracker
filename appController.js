/*
    Code adapted from the demo project files
*/

const express = require('express');
const appService = require('./appService');
// const cors = require("cors");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const loginResult = await appService.login(username, password);
    if (loginResult.length > 0) {
        res.json({ success: true, userID: loginResult[0][0], admin: loginResult[0][1] });
    } else {
        res.status(401).json({ success: false, userID: loginResult[0], admin: loginResult[1] });
    }
});

router.post("/insert-user", async (req, res) => {
    const { username, email, password, birthDate } = req.body;
    const insertResult = await appService.insertUser(username, email, password, birthDate);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/create-watchlist", async (req, res) => {
    const { name, userID } = req.body;
    const insertResult = await appService.createWatchlist(name, userID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-watchlist", async (req, res) => {
    const { watchlistID } = req.body;
    const deleteResult = await appService.deleteWatchlist(watchlistID);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/update-watchlist", async (req, res) => {
    const { watchlistID, name, userID } = req.body;
    const insertResult = await appService.updateWatchlist(watchlistID, name, userID);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/get-watchlists", async (req, res) => {
    const { userID } = req.body;
    const result = await appService.getWatchlistsForUser(userID);
    if (result.length > 0) {
        res.json({ success: true, result: result });
    } else {
        res.status(500).json({ success: false, result: result });
    }
});

router.post("/get-watchlist-content", async (req, res) => {
    const { userID } = req.body;
    const result = await appService.getContentInWatchlist(userID);
    if (result.length > 0) {
        res.json({ success: true, result: result });
    } else {
        res.status(500).json({ success: false, result: result });
    }
});

router.post("/add-watchlist-content", async (req, res) => {
    const { watchlistID, contentID } = req.body;
    const insertResult = await appService.adddContentToWatchlist(watchlistID, contentID);
    if (insertResult === 1) {
        res.status(200).json({ success: true });
    } else if (insertResult === 404) {
        console.log("Not found");
        res.status(404).json({ success: false });
    } else if (insertResult === 400) {
        console.log("duplicate")
        res.status(400).json({ success: false });
    } else {
        console.log("Other error");
        res.status(500).json({ success: false });
    }
});

router.delete("/remove-watchlist-content", async (req, res) => {
    const { watchlistID, contentID } = req.body;
    const insertResult = await appService.removeContentFromWatchlist(watchlistID, contentID);
    if (insertResult === 1) {
        res.status(200).json({ success: true });
    } else if (insertResult === 404) {
        res.status(404).json({ success: false });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/count-watchlist', async (req, res) => {
    const { userID } = req.body;
    const tableCount = await appService.countWatchlist(userID);
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/count-movies', async (req, res) => {
    const { userID } = req.body;
    const tableCount = await appService.countMovies(userID);
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/count-series', async (req, res) => {
    const { userID } = req.body;
    const tableCount = await appService.countSeries(userID);
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/count-reviews', async (req, res) => {
    const { userID } = req.body;
    const tableCount = await appService.countReviews(userID);
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.get('/count-services', async (req, res) => {
    const { userID } = req.body;
    const tableCount = await appService.countServices();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

router.post('/count-genres', async (req, res) => {
    const { userID } = req.body;
    const genre = await appService.getMostPopularGenre(userID);
    if (genre !== -1) {
        res.json({
            success: true,
            genre: genre
        })
    } else {
        res.status(500).json ({
            success: false,
            genre: ""
        });
    }
});

router.post('/count-shows-by-seasons', async (req, res) => {
    const { seasonNumber } = req.body;
    const response = await appService.countShowsBySeasons(seasonNumber);
    if (response.length > 0) {
        res.json({
            success: true,
            result: response
        })
    } else {
        res.status(500).json ({
            success: false,
            count: response
        });
    }
});

router.post('/search-services', async (req, res) => {
    const { name, country, order } = req.body;
    const response = await appService.searchServices(name, country, order);
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.post('/get-ultimate-reviewers', async (req, res) => {
    const { age } = req.body;
    const response = await appService.getUltimateReviewers(age);
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.post('/view-table', async (req, res) => {
    const { tableName, attributeNames } = req.body;
    const response = await appService.viewTable(tableName, attributeNames);
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.post('/search-movies', async (req, res) => {
    const { contentID, duration, lengthType, ageRating, title, releaseDate, ageRestricted, and } = req.body;
    const response = await appService.searchMovies(contentID, duration, lengthType, ageRating, title, releaseDate, ageRestricted, and);
    if (response[0] === -1) {
        res.status(400).json({
            success: false,
            result: []
        });
    } else if(response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.get('/get-tables', async (req, res) => {
    const response = await appService.getTableNames();
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.post('/get-attributes', async (req, res) => {
    const { tableName } = req.body;
    const response = await appService.getAttributeNames(tableName);
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

router.post('/get-genre-count-average-runtime', async (req, res) => {
    const { releaseDate } = req.body;
    const response = await appService.getGenreCountByAverageRuntime(releaseDate);
    if (response.length >= 0) {
        res.json({
            success: true,
            result: response
        });
    } else {
        res.status(500).json({
            success: false,
            result: response
        });
    }
});

module.exports = router;
