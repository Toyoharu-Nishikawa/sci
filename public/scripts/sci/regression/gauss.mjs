"use strict"

const gaussKernel(x1, x2, beta)=>{
  if(!Array.isArray(x1) && !Array.isArray(x2)){
    const k = Math.exp(-beta*(x1-x2)**2)
    return k
  }
  else if(Array.isArray(x1) && Array.isArray(x2)){
    const d = x1.reduce((p,c,i)=>p+(c-x2[i])**2)
    const k = Math.exp(-beta*d)
    return k
  }
  else{
    throw new Error(`gaussKernel arguments error.Both of them must be array or float ${x1} ${x2}`)
  }
}
/*
const gramMatrix(x)=>{
  const matrix = x.map((v,i,arr)=>)
  const gram = (i,j)=>{
     
  }
  return gram
}
*/
export const gaussKernelRegression(x,y,beta=0.1,rammda=0.01)=>{
   

}
