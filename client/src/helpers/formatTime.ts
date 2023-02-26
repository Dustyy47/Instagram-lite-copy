export function getPassedTime(date: Date | string) {
    let newDate: Date
    if (typeof date === 'string') {
        newDate = new Date(date)
    } else {
        newDate = date as Date
    }
    let passed = new Date().getTime() - newDate.getTime()

    passed /= 1000 // получение в секундах
    if (passed < 60) return Math.floor(passed) + ' сек.'
    passed /= 60
    if (passed < 60) return Math.floor(passed) + ' мин.'
    passed /= 60
    if (passed < 24) return Math.floor(passed) + ' ч.'
    passed /= 24
    if (passed < 7) return Math.floor(passed) + ' д.'

    let day: number | string = newDate.getDate()
    let month: number | string = newDate.getMonth()
    let year = newDate.getFullYear()
    day = (day < 10 ? '0' : '') + day
    month = (month < 10 ? '0' : '') + month
    return `${day}.${month}.${year}`
}
