import Vertex from "./vertex.ts"
import Vector from "./vector.ts"
import Color from "./color.ts"

export default class Model {
    vertices: Vertex[] = []
    faces: number[][] = []
    uvs: Vector[] = []
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
                const parts = line.trim().slice(2).split(' ')
                const face: number[] = []
                for (const part of parts) {
                    const item = part.split('/')
                    const vertexIndex = Number(item[0]) - 1
                    const uvIndex = Number(item[1]) - 1
                    face.push(vertexIndex)
                    face.push(uvIndex)
                }
                model.faces.push(face)
            } else if (line.startsWith('vt ')) {
                const vt = line.slice(3).trim().split(' ')
                const u = Number(vt[0])
                const v = Number(vt[1])
                model.uvs.push(Vector.new(u, v, 0))
            } else {
                //
            }
        }

        return model
    }
}