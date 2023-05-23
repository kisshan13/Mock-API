import nodemailer from 'nodemailer'
import ck from 'ckey'

const mail = nodemailer.createTransport({
    service: ck.MAIL_SERVICE,
    auth: {
        user: ck.MAIL_ADDRESS,
        pass: ck.MAIL_ADDRESS_PASS
    }
})

export async function sendOTP({ from, to, subject, text }) {
    try {
        const info = await mail.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text
        })

        return info
    }

    catch (e) {
        return e.message
    }
} 
