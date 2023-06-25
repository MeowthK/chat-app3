import type {ICredentialFormData} from '../../src/types/form'
import { register } from '../helpers/dbhelper'
import { Code } from '../types/error-code'
import { redirect } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import user from '../user'
import { hash } from '../helpers/hash-unhash'

export async function load({}) {
    user.set(null)
}

export const actions = {
    default: async ({request}) => {
        
        const fData = await request.formData()
        const username = fData.get('username')
        const salt = await bcrypt.genSalt(10)
        const password = await hash(fData.get('password') as string, salt)
        const x = fData.get('avatar-coordx')
        const y = fData.get('avatar-coordy')

        let RegisterResponse:ICredentialFormData = {
            username,
            password,
            "timestamp": Date.now(),
            avatar: {x, y}
        }

        const errorCode = await register(RegisterResponse)

        if (errorCode === Code.SUCCESS) {
            console.log("User registered.")
            throw redirect(303, '/registerSuccess')
        }
        else if (errorCode === Code.USERNAME_EXISTS) {
            console.log("User already exists. Login instead.")
        }

        return errorCode
    }
}