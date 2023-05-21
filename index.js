import express from "express";
import ck from 'ckey';
import bodyParser from "body-parser";
import { logger } from "./middlewares/logger.js";

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

app.use(logger)

app.get('/', (req, res) => {
    res.send('Hii')
})

app.listen(ck.PORT, () => {
    console.log('Server running !!')
})