export function generateMocks<T>(example: T, count: number, returnWithNewKey: (obj: T, key: number) => T) {
    let res = [example]
    for (let i = 1; i < count; i++) {
        res.push(returnWithNewKey(example, i + 1))
    }
    return res
}
