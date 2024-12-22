import Vertex from "./vertex.ts"

export default class Triangle {
    p1: Vertex
    p2: Vertex
    p3: Vertex
    static new(p1: Vertex, p2: Vertex, p3: Vertex): Triangle {
        return new Triangle(p1, p2, p3)
    }
    constructor(p1: Vertex, p2: Vertex, p3: Vertex) {
        this.p1 = p1
        this.p2 = p2
        this.p3 = p3
    }
}