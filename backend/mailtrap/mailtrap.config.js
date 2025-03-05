import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Mailtrap client
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN, // Ensure the token is correct
});

// Sender details
export const sender = {
  email: 'saadaouiossama11@gmail.com',
  name: 'Saadaoui',
};
