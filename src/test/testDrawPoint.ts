import Canvas from "../canvas.ts"
import { randomFloatBetween } from "../utils.ts"
import Vector from "../vector.ts"
import Color from "../color.ts"
import Vertex from "../vertex.ts"

export const testDrawPoints = (canvas: Canvas) => {
    const scene = canvas.getScene()
    for (let i = 0; i < 1000; i++) {
        const x = randomFloatBetween(-1, 1)
        const y = randomFloatBetween(-1, 1)
        const position = Vector.new(x, y, 0)
        const color = Color.randomColor()
        const p = Vertex.new(position, color)
        scene.addPoint(p)
    }
}