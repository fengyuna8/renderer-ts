import Canvas from "./canvas.ts"
import Vertex from "./vertex.ts"
import Line from "./line.ts"
import Config from "./config.ts"
import Triangle from "./triangle.ts"
import Model from "./model.ts"
import Renderer from "./renderer.ts"

export default class Scene {
    canvas: Canvas
    imageData: ImageData
    renderer: Renderer
    points: Vertex[] = []
    lines: Line[] = []
    triangles: Triangle[] = []
    models: Model[] = []
    static new(canvas: Canvas): Scene {
        return new Scene(canvas)
    }
    constructor(canvas: Canvas) {
        this.canvas = canvas
        this.imageData = canvas.getImageData()
        this.renderer = Renderer.new(this.imageData)
    }
    addPoint(point: Vertex) {
        this.points.push(point)
    }
    addLine(line: Line) {
        this.lines.push(line)
    }
    addTriangle(triangle: Triangle) {
        this.triangles.push(triangle)
    }
    addModel(model: Model) {
        this.models.push(model)
    }
    draw() {
        for (const p of this.points) {
            this.renderer.drawPoint(p)
        }

        if (Config.enableClip) {
            this.renderer.drawClipWindow()
        }

        for (const l of this.lines) {
            if (Config.enableClip) {
                this.renderer.drawLine(l.start, l.end)
            } else {
                this.renderer.drawLineWithBresenham(l.start, l.end)
            }
        }

        for (const t of this.triangles) {
            this.renderer.drawTriangle(t)
        }

        for (const m of this.models) {
            this.renderer.drawModel(m)
        }
        this.canvas.putImageData(this.imageData)
    }
}