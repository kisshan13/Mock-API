import chalk from "chalk";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export function logger(req, res, next) {
    let {
        method,
        originalUrl,
        ip,
    } = req

    // Getting the url only
    let url = originalUrl.split('?')[0]

    console.log(`
    [${chalk.green(method)}] : ${chalk.yellow(url)}
    `)

    next()
}