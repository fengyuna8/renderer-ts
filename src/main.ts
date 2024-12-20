import Canvas from "./canvas.ts"
import Vector from "./vector.ts"
import { randomIntBetween } from "./utils.ts"

class Config {
    static width: number = 800
    static height: number = 600
}

const testDrawPoints = (canvas: Canvas) => {
    const scene = canvas.getScene()
    for (let i = 0; i < 1000; i++) {
        const x = randomIntBetween(0, canvas.context.canvas.width)
        const y = randomIntBetween(0, canvas.context.canvas.height)
        const p = Vector.new(x, y, 0)
        scene.add(p)
    }
}

const main = () => {
    const w = Config.width
    const h = Config.height
    const canvas = Canvas.new('#id-canvas', w, h)

    testDrawPoints(canvas)
}

main()