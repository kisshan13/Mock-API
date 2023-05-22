import bcrypt from 'bcrypt'

/**
 * 
 * @param {string} text
 */
export function hash(text) {
    return bcrypt.hashSync(text, 9)
}

export function compare(hash, text) {
    return bcrypt.compareSync(text, hash)
}