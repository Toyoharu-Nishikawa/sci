import {makeN} from "../interpolate/bspline.mjs"

export const makeKnots = (k, n, order) => {
  const knots = typeof k !=="undefined" ? k:
    [].concat(
      [...Array(order)].fill(0),
      [...Array(n-order)].map((v,i)=>(i+1)),
      [...Array(order)].fill(n-order+1)
    )
  return knots
}

export const bspline = (points, degree=3, k) =>{
  const order = degree+1
  const num = points.length 
  const knots = makeKnots(k, num, order)
  try{
    if(knots.length !== num + order){
      throw new RangeError("length of knots must be equal to x.length + degree + 1") 
    }
  }
  catch(e){
   console.log(e.name +" : " + e.message)
  }
  return (t)=>{  // 0 <= t <=1
    const s = t * (num-order+1)
    const N = makeN(knots, order,num, s)
    const x = N.reduce((pre, current, i)=>pre+current*points[i][0],0)
    const y = N.reduce((pre, current, i)=>pre+current*points[i][1],0)
    return [x, y] 
  }
}

export const bezier = (points) => {
  const num = points.length
  const degree = num -1
  const func = bspline(points, degree)
  return func
}
