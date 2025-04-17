import 'dotenv/config'

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    DATABASE_NAME: process.env.DATABASE_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    ORIGIN: process.env.ORIGIN,
    AUTHOR: process.env.AUTHOR,
    NODE_MAILER_USER: process.env.NODE_MAILER_USER,
    NODE_MAILER_PASS: process.env.NODE_MAILER_PASS,
    OPENAI_API_KEY: process.env.OPENAI_SECRET,
}
