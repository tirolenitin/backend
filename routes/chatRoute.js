const express = require('express')
const chatModel = require('../model/chatModel.js')

const router = express.Router()

// add chat
router.post("/addChat", async (req, res) => {
    const { senderId, recieverId } = req.body;
    const isChat = await chatModel.findOne({
      $and: [
        { users: { $elemMatch: { $eq: senderId } } },
        { users: { $elemMatch: { $eq: recieverId } } },
      ],
    });
    if (isChat) {
      res.json(isChat);
    } else {
      const newChat = await chatModel.create({
        users: [senderId, recieverId],
      });
      res.json(newChat);
    }
  });
  

// get chat 

router.get('/getChat/:userId',async(req,res)=>{
    const {userId} = req.params
    try {
        const chat = await chatModel.find({users:{$in:[userId]}})
        res.json(chat)
    } catch (error) {
        res.json(error)
    }
})

module.exports = router