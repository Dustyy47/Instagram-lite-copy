import { useState } from 'react'
import { Validation } from '../../helpers/validations'

export interface Validator {
    validate: (value: string) => void
    errors: string
}

export function useValidator(
    validations: Validation[],
    options = {
        checkEmpty: true,
    }
) {
    const [errors, setErrors] = useState<string>('')
    const newValidator: Validator = {
        validate(value: string): void {
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
    return newValidator
}
