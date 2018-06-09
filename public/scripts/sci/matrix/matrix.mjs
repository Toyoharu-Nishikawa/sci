

//vector
export const mulScalarVec=(a, x0)=>{
  const y=x0.map(x=>x*a)
  return y
}

export const addVec = (x0,x1)=>{
  const y= x0.map((a,i)=>a+x1[i]) 
  return y
}

export const subVec = (x0,x1)=>{
  const y= x0.map((a,i)=>a-x1[i]) 
  return y
}

export const absVec = (x0)=>{
  const a2 = x0.reduce((pre,current)=>pre+current**2,0) 
  const a = Math.sqrt(a2)
  return a
}

export const innerProductVec=(x0,x1)=>{
  const y = x0.reduce((pre,current,i)=>pre+current*x1[i],0) 
  return y
}

//matrix
export const transpose = A=>A[0].map((k,i)=>A.map((v)=>v[i]))

export const mulScalarMat=(a, A)=>{
  const B=A.map(columns=>columns.map(x=>a*x))
  return B 
}

export const addMatMat = (A,B)=>{
  const C= A.map((columns,i)=>columns.map((a,j)=>a+B[i][j])) 
  return C 
}

export const subMatMat = (A,B)=>{
  const C= A.map((columns,i)=>columns.map((a,j)=>a-B[i][j])) 
  return C 
}

export const mulMatMat = (A,B)=>{
  const BT = transpose(B)
  const C = A.map(
    column=>BT.map(
      row=>row.reduce(
        (pre,current,k)=>pre+current*column[k],0
      )
    )
  )
  return C 
}

//matrix and vector
export const mulMatVec = (A,u)=>{
  const v = A.map(column=>column.reduce((pre,current,i)=>pre+current*u[i],0))
  return v
}








