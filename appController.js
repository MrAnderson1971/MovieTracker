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
    if (loginResult > 0) {
        res.json({ success: true, userID: loginResult });
    } else {
        res.status(401).json({ success: false, userID: loginResult });
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

router.get('/count-movies', async (req, res) => {
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

router.get('/search-services', async (req, res) => {
    const { name, country, order } = req.body;
    const response = await appService.searchServices(name, country, order);
    if (tableCount >= 0) {
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
