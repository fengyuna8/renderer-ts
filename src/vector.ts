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
    interpolate(vector: Vector, factor: number): Vector {
        const x = this.x + (vector.x - this.x) * factor
        const y = this.y + (vector.y - this.y) * factor
        const z = this.z + (vector.z - this.z) * factor
        return Vector.new(x, y, z)
    }
}