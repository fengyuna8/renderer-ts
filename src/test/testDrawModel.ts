import Canvas from "../canvas.ts"
import Model from "../model.ts"

export const testDrawModel = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const scene = canvas.getScene()
    scene.addModel(model)
}