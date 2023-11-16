const express = require ("express") 
const userModel = require ('../model/userModel.js') 
const bcrypt = require('bcrypt')

const router = express.Router()

// register user
router.post('/register',async(req,res)=>{
    const {name,email,password}= req.body
    const exist = await userModel.findOne({email})
    if(exist){
        res.json('user already registered')
    }else{
        const hashed = await bcrypt.hash(password,8)
        const user = new userModel({
            name,
            email,
            password:hashed
        })
        try{
            const savedUser = await user.save()
            res.json(savedUser)
        }catch(err){
            res.json(err)
        }
    }
})

// login user

router.post('/login',async(req,res)=>{
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    try {
        if(user){
            const match = await bcrypt.compare(password,user.password)
            if(match){
                res.json(user)
            }else{
                res.json('invalid user or password')
            }
        }else{
            res.json('user not found')
        }
    } catch (error) {
        res.json(error)
    }
})

// find user

router.get('/find/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const user = await userModel.findById({_id:id})
        res.json(user)
    } catch (error) {
        res.json(error)
    }
})


module.exports = router