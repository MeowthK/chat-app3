import bcrypt from 'bcryptjs'

export const hash = async (data:string, salt:Number) => {
    return await bcrypt.hash(data, salt)
}