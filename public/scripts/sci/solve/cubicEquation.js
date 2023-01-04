import * as complex from "../complex/index.js"

const get_cubic_root = (x) => {
  if (x >= 0.0) {
    return Math.cbrt(x)
  }
  else {
    return -Math.cbrt(-x)
  }
}

export const solveCubicEquation = (a,b,c,d) => {
  if(Math.abs(a) <=Number.EPSILON){
    return null
  }

  const a1 = b / (3 * a)
  const a2 = c / a
  const a3 = d / a
  const p = a1**2 - a2 / 3
  const q = (a1 * (a2 - 2 * a1**2) - a3) / 2
  const dis = p**3 - q**2

  if (Math.abs(dis) <=Number.EPSILON) {
    const r = get_cubic_root(q)
    const x0 = 2 * r - a1
    if(Math.abs(r)<=Number.EPSILON){
      const x1 = x0
      const x2 = x0

      const x = [x0,x1,x2]
      const multiplicities = [3,3,3]
      const ans = {
        message: "one triple solution",
        discriminantValue: dis,
        numberOfRealSolutions: 1,
        numberOfImaginarySolutions: 0,
        multiplicities: multiplicities,
        solutions:x,
      }
      return ans
    }
    else{
      const x1 = -r - a1
      const x2 = x1
      const x = x0<x1 ? [x0,x1,x2] : [x1,x2,x0]
      const multiplicities = x0<x1 ? [1,2,2] :[2,2,1]
      const ans = {
        message: "one real solution and one double solution",
        discriminantValue: dis,
        numberOfRealSolutions: 2,
        numberOfImaginarySolutions: 0,
        multiplicities: multiplicities,
        solutions:x,
      }
      return ans
    }
  }
  else if (dis < 0.0) {
    const qq = q >= 0.0 ? get_cubic_root(q + Math.sqrt(-dis)):
                          get_cubic_root(q - Math.sqrt(-dis))

    const pp = p / qq
    const re = -(qq + pp) / 2 - a1
    const im = (Math.abs(qq - pp) * Math.sqrt(3.0)) / 2


    const x0 = qq + pp - a1
    const x1 = complex.set(re, im)
    const x2 = complex.set(re, -im)
    const x = [x0,x1,x2]
    const multiplicities = [1,1,1]

    const ans = {
      message: "one real solution and two imaginary solutions",
      discriminantValue: dis,
      numberOfRealSolutions: 1,
      numberOfImaginarySolutions: 2,
      multiplicities: multiplicities,
      solutions:x,
    }
    return ans
  }
  else {
    const r = Math.sqrt(p)
    const t = Math.acos(q / (p * r))
    const r2 = 2*r
    const PI = Math.PI
    const x0 = r2 * Math.cos(t / 3) - a1
    const x1 = r2 * Math.cos((t + 2 * PI) / 3) - a1
    const x2 = r2 * Math.cos((t + 4 * PI) / 3) - a1

    const x = [x0,x1,x2].sort()
    const multiplicities = [1,1,1]
    const ans = {
      message: "three real solutions",
      discriminantValue: dis,
      numberOfRealSolutions: 3,
      numberOfImaginarySolutions: 0,
      multiplicities: multiplicities,
      solutions:x,
    }
    return ans
  }
}

const solveCubicEquationSimplely = (a,b,c,d) => {
  const p = (-1*b**2+3*a*c)/(9*a**2)
  const q = (2*b**3-9*a*b*c+27*a**2*d)/(54*a**3)
  
  const ini = -b/(3*a)
  
  const w  = complex.set(-0.5,Math.sqrt(3)/2 )
  const w2 = complex.set(-0.5,-Math.sqrt(3)/2 )
  
  const r = q**2 + p**3 
  const s = complex.sqrt(r) 
  
  const u = complex.add(-q, s)
  const v = complex.subtract(-q, s)
  

  const u_3 = complex.cbrt(u)
  const v_3 = complex.cbrt(v)


 
  const wu_3  = complex.multiply(w, u_3)
  const w2u_3 = complex.multiply(w2, u_3)
  
  const wv_3  = complex.multiply(w, v_3)
  const w2v_3 = complex.multiply(w2, v_3)

  const x1_t = complex.add(u_3, v_3)
  const x2_t = complex.add(wu_3, w2v_3)
  const x3_t = complex.add(w2u_3, wv_3)
  
  const x1 = complex.add(ini, x1_t)
  const x2 = complex.add(ini, x2_t)
  const x3 = complex.add(ini, x3_t)
  
  const list = [x1,x2,x3]
  return list
}
