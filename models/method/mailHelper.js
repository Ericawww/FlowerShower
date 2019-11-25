var nodemailer = require('nodemailer'); //邮件发送

var mailHelper = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secureConnection: true,
    auth: {
        user: 'ZJUSRE_G13_2019@163.com',
        pass: 'httnb233'
    }
});

module.exports = mailHelper;