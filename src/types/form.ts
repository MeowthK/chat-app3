export interface ICredentialFormData {
    username: FormDataEntryValue,
    password: FormDataEntryValue,
    [key:string]: any,
    avatar?:any
}

export interface IChatFormData {
    origin: FormDataEntryValue,
    destination: FormDataEntryValue,
    message: FormDataEntryValue,
    [key:string]: any,
}

export interface IUserData {
    username: string
}