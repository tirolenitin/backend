const express = require("express");
const userModel = require("../model/userModel.js");
const chatModel = require('../model/chatModel.js')

const router = express.Router();

router.post("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const chat = await chatModel.findOne({
        $and: [
          { users: { $elemMatch: { $eq: userId } } },
          { users: { $elemMatch: { $eq: user._id } } },
        ],
      });
      if (chat) {
        res.json(chat);
      } else {
        const newchat = await chatModel.create({
          users: [userId, user._id],
        });
        res.json(newchat);
      }
    } else {
      res.json("user not found");
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
