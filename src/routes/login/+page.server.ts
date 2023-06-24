import type {ICredentialFormData} from '../../../src/types/form'
import { login } from '../../helpers/dbhelper'
import {Code} from '../../types/error-code'
import bcrypt from 'bcryptjs'
import user from '../../user'
import {redirect} from '@sveltejs/kit'

export async function load({}) {

    user.subscribe((data) => {
        
        if (data && data.username.length > 0) {
            console.log("You are already logged in.")
            throw redirect(303, `/chat/${data.username}`)
        }

    })
}

export const actions = {
    default: async ({request}) => {
        
        const fData = await request.formData()
        const username = fData.get('username')
        const password = fData.get('password')

        let LoginResponse:ICredentialFormData = {
            username,
            password
        }

        const errorCode:Code = await login(LoginResponse)
        
        switch (errorCode) {
            case Code.SUCCESS:
                user.set({username: username.toString()})
                throw redirect(303, `/chat/${username}`)

            case Code.INCORRECT_PASSWORD:
                console.log("Incorrect password.")
                break;

            case Code.USERNAME_NOT_REGISTERED:
                console.log("Username not registered.")
        }
    }
}