import { isEmail } from "validator"

export const validateEmailField = (data: any) => {
    if (!data['email'] || !isEmail(data['email'])) {
        return new Error(`Email is invalid`)
    }
}


