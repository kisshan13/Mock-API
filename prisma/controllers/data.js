import { prisma } from "../db.js"

export async function addData({ id, info }) {
    try {
        const data = await prisma.data.upsert({
            update: {
                data: info
            },

            where: {
                userId: id
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
            error: e.message
        }
    }
}

export async function getData({ id }) {
    try {
        const data = await prisma.data.findFirst({
            where: {
                userId: id
            }
        })

        return {
            success: true,
            data: data,
        }
    }

    catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}