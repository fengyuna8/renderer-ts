import Canvas from "./canvas.ts"
import Vector from "./vector.ts"
import { randomIntBetween } from "./utils.ts"
import Vertex from "./vertex.ts"
import Color from "./color.ts"
import Line from "./line.ts"
import Config from "./config.ts"

const testDrawPoints = (canvas: Canvas) => {
    const scene = canvas.getScene()
    for (let i = 0; i < 1000; i++) {
        const x = randomIntBetween(0, canvas.context.canvas.width)
        const y = randomIntBetween(0, canvas.context.canvas.height)
        const position = Vector.new(x, y, 0)
        const color = Color.randomColor()
        const p = Vertex.new(position, color)
        scene.addPoint(p)
    }
}

const testDrawLines = (canvas: Canvas) => {
    const w = canvas.context.canvas.width
    const h = canvas.context.canvas.height
    const scene = canvas.getScene()
    for (let i = 0; i < 10; i++) {
        const x1 = randomIntBetween(0, w)
        const y1 = randomIntBetween(0, h)
        const x2 = randomIntBetween(0, w)
        const y2 = randomIntBetween(0, h)
        const p1 = Vector.new(x1, y1, 0)
        const p2 = Vector.new(x2, y2, 0)
        const line = Line.new(Vertex.new(p1, Color.randomColor()), Vertex.new(p2, Color.randomColor()))
        scene.addLine(line)
    }
}

const main = () => {
    const w = Config.width
    const h = Config.height
    const canvas = Canvas.new('#id-canvas', w, h)

    testDrawPoints(canvas)
    testDrawLines(canvas)
}

main()