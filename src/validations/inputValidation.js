import dayjs from 'dayjs'

const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    userName: /^[a-zA-Z](?!.*\.\.)[a-zA-Z0-9._]{3,28}[a-zA-Z0-9_]$/,
    passWord: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
    fullName: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
    gender: /^(Nữ|Nam|Khác)$/i,
    phoneNumber: /^0\d{9}$/,
}

export const loginValidation = ({ identifier, passWord }) => {
    if (!identifier?.trim() || !passWord?.trim()) {
        return { isValid: false, message: 'Identifier and password are required' }
    }
    if (identifier.includes(' ')) {
        return { isValid: false, message: 'Identifier must not contain spaces' }
    }
    return { isValid: true }
}

export const loginCondition = (identifier) => {
    const isEmail = regex.email.test(identifier)

    return isEmail ? { email: identifier } : { userName: identifier }
}

export const registerValidation = ({ fullName, gender, email, userName, passWord, confirmPassWord, birthday }) => {
    if (!fullName?.trim() || !regex.fullName.test(fullName.trim())) {
        return {
            isValid: false,
            message: 'Full name must be 2-50 characters long and can only contain letters and spaces',
        }
    }

    if (!gender?.trim() || !regex.gender.test(gender.trim())) {
        return { isValid: false, message: 'Gender must be Nữ, Nam or Khác' }
    }

    if (!email?.trim() || !regex.email.test(email.trim())) {
        return { isValid: false, message: 'Email is invalid' }
    }

    if (!userName?.trim() || !regex.userName.test(userName.trim())) {
        return {
            isValid: false,
            message:
                'Username must be 4-28 characters long and can only contain letters, numbers, dots, and underscores',
        }
    }

    if (!passWord?.trim() || !regex.passWord.test(passWord.trim())) {
        return {
            isValid: false,
            message: 'Password must be at least 8 characters long and contain at least one letter and one number',
        }
    }

    if (passWord !== confirmPassWord) {
        return { isValid: false, message: 'Password and confirm password do not match' }
    }

    const date = dayjs(birthday.trim(), 'MM/DD/YYYY', true)
    if (!birthday?.trim()) {
        return { isValid: false, message: 'Birthday is required' }
    }
    if (!date.isValid()) {
        return { isValid: false, message: 'Birthday must be in MM/DD/YYYY format' }
    }
    if (date.isAfter(dayjs())) {
        return { isValid: false, message: 'Birthday must be in the past' }
    }

    return { isValid: true }
}

export const updateProfileValidation = ({ fullName, phoneNumber, birthday }) => {
    if (!fullName?.trim() || !regex.fullName.test(fullName.trim())) {
        return {
            isValid: false,
            message: 'Full name must be 2-50 characters long and can only contain letters and spaces',
        }
    }

    if (!phoneNumber || !regex.phoneNumber.test(phoneNumber.trim())) {
        return { isValid: false, message: 'Phone number must be 10 digits long' }
    }

    const date = dayjs(birthday.trim(), 'MM/DD/YYYY', true)
    if (!birthday?.trim()) {
        return { isValid: false, message: 'Birthday is required' }
    }
    if (!date.isValid()) {
        return { isValid: false, message: 'Birthday must be in MM/DD/YYYY format' }
    }
    if (date.isAfter(dayjs())) {
        return { isValid: false, message: 'Birthday must be in the past' }
    }

    return { isValid: true }
}

export const changePassWordValidation = ({ currentPassWord, newPassWord, confirmPassWord }) => {
    if (!newPassWord?.trim() || !regex.passWord.test(newPassWord.trim())) {
        return {
            isValid: false,
            message: 'New password must be at least 8 characters long and contain at least one letter and one number',
        }
    }

    if (currentPassWord === newPassWord) {
        return { isValid: false, message: 'New password must be different from current password' }
    }

    if (newPassWord !== confirmPassWord) {
        return { isValid: false, message: 'New password and confirm new password do not match' }
    }

    return { isValid: true }
}
