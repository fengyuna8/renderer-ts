import Canvas from "../canvas.ts"
import Model from "../model.ts"
import Line from "../line.ts"

export const testDrawModelLine = async (canvas: Canvas) => {
    const model = await Model.parseObj('/obj/african_head.obj')
    const faces = model.faces
    const vertices = model.vertices
    const scene = canvas.getScene()

    for (const f of faces) {
        for (let i = 0; i < 3; i++) {
            const v1 = vertices[f[i * 2]]
            const v2 = vertices[f[(i + 1) * 2 % 6]]
            if (v2 === undefined) {
                throw new Error('v2 is undefined')
            }
            const line = Line.new(v1, v2)
            scene.addLine(line)
        }
    }
}