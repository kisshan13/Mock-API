import ckey from 'ckey'
import jwt from 'jsonwebtoken'
import { createAuthToken } from '../prisma/controllers/sessions.js'

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

        next()
    }

    catch (e) {

        const cookie = req.cookies.refresh_token

        console.log(cookie)

        if (!cookie) {
            return res.json({
                success: false,
                error: 'Missing cookie, signin again.'
            })
        }

        const token = await createAuthToken(cookie)

        if (token.success === false) {
            return res.status(403).json(token)
        }

        return res.status(200).json({
            success: false,
            data: {
                token: token.token
            }
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @param {Object} Options 
 * @param {boolean} Options.user 
 */
export async function userAuth(req, res, next) {
    if (res.perms === 'user') {
        next()
    }

    else {
        return res.status(403).json({
            success: false,
            error: 'Not authorised.'
        })
    }
}

