

const getRandomInt = (max)=> Math.floor(Math.random() * Math.floor(max));

const sumOfSqure = (x1, x2)=> x1.map((v,i)=>v-x2[i]).reduce((p,c)=>p+c**2,0)

const makeGaussKernel = (beta)=> (x1, x2)=> Math.exp(-beta*sumOfSqure(x1,x2))  

export const SVM = (x, y, beta=0.1, C=100, maxIteration=30, tolerance=1E-5)=>{
  const kernel = makeGaussKernel(beta)

  const originK = x.map((v,i,arr)=>[].concat(
    [...Array(i)].map((u,j)=>kernel(v,arr[j])),
    1
  ))

  const K = (i,j)=> i<j ? originK[j][i]: originK[i][j]

  const N = x.length
  const a = [...Array(N)].fill(0)

  let b = 0
  let count = 0 

  const fi = (i)=> a.map((v,j)=>v*y[j]*K(j,i)).reduce((p,c)=>p+c,0)+b

  while(count < maxIteration){
    let numChangedAlphas = 0
    for(let i=0;i<N;i++){
      const Ei = fi(i) -y[i]
      const yEi = y[i]*Ei
      if( (yEi < -tolerance && a[i]<C) || (yEi > tolerance && a[i]>0) ){
        const j = getRandomInt(N)
        const Ej = fi(j) -y[j] 
        const ai = a[i]
        const aj = a[j]
        const L = y[i] !==y[j] ? Math.max(0, aj-ai):Math.max(0, aj+ai-C)
        const H = y[i] !==y[j] ? Math.min(C, C+aj-ai):Math.min(C, aj+ai)
        if(L===H){
          continue
        }
        const eta = 2*K(i,j)-K(i,i)-K(j,j)
        if(eta >=0){
          continue
        }
        const ajTemp = aj - y[j]*(Ei-Ej)/eta 
        const ajNew = ajTemp > H ? H :
                      ajTemp < L ? L: 
                      ajTemp
        if(Math.abs(ajNew-aj)<1E-5){
          continue
        }
        const aiNew = ai + y[i]*y[j]*(aj-ajNew)
        const b1 = b-Ei-y[i]*(aiNew-ai)*K(i,i)-y[j]*(ajNew-aj)*K(i,j)
        const b2 = b-Ej-y[i]*(aiNew-ai)*K(i,j)-y[j]*(ajNew-aj)*K(j,j)
        b = (0< aiNew && aiNew < C) ? b1 :
            (0< ajNew && ajNew < C) ? b2 :
            (b1+b2)/2
        a[i] = aiNew
        a[j] = ajNew
        numChangedAlphas++
      }
    }
    if(numChangedAlphas==0){
      count++
    }
    else{
      count = 0
    }
  }

  const alpha = a.filter(v=> v>0)
  const X = x.filter((v,i)=> a[i]>0)
  const Y = y.filter((v,i)=> a[i]>0)
  const f = (t)=> alpha.map((v,i)=>v*Y[i]*kernel(X[i],t)).reduce((p,c)=>p+c,0)+b
  return {
    predict: f,
    parameters: {alpha:alpha, b:b, beta:beta, x:X, y:Y}  
  }
}

export const SVMLoad = (parameters)=>{
  const a = parameters.alpha
  const b = parameters.b
  const beta = parameters.beta
  const x = parameters.x
  const y = parameters.y
 
  const kernel = makeGaussKernel(beta)
  const f = (t)=> a.map((v,i)=>v*y[i]*kernel(x[i],t)).reduce((p,c)=>p+c,0)+b
  return f
} 
