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

router.get('/count-watchlist', async (req, res) => {
    const userID = req.query.userID;
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

router.get('/count-movies', async (req, res) => {
    const { userID } = req.query;
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

router.get('/count-series', async (req, res) => {
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

router.get('/count-reviews', async (req, res) => {
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

router.get('/count-genres', async (req, res) => {
    const genre = await appService.getMostPopularGenre();
    if (genre !== -1) {
        res.json({
            success: true,
            count: genre
        })
    } else {
        res.status(500).json ({
            success: false,
            count: -1
        });
    }
})

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

router.post('/view-table', async (req, res) => {
    const { tableName, attributes } = req.body;
    const response = await appService.viewTable(tableName, attributes);
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
