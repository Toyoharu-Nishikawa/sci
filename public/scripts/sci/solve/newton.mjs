import * as matrix from "../matrix/index.mjs"

"use strict"

export const lineSplitMethod = (x0,f,dfdx0,maxIteration,tolerance)=>{
  let x=x0
  let y = f(x)
  let dfdx = dfdx0
  let count=0
  while(count<maxIteration){
    const dx = -y/dfdx
    x +=dx
    const tempY = f(x)
    const dy = tempY-y
    y=tempY
    if(Math.abs(y)<tolerance){
      break
    }
    dfdx =  dy/dx
    count++
  }
  if(count<maxIteration){
    console.log(`lineSplitMethod converged in ${count} iterations`)
  }
  else{
    console.log(`lineSplitMethod diverged over ${count} iterations`)
  }
  const result = {
    converged: count < maxIteration ? true: false,
    error : Math.abs(y),
    count :count,
    value: x,
  }
  return result 
}

export const newtonMethod = (x0, f, invJ, maxIteration,torelance)=>{
  let dx = [0,0] 
  let x = x0
  let y = f(x0) 
  
  let count=0
  while(count<maxIteration){
    dx =mulScalarVec(-1,matrix.mulMatVec(invJ(x), y))
    x = matrix.addVec(x,dx)
    y = f(x) 
    const rem = matrix.absVec(y)
    if(rem<torelance){
      break  
    }
    count++
  }
  if(count<maxIteration){
    console.log(`Newton Method converged in ${count} iterations`)
  }
  else{
    console.log(`Newton Method diverged over ${count} iterations`)
  }

  const result = {
    converged: count < maxIteration ? true: false,
    error : Math.abs(y),
    count :count,
    value: x,
  }
  return result 

}

const calcDeltaB = (dx,dy,invB)=>{
  const Bdy = matrix.mulMatVec(invB, dy) 
  const sub = matrix.subVec(dx,Bdy)
  const dxT = [dx]
  const mul = matrix.mulMatMat(matrix.transpose([sub]), dxT)
  const numerator = matrix.mulMatMat(mul,invB)
  const dxTB = matrix.mulMatMat(dxT, invB)
  const denominator = matrix.innerProductVec(dxTB[0], dy)
  const dB = matrix.mulScalarMat(1/denominator, numerator)
 return dB
}

export const broydenMethod= (x0, f, invB0, maxIteration, torelance)=>{
  let x = x0
  let dx = [0,0] 
  let invB = invB0
  let y = f(x0) 
  let dy = [0,0] 
  
  let count=0
  while(count<maxIteration){
    dx =matrix.mulScalarVec(-1, matrix.mulMatVec(invB, y))
    x = matrix.addVec(x,dx)
    const tempy = f(x) 
    dy = matrix.subVec(tempy,y)
    y = tempy
    const dB = calcDeltaB(dx, dy, invB)
    invB = matrix.addMatMat(invB, dB)
    
    const rem = matrix.absVec(y)
    if(rem<torelance){
      break  
    }
    count++
  }

  if(count<maxIteration){
    console.log(`Newton Method converged in ${count} iterations`)
  }
  else{
    console.log(`Newton Method diverged over ${count} iterations`)
  }

  const result = {
    converged: count < maxIteration ? true: false,
    error : Math.abs(y),
    count :count,
    value: x,
  }
  return result 

}


