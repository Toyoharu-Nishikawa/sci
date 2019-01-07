import {modifiedCholeskyDecomposition, modifiedCholeskySolve} from "../solve/linerEquation.mjs"

import {makeGaussKernel} from "../funcs/index.mjs"

"use strict"

export const gaussKernelRegression = (x,y,beta,C)=>{
  const kernel = makeGaussKernel(beta)
  const originK = x.map((v,i,arr)=>[].concat(
    [...Array(i)].map((u,j)=>kernel(v,arr[j])),
    1+1/C
  ))
  const LDLT = modifiedCholeskyDecomposition(originK)  
  const alpha = modifiedCholeskySolve(LDLT.L, LDLT.D, y)
  const f = (t)=> alpha.map((v,i)=>v*kernel(x[i],t)).reduce((p,c)=>p+c,0)
  return {
    predict: f,
    parameters:{alpha: alpha, beta: beta, x:x, y:y}
  } 
}

export const gaussKernelRegressionLoad = (parameters)=>{
  const a = parameters.alpha
  const beta = parameters.beta
  const x = parameters.x
  const y = parameters.y
 
  const kernel = makeGaussKernel(beta)
 
  const f = (t)=> a.map((v,i)=>v*kernel(x[i],t)).reduce((p,c)=>p+c,0)
  return f
} 
