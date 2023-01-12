const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface MessageI {
    to: string,
    subject: string,
    textMessage: string,
}

export const sendEmailNotification = async ({ to, subject, textMessage }: MessageI) => {
    try {
        const msg = {
            from: process.env.SENDGRID_SENDER_EMAIL,
            to: to,
            subject: subject,
            html: textMessage
        };

        const response = await sgMail.send(msg);
        console.log("response === ", response);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
}

// import nodemailer from 'nodemailer'

// export async function sendEmailNotification() {
//     // Generate test SMTP service account from ethereal.email
//     // Only needed if you don't have a real mail account for testing
//     let testAccount = await nodemailer.createTestAccount();

//     // create reusable transporter object using the default SMTP transport
//     let transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: testAccount.user, // generated ethereal user
//             pass: testAccount.pass, // generated ethereal password
//         },
//     });

//     // send mail with defined transport object
//     let info = await transporter.sendMail({
//         from: '"Fred Foo 👻" <foo@example.com>', // sender address
//         to: "haseebhowto@gmail.com", // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Your auth code is 123456", // plain text body
//         html: "<b>Your auth code is 123456</b>", // html body
//     });

//     console.log("Message sent: %s", info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//     // Preview only available when sending through an Ethereal account
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }