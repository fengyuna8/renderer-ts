import Canvas from "../canvas.ts"
import Model from "../model.ts"

export const testDrawModelPoint = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const v of vertices) {
        scene.addPoint(v)
    }
}