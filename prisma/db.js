import { PrismaClient } from '@prisma/client'
import { hash } from '../lib/utils.js'
import jwt from 'jsonwebtoken'
import ck from 'ckey'

export const prisma = new PrismaClient()

export async function addUser({ name, email, password }) {
    try {
        const isUserExist = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (isUserExist) {
            return {
                success: false,
                error: 'Email already exists.'
            }
        }

        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hash(password)
            }
        })

        const session = await createSession({
            email: user.email,
            id: user.id,
            name: user.name
        })

        return session
    }

    catch (e) {
        return {
            success: false,
            error: 'Internal server error.'
        }
    }
}

export async function addData({ id, info }) {
    try {

        const data = await prisma.data.upsert({
            where: {
                userId: id
            },

            update: {
                data: info
            },

            create: {
                data: info,
                userId: id
            }
        })

        return {
            success: true,
            data: data
        }
    }

    catch (e) {
        return {
            success: false,
            error: 'Internal server error'
        }
    }
}

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
                id: id,
                refresh_token: refreshToken
            }
        })

        const token = jwt.sign({
            email: email,
            id: id,
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