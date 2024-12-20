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
}