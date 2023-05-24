import { Router } from "express";
import { addUser, validateUser } from "../prisma/controllers/user.js"

export const authRouter = Router()

authRouter.post('/signup', async (req, res) => {

    if (res.perms === 'user') {
        return res.status(403).json({
            success: false,
            erorr: 'Already a user'
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

authRouter.post('/signin', async (req, res) => {

    console.log([
        res.token,
        res.userId,
        res.perms
    ])

    if (res.perms === 'user') {
        return res.status(403).json({
            success: false,
            error: 'Already a user.'
        })
    }

    let { email, password } = req.body

    if (!(email && password)) {
        return res.status(403).json({
            success: false,
            error: 'Missing required fields.'
        })
    }

    const user = await validateUser({ email: email, password: password })

    if (user.error) {
        return res.status(403).json(user)
    }

    return res.status(200).json(user)
})