var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: 'clientstaging@shilshatech.com', 
        pass: 'Tester112233# ',
      
    },
    tls:{
        rejectUnauthorized:false
    }
});
exports.send = async function (payload){
    const msg = {
        to: 'ramkewal143@gmail.com',
        from:'clientstaging@shilshatech.com',
        subject: payload.subject,
        html: payload.message
    }
    try{
        console.log("Email is sent ");
        return transporter.sendMail(msg);
    }
    catch(err){
        return err;
    }
}
