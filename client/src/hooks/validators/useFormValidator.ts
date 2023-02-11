import { Validator } from './useValidator'
export function useFormValidator(...validators: Validator[]) {
    return {
        hasErrors() {
            for (let validator of validators) {
                if (validator.errors) return true
            }
            return false
        },
        reset() {
            validators.forEach((validator) => {
                validator.reset()
            })
        },
        validators,
    }
}
