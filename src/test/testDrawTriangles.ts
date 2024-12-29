import Canvas from "../canvas.ts"
import { randomFloatBetween } from "../utils.ts"
import Vector from "../vector.ts"
import Vertex from "../vertex.ts"
import Color from "../color.ts"
import Triangle from "../triangle.ts"

export const testDrawTriangles = (canvas: Canvas) => {
    const scene = canvas.getScene()
    for (let i = 0; i < 10; i++) {
        const x1 = randomFloatBetween(-1, 1)
        const y1 = randomFloatBetween(-1, 1)
        const x2 = randomFloatBetween(-1, 1)
        const y2 = randomFloatBetween(-1, 1)
        const x3 = randomFloatBetween(-1, 1)
        const y3 = randomFloatBetween(-1, 1)
        const p1 = Vector.new(x1, y1, 0)
        const p2 = Vector.new(x2, y2, 0)
        const p3 = Vector.new(x3, y3, 0)
        const v1 = Vertex.new(p1, Color.randomColor())
        const v2 = Vertex.new(p2, Color.randomColor())
        const v3 = Vertex.new(p3, Color.randomColor())
        const triangle = Triangle.new(v1, v2, v3)
        scene.addTriangle(triangle)
    }
}