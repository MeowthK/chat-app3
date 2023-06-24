import {writable} from 'svelte/store'
import type { IUserData } from './types/form'

const user = writable<IUserData>({
    username: ''
})

export default user