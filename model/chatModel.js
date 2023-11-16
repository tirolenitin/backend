const mongoose = require ('mongoose')

const chatSchema = new mongoose.Schema({
    users:{
        type:Array,
    },
},{
    timestamps:true
})

const chatModel = mongoose.model('chat',chatSchema)

module.exports = chatModel