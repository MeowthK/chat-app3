import {MongoClient} from 'mongodb'
import {MONGO_URI, MONGO_DB, MONGO_DB_USER_COL, MONGO_DB_CHAT_COL} from '$env/static/private'
import type { ICredentialFormData, IChatFormData } from '../types/form'
import {Code} from '../types/error-code'
import bcrypt from 'bcryptjs'

const client = new MongoClient(MONGO_URI, { serverSelectionTimeoutMS: 10000 })

let db = null
let collection = null

// TODO: Improve this messy reconnection configuration.
while (db === null) {
    try {
        await client.connect()
        .then(() => {
            db = client.db(MONGO_DB)
            collection = db.collection(MONGO_DB_USER_COL)

            if (db && collection) {
                console.log("Connected to MongoDB.")
            }
        })
    } catch (error) {
        console.log({ Error: error })
    }
}

const Con_OK = () => { return db && collection }

export const usernameExists = async (username) => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    const user = await collection.findOne({username: username})
    return user !== null
}

export const register = async (data:ICredentialFormData) => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    if (await usernameExists(data.username) === true)
        return Code.USERNAME_EXISTS

    const inserted = await collection.insertOne(data)

    if (inserted)
        return Code.SUCCESS

    return Code.UNSPECIFIED_ERROR
}

export const login = async (data:ICredentialFormData) => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    const user = await collection.findOne({username: data.username})
    
    if (user) {
        const {password} = user
        const passwordCorrect = await bcrypt.compare(data.password, password)

        return passwordCorrect ? Code.SUCCESS : Code.INCORRECT_PASSWORD
    }

    return Code.USERNAME_NOT_REGISTERED
}

export const store_chat = async (data:IChatFormData) => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    let chat_col = db.collection(MONGO_DB_CHAT_COL)
    const inserted = await chat_col.insertOne(data)

    if (inserted)
        return Code.SUCCESS

    return Code.UNSPECIFIED_ERROR
}

export const get_chats = async (username:any) => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    let chat_col = db.collection(MONGO_DB_CHAT_COL)
    const chats = await chat_col.find({"$or": [{"origin": username}, {"destination": username}]})

    if (chats) {
        chats.sort({"timestamp": 1})
        return chats.toArray()
    }

    return null
}

export const get_users = async () => {

    if (!Con_OK)
        return Code.CONNECTION_ERROR

    const users = await collection.find()

    if (users)
        return users.project({"_id": 0, "username": 1, "avatar": 1}).toArray()

    return null;
}