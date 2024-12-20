import Vector from "./vector.ts"
import Canvas from "./canvas.ts"
import Color from "./color.ts"

export default class Scene {
    canvas: Canvas
    imageData: ImageData
    width: number
    height: number
    points: Vector[]
    static new(canvas: Canvas): Scene {
        return new Scene(canvas)
    }
    constructor(canvas: Canvas) {
        this.canvas = canvas
        this.imageData = canvas.getImageData()
        this.width = this.imageData.width
        this.height = this.imageData.height
        this.points = []
    }
    add(point: Vector) {
        this.points.push(point)
    }
    draw() {
        for (const p of this.points) {
            this.drawPixel(p)
        }
        this.canvas.putImageData(this.imageData)
    }
    drawPixel(point: Vector, color: Color = Color.black()) {
        const x = point.x
        const y = point.y
        this.setPixel(x, y, color)
    }
    private setPixel(x: number, y: number, color: Color) {
        const w = this.width
        const i = (y * w + x) * 4
        const imageData = this.imageData
        imageData.data[i] = color.r
        imageData.data[i + 1] = color.g
        imageData.data[i + 2] = color.b
        imageData.data[i + 3] = color.a
    }
}