import { clipWindow, computeCode, isBottom, isInside, isLeft, isRight, isSameSide, isTop } from "./clip.ts"
import Vector from "./vector.ts"
import Color from "./color.ts"
import Vertex from "./vertex.ts"
import Triangle from "./triangle.ts"
import Model from "./model.ts"
import Config from "./config.ts"

export default class Renderer {
    imageData: ImageData
    width: number
    height: number
    zBuffer: number[]
    light: Vector
    static new(imageData: ImageData): Renderer {
        return new Renderer(imageData)
    }
    constructor(imageData: ImageData) {
        this.imageData = imageData
        this.width = imageData.width
        this.height = imageData.height
        this.zBuffer = new Array(this.width * this.height).fill(Infinity)
        this.light = Vector.new(0, 0, 1)
    }
    drawClipWindow() {
        const {xMin, yMin, xMax, yMax} = clipWindow
        this.drawRect(xMin, yMin, xMax, yMax)
    }
    drawPoint(vertex: Vertex) {
        const p = this.viewportTransform(vertex)
        const color = p.color
        const x = p.position.x
        const y = p.position.y
        const z = p.position.z
        this.setPixel(x, y, z, color)
    }
    drawLineWithBresenham(start: Vertex, end: Vertex) {
        let v1
        let v2
        if (Config.enableClip) {
            v1 = start
            v2 = end
        } else {
            v1 = this.viewportTransform(start)
            v2 = this.viewportTransform(end)
        }
        const x1 = v1.position.x
        const x2 = v2.position.x
        const y1 = v1.position.y
        const y2 = v2.position.y
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
                this.setPixel(x, y, 0, color)
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
                this.setPixel(x, y, 0, color)
                error += dx
                if (2 * error >= dy) {
                    x += signX
                    error -= dy
                }
            }
        }
    }
    drawLine(start: Vertex, end: Vertex) {
        const v1 = this.viewportTransform(start)
        const v2 = this.viewportTransform(end)
        let x1 = v1.position.x
        let x2 = v2.position.x
        let y1 = v1.position.y
        let y2 = v2.position.y
        let code1 = computeCode(x1, y1)
        let code2 = computeCode(x2, y2)

        const {xMin, yMin, xMax, yMax} = clipWindow
        let accept = false
        let count = 0
        while (true) {
            if (isInside(code1, code2)) {
                accept = true
                break
            } else if (isSameSide(code1, code2)) {
                break;
            } else {
                let x
                let y
                const code = (code1 !== 0) ? code1 : code2
                if (isTop(code)) {
                    y = yMin
                    const factor = (y - y1) / (y2 - y1)
                    const p = v1.position.interpolate(v2.position, factor)
                    x = p.x
                } else if (isBottom(code)) {
                    y = yMax
                    const factor = (y - y1) / (y2 - y1)
                    const p = v1.position.interpolate(v2.position, factor)
                    x = p.x
                } else if (isLeft(code)) {
                    x = xMin
                    const factor = (x - x1) / (x2 - x1)
                    const p = v1.position.interpolate(v2.position, factor)
                    y = p.y
                } else if (isRight(code)) {
                    x = xMax
                    const factor = (x - x1) / (x2 - x1)
                    const p = v1.position.interpolate(v2.position, factor)
                    y = p.y
                } else {
                    throw new Error(`error code, ${code}`)
                }

                count += 1

                if (count > 5) {
                    break
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
    drawTriangle(triangle: Triangle, intensity: number = 1) {
        const p1 = this.viewportTransform(triangle.p1)
        const p2 = this.viewportTransform(triangle.p2)
        const p3 = this.viewportTransform(triangle.p3)
        const [pa, pb, pc] = [p1, p2, p3].sort((a, b) => a.position.y - b.position.y)
        const factor = (pb.position.y - pa.position.y) / (pc.position.y - pa.position.y)
        const middle = pa.interpolate(pc, factor)
        this.drawUpperTriangle(pa, pb, middle, intensity)
        this.drawLowerTriangle(pb, middle, pc, intensity)
    }
    private drawUpperTriangle(pa: Vertex, pb: Vertex, pc: Vertex, intensity: number = 1) {
        const y1 = pa.position.y
        const y2 = pc.position.y
        for (let y = y1; y <= y2; y += 1) {
            const factor = (y - y1) / (y2 - y1)
            const v1 = pa.interpolate(pb, factor)
            v1.position.y = y
            const v2 = pa.interpolate(pc, factor)
            v2.position.y = y
            this.drawScanline(v1, v2, intensity)
        }
    }
    private drawLowerTriangle(pa: Vertex, pb: Vertex, pc: Vertex, intensity: number = 1) {
        const y1 = pa.position.y
        const y2 = pc.position.y
        for (let y = y1; y <= y2; y += 1) {
            const factor = (y - y1) / (y2 - y1)
            const v1 = pa.interpolate(pc, factor)
            const v2 = pb.interpolate(pc, factor)
            this.drawScanline(v1, v2, intensity)
        }
    }
    private drawScanline(p1: Vertex, p2: Vertex, intensity: number = 1) {
        let a = p1.position.x
        let b = p2.position.x
        let x1 = Math.min(a, b)
        let x2 = Math.max(a, b)
        for (let x = x1; x < x2; x += 1) {
            const factor = (x - x1) / (x2 - x1)
            const p = p1.interpolate(p2, factor)
            const c = p.color.multiply(intensity)
            this.setPixel(x, p1.position.y, p.position.z, c)
        }
    }
    drawModel(model: Model) {
        const faces = model.faces
        const vertices = model.vertices
        for (let i = 0; i < faces.length; i++) {
            const f = faces[i]
            const v1 = vertices[f[0]]
            const v2 = vertices[f[2]]
            const v3 = vertices[f[4]]

            const vector1 = v2.position.subtract(v1.position)
            const vector2 = v3.position.subtract(v1.position)
            const normal = vector1.cross(vector2).normalize()
            const intensity = normal.dot(this.light)
            if (intensity > 0) {
                const triangle = Triangle.new(v1, v2, v3)
                this.drawTriangle(triangle, 1)
            }
        }
    }
    private viewportTransform(vertex: Vertex) {
        const x1 = Math.floor((vertex.position.x + 1) / 2 * this.width)
        const y1 = this.height - Math.floor((vertex.position.y + 1) / 2 * this.height)
        const p = Vector.new(x1, y1, 0)
        return Vertex.new(p, vertex.color)
    }
    private drawRect(x1: number, y1: number, x2: number, y2: number) {
        const color = Color.new(80, 80, 80, 255)
        for (let x = x1; x <= x2; x += 1) {
            for (let y = y1; y <= y2; y += 1) {
                this.setPixel(x, y, 1, color)
            }
        }
    }
    private setPixel(x: number, y: number, z: number, color: Color) {
        x = Math.floor(x)
        y = Math.floor(y)
        const w = this.width
        const index = y * w + x

        if (z < this.zBuffer[index]) {
            this.zBuffer[index] = z
            const imageData = this.imageData
            const i = (y * w + x) * 4
            imageData.data[i] = color.r
            imageData.data[i + 1] = color.g
            imageData.data[i + 2] = color.b
            imageData.data[i + 3] = color.a
        }
    }
}