/*
    Code adapted from the demo project files
*/

const express = require('express');
const appService = require('./appService');
const cors = require("cors");

const router = express.Router();

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

module.exports = router;
