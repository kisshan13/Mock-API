import express from "express";
import ck from 'ckey';
import bodyParser from "body-parser";
import { logger } from "./middlewares/logger.js";
import { auth } from "./middlewares/auth.js";
import { authRouter } from './routes/auth.js'

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

app.use(logger)
app.use(auth)

app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.send({
        id: res.userId,
        perms: res.perms
    })
})

app.listen(ck.PORT, () => {
    console.log('Server running !!')
})