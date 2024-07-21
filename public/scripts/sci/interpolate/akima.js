const calcQ = (m0,m1,m2,m3,m4,method) => {
  const w1_t = method=="makima" ? Math.abs(m1-m0)+Math.abs(m1+m0)/2 :
                                  Math.abs(m1-m0)
  const w1_b = method=="makima" ? Math.abs(m3-m2)+Math.abs(m3+m2)/2 :
                                  Math.abs(m3-m2)                    
  const w2_t = method=="makima" ? Math.abs(m4-m3)+Math.abs(m4+m3)/2 :
                                  Math.abs(m4-m3)                    
  const w2_b = method=="makima" ? Math.abs(m2-m1)+Math.abs(m2+m1)/2 :
                                  Math.abs(m2-m1)
  let q1
  if(w1_t==w1_b){
    q1=(m1-m2)/2
  }        
  else if(w1_b==0 && w1_t!=0){
    q1 = 0
  }
  else{
    const w1 = w1_t/w1_b
    q1 = (m1-m2)/(1+w1)
  }

  let q2
  if(w2_t == w2_b){
    q2 = (m3-m2)/2
  }
  else if(w2_b==0 && w2_t!=0){
    q2=0
  }
  else{
    const w2 = w2_t/w2_b
    q2 = (m3-m2)/(1+w2)
  }

  const obj = {q1,q2}
  return obj
}

export const akima = (x,y,method="akima") => {
  const N = x.length
   
  const newX_L2 =   x[0]+x[1]-x[2]
  const newX_L1 =  -x[2]+2*x[0]
  const m0 = (y[1]-y[0])/(x[1]-x[0])
  const m1 = (y[2]-y[1])/(x[2]-x[1])
  const newY_L2 = y[0]-(x[0]-newX_L2)*(-m1+2*m0)
  const newY_L1 = newY_L2-(newX_L2-newX_L1)*(-2*m1+3*m0)
  
  const newX_R1 = -x[N-3]+  x[N-2]+x[N-1]
  const newX_R2 = -x[N-3]+2*x[N-1]
  const mn_2 = (y[N-3]-y[N-2])/(x[N-3]-x[N-2])
  const mn_1 = (y[N-2]-y[N-1])/(x[N-2]-x[N-1])
  const newY_R1 = y[N-1] +(newX_R1-x[N-1])*(2*mn_1-mn_2)
  const newY_R2 = newY_R1 +(newX_R2-newX_R1)*(3*mn_1-2*mn_2)
  
  const newX = [newX_L1, newX_L2, ...x, newX_R1, newX_R2]
  const newY = [newY_L1, newY_L2, ...y, newY_R1, newY_R2]
  
  const calcParams = (x_) => {  
    const indexTmp = newX.reduce((pre,current,i)=>current <= x_ ? i: pre,0)
    const i = indexTmp < 2 ? 2:
              indexTmp > N ? N:
              indexTmp

    const x0 = newX[i-2]
    const x1 = newX[i-1]
    const x2 = newX[i]
    const x3 = newX[i+1]
    const x4 = newX[i+2]
    const x5 = newX[i+3]

    const y0 = newY[i-2]
    const y1 = newY[i-1]
    const y2 = newY[i]
    const y3 = newY[i+1]
    const y4 = newY[i+2]
    const y5 = newY[i+3]

    const m0 = (y1-y0)/(x1-x0)
    const m1 = (y2-y1)/(x2-x1)
    const m2 = (y3-y2)/(x3-x2)
    const m3 = (y4-y3)/(x4-x3)
    const m4 = (y5-y4)/(x5-x4)
    const objQ = calcQ(m0,m1,m2,m3,m4,method) 
    const q1 = objQ.q1
    const q2 = objQ.q2

    const a0 = y2
    const a1 = q1+m2
    const a2 = -(2*q1+q2)/(x3-x2)
    const a3 = (q1+q2) /(x3-x2)**2
    
    const obj = {a0,a1,a2,a3,x2}
    return obj
  }

  const f = (x_) => {
    const {a0,a1,a2,a3,x2} = calcParams(x_)
    const y_ = a0+a1*(x_-x2)+a2*(x_-x2)**2+a3*(x_-x2)**3
    return y_
  }
  const df = (x_) => {
    const {a1,a2,a3,x2} = calcParams(x_)
    const dy_ = a1+2*a2*(x_-x2)+3*a3*(x_-x2)**2
    return dy_
  }
  
  const obj = {f,df}
  return obj
 
}
