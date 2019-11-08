const jwt = require('jsonwebtoken');
const verify = (req, res, next)=>{
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied')
    try{
        const verified = jwt.verify(token, process.env.SECRET_KEY)
        req.user = verified
        next()
    }catch(err){
        return res.status(400).send('Invalid Token')
    }
}

const verify1 = (req, res, next)=>{
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access Denied')
    try{
        const verified = jwt.verify(token, process.env.SECRET_KEY1)
        req.user = verified
        next()
    }catch(err){
        return res.status(400).send('Invalid Token')
    }
}

  
module.exports.verify = verify;
module.exports.verify1 = verify1