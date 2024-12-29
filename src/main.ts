import Canvas from "./canvas.ts"
import Config from "./config.ts"
import * as Tests from './test/index.ts'

const main = () => {
    const w = Config.width
    const h = Config.height
    const canvas = Canvas.new('#id-canvas', w, h)

    // Tests.testDrawPoints(canvas)
    // Tests.testDrawLines(canvas)
    // Tests.testDrawTriangles(canvas)
    // Tests.testDrawModelPoint(canvas).then()
    // Tests.testDrawModelLine(canvas).then()
    // Tests.testDrawModelTriangle(canvas).then()
    Tests.testDrawModel(canvas).then()
}

main()