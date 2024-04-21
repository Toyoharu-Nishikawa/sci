import Delaunator from '../modules/delaunator/index.js'

export const innerTriangle = (triangle, point) => {
  const p1 = triangle[0]
  const p2 = triangle[1]
  const p3 = triangle[2]
  const p4 = point
  
  const u12 = [p2[0]-p1[0], p2[1]-p1[1]] 
  const u13 = [p3[0]-p1[0], p3[1]-p1[1]] 
  const u14 = [p4[0]-p1[0], p4[1]-p1[1]]
  
  const det = u12[0]*u13[1] - u12[1]*u13[0]
  const Uint = [
    [u13[1]/det, -u13[0]/det],
    [-u12[1]/det, u12[0]/det],
  ]
 
  const s = [
    Uint[0][0]*u14[0]+Uint[0][1]*u14[1], 
    Uint[1][0]*u14[0]+Uint[1][1]*u14[1], 
  ] 

  const flag1 = 0<= s[0] && s[0] <=1
  const flag2 = 0<= s[1] && s[1] <=1
  const flag3 = 0<= 1-s[0]- s[1]  && 1-s[0]-s[1]<=1

  const flag = flag1 && flag2 && flag3
 
  return flag
}


export const DelaunayTriangulation = class {
  constructor(points){
    this.points = points
    this.numberOfPoints = null 
    this.delaunay       = null 
    this.triangles      = null 
    this.allEdges       = null 
    this.neighbors      = null 
    this.neighborPoints = null 
    this.convexHull     = null 
 
    this.setDelaunayTriangulation(points)
  }
  edgesOfTriangle(t){
    return [3 * t, 3 * t + 2, 3 * t + 1]
  }
  nextHalfedge(e){
    return (e % 3 === 2) ? e - 2 : e + 1
  }
  prevHalfedge(e){
    return (e % 3 === 0) ? e + 2 : e - 1
  }
  triangleOfEdge(e){
    return Math.floor(e / 3) 
  }
  setDelaunayTriangulation(points){
    const numberOfPoints = points.length

    const coords = points.flatMap(v=>v)
    const delaunay = new Delaunator(coords)
    //const delaunay = delaunayTriangulation(points)
    this.delaunay = delaunay
    const triangles = []
    const neighbors = []
    for (let t = 0; t < delaunay.triangles.length/3; t++ ) {
      const vertices = this.edgesOfTriangle(t).map(v=>delaunay.triangles[v])
      triangles.push(vertices)
      neighbors.push(this.trianglesAdjacentToTriangle(t))
    }
    const allEdges = []
    for (let e = 0; e < delaunay.triangles.length; e++) {
      if (e > delaunay.halfedges[e]) {
          const p = this.delaunay.triangles[e]
          const q = this.delaunay.triangles[this.nextHalfedge(e)]
          allEdges.push([p,q])
      }
    }
    const neighborPoints = []
    for(let i=0;i<numberOfPoints;i++){
      neighborPoints[i] = []
      for(let j=0;j<allEdges.length;j++){
        const edge = allEdges[j]
        const flag0 = edge[0]===i 
        const flag1 = edge[1]===i 
        if(flag0){
          neighborPoints[i].push(edge[1])
        }
        if(flag1){
          neighborPoints[i].push(edge[0])
        }
      }
    } 
    this.numberOfPoints = numberOfPoints
    this.delaunay = delaunay
    this.triangles = triangles
    this.allEdges = allEdges
    this.neighbors = neighbors
    this.neighborPoints = neighborPoints
    this.convexHull = delaunay.hull.reverse()
  }
  trianglesAdjacentToTriangle = (t) => {
    const tmp = []
    const edges = this.edgesOfTriangle(t)
    for (const e of edges) {
        const opposite = this.delaunay.halfedges[e]
        if(opposite >= 0) {
            tmp.push(this.triangleOfEdge(opposite))
        }
        else{
            tmp.push(-1)
        }
    }
    const adjacentTriangles =[
      tmp[2],
      tmp[0],
      tmp[1],
    ] 
    return adjacentTriangles
  }
  getCoord(list){
    const coord = []
    for(let i=0;i<list.length;i++){
      coord[i]=this.points[list[i]]
    }
    return coord
  }
  findTriangle(point){
    const triangles = this.triangles
    for(let i=0; i<triangles.length; i++){
      const t = triangles[i]
      const triangle = this.getCoord(t)
      const flag = innerTriangle(triangle, point)
      if(flag){
        return i
      }
    }
  }
  getBarycentricCoord(triangleId, point){
    const triangles = this.triangles
    const tri = triangles[triangleId]
    const t = this.getCoord(tri)
    const Ax = t[0][0]
    const Ay = t[0][1]
    const Bx = t[1][0]
    const By = t[1][1]
    const Cx = t[2][0]
    const Cy = t[2][1]
    const Px = point[0]
    const Py = point[1]

    const det = (Ax-Cx)*(By-Cy)-(Bx-Cx)*(Ay-Cy)
    const alpha = ((By-Cy)*(Px-Cx)+(Cx-Bx)*(Py-Cy))/det
    const beta  = ((Cy-Ay)*(Px-Cx)+(Ax-Cx)*(Py-Cy))/det
    const gamma= 1-alpha-beta 
    const coord = [alpha, beta, gamma]
    return coord
  }
}
