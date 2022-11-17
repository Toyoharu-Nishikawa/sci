"use strict"

const makeRotFunc = theta => P => [
  Math.cos(theta) * P[0] - Math.sin(theta) * P[1],
  Math.sin(theta) * P[0] + Math.cos(theta) * P[1],
]

export const calcAreaOfPolygon = points =>{
 const Ai = points.map( (v, i,arr)=> i>0 ? 
    (arr[i-1][0]*v[1]-arr[i-1][1]*v[0])/2:
    (arr[arr.length-1][0]*v[1]-arr[arr.length-1][1]*v[0])/2
  )  
  const A = Ai.reduce((p,c)=>p+c,0)
  
  return A
}

export const getCentroid = points => {
  const Ai = points.map( (v, i,arr)=> i>0 ? 
    (arr[i-1][0]*v[1]-arr[i-1][1]*v[0])/2:
    (arr[arr.length-1][0]*v[1]-arr[arr.length-1][1]*v[0])/2
  )  
  
  const Xi = points.map( (v, i,arr)=> i>0 ? 
    Ai[i]*(v[0]+arr[i-1][0])/3:
    Ai[i]*(v[0]+arr[arr.length-1][0])/3
  )  
  
  const Yi = points.map( (v, i,arr)=> i>0 ? 
    Ai[i]*(v[1]+arr[i-1][1])/3:
    Ai[i]*(v[1]+arr[arr.length-1][1])/3
  )  
  
  const A = Ai.reduce((p,c)=>p+c,0)
  const X = Xi.reduce((p,c)=>p+c,0)
  const Y = Yi.reduce((p,c)=>p+c,0)
  
  const x = X/A
  const y = Y/A
  
  const centroid = [x, y]
  
  return centroid
}

/**
  *calculate moment of inertial for traingle by using Green's theorem
  *@param {Array}
  *@param {Array}
  *@return {Object}
  */
const calcMomentOfInertiaOfAreaOfTriangle = (P1, P2) => {
  const x1 = P1[0]  
  const y1 = P1[1]  
  const x2 = P2[0]  
  const y2 = P2[1]  

  const Sx = 1/3 * x1 * y1**2
    - 1/3 * x2 * y2**2
    + 1/3 * (y2**2 + y2*y1 + y1**2) * (x2 - x1) 
    - 1/2 * (y2 + y1) * (y1*x2 - y2*x1)

  const Sy = -1/3 * x1**2 * y1
    + 1/3 * x2**2 * y2
    - 1/3 * (x2**2 + x2*x1 + x1**2) * (y2 - y1) 
    + 1/2 * (x2 + x1) * (x1*y2 - x2*y1)
 

  const Ix = 1/4 * x1 * y1**3  
    - 1/4 * x2 * y2**3
    + 1/4 * (y2**2 + y1**2) * (y2 + y1) * (x2 - x1) 
    - 1/3 * (y2**2 + y2*y1 + y1**2) * (y1*x2 - y2*x1) 
 
  const Iy = -1/4 * x1**3 * y1  
    + 1/4 * x2**3 * y2
    - 1/4 * (x2**2 + x1**2) * (x2 + x1) * (y2 - y1) 
    + 1/3 * (x2**2 + x2*x1 + x1**2) * (x1*y2 - x2*y1)

  const Ixy = 1/24 * (
      x1**2 * y2**2 - x2**2 * y1**2
      + 2* x1 * x2 * (y2**2 - y1**2)
      - 2* y1 * y2 * (x2**2 - x1**2)
    )    

  const Ixx = 1/5 * x1 * y1**4 
    - 1/5 * x2 * y2**4
    + 1/5 * (y2**4 + y2**3*y1 + y2**2*y1**2 + y2*y1**3 + y1**4) * (x2 - x1) 
    - 1/4 * (y2**2 + y1**2) * (y2 + y1) * (y1*x2 - y2*x1) 
 
   const Iyy = -1/5 * x1**4 * y1 
    + 1/5 * x2**4 * y2
    - 1/5 * (x2**4 + x2**3*x1 + x2**2*x1**2 + x2*x1**3 + x1**4) * (y2 - y1) 
    + 1/4 * (x2**2 + x1**2) * (x2 + x1) * (x1*y2 - x2*y1) 
    
  const momentOfInertiaOfArea = {
    Sx: Sx,
    Sy: Sy,
    Ix: Ix,
    Iy: Iy,
    Ixy: Ixy,
    Ixx: Ixx,
    Iyy: Iyy,
  }
  return momentOfInertiaOfArea
} 

