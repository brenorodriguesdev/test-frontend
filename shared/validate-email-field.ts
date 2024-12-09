import validator from 'validator';
const { isEmail } = validator;

export const validateEmailField = (data: any) => {
    if (!data['email'] || !isEmail(data['email'])) {
        return new Error(`Email is invalid`)
    }
}


