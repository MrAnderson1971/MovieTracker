const express = require('express');
const appService = require('./appService');

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

module.exports = router;