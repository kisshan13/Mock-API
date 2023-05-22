import express from "express";
import ck from 'ckey';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { logger } from "./middlewares/logger.js";
import { auth } from "./middlewares/auth.js";

import { authRouter } from './routes/auth.js'
import { refresh } from "./routes/refresh.js";

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.use(logger)
app.use(auth)

app.use('/auth', authRouter)
app.use('/refresh', refresh)

app.get('/', (req, res) => {
    res.send({
        cookie: req.cookies,
        id: res.userId,
        perms: res.perms
    })
})

app.listen(ck.PORT, () => {
    console.log('Server running !!')
})