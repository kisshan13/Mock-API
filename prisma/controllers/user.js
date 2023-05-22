import { prisma } from "../db.js";
import { hash, compare } from "../../lib/utils.js";
import { createSession } from "./sessions.js";

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

export async function validateUser({ email, password }) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            return {
                success: false,
                error: 'Username & Password not matched.'
            }
        }

        const isPasswordMatched = compare(user.password, password)

        if (!isPasswordMatched) {
            return {
                success: false,
                error: 'Username & Password not matched.'
            }
        }

        const session = await createSession({
            email: user.email,
            name: user.name,
            id: user.id
        })

        return session
    }

    catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}