import Vector from "./vector.ts"
import Canvas from "./canvas.ts"
import Color from "./color.ts"
import Vertex from "./vertex.ts"
import Line from "./line.ts"
import Config from "./config.ts"

interface ClipWindow {
    xMin: number
    yMin: number
    xMax: number
    yMax: number
}

const clipWindow: ClipWindow = {
    xMin: Config.width * 0.2,
    yMin: Config.height * 0.2,
    xMax: Config.width * 0.8,
    yMax: Config.height * 0.8,
}

class BoundaryCode {
    static inside = 0b0000
    static left   = 0b0001
    static right  = 0b0010
    static bottom = 0b0100
    static top    = 0b1000
}

function computeCode(x: number, y: number): number {
    const {xMin, yMin, xMax, yMax} = clipWindow

    let code = BoundaryCode.inside
    if (x < xMin) {
        code = code | BoundaryCode.left
    } else if (x > xMax) {
        code = code | BoundaryCode.right
    }
    if (y < yMin) {
        code = code | BoundaryCode.top
    } else if (y > yMax) {
        code = code | BoundaryCode.bottom
    }
    return code
}

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
    addPoint(point: Vertex) {
        this.points.push(point)
    }
    addLine(line: Line) {
        this.lines.push(line)
    }
    draw() {
        for (const p of this.points) {
            this.drawPoint(p.position, p.color)
        }

        const {xMin, yMin, xMax, yMax} = clipWindow
        this.drawRect(xMin, yMin, xMax, yMax)
        for (const l of this.lines) {
            this.drawLine(l.start, l.end)
        }
        this.canvas.putImageData(this.imageData)
    }
    private drawPoint(point: Vector, color: Color = Color.black()) {
        const x = point.x
        const y = point.y
        this.setPixel(x, y, color)
    }
    private drawLineWithBresenham(start: Vertex, end: Vertex) {
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
    private drawLine(start: Vertex, end: Vertex) {
        let x1 = start.position.x
        let x2 = end.position.x
        let y1 = start.position.y
        let y2 = end.position.y
        let code1 = computeCode(x1, y1)
        let code2 = computeCode(x2, y2)

        const {xMin, yMin, xMax, yMax} = clipWindow
        let accept = false
        while (true) {
            if ((code1 | code2) === 0) {
                // code1 === 0, code2 === 0
                accept = true
                break
            } else if ((code1 & code2) !== 0) {
                // code1 bit1 === 1, code2 bit1 === 1
                // code1 bit2 === 1, code2 bit2 === 1
                // code1 bit3 === 1, code2 bit3 === 1
                // code1 bit4 === 1, code2 bit4 === 1
                break;
            } else {
                let x
                let y
                const code = (code1 !== 0) ? code1 : code2
                if ((code & BoundaryCode.top) !== 0) {
                    y = yMin
                    const factor = (y - y1) / (y2 - y1)
                    const p = start.position.interpolate(end.position, factor)
                    x = p.x
                } else if ((code & BoundaryCode.bottom) !== 0) {
                    y = yMax
                    const factor = (y - y1) / (y2 - y1)
                    const p = start.position.interpolate(end.position, factor)
                    x = p.x
                } else if ((code & BoundaryCode.left) !== 0) {
                    x = xMin
                    const factor = (x - x1) / (x2 - x1)
                    const p = start.position.interpolate(end.position, factor)
                    y = p.y
                } else if ((code & BoundaryCode.right) !== 0) {
                    x = xMax
                    const factor = (x - x1) / (x2 - x1)
                    const p = start.position.interpolate(end.position, factor)
                    y = p.y
                } else {
                    throw new Error(`error code, ${code}`)
                }

                if (code === code1) {
                    x1 = Math.round(x)
                    y1 = Math.round(y)
                    code1 = computeCode(x1, y1)
                } else {
                    x2 = Math.round(x)
                    y2 = Math.round(y)
                    code2 = computeCode(x2, y2)
                }
            }
        }
        if (accept) {
            const p1 = Vertex.new(Vector.new(x1, y1, 0), start.color)
            const p2 = Vertex.new(Vector.new(x2, y2, 0), end.color)
            this.drawLineWithBresenham(p1, p2)
        }
    }
    private drawRect(x1: number, y1: number, x2: number, y2: number) {
        const color = Color.new(80, 80, 80, 255)
        for (let x = x1; x <= x2; x += 1) {
            for (let y = y1; y <= y2; y += 1) {
                this.setPixel(x, y, color)
            }
        }
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