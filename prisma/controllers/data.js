import { prisma } from "../db.js"

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