const calcMomentOfInertiaOfArea = points => {
  const momentOfInertiaOfAreaOfTriangles = points.map((v,i,arr)=>{
    const P1 = i>0? arr[i-1]: arr[arr.length-1]
    const P2 = v 
    const momentOfInertiaOfArea = calcMomentOfInertiaOfAreaOfTriangle(P1, P2)
    return momentOfInertiaOfArea
  })
  
  const Sxi  = momentOfInertiaOfAreaOfTriangles.map(v=>v.Sx)
  const Syi  = momentOfInertiaOfAreaOfTriangles.map(v=>v.Sy)
  const Ixi  = momentOfInertiaOfAreaOfTriangles.map(v=>v.Ix)
  const Iyi  = momentOfInertiaOfAreaOfTriangles.map(v=>v.Iy)
  const Ixyi = momentOfInertiaOfAreaOfTriangles.map(v=>v.Ixy)
  const Ixxi = momentOfInertiaOfAreaOfTriangles.map(v=>v.Ixx)
  const Iyyi = momentOfInertiaOfAreaOfTriangles.map(v=>v.Iyy)
  
  
  const Sx  = Sxi.reduce((p,c)=>p+c,0)
  const Sy  = Syi.reduce((p,c)=>p+c,0)
  const Ix  = Ixi.reduce((p,c)=>p+c,0)
  const Iy  = Iyi.reduce((p,c)=>p+c,0)
  const Ixy  = Ixyi.reduce((p,c)=>p+c,0)
  const Ixx  = Ixxi.reduce((p,c)=>p+c,0)
  const Iyy  = Iyyi.reduce((p,c)=>p+c,0)
 
  const momentOfInertiaOfArea = {
    Sx : Sx,
    Sy : Sy,
    Ix : Ix,
    Iy : Iy,
    Ixy: Ixy,
    Ixx: Ixx,
    Iyy: Iyy,
  }
  return momentOfInertiaOfArea
}

const calcPrincipalMomentOfInertiaOfArea =(Ix, Iy, Ixy) => {
  const alpha = Math.atan2(-2*Ixy, Ix - Iy)/2

  const Ixm = 1/2 * (Ix + Iy) + 1/2 * Math.sqrt((Ix - Iy)**2 + 4 * Ixy**2)
  const Iym = 1/2 * (Ix + Iy) - 1/2 * Math.sqrt((Ix - Iy)**2 + 4 * Ixy**2)
  
  const principalMomentOfInertiaOfArea = {
    alpha: alpha,    
    Ipx: Ixm,    
    Ipy: Iym,    
  }
  
  return principalMomentOfInertiaOfArea
} 

export const calcSpecOfPolygon = points => {
  const area = calcAreaOfPolygon(points)
  const centroid = getCentroid(points)
  const momentOfInertiaOfArea = calcMomentOfInertiaOfArea(points)
  const Sx = momentOfInertiaOfArea.Sx
  const Sy = momentOfInertiaOfArea.Sy
  const Imx = momentOfInertiaOfArea.Ix
  const Imy = momentOfInertiaOfArea.Iy
  const Imxy = momentOfInertiaOfArea.Ixy
  const Imxx = momentOfInertiaOfArea.Ixx
  const Imyy = momentOfInertiaOfArea.Iyy

  const [cx, cy] = centroid
  const Ix = Imx - cy**2 * area 
  const Iy = Imy - cx**2 * area 
  const Ixy = Imxy - cx * cy * area 
  const Ixx = Imxx -(cy**3 * area + 3*cy*Ix) 
  const Iyy = Imyy -(cx**3 * area + 3*cx*Iy) 
  
  const principalMomentOfInertiaOfArea = calcPrincipalMomentOfInertiaOfArea(Ix, Iy, Ixy)
  const {alpha,Ipx, Ipy } = principalMomentOfInertiaOfArea
  
  const rotAlpha = makeRotFunc(alpha)
  const xaxis = [1, 0]
  const yaxis = [0, 1] 
  
  const Xaxis = rotAlpha(xaxis)
  const Yaxis = rotAlpha(yaxis)
  
  const spec = {
    area: area,
    centroid: centroid,
    Sx: Sx,
    Sy: Sy,
    Ix: Ix,
    Iy: Iy,
    Ixy: Ixy,
    Ixx: Ixx,
    Iyy: Iyy,
    Imx: Imx,
    Imy: Imy,
    Imxy: Imxy,
    Imxx: Imxx,
    Imyy: Imyy,
    Ipx: Ipx,
    Ipy: Ipy,
    alpha: alpha,
    Xaxis: Xaxis,
    Yaxis: Yaxis,
  }
  return spec
}


