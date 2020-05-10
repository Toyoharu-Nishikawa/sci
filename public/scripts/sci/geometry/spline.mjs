import {makeN} from "../interpolate/bspline.mjs"
import {linEqGauss} from "../solve/linearEquation.mjs"

const checkSchoenbergWhitneyCondition = (pointsLength, knotsLength, order) => {
  const flag = knotsLength - (pointsLength + order) === 0
  try{
    if(!flag){
      throw new RangeError("length of knots must be equal to x.length + degree + 1") 
    }
  }
  catch(e){
   console.log(e.name +" : " + e.message)
  }

  return flag
}

export const makeKnots = (num, order, type="openUniformKnots") => {
  // default knot vector is open uniform

  switch(type){
    default : {
      const knots =  [].concat(
          [...Array(order)].fill(0),
          [...Array(num-order)].map((v,i)=>(i+1)),
          [...Array(order)].fill(num-order+1)
        )
      return knots
    }
  }
}

export const bsplineBasis = (knots, degree=3,  normalizedFlag=true) => {
  // default knot vector is open uniform
  const order = degree+1
  const min = knots[0]
  const max = knots[knots.length-1]
  if(normalizedFlag){
    return (t)=>{  // 0 <= t <=1
      const s = min + t * (max - min)
      const N = makeN(knots, order,  s)
      return N
    } 
  }
  else{
    return (s)=>{  // knots[0] <= s <=knots[knots.length-1]
      const N = makeN(knots, order, s)
      return N
    } 
  }
}

export const bspline = (points, degree=3, k) =>{
  // default knot vector is open uniform
  const num = points.length
  const order = degree + 1
  if(k){
    const pointsLength = points.length
    const knotsLength = k.length
    checkSchoenbergWhitneyCondition(pointsLength, knotsLength, order)
  }
  const knots = k || makeKnots(num, order, "openUniformKnots")
  const bN = bsplineBasis(knots, degree,  true)

  return (t)=>{  // 0 <= t <=1
    const N = bN(t) 
    const x = N.reduce((p, c, i)=>p+c*points[i][0],0)
    const y = N.reduce((p, c, i)=>p+c*points[i][1],0)
    return [x, y] 
  }
}


export const nurbs = (points, degree=3, w, k) =>{
  // default knot vector is open uniform
  const num = points.length
  const order = degree + 1

  if(k){
    const pointsLength = points.length
    const knotsLength = k.length
    checkSchoenbergWhitneyCondition(pointsLength, knotsLength, order)
  }

  const knots = k || makeKnots(num, order, "openUniformKnots")
  const bN = bsplineBasis(knots, degree,  true)
  const W =  w || [...Array(num)].fill(1)

  return (t)=>{  // 0 <= t <=1
    const N = bN(t)
    const NW = N.reduce((p,c,i)=>p+c*W[i],0)
    const x = N.reduce((p, c, i)=>p+c*W[i]*points[i][0],0)/NW
    const y = N.reduce((p, c, i)=>p+c*W[i]*points[i][1],0)/NW
    return [x, y] 
  }
}

export const bezier = (points) => {
  const num = points.length
  const degree = num -1
  const func = bspline(points, degree)
  return func
}


