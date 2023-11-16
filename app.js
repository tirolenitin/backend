const  express = require ("express");
const cors= require ('cors');
const mongoose= require ('mongoose')
const userRoutes= require ('./routes/userRoutes.js')
const chatRoute= require ('./routes/chatRoute.js')
const messageRoute= require ('./routes/messageRoute.js')
const newChat= require ('./routes/newChat.js')
const DATABASE = process.env.DATABASE
const BASE_URL = process.env.BASE_URL
const PORT = process.env.PORT || 3001

const connect = () =>{
    mongoose.connect('mongodb://nitin:nitin123@ac-epgxon7-shard-00-00.pnoeo7u.mongodb.net:27017,ac-epgxon7-shard-00-01.pnoeo7u.mongodb.net:27017,ac-epgxon7-shard-00-02.pnoeo7u.mongodb.net:27017/chatDatabase?ssl=true&replicaSet=atlas-k007fy-shard-0&authSource=admin&retryWrites=true&w=majority')
    .then(()=>console.log('connect to database'))
    .catch((error)=>console.log(error))
}

const app = express()
app.use(cors())
app.use(express.json())

connect()

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoute)
app.use('/api/msg',messageRoute)
app.use('/api/chat/newchat',newChat)

const server = app.listen(PORT,()=>{
    console.log(`server is run on http://localhost:3001`)
})
const io = require('socket.io')(server,{
    cors:{
        origin:BASE_URL
    }
})

    var chatuser=[]

 io.on('connection',(socket)=>{

    socket.on('setup',async(user)=>{
        socket.join(user?._id)
    })

    socket.on('join room',async(chat)=>{
        socket.join(chat?._id)
        chatuser = await chat?.users
        console.log('user join' + chat?._id)
    })

    socket.on('newmsg',(msg)=>{ 
        chatuser?.forEach((u)=>{
            if(u === msg.senderId){
            return
            }else{
                io.to(u).emit('recievedmsg',msg)
            }
        })
    })
 })


