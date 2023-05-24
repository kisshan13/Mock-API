import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { addData, getData } from "../prisma/controllers/data.js";

export const dataRouter = Router()

dataRouter.get('/', userAuth, async (req, res) => {
    let data = await getData({ id: res.userId })

    if (data.success) {
        return res.status(200).json(data)
    }

    return res.status(500).json(data)
})