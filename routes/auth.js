import { Router } from "express";
import { addUser } from "../prisma/db.js";

export const authRouter = Router()

authRouter.post('/signup', async (req, res) => {

    if (res.perms === 'user') {
        return res.status(403).json({
            success: false,
            erorr: 'Already signed up.'
        })
    }

    let {
        name,
        email,
        password
    } = req.body

    if (!(name && email && password)) {
        return res.status(403).json({
            success: false,
            error: 'Missing required fields.'
        })
    }

    const user = await addUser({ email: email, name: name, password: password })

    if (user.error) {
        return res.status(500).json(user)
    }

    return res.status(200).json(user)
})