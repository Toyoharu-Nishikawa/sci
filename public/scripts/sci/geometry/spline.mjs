import {makeN} from "../interpolate/bspline.mjs"

export const makeKnots = (k, n, order) => {
  // default knot vector is open uniform
  const knots = typeof k !=="undefined" ? k:
    [].concat(
      [...Array(order)].fill(0),
      [...Array(n-order)].map((v,i)=>(i+1)),
      [...Array(order)].fill(n-order+1)
    )
  return knots
}

export const bsplineBasis = (points, degree=3, k, normalizedFlag=true) => {
  // default knot vector is open uniform
  const order = degree+1
  const num = points.length 
  const knotsLength = k.length
  const knots = makeKnots(k, num, order)
  const min = knots[0]
  const max = knots[knotsLength-1]
  try{
    if(knotsLength !== num + order){
      throw new RangeError("length of knots must be equal to x.length + degree + 1") 
    }
  }
  catch(e){
   console.log(e.name +" : " + e.message)
  }
  if(normalizedFlag){
    return (t)=>{  // 0 <= t <=1
      const s = min + t * (max - min)
      const N = makeN(knots, order,num, s)
      return N
    } 
  }
  else{
    return (s)=>{  // knots[0] <= s <=knots[knots.length-1]
      const N = makeN(knots, order,num, s)
      return N
    } 
  }
}

export const bspline = (points, degree=3, k) =>{
  // default knot vector is open uniform
  const order = degree+1
  const num = points.length 
  const knotsLength = k.length
  const knots = makeKnots(k, num, order)
  const min = knots[0]
  const max = knots[knotsLength-1]
  try{
    if(knotsLength !== num + order){
      throw new RangeError("length of knots must be equal to x.length + degree + 1") 
    }
  }
  catch(e){
   console.log(e.name +" : " + e.message)
  }
  return (t)=>{  // 0 <= t <=1
    const s = min + t * (max - min)
    const N = makeN(knots, order,num, s)
    const x = N.reduce((pre, current, i)=>pre+current*points[i][0],0)
    const y = N.reduce((pre, current, i)=>pre+current*points[i][1],0)
    return [x, y] 
  }
}


export const nurbs = (points, degree=3, w, k) =>{
  // default knot vector is open uniform


  const order = degree+1
  const num = points.length 
  const knotsLength = k.length
  const knots = makeKnots(k, num, order)

  const W = typeof w !=="undefined" ? w: [...Array(num)].fill(1)

  const min = knots[0]
  const max = knots[knotsLength-1]
  try{
    if(knotsLength !== num + order){
      throw new RangeError("length of knots must be equal to x.length + degree + 1") 
    }
  }
  catch(e){
   console.log(e.name +" : " + e.message)
  }
  return (t)=>{  // 0 <= t <=1
    const s = min + t * (max - min)
    const N = makeN(knots, order,num, s)
    const NW = N.reduce((p,c,i)=>p+c*W[i],0)
    const x = N.reduce((pre, current, i)=>pre+current*W[i]*points[i][0],0)/NW
    const y = N.reduce((pre, current, i)=>pre+current*W[i]*points[i][1],0)/NW
    return [x, y] 
  }
}

export const bezier = (points) => {
  const num = points.length
  const degree = num -1
  const func = bspline(points, degree)
  return func
}


