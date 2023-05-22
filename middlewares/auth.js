import ckey from 'ckey'
import jwt from 'jsonwebtoken'
import { createAuthToken } from '../prisma/db.js'

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            success: false,
            error: 'Auth header missing'
        })
    }

    const authBearerToken = req.headers.authorization.split(' ')[1]

    try {
        const isValid = jwt.verify(
            authBearerToken,
            ckey.JWT_SECRET)

        console.log(isValid)

        res.userId = isValid.id
        res.perms = isValid.perms

        console.log([res.userId, res.perms])

        next()
    }

    catch (e) {

        const cookie = req.cookies.refresh_token

        console.log(cookie)

        if (!cookie) {
            return res.json({
                success: false,
                error: 'Auth token is not valid'
            })
        }

        const token = await createAuthToken(cookie)

        if (token.success === false) {
            return res.status(403).json(token)
        }

        res.token = token.token
        res.userId = token.id
        res.perms = token.perms

        next()

    }
}