import * as complex from "../complex/index.js"

export const solveCubicEquation = (b,c,d) => {
  const f = x  => x**3 + b*x**2 + c*x + d
  const D = b**2 - 3*c

  if(D>0){
    const x21 = -b - Math.sqrt(D)
    const x22 = -b + Math.sqrt(D)
    const y21 = f(x21)
    const y22 = f(x22)
    const d = y21*y22
    if(d>0){
      const ans = solveCubicEquationSimplely(1,b,c,d)
    }
    else if(d<0){
      const ans = solveCubicEquationSimplely(1,b,c,d)
    }
    else{
      if(y21===0){
        const x0 = -2*x21-b
      }
      else{
        const x0 = -2*x22-b
      }
    }
  }
  else if(D<0){
    const ans = solveCubicEquationSimplely(1,b,c,d)
  }
  else{
    if(y21===0){
      const x0 = x21 
    }
    else{
    }
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
