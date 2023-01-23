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
