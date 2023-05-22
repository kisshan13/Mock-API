import bcrypt from 'bcrypt'

/**
 * 
 * @param {string} text
 */
export function hash(text) {
    return bcrypt.hashSync(text, 9)
}