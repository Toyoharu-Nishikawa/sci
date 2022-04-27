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
  const f = (x) => x.reduce((p,c,i)=>p+c*w[i],0)+w[w.length-1] 
  const obj = {
    predict: f,
    parameters: {weight:w}
  }
  return obj 
}

export const multipleRegressionLoad = (parameters)=>{
  const w = parameters.weight
  const f = (x)=> x.reduce((p,c,i)=>p+c*w[i],0) + w[w.length-1] 

  return f 
}

const makePolyList = (x, n)=>[...Array(n)].map((v,i)=>x**(i+1))

const polynominalize = (degree)=>{
  return list => {
    const data = list.map((v,i)=>makePolyList(v, degree))
    const res =  [].concat(...data)
    return res
  }
}

export const polynominalRegression = (x, y, degree=1)=>{
  const x2 = x.map(v=>makePolyList(v, degree))
 
  const X = x2.map(v=>v.concat(1))
  const Xt = matrix.transpose(X) 
  const XtX = matrix.mulMatMat(Xt,X)
  const Xty = matrix.mulMatVec(Xt,y)
  const w = solve.linEqGauss(XtX, Xty) 

  const f = (x0) => makePolyList(x0, degree).reduce((p,c,i)=>p+c*w[i],0)+w[w.length-1] 
  const obj = {
    predict: f,
    parameters: {
      degree: degree,
      weight:w,
    }
  }
  return obj 
}

export const polynominalRegressionLoad = (parameters)=>{
  const degree = parameters.degree
  const w = parameters.weight

  const f = (x0) => makePolyList(x0,degree).reduce((p,c,i)=>p+c*w[i],0)+w[w.length-1] 

  return f 
}

