import twilio from 'twilio';

export async function sendTwilioNotificationWhatsapp(req,res) {
    const messageBody = req.body.messageBody;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);


    client.messages
        .create({
            body: `${messageBody}`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+51987149812'
        })
        .then(message => {
            res.status(200).json({
                success: true,
                message: 'Whatsapp Message sent successfully',
                wspMessage: message.body
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Whatsapp Message not sent successfully',
                error: err
            })
        })
}


export async function sendTwilioNotificationSMS(req,res) {
    const messageBody = req.body.messageBody;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    client.messages
        .create({
            body: `${messageBody}`,
            from: '+12055768445',
            to: '+51987149812'
        })
        .then(message => {
            res.status(200).json({
                success: true,
                message: 'SMS Message sent successfully',
                wspMessage: message.body
            })
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'SMS Message not sent successfully',
                error: err
            })
        })
}
