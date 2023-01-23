import { useState } from 'react'

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
