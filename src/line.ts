import Vertex from "./vertex.ts"

export default class Line {
    start: Vertex
    end: Vertex
    static new(start: Vertex, end: Vertex): Line {
        return new Line(start, end)
    }
    constructor(start: Vertex, end: Vertex) {
        this.start = start
        this.end = end
    }
}