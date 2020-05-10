import {  bsplineBasis} from "./spline.mjs"
import {linEqGauss} from "../solve/linearEquation.mjs"

//const makeNormalizedSamplingKnots = (points, knots, order, type="stable") => {
//  switch(type){
//    case "chord":{
//      const l = points.map((v,i,arr)=>i>0?Math.sqrt( (v[0]-arr[i-1][0])**2+(v[1]-arr[i-1][1])**2 ):0)
//      const S = l.reduce((p,c,i)=>i>0?p.concat(p[p.length-1]+c):[c],0)
//      const endS = S[S.length-1]
//      const s = S.map(v=>v/endS)
//      return s
// 
//    }
//    case "square": {
//      const l = points.map((v,i,arr)=>i>0?Math.sqrt( (v[0]-arr[i-1][0])**2+(v[1]-arr[i-1][1])**2 ):0)
//      const lt = l.map(v=>Math.sqrt(v))
//      const S = lt.reduce((p,c,i)=>i>0?p.concat(p[p.length-1]+c):[c],0)
//      const endS = S[S.length-1]
//      const s = S.map(v=>v/endS)
//      return s
//    }
//    case "uniform" :{
//      const num = points.length
//      const s = [...Array(num)].map((v,i)=>i/(num-1))
//      return s
//    }
//    case "stable":
//    default : {
//      const num = points.length
//      const min = knots[0]
//      const max = knots[knots.length-1]
// 
//      const xi = [...Array(num)].map((v,i)=>knots.slice(i+1, i+order).reduce((p,c)=>p+c,0)/(order-1))
//      const s = xi.map(v=> (v-min)/(max-min))
//      return s
//    }
//  }
//}

const makeParameters = (points, type) => {
  const m = points.length -1

  switch(type){
    case "uniform" : {
      const s = [...Array(m+1)].map((v,i)=>i/m)
      return s
    }
    case "chord" : {
      const l = points.map((v,i,arr)=>i>0?Math.sqrt((v[0]-arr[i-1][0])**2+(v[1]-arr[i-1][1])**2):0)
      const sum = l.reduce((p,c,i)=>i>0 ? p.concat(p[p.length-1]+c) : [0], [])
      const total = sum[sum.length-1] 
      const normalized = sum.map(v=>v/total)
      return normalized 
    }
    case "sqrt" : {
      const l = points.map((v,i,arr)=>i>0?Math.sqrt(Math.sqrt((v[0]-arr[i-1][0])**2+(v[1]-arr[i-1][1])**2)):0)
      const sum = l.reduce((p,c,i)=>i>0 ? p.concat(p[p.length-1]+c) : [0], [])
      const total = sum[sum.length-1] 
      const normalized = sum.map(v=>v/total)
      return normalized 
    }
  }
}

const makeKnotVector = (num, degree, parameters, knotType) => {
  const m = num - 1
  const p = degree
  const startKnot = [...Array(degree+1)].fill(0)
  const endKnot = [...Array(degree+1)].fill(1)

  let middleKnot = []

  switch(knotType){
    case "uniform": {
      middleKnot = [...Array(m-p)].map((v,i)=>(i+1)/(m-p+1)) 
      break
    }
    case "average": {
      middleKnot = [...Array(m-p)].map((v,i)=>parameters.slice(i+1, i+p+1).reduce((p,c)=>p+c,0)/p) 
      break
    }
    case "natural":{
      middleKnot = [...Array(m-p)].map((v,i)=>parameters[i+2])
      break
    }
  }

  const knot = [].concat(startKnot, middleKnot, endKnot)
  return knot
}

// @points: nurbs curve fit points
// @type   : uniform, chord or sqrt 
export const getNurbsParameters = (points, parameterType="chord", knotType="average") => {
  const degree = 3
  const num = points.length 
  const order = degree + 1

  const parameters = makeParameters(points, parameterType)
  const knots = makeKnotVector(num, degree, parameters, knotType)

  const W =  [...Array(num)].fill(1)


  const bN = bsplineBasis(knots, degree, true)
         

  const matN = parameters.map(v=>bN(v)) 
  const NW = matN.map(v=>v.reduce((p,c,i)=>p+c*W[i],0))

  const x = points.map((v,i)=>v[0]*NW[i])
  const y = points.map((v,i)=>v[1]*NW[i])


  const ftmp = linEqGauss(matN, x)
  const gtmp = linEqGauss(matN, y)
  const f = ftmp.map((v,i)=>v/W[i])
  const g = gtmp.map((v,i)=>v/W[i])
  const controlPoints = f.map((v,i)=>[v, g[i]])

  const nurbs = (t)=>{  // 0 <= t <=1
    const N = bN(t)
    const NW = N.reduce((p,c,i)=>p+c*W[i],0)
    const x = N.reduce((p, c, i)=>p+c*W[i]*controlPoints[i][0],0)/NW
    const y = N.reduce((p, c, i)=>p+c*W[i]*controlPoints[i][1],0)/NW
    return [x, y] 
  } 

  const obj = {
    points : points,
    controlPoints: controlPoints,
    wights: W,
    knots: knots,
    bsplineFunctionsVector: bN,
    parameters: parameters,
    nurbs: nurbs,
  }
  return obj
}

