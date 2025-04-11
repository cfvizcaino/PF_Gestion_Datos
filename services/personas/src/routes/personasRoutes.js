const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
    console.log('Ping request received');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        ok: true,
        message: 'Pong'
    });
});

module.exports = router;