import * as complex from "../complex/index.js"

export const solveQuadraticEquation = (a,b,c) => {
  if(Math.abs(a) <=Number.EPSILON){
    return null
  }
  const a1 = -b/(2*a)
  const dis = b**2 -4*a*c 

  if(Math.abs(dis) <=Number.EPSILON){
    const x0 = a1
    const x1 = x0
    const x = [x0,x1]
    const multiplicity = [2,2]
    const ans = {
      message: "one double solution",
      discriminantValue: dis,
      numberOfRealSolution: 1,
      numberOfImaginarySolution: 0,
      multiplicity: multiplicity,
      solutions:x,
    }
    return ans
  }
  else if(dis<0){
    const a2= Math.sqrt(-dis)/2
    const x0 = complex.set(a1, a2)
    const x1 = complex.set(a1, -a2)

    const x = [x0,x1]
    const multiplicity = [1,1]
    const ans = {
      message: "two imaginary solutions",
      discriminantValue: dis,
      numberOfRealSolution: 0,
      numberOfImaginarySolution: 2,
      multiplicity: multiplicity,
      solutions:x,
    }
    return ans
  }
  else {
    const a2= Math.sqrt(dis)/2
    const x0 = a1 - a2
    const x1 = a1 + a2

    const x = [x0,x1]
    const multiplicity = [1,1]
    const ans = {
      message: "two real solutions",
      discriminantValue: dis,
      numberOfRealSolution: 2,
      numberOfImaginarySolution: 0,
      multiplicity: multiplicity,
      solutions:x,
    }
    return ans
  }
}
