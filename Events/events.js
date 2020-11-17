var events = require('events');
var eventEmitter = new events.EventEmitter();
var nodemailer = require('nodemailer');
require("dotenv").config();
/// Create event handler
var sendEmail = function (subject, user, text) {
    return new Promise(async function(resolve, reject){
        try {
            var transporter = await nodemailer.createTransport({
                service:'gmail',
                
               // secure: true,
                auth: {
                    user: process.env.SENDER_EMAIL_ID,
                    pass: process.env.SENDER_EMAIL_PASSWORD
                }
            });

            var mailOptions =  {
                from: process.env.SENDER_EMAIL_ID,
                to: user.email,
                subject: subject,
                text: text,
            }
            var response = await transporter.sendMail(mailOptions);
            resolve(response);
        } catch (error) {
            return reject(error)
        }
    })
}

/// Assign the event handler to an event
eventEmitter.on('sendEmail', sendEmail);

module.exports = eventEmitter;