const calcMomentOfInertiaOfSolidOfRevolution = (P1, P2) => {
  const x1 = P1[0]  
  const y1 = P1[1]  
  const x2 = P2[0]  
  const y2 = P2[1]  


  const IxxTmp = 1/5 * x1 * y1**4 
    - 1/5 * x2 * y2**4
    + 1/5 * (y2**4 + y2**3*y1 + y2**2*y1**2 + y2*y1**3 + y1**4) * (x2 - x1) 
    - 1/4 * (y2**2 + y1**2) * (y2 + y1) * (y1*x2 - y2*x1) 
 
  const IyyTmp1 =  -1/10 * x1**3 * y1**2
    + 1/10 * x2**3 * y2**2
    - 1/60 * (y1**2 + 3*y1*y2 + 6*y2**2) * (x2 - x1)**3
    - 1/12 * (y1**2 + 2*y1*y2 + 3*y2**2) * (x2 - x1)**2 * x1
    - 1/6  * (y1**2 +   y1*y2 +   y2**2) * (x2 - x1)    * x1**2

  const IyyTmp2 = 1/5 * x1 * y1**4 
    - 1/5 * x2 * y2**4
    + 1/5 * (y2**4 + y2**3*y1 + y2**2*y1**2 + y2*y1**3 + y1**4) * (x2 - x1) 
    - 1/4 * (y2**2 + y1**2) * (y2 + y1) * (y1*x2 - y2*x1) 
 
  const Ixx = 2*Math.PI * IxxTmp
  const Iyy = 2*Math.PI * IyyTmp1 + Math.PI * IyyTmp2

  const obj = {Ixx, Iyy}
  return obj
}

const calcMomentOfInertiaOfAxisymmetricBody = points => {
  const properties = points.map((v,i,arr)=>{
    const P1 = i>0? arr[i-1]: arr[arr.length-1]
    const P2 = v 
    const momentOfInertiaOfBody = calcMomentOfInertiaOfSolidOfRevolution(P1, P2)
    return momentOfInertiaOfBody 
  })
  
  const Ixxi = properties.map(v=>v.Ixx)
  const Iyyi = properties.map(v=>v.Iyy)
  
  const Ixx  = Ixxi.reduce((p,c)=>p+c,0)
  const Iyy  = Iyyi.reduce((p,c)=>p+c,0)

  const obj = {Ixx, Iyy}
  return obj
}
 
export const calcSpecOfAxisymmetricBody = (points) => {
  const sectionArea = calcAreaOfPolygon(points)
  const centroidOfSection = getCentroid(points)

  const sectionProperty = calcMomentOfInertiaOfArea(points)

  const cxS = centroidOfSection[0]
  const cyS = centroidOfSection[1]


  const centroidOfCrossSection = [cxS, cyS]
  const areaOfCrossSection = sectionArea

  const volume = 2*Math.PI * cyS * sectionArea
  const cxB = sectionProperty.Ixy /(cyS * sectionArea)
  const centroid = [cxB, 0, 0]

  const property = calcMomentOfInertiaOfAxisymmetricBody(points)
  const Imxx = property.Ixx
  const Imyy = property.Iyy
  const Imzz = Imyy

  const Ixx = Imxx
  const Iyy = Imyy - cxB**2 * volume 
  const Izz = Iyy

  const obj = {
    centroidOfCrossSection,
    areaOfCrossSection ,
    centroid,
    volume,
    Ixx,
    Iyy,
    Izz,
    Imxx,
    Imyy,
    Imzz,
  }
  return obj
}
