import Vector from "./vector.ts"
import Canvas from "./canvas.ts"
import Color from "./color.ts"
import Vertex from "./vertex.ts"
import Line from "./line.ts"

export default class Scene {
    canvas: Canvas
    imageData: ImageData
    width: number
    height: number
    points: Vertex[] = []
    lines: Line[] = []
    static new(canvas: Canvas): Scene {
        return new Scene(canvas)
    }
    constructor(canvas: Canvas) {
        this.canvas = canvas
        this.imageData = canvas.getImageData()
        this.width = this.imageData.width
        this.height = this.imageData.height
    }
    add(point: Vertex) {
        this.points.push(point)
    }
    addLine(line: Line) {
        this.lines.push(line)
    }
    draw() {
        for (const p of this.points) {
            this.drawPixel(p.position, p.color)
        }
        for (const l of this.lines) {
            this.drawLine(l.start, l.end)
        }
        this.canvas.putImageData(this.imageData)
    }
    drawPixel(point: Vector, color: Color = Color.black()) {
        const x = point.x
        const y = point.y
        this.setPixel(x, y, color)
    }
    drawLine(start: Vertex, end: Vertex) {
        const x1 = start.position.x
        const x2 = end.position.x
        const y1 = start.position.y
        const y2 = end.position.y
        const dx = Math.abs(x2 - x1)
        const dy = Math.abs(y2 - y1)
        const signX = x2 > x1 ? 1 : -1
        const signY = y2 > y1 ? 1 : -1
        if (dx > dy) {
            let error = 0
            let y = y1
            for (let x = x1; (signX > 0) ? (x <= x2) : (x >= x2); x += signX) {
                const factor = (x - x1) / (x2 - x1)
                const color = start.color.interpolate(end.color, factor)
                this.setPixel(x, y, color)
                error += dy
                if (2 * error >= dx) {
                    y += signY
                    error -= dx
                }
            }
        } else {
            let error = 0
            let x = x1;
            for (let y = y1; (signY > 0) ? (y <= y2) : (y >= y2); y += signY) {
                const factor = (y - y1) / (y2 - y1)
                const color = start.color.interpolate(end.color, factor)
                this.setPixel(x, y, color)
                error += dx
                if (2 * error >= dy) {
                    x += signX
                    error -= dy
                }
            }
        }
    }
    private setPixel(x: number, y: number, color: Color) {
        const w = this.width
        const i = (y * w + x) * 4
        const imageData = this.imageData
        // console.log('color is', color, `r=${color.r}, g=${color.g}, b=${color.b}, a=${color.a}`)
        imageData.data[i] = color.r
        imageData.data[i + 1] = color.g
        imageData.data[i + 2] = color.b
        imageData.data[i + 3] = color.a
    }
}