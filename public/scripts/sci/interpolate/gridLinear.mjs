import {innerTriangle, delaunayTriangulation} from "../geometry/delaunayTriangulation.mjs"

const triangleInterpolate = (p1, p2, p3) => {
  return p4 => {
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

    const z = p1[2] + s[0]*(p2[2]-p1[2]) + s[1]*(p3[2]-p1[2])
    
    return z
  }
}

const searchTriangle = (triangles, point) => {
  for(let i=0; i<triangles.length; i++){
    const flag = innerTriangle(triangles[i], point)
    if(flag){
      return triangles[i]
    }
  }
}


export const gridLinear = points=> {
  const triangles = delaunayTriangulation(points)
  return point => {
    const targetTriangle = searchTriangle(triangles, point)  
    const interp = triangleInterpolate(...targetTriangle)
    const z = interp(point)

    return z
  }
}
