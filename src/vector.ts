export default class Vector {
    x: number
    y: number
    z: number
    static new(x: number, y: number, z: number): Vector {
        return new Vector(x, y, z)
    }
    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }
    length(): number {
        const len = this.x * this.x + this.y * this.y + this.z * this.z
        return Math.sqrt(len)
    }
    normalize(): Vector {
        const len = this.length()
        return Vector.new(this.x / len, this.y / len, this.z / len)
    }
    dot(vector: Vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z
    }
    cross(vector: Vector) {
        const x1 = this.x
        const y1 = this.y
        const z1 = this.z
        const x2 = vector.x
        const y2 = vector.y
        const z2 = vector.z
        return Vector.new(y1*z2 - z1*y2, z1*x2 - x1*z2, x1*y2 - y1*x2)
    }
    subtract(vector: Vector) {
        return Vector.new(this.x - vector.x, this.y - vector.y, this.z - vector.z)
    }
    multiply(factor: number) {
        return Vector.new(this.x * factor, this.y * factor, this.z * factor)
    }
    interpolate(vector: Vector, factor: number): Vector {
        const x = this.x + (vector.x - this.x) * factor
        const y = this.y + (vector.y - this.y) * factor
        const z = this.z + (vector.z - this.z) * factor
        return Vector.new(x, y, z)
    }
}