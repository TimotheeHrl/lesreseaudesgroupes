import sgMail from "@sendgrid/mail"
let apiKey = process.env.SENDGRID_API_KEY as string
sgMail.setApiKey(apiKey)
interface EmailConfig {
  to: string | string[]
  from: string
  subject: string
  html: string
  heading?: string
  text: string
  sendAt?: number
}
export const SendAt = async ({ from, to, subject, html, text, sendAt }: EmailConfig) => {
  return sgMail
    .send({
      from,
      to,
      subject,
      text,
      html,
      sendAt,
    })
    .then(
      () => {},
      (error) => {
        console.error(error)

        if (error.response) {
          console.error(error.response.body)
        }
      }
    )
}
