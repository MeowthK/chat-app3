import type {IChatFormData} from '../../../types/form'
import { store_chat, get_chats, get_users, usernameExists } from '../../../helpers/dbhelper'
import user from '../../../user'
import { redirect } from '@sveltejs/kit'
import Pusher from 'pusher'
import { PUSHER_APPID, PUSHER_CLUSTER, PUSHER_SECRET } from '$env/static/private'
import { PUBLIC_PUSHER_KEY } from '$env/static/public'

const pusher = new Pusher({
    appId: PUSHER_APPID,
    key: PUBLIC_PUSHER_KEY,
    secret: PUSHER_SECRET,
    cluster: PUSHER_CLUSTER,
    useTLS: true
});

export async function load({params}) {

    const stored_chats = await get_chats(params.slug)
    const stored_users = await get_users()

    user.subscribe((data) => {

        if (!data)
            throw redirect(308, '/login')

        if (data.username !== params.slug || data.username.length === 0) {
            console.log("User not authorized to send.")

            const url = data.username.length > 0 ? `/chat/${data.username}` : '/login'
            throw redirect(308, url)
        }
    })

    params.slug = `{"username": "${params.slug}", "chats": ${JSON.stringify(stored_chats)}, "users": ${JSON.stringify(stored_users)}}`
    return params
}

export const actions = {
    send: async ({request}) => {

        const {sender, recipient, message, timestamp} = await request.json()

        if (await usernameExists(recipient) !== true) {
            console.log("Receiving user does not exist.")
            return null
        }

        const ChatResponse:IChatFormData = {
            origin: sender,
            destination: recipient,
            message,
            timestamp
        }

        await pusher.trigger("chat-channel", "chat", {
            sender, recipient, message, timestamp
        })

        return await store_chat(ChatResponse)
    },

    logout: () => {
        console.log("User cleared.")
        user.set(null)
    }
}