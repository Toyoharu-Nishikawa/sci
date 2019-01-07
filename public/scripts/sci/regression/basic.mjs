import * as matrix from "../matrix/index.mjs"
import * as solve from "../solve/index.mjs"
import * as statistics from "../statistics/index.mjs"

"use strict"

export const singleRegression = (x, y)=>{
  const X = x.map(v=>[v,1])
  const Xt = matrix.transpose(X) 
  const XtX = matrix.mulMatMat(Xt,X)
  const Xty = matrix.mulMatVec(Xt,y)
  const w = solve.linEqGauss(XtX, Xty) 
  const f = (x)=>{
    const y = x*w[0]+w[1] 
    return y
  }

  const obj = {
    predict: f,
    parameters: {weight: w}
  }
  return obj
}

export const singleRegressionLoad = (parameters)=>{
  const w = parameters.weight
  const f = (x)=>{
    const y = x*w[0]+w[1] 
    return y
  }

  return f 
}
 
export const multipleRegression = (x, y)=>{
  const X = x.map(v=>v.concat(1))
  const Xt = matrix.transpose(X) 
  const XtX = matrix.mulMatMat(Xt,X)
  const Xty = matrix.mulMatVec(Xt,y)
  const w = solve.linEqGauss(XtX, Xty) 
  const f = (x)=>{
    const y = x.reduce((c,p,i)=>c+p*w[i])+w[w.length-1] 
    return y
  }
  const obj = {
    predict: f,
    parameters: {weight:w}
  }
  return obj 
}

export const multipleRegressionLoad = (parameters)=>{
  const w = parameters.weight
  const f = (x)=>{
    const y = x.reduce((c,p,i)=>c+p*w[i])+w[w.length-1] 
    return y
  }

  return f 
}

