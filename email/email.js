const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:'smtp.mailtrap.io',
    port:2525,
    auth: {
        user: "ab68f43a641492",
        pass: "debae69680b8a1"
      }
}) 
const passwordreseturl = (user, token)=>{
    return 'localhost:4000/password/reset/${user._id}/${token}'
}
const resetPasswordTemplate = (user, url) => {
    const from = ''
    const to = user.email
    const subject = "Password Reset "
    const html = `
    <p>Hey ${user.username || user.email},</p>
    <p>We heard that you lost your password. Sorry about that!</p>
    <p>But don’t worry! You can use the following link to reset your password:</p>
    <a href=${url}>${url}</a>
    <p>If you don’t use this link within 1 hour, it will expire.</p>
    `
  
    return { from, to, subject, html }
  }
module.exports.transporter = transporter
module.exports.passwordreseturl = passwordreseturl
module.exports.resetPasswordTemplate = resetPasswordTemplate  