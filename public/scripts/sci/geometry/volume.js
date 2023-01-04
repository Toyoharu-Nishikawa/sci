import {calcSpecOfPolygon} from "./moment.js"
import {normalizeVec,innerProductVec, vectorProduct, addVec, subVec, mulScalarVec,mulMatMat, mulMatVec, absVec,invMat} from "../matrix/index.js"
import {solveEigenvalue3D} from "../matrix/eigenvalue.js"
import {makeQuaternionFromVectors,invQuaternion, 
  createRotationFuncFromQuaternion, quaternionToRotationMatrix} from "../quaternion/index.js"

const calcTriangleSpec = vertices => {
  const areaVecX2 = addVec(vectorProduct(vertices[0],vertices[1]),
                   vectorProduct(vertices[1],vertices[2]),
                   vectorProduct(vertices[2],vertices[0]))
                  
  const areaVec = mulScalarVec(1/2, areaVecX2)
  const area = absVec(areaVec)
  const centroid = mulScalarVec(1/3,addVec(addVec(vertices[0], vertices[1]), vertices[2]))
  const obj = {
    areaVec: areaVec,
    area: area,
    centroid: centroid
  }
  return obj
} 

const calcAreaSpec = vertices => {
  const n = vertices.length
  const triangles = vertices.map((v,i,arr)=>i<2 ? null: [arr[0], arr[i-1], v]).slice(2)
  const trianglesSpec = triangles.map(v=>calcTriangleSpec(v))
  const areaVec = trianglesSpec.reduce((p,c)=>addVec(p, c.areaVec), [0,0,0]) 
  const area = absVec(areaVec) 

  const centroidTmp = trianglesSpec.map(v=>mulScalarVec(innerProductVec(v.areaVec,areaVec), v.centroid))
  const centroidTmp2 = centroidTmp.reduce((p,c)=>addVec(p, c), [0,0,0])
  const centroid = mulScalarVec(1/area**2, centroidTmp2)

  const obj = {
    area: area,
    areaVec: areaVec,
    centroid: centroid,
  }   
  return obj 
}

const calcSpecOfBasicPyramid = (basePoints, apex) => {
  const reversePoints = basePoints.concat().reverse()
  const baseProperty = calcSpecOfPolygon(reversePoints)
  const Ix0 = baseProperty.Ix
  const Iy0 = baseProperty.Iy
  const Ixy0 = baseProperty.Ixy
  const A0 = baseProperty.area

  const [x1,y1,z1] = apex

  const Izz = 1/5*(Ix0+Iy0)*z1
            + 1/30*A0*(x1**2*z1+y1**2*z1)

  const Ixx = 1/5*Ix0*z1
            + 1/30*A0*(z1**3+y1**2*z1)

  const Iyy = 1/5*Iy0*z1
            + 1/30*A0*(z1**3+x1**2*z1)

  const Ixy =-1/5*Ixy0*z1
            - 1/30*x1*y1*z1*A0

  const Iyz = -1/30*y1*z1**2*A0

  const Izx = -1/30*x1*z1**2*A0

  const obj = {
    Ixx, Iyy, Izz, Ixy, Iyz, Izx
  }

  
  return obj
}

const calcSpecOfGeneraizedPyramid = (basePoints)=> {
  const baseProperty = calcAreaSpec(basePoints)
  const baseCentroid = baseProperty.centroid
  const centroid = baseCentroid.map(v=>v*3/4)
  const baseAreaVec = baseProperty.areaVec
  const zAxis = [0,0,-1]

  const volume = innerProductVec(baseCentroid, baseAreaVec)/3

  const q = makeQuaternionFromVectors(zAxis, baseAreaVec)
  const invQ = invQuaternion(q)
  const rotFunc = createRotationFuncFromQuaternion(invQ)
  const counterRotMatrix = quaternionToRotationMatrix(q)
  const rotMatrix = quaternionToRotationMatrix(invQ)
  
  const transferedBasePoints = basePoints.map(v=>[
    v[0]-baseCentroid[0],
    v[1]-baseCentroid[1],
    v[2]-baseCentroid[2],
  ])
  const transferedOrigin = [
    -baseCentroid[0],
    -baseCentroid[1],
    -baseCentroid[2],
  ]

  const basicPoints =  transferedBasePoints.map(v=>rotFunc(v))
  const apex =  rotFunc(transferedOrigin)

  const basicProperty = calcSpecOfBasicPyramid(basicPoints, apex)
  const basicI = [
   [basicProperty.Ixx, basicProperty.Ixy,basicProperty.Izx],
   [basicProperty.Ixy, basicProperty.Iyy,basicProperty.Iyz],
   [basicProperty.Izx, basicProperty.Iyz,basicProperty.Izz],
  ]

  const transferedI = mulMatMat(counterRotMatrix, mulMatMat(basicI, rotMatrix))

  const [cx,cy,cz] = baseCentroid

  const Ixx = transferedI[0][0] + 1/2*(cy**2+cz**2)*volume
  const Iyy = transferedI[1][1] + 1/2*(cx**2+cz**2)*volume
  const Izz = transferedI[2][2] + 1/2*(cx**2+cy**2)*volume
  const Ixy = transferedI[0][1] - 1/2*cx*cy*volume
  const Iyz = transferedI[1][2] - 1/2*cy*cz*volume
  const Izx = transferedI[0][2] - 1/2*cz*cx*volume

  const property = {Ixx, Iyy, Izz, Ixy, Iyz, Izx, centroid, volume}

  return property
}


