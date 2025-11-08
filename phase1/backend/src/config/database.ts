import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    username: "postgres",
    password: "zxcvbnm",
    database: "school-lending",
    host: "localhost",
    port: 5432
  }
};