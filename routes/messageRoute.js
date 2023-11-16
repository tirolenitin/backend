const express = require('express')
const messageModel = require('../model/messageModel.js')

const router = express.Router()

// add message
router.post('/addMsg',async(req,res)=>{
    const {chatId,senderId,text} = req.body
    const msg = new messageModel({
        chatId,
        senderId,
        text
    })
    try {
        const newMsg = await msg.save()
        res.json(newMsg)
    } catch (error) {
        res.json(error)
    }
})

// get msg

router.get('/getMsg/:chatId',async(req,res)=>{
    const chatId = req.params.chatId
    try {
        const msg = await messageModel.find({chatId})
        res.json(msg)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router