export const calcPolyhedronSpecFromSurfaces = (surfaceVertices, config={}) => {
    
  const piramidList = surfaceVertices.map(v=>calcSpecOfGeneraizedPyramid (v)) 
  const volume = piramidList.reduce((p,c)=>p+c.volume,0)
  const Imxx = piramidList.reduce((p,c)=>p+c.Ixx,0)
  const Imyy = piramidList.reduce((p,c)=>p+c.Iyy,0)
  const Imzz = piramidList.reduce((p,c)=>p+c.Izz,0)
  const Imxy = piramidList.reduce((p,c)=>p+c.Ixy,0)
  const Imyz = piramidList.reduce((p,c)=>p+c.Iyz,0)
  const Imzx = piramidList.reduce((p,c)=>p+c.Izx,0)
  const weightedCentroidList = piramidList.map((v,i)=>mulScalarVec(v.volume, v.centroid))
  const centroidTmp = weightedCentroidList.reduce((p,c) => addVec(p, c), [0,0,0])
  const centroid = mulScalarVec(1/volume, centroidTmp)

  const [cx,cy,cz] = centroid

  const Ixx = Imxx - (cy**2+cz**2)*volume
  const Iyy = Imyy - (cz**2+cx**2)*volume
  const Izz = Imzz - (cx**2+cy**2)*volume
  const Ixy = Imxy + cx*cy*volume
  const Iyz = Imyz + cy*cz*volume
  const Izx = Imzx + cz*cx*volume

  const A = [
    [Ixx, Ixy, Izx],
    [Ixy, Iyy, Iyz],
    [Izx, Iyz, Izz],
  ]

  const sol = solveEigenvalue3D(A)

  const {P, D,eigenvectors,eigenvalues,diagonalizable} =sol
  if(!diagonalizable){
    const obj = {
      volume,
      centroid,
      Ixx, 
      Iyy,
      Izz,
      Ixy,
      Iyz,
      Izx, 
      Imxx,
      Imyy,
      Imzz,
      Imxy,
      Imyz,
      Imzx,
    }
    return obj 
  }

  const IXX = eigenvalues[0]
  const IYY = eigenvalues[1]
  const IZZ = eigenvalues[2]
  const X = eigenvectors[0]
  const Y = eigenvectors[1]
  const Z = eigenvectors[2]

  const coordinateTransformFunc = u => {
    const v = subVec(u,centroid)
    const w = mulMatVec(P,v)
    return w
  }

  
  const obj = {
    volume,
    centroid,
    Ixx, 
    Iyy,
    Izz,
    Ixy,
    Iyz,
    Izx, 
    Imxx,
    Imyy,
    Imzz,
    Imxy,
    Imyz,
    Imzx,
    IXX,IYY,IZZ,
    X,Y,Z,
    coordinateTransformFunc
  }
  return obj 
}

//export const calcPolyhedronSpecFromSurfaces2 = surfaceVertices => {
//  const surfaceArea = surfaceVertices.map(v=>calcAreaSpec(v)) 
//  const partialVolume = surfaceArea.map(v=>innerProductVec(v.centroid, v.areaVec)/3)
//  const volume = partialVolume.reduce((p,c)=>p+c,0)
//  const centroidList = surfaceArea.map((v,i)=>mulScalarVec(partialVolume[i]*3/4, v.centroid))
//  const centroidTmp = centroidList.reduce((p,c) => addVec(p, c), [0,0,0])
//  const centroid = mulScalarVec(1/volume, centroidTmp)
//  
//  const obj = {
//    volume: volume,
//    centroid: centroid,
//  }
//  return obj 
//}


export const calcTetrahedronSpecFromVertices = (vertices) => {
  const e1 = subVec(vertices[1], vertices[0])
  const e2 = subVec(vertices[2], vertices[0])
  const e3 = subVec(vertices[3], vertices[0])
  const volume = innerProductVec(vectorProduct(e1, e2), e3)/6
  const centroid= mulScalarVec(1/4, addVec(...vertices))
  const obj = {
    volume: volume,
    centroid: centroid,
  }
  return obj 
}

export const calcHexahedronSpecFromVertices = (vertices) => {
  const surfaceVertices = [
    [vertices[0], vertices[1], vertices[2], vertices[3]],
    [vertices[0], vertices[4], vertices[5], vertices[1]],
    [vertices[5], vertices[6], vertices[2], vertices[1]],
    [vertices[6], vertices[7], vertices[3], vertices[2]],
    [vertices[7], vertices[4], vertices[0], vertices[3]],
    [vertices[4], vertices[7], vertices[6], vertices[5]],
  ] 
  
  const spec = calcPolyhedronSpecFromSurfaces(surfaceVertices) 
  return spec
}
