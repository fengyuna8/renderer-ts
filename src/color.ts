import { randomIntBetween } from "./utils.ts"

export default class Color {
    r: number
    g: number
    b: number
    a: number
    static new(r: number, g: number, b: number, a: number = 255) {
        return new Color(r, g, b, a)
    }
    static red() {
        return this.new(255, 0, 0, 255)
    }
    static green() {
        return this.new(0, 255, 0, 255)
    }
    static blue() {
        return this.new(0, 0, 255, 255)
    }
    static black() {
        return this.new(0, 0, 0, 255)
    }
    static randomColor() {
        const r = randomIntBetween(0, 255)
        const g = randomIntBetween(0, 255)
        const b = randomIntBetween(0, 255)
        const a = 255
        return this.new(r, g, b, a)
    }
    constructor(r: number, g: number, b: number, a: number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
    interpolate(color: Color, factor: number) {
        const r = this.r + (color.r - this.r) * factor
        const g = this.g + (color.g - this.g) * factor
        const b = this.b + (color.b - this.b) * factor
        const a = this.a + (color.a - this.a) * factor
        return Color.new(r, g, b, a)
    }
}