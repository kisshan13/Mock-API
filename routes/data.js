import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { addData } from "../prisma/controllers/data.js";

export const dataRouter = Router()

dataRouter.get('/', userAuth, async (req, res) => {
    let data = await addData({ id: res.userId, info: 'This is a info' })

    if (data.success) {
        return res.status(200).json(data)
    }

    return res.status(500).json(data)
})