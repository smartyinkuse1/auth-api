const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')

const signupValidation = data => {
    const schema = {
    email:Joi.string().email().required(),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(4).required()
}
return Joi.validate(data, schema)
}
const loginValidation = data => {
    const schema = {
    username: Joi.string().min(5).required(),
    password: Joi.string().min(4).required()
}
return Joi.validate(data, schema)
}
const usePasswordHashToMakeToken = ({
    password: passwordHash,
    _id: userId,
    date
  }) => {
    // highlight-start
    const secret = passwordHash + "-" + date
    const token = jwt.sign({ userId }, secret, {
      expiresIn: 3600 // 1 hour
    })
    // highlight-end
    return token
  }
module.exports.signupValidation = signupValidation
module.exports.loginValidation = loginValidation
module.exports.usePasswordHashToMakeToken = usePasswordHashToMakeToken