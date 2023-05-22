import { Router } from "express";

export const authRouter = Router()

authRouter.post('/signup', (req, res) => {

    if (res.perms === 'user') {
        res.json({
            success: false,
            erorr: 'Already signed up.'
        }).sendStatus(403)
    }

    let {
        name,
        email,
        password
    } = req.body

    if (!(name && email && password)) {
        res.json({
            success: false,
            error: 'Missing required fields.'
        }).sendStatus(403)
    }

    res.send({
        name: name,
        email: email,
        password: password
    })

})