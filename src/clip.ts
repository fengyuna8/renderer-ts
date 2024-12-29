import Config from "./config.ts"

export interface ClipWindow {
    xMin: number
    yMin: number
    xMax: number
    yMax: number
}

export const clipWindow: ClipWindow = {
    xMin: Config.width * 0.2,
    yMin: Config.height * 0.2,
    xMax: Config.width * 0.8,
    yMax: Config.height * 0.8,
}

class BoundaryCode {
    static inside = 0b0000
    static left   = 0b0001
    static right  = 0b0010
    static bottom = 0b0100
    static top    = 0b1000
}

export const computeCode = (x: number, y: number): number => {
    const {xMin, yMin, xMax, yMax} = clipWindow

    let code = BoundaryCode.inside
    if (x < xMin) {
        code = code | BoundaryCode.left
    } else if (x > xMax) {
        code = code | BoundaryCode.right
    }
    if (y < yMin) {
        code = code | BoundaryCode.top
    } else if (y > yMax) {
        code = code | BoundaryCode.bottom
    }
    return code
}

export function isInside(code1: number, code2: number): boolean {
    // code1 === 0, code2 === 0
    return (code1 | code2) === 0
}

export function isSameSide(code1: number, code2: number) {
    // code1 bit1 === 1, code2 bit1 === 1
    // code1 bit2 === 1, code2 bit2 === 1
    // code1 bit3 === 1, code2 bit3 === 1
    // code1 bit4 === 1, code2 bit4 === 1
    return (code1 & code2) !== 0
}

export function isTop(code: number): boolean {
    return (code & BoundaryCode.top) !== 0
}

export function isBottom(code: number): boolean {
    return (code & BoundaryCode.bottom) !== 0
}

export function isLeft(code: number): boolean {
    return (code & BoundaryCode.left) !== 0
}

export function isRight(code: number): boolean {
    return (code & BoundaryCode.right) !== 0
}