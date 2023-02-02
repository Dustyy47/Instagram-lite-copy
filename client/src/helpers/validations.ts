type CheckCallback = (value: string) => boolean
type CheckCallbackCreator = (...params: any) => CheckCallback

export class Validation {
    check
    errorMessage

    constructor(check: CheckCallback, errorMessage: string) {
        this.check = check
        this.errorMessage = errorMessage
    }
    // returns empty string if value valid and an error if not
    validate(value: string) {
        let isValid = this.check(value)
        return isValid ? '' : this.errorMessage
    }
}

const checkEmail: CheckCallback = (value) =>
    !!value?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const checkName: CheckCallback = (value) => !!value?.match(/[аАaA-яЯzZ]\s[аАaA-яЯzZ]/)
const checkLength: CheckCallbackCreator = (min, max) => (value) =>
    value.length >= min && value.length <= max
const checkEqual: CheckCallbackCreator = (valueToCompare) => (value) => valueToCompare === value

export const checks = {
    checkEmail,
    checkName,
    checkLength,
    checkEqual,
}
