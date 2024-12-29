import Canvas from "../canvas.ts"
import Model from "../model.ts"
import Triangle from "../triangle.ts"

export const testDrawModelTriangle = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const faces = model.faces
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const f of faces) {
        const v1 = vertices[f[0]]
        const v2 = vertices[f[2]]
        const v3 = vertices[f[4]]
        const triangle = Triangle.new(v1, v2, v3)
        scene.addTriangle(triangle)
    }
}