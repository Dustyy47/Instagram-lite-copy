import { useState } from 'react'

export class Validation {
    check
    errorMessage

    constructor(check, errorMessage) {
        this.check = check
        this.errorMessage = errorMessage
    }
    // returns empty string if value valid and an error if not
    validate(value) {
        let isValid = this.check(value)
        return isValid ? '' : this.errorMessage
    }
}

export function useFormValidator(...validators) {
    return {
        hasErrors() {
            for (let validator of validators) {
                if (validator.errors !== '') return true
            }
            return false
        },
        validators,
    }
}

export function useValidator(
    validations,
    options = {
        checkEmpty: true,
    }
) {
    const [errors, setErrors] = useState('')
    return {
        validate(value) {
            let validationsQuery = ''

            if (options.checkEmpty && value === '') {
                validationsQuery = 'Поле не должно быть пустым'
                setErrors(validationsQuery)
                return
            }

            for (let validation of validations) {
                let validationResult = validation.validate(value)
                if (validationResult) validationsQuery += validationResult + '\n'
            }
            setErrors(validationsQuery)
        },
        errors,
    }
}

export const checkEmail = (value) => value?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
export const checkName = (value) => value?.match(/[аАaA-яЯzZ]\s[аАaA-яЯzZ]/)
export const checkLength = (min, max) => (value) => value.length >= min && value.length <= max
