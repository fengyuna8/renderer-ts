import Canvas from "../canvas.ts"
import { randomFloatBetween } from "../utils.ts"
import Vector from "../vector.ts"
import Line from "../line.ts"
import Vertex from "../vertex.ts"
import Color from "../color.ts"

export const testDrawLines = (canvas: Canvas) => {
    const scene = canvas.getScene()
    for (let i = 0; i < 10; i++) {
        const x1 = randomFloatBetween(-1, 1)
        const y1 = randomFloatBetween(-1, 1)
        const x2 = randomFloatBetween(-1, 1)
        const y2 = randomFloatBetween(-1, 1)
        const p1 = Vector.new(x1, y1, 0)
        const p2 = Vector.new(x2, y2, 0)
        const line = Line.new(Vertex.new(p1, Color.randomColor()), Vertex.new(p2, Color.randomColor()))
        scene.addLine(line)
    }
}