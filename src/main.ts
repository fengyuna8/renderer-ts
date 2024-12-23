import Canvas from "./canvas.ts"
import Vector from "./vector.ts"
import { randomIntBetween } from "./utils.ts"
import Vertex from "./vertex.ts"
import Color from "./color.ts"
import Line from "./line.ts"
import Config from "./config.ts"
import Triangle from "./triangle.ts"
import Model from "./model.ts"

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

const testDrawTriangles = (canvas: Canvas) => {
    const w = canvas.context.canvas.width
    const h = canvas.context.canvas.height
    const scene = canvas.getScene()
    for (let i = 0; i < 10; i++) {
        const x1 = randomIntBetween(0, w)
        const y1 = randomIntBetween(0, h)
        const x2 = randomIntBetween(0, w)
        const y2 = randomIntBetween(0, h)
        const x3 = randomIntBetween(0, w)
        const y3 = randomIntBetween(0, h)
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

const testDrawModelPoint = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const v of vertices) {
        const p = scene.viewportTransform(v)
        scene.addPoint(p)
    }
}

const testDrawModelLine = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const faces = model.faces
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const f of faces) {
        for (let i = 0; i < 3; i++) {
            const v1 = vertices[f[i]]
            const v2 = vertices[f[(i + 1) % 3]]
            const p1 = scene.viewportTransform(v1)
            const p2 = scene.viewportTransform(v2)
            const line = Line.new(p1, p2)
            scene.addLine(line)
        }
    }
}

const testDrawModelTriangle = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const faces = model.faces
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const f of faces.slice(0)) {
        const v1 = vertices[f[0]]
        const v2 = vertices[f[1]]
        const v3 = vertices[f[2]]

        const p1 = scene.viewportTransform(v1)
        const p2 = scene.viewportTransform(v2)
        const p3 = scene.viewportTransform(v3)
        const triangle = Triangle.new(p1, p2, p3)
        scene.addTriangle(triangle)
    }
}


const main = () => {
    const w = Config.width
    const h = Config.height
    const canvas = Canvas.new('#id-canvas', w, h)

    // testDrawPoints(canvas)
    // testDrawLines(canvas)
    // testDrawTriangles(canvas)
    // testDrawModelPoint(canvas).then()
    // testDrawModelLine(canvas).then()
    testDrawModelTriangle(canvas).then()
}

main()