import ckey from 'ckey'
import jwt from 'jsonwebtoken'

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export function auth(req, res, next) {
    if (!req.headers.authorization) {
        res.json({
            success: false,
            error: 'Auth header missing'
        }).sendStatus(403)
    }

    const authBearerToken = req.headers.authorization.split(' ')[1]

    try {
        const isValid = jwt.verify(
            authBearerToken,
            ckey.JWT_SECRET)

        res.userId = isValid.userId
        res.perms = isValid.perms

        next()
    }

    catch (e) {
        res.json({
            success: false,
            message: ckey.JWT_SECRET,
            error: 'Auth token is not valid'
        })
    }
}