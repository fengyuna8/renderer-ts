const ensure = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(`error message: ${message}`)
    }
}

export const randomIntBetween = (a: number, b: number) => {
    ensure(a <= b, `[${a}] <= [${b}] 不成立`)
    let n = Math.random()
    n = n * (b - a + 1)
    n += a
    n = Math.floor(n)
    return n
}

export const randomFloatBetween = (a: number, b: number) => {
    ensure(a <= b, `[${a}] <= [${b}] 不成立`)
    let n = Math.random()
    n = n * (b - a)
    n += a
    return n
}
