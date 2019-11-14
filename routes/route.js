module.exports = (app)=>{
    const auth = require('../controller/controller')
    const { verify, verify1 }= require('../validation/verify') 
    app.post('/sign', auth.signIn);
    app.post('/register',verify1, auth.SIGNIN);
    app.post('/login', auth.login);
    app.get('/profile', verify, auth.profile);
    app.post('/resetpassword', auth.sendemail)
    app.post('/receivepassword/:userid/:token', auth.receivePassword)
}