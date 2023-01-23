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

const checkEmail = (value) => value?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
const checkName = (value) => value?.match(/[аАaA-яЯzZ]\s[аАaA-яЯzZ]/)
const checkLength = (min, max) => (value) => value.length >= min && value.length <= max
const checkEqual = (valueToCompare) => (value) => valueToCompare === value

export const checks = {
    checkEmail,
    checkName,
    checkLength,
    checkEqual,
}
