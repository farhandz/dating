import nodemailer from 'nodemailer';
import mjml2html from 'mjml';

export const transporter = async (
  template: string,
  email: string,
  subject: string,
  cb: any,
): Promise<void | any> => {
  try {
    const { html } = mjml2html(template);
    const transporter = await nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailinfo = {
      from: process.env.MAIL_FROM_ADDRESS,
      to: email,
      subject: subject,
      html: html,
    };

    return transporter.sendMail(mailinfo, (error, info) => {
      return cb(info, error);
    });
  } catch (error) {
    cb(null, error);
  }
};
