import { prisma } from '../db.js'
import jwt from 'jsonwebtoken'
import ck from 'ckey'

export async function createSession({ email, id, name }) {
    try {
        const refreshToken = jwt.sign({
            token: 'refresh_token'
        }, ck.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 * 100,
            issuer: 'Mock-API',
            subject: 'Refresh'
        })

        await prisma.session.create({
            data: {
                name: name,
                email: email,
                userId: id,
                refresh_token: refreshToken
            }
        })

        const token = jwt.sign({
            email: email,
            id: id,
            perms: 'user',
            name: name
        }, ck.JWT_SECRET, {
            expiresIn: 60 * 20
        })

        return {
            success: true,
            data: {
                token: token,
                refresh_token: refreshToken
            }
        }
    }

    catch (e) {
        return {
            success: false,
            error: 'Session creation error'
        }
    }
}

export async function createAuthToken(refresh_token) {
    try {
        jwt.decode(refresh_token, ck.JWT_SECRET)

        const getSession = await prisma.session.findFirst({
            where: {
                refresh_token: refresh_token
            }
        })

        if (!getSession) {
            return {
                success: false,
                error: "You've been logged out."
            }
        }

        const token = jwt.sign({
            email: getSession.email,
            id: getSession.userId,
            name: getSession.name,
            perms: 'user'
        }, ck.JWT_SECRET, {
            expiresIn: 60 * 20
        })

        return {
            token: token,
            id: getSession.userId,
            perms: 'user'
        }
    }

    catch (e) {
        return {
            success: false,
            error: "You've been logged out."
        }
    }
}