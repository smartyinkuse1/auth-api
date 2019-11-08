const User = require('../model/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { signupValidation, loginValidation, usePasswordHashToMakeToken } = require('../validation/validation') 
const { transporter, passwordreseturl, resetPasswordTemplate } = require('../email/email')
//const { admin } = require('../validation/admin') 
const Super = new User({
    email:"super",
    username:"super",
    password:"super",
    role:"superuser"
})
try{
    const savedSuper = Super.save()
    console.warn(savedSuper)
}catch(err){
    console.warn(err)
}

exports.SIGNIN = async (req, res)=>{
    const { error } = signupValidation(req.body)
    if(error) return  res.status(400).send(error.details[0].message)
    console.warn(req.body)
    const usernameExist = await User.findOne({username:req.body.username})
    if (usernameExist) return res.status(400).send('Username already exist')
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const admin = new User({
        email:req.body.email,
        username:req.body.username,
        password:hashedPassword,
        role:'admin'
    })
    try{
        const savedUser = await admin.save() 
        res.send({admin:admin._id,
        username:admin.username,
        password:admin.password,
        role:admin.role,
    })
    }catch(err){
        res.status(400).send(err)
    }
}
exports.signIn = async (req, res)=>{
    const { error } = signupValidation(req.body)
    if(error) return  res.status(400).send(error.details[0].message)
    console.warn(req.body)
    const usernameExist = await  User.findOne({username:req.body.username})
    if (usernameExist) return res.status(400).send('Username already exist')
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const user = new User({
        email:req.body.email,
        username:req.body.username,
        password:hashedPassword,
        role:'user'
    })
    try{
        const savedUser = await user.save() 
        res.send({user:user._id})
    }catch(err){
        res.status(400).send(err)
    }
}



exports.login = async (req, res)=>{
    const assignToken = ()=>{const token = jwt.sign({_id:user._id}, process.env.SECRET_KEY)
    res.header('auth-token', token).send('TOKEN ASSIGNED')}
    const { error } = loginValidation(req.body)
    if(error) return  res.status(400).send(error.details[0].message)
    const user = await User.findOne({username:req.body.username})
    if (!user) return res.status(400).send('Username or password wrong')
    if((req.body.username === user.username)&&(req.body.password===user.password)){
        if(user.role === 'admin'|| 'superuser'){
            const token = jwt.sign({id:user._id}, process.env.SECRET_KEY1)
            return res.header('x-auth-token', token).send('admin token sent')
        }
        
    }
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Password wrong');
    assignToken()

}

exports.profile = (req, res)=>{
    console.warn(req.session)
    res.send({
        first: "the boy is bad",
        second: "the girl is good"
    })

}

exports.sendemail = async (req, res)=>{
    let user;
    user =  await User.findOne({email:req.body.email})
    if (!user) return res.status(400).send('No User with that email ')
    const token = usePasswordHashToMakeToken(user)
    const url = passwordreseturl(user, token)
    const emailTemplate = resetPasswordTemplate(user, url)
    const sendEmail = ()=>{
        transporter.sendMail(emailTemplate, (err, info)=>{
            console.warn(err)
            if (err) return res.status(500).send('Error sending mail')
            return res.send({userId:user._id,
            token: token})
        })
    }
    sendEmail()
    
}

exports.receivePassword = async (req, res)=>{
    const userId = req.params.userid
    const token = req.params.token
    user = await User.findOne({_id:userId})
    if(!user) return res.status(400).send('Unauthorized')
    const secret = user.password + "-" + user.date
    const payload = jwt.decode(token, secret)
    console.warn(payload)
    console.warn(user._id)
    if (payload.userId == user._id){
        console.warn("hi")
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.warn(hashedPassword)
        await User.findByIdAndUpdate({_id:userId},{password:hashedPassword}).then(()=>{res.status(202).send('password change accepted')}).catch(err=>{
            res.status(500).send('error in changing password')
        })

    }
}
