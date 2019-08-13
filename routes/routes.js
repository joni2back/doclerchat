const express = require('express');
const router = express.Router();
const ChatMessage  = require('../mongoose-models/ChatMessage');

router.get('/history/:roomId/:lastOne?', (req, res) => {

    const roomId = req.params.roomId;
    const lastOne = req.params.lastOne;
    const limit = 15;
    const sort = {
        date: -1 
    };

    const cond = {
        roomId: roomId,
    };

    if (/[a-f\d]{24}/.test(lastOne)) {
        cond._id = {
            $lt: lastOne
        }
    }

    //lazy load
    var result = ChatMessage.find(cond, {}, {sort}).limit(limit).then(r => {
        res.send(r.reverse());
    }).catch(e => {
        res.status(500).send(e);
    })
});

module.exports = router;