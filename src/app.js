import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { envConfig } from './config/env.config.js';

const app = express()

app.use(cors({
    origin : envConfig.cors_origin,
    credientials : true,
}))

app.use(express.json())
app.use(cookieParser())

app.get("/", (req,res)=> res.send("Hello World!"))

export default app;
