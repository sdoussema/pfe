import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE , Welcome_Mail } from "./emailTemplates.js";
import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "8075035645337932816457b737174fe5";
const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

export const sendVerificationEmail = async (email ,verificationCode) => {
  try {
    const sender = {
      address: "hello@demomailtrap.co",
      name: "DataWise Test",
    };
    const recipients = email;
    
    const response = await transport.sendMail({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
      category: "Email Verification",
    });

    console.log("Email sent successfully", response);  // Now you can log the response

  } catch (error) {
    console.error(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};
export const sendWelcomeEmail = async (email, name) => {
  try {
    const sender = {
      address: "hello@demomailtrap.co",
      name: "DataWise test",
    };
    const recipients = email;

    const response = await transport.sendMail({
      from: sender,
      to: recipients,
      subject: "welcome email",
      html: Welcome_Mail.replace("{name}", name),
      category: "Welcome Email",
    });

    console.log("Email sent successfully", response); // Log the response

  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error(`Error sending welcome email: ${error.message}`);
  }
};
export const sendpaswordresetEmail = async (email,resetURL) => {
  try {
    const sender = {
      address: "hello@demomailtrap.co",
      name: "DataWise test rest password ",
    };
    const recipients = email;

    const response = await transport.sendMail({
      from: sender,
      to: recipients,
      subject: "welcome email",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Welcome Email",
    });

    console.log("Email sent successfully", response);
  }
  catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
}
export const sendRestSuccessEmail = async (email) => {
  try {
    const sender = {
      address: "hello@demomailtrap.co",
      name: "DataWise test validation rest password ",
    };
    const recipients = email;

    const response = await transport.sendMail({
      from: sender,
      to: recipients,
      subject: "Password reset successfull",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "reset password",
    });

    console.log("Email sent successfully", response);
    
  } catch (error) {
    console.error(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
}



