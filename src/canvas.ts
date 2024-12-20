import Scene from "./scene.ts"

interface FPSData {
    lastFrameTime: number
    frameCount: number
    fps: number
    elapsedTime: number
}

export default class Canvas {
    private data: FPSData = {
        lastFrameTime: 0,
        frameCount: 0,
        fps: 0,
        elapsedTime: 0,
    }
    private readonly imageData: ImageData
    context: CanvasRenderingContext2D
    scene: Scene
    static new(selector: string, width: number, height: number) {
        return new this(selector, width, height)
    }
    constructor(selector: string, width: number, height: number) {
        const canvas = document.querySelector(selector) as HTMLCanvasElement
        if (canvas === null) {
            throw new Error(`canvas is null, selector '${selector}' not found`)
        }
        canvas.width = width
        canvas.height = height
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D
        this.imageData = this.context.createImageData(width, height)
        this.scene = Scene.new(this)
        requestAnimationFrame(this.runLoop.bind(this))
    }
    getImageData(): ImageData {
        return this.imageData
    }
    putImageData(data: ImageData) {
        this.context.putImageData(data, 0, 0)
    }
    getScene(): Scene {
        return this.scene
    }
    private clear() {
        const w = this.context.canvas.width
        const h = this.context.canvas.height
        this.context.clearRect(0, 0, w, h)
    }
    private update() {

    }
    private draw() {
        this.scene.draw()
        this.drawFps()
    }
    private drawFps() {
        this.context.fillStyle = 'black'
        this.context.font = '16px monospace'
        const s = `FPS: ${this.data.fps.toFixed(2)}`
        this.context.fillText(s, 10, 20)
    }
    private runLoop(timestamp: number) {
        if (this.data.lastFrameTime === 0) {
            this.data.lastFrameTime = timestamp
        }
        const t = timestamp - this.data.lastFrameTime
        this.data.elapsedTime += t
        this.data.frameCount += 1
        this.data.lastFrameTime = timestamp
        if (this.data.elapsedTime >= 1000) {
            this.data.fps = this.data.frameCount
            this.data.elapsedTime = 0
            this.data.frameCount = 0
        }
        this.clear()
        this.update()
        this.draw()

        requestAnimationFrame(this.runLoop.bind(this))
    }
}