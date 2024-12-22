import Vertex from "./vertex.ts"
import Vector from "./vector.ts"
import Color from "./color.ts"

export default class Model {
    vertices: Vertex[] = []
    faces: number[][] = []
    static new() {
        return new Model()
    }
    static async parseObj(url: string): Promise<Model> {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const model = Model.new()
        const text = await response.text()
        const lines = text.split('\n')
        for (const line of lines) {
            if (line.startsWith('v ')) {
                const v = line.trim().slice(2).split(' ')
                const p = Vector.new(Number(v[0]), Number(v[1]), Number(v[2]))
                const c = Color.white()
                model.vertices.push(Vertex.new(p, c))
            } else if (line.startsWith('f ')) {
                const f = line.trim().slice(2).split(' ')
                const i0 = Number(f[0].split('/')[0]) - 1
                const i1 = Number(f[1].split('/')[0]) - 1
                const i2 = Number(f[2].split('/')[0]) - 1
                const face = [i0, i1, i2]
                model.faces.push(face)
            } else {
                //
            }
        }

        return model
    }
}