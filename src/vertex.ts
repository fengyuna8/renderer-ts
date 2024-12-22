import Vector from "./vector.ts"
import Color from "./color.ts"

export default class Vertex {
    position: Vector
    color: Color
    static new(position: Vector, color: Color = Color.white()): Vertex {
        return new Vertex(position, color)
    }
    constructor(position: Vector, color: Color = Color.black()) {
        this.position = position
        this.color = color
    }
    interpolate(vertex: Vertex, factor: number): Vertex {
        const position = this.position.interpolate(vertex.position, factor)
        const color = this.color.interpolate(vertex.color, factor)
        return Vertex.new(position, color)
    }
}