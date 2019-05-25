import *  as matrix from "../matrix/index.mjs"
import * as optimize from "../optimize/index.mjs"
import * as solve from "../solve/index.mjs"
import * as basic from "./basic.mjs"



const estimate = (mag)=> mag[0]*mag[1]<0 ? 1 : -1

const makeCalcDeltaR = (p, pSpline, sSpline) =>{
  return (s)=>{
    const res = basic.getCrossPointOfCurveNormals(p,pSpline,s, sSpline) 
    const deltaR = res.Rp -res.Rs
    return deltaR
  }
}

const getCandidateOfDividingPoint = (p, pSpline, sSpline, start, end, N)=>{
  const getVal = s => basic.getCrossPointOfCurveNormals(p, pSpline, s,sSpline).mag
  const d = (end - start)/N
  const val = [...Array(N+1)].map((v,i)=>[start+d*i, estimate(getVal(start+d*i))])
  const candidateList = val.filter(v=>v[1]>0)
  const ave = list => list.reduce((p,c)=>p+c[0],0)/list.length
  const candidate = candidateList.length>0?ave(candidateList): start 
  return candidate 
}

const getSearchRange = (p, pSpline, s, sSpline)=>{
  const pointObjOfP = basic.getPointObject(p, pSpline)
  const dP = pointObjOfP.normal 
  
  const pointObjOfS = basic.getPointObject(s, sSpline)
  const dS = pointObjOfS.normal 
  const dPAbs = Math.sqrt(dP[0]**2+dP[1]**2)
  const dSAbs = Math.sqrt(dS[0]**2+dS[1]**2)
  const vectorProduct = (dP[0]*dS[1] - dP[1]*dS[0])
  const sine = vectorProduct/(dPAbs*dSAbs)
  const range = Math.abs(sine)
  return range 
}

const minimizeDistance = (C, sSpline, sIni,alpha, maxIteration, tolerance)=>{
  const f = s=>{
    const S = basic.getPointObject(s, sSpline).point
    const CS = matrix.subVec(C,S)
    const absCS = matrix.absVec(CS)
    return absCS
  }  
  const x0 = sIni
  const y0 = f(x0)
  const dt = x0<1-tolerance ? tolerance : -tolerance
  const y1 = f(x0+dt)
  const dfdx0 = (y1-y0)/dt 
  let res = null
  for(let a of alpha){
    res = optimize.gradientDescent(x0, f, dfdx0, a, tolerance, maxIteration)
    if(res.converged){break}
  }
  const s = res.value
  const distance = f(s)
  const obj = {
    converged: res.converged,
    s: s,
    distance: distance
  }
  return obj
}

const makeErrorFunc = (p, pSpline, sSpline, sIni,alpha, maxIteration, tolerance)=>{
  return t =>{ 
    const pObj = basic.getPointObject(p, pSpline)
    const P = pObj.point
    const dP = pObj.normal
    const ddP = matrix.mulScalarVec(t, dP)
    const distance1 = matrix.absVec(ddP)
    const C = matrix.addVec(P, matrix.mulScalarVec(t, dP)) 
    const res = minimizeDistance(C, sSpline, sIni,alpha, maxIteration, tolerance)

    //console.log(res.converged)
    const distance2 = res.distance
    const error = distance2 - distance1
    return error
  }
} 

const crossPointMethod = (s0, pF, N, p, pSpline, sSpline,maxIteration, tolerance)=>{

  const f = makeCalcDeltaR(p, pSpline, sSpline)
  const x0 = s0 
  const dt = x0< 1-tolerance ? tolerance : -tolerance
  const y0 = f(x0)
  const y1 = f(x0+dt)
  const dfdx0 = (y1-y0)/dt
  let res = solve.lineSplitMethod(x0, f, dfdx0, maxIteration, tolerance)

  if(!res.converged){
    const dR = pF.crossFlag ? getSearchRange(p, pSpline, pF.t, sSpline) :0
    const start = pF.crossFlag ? Math.max(pF.t -dR, 0):0
    const end = pF.crossFlag ? Math.min(pF.t + dR, 1) :1
    const x0 = getCandidateOfDividingPoint(p,pSpline, sSpline,start, end, N)
    const dt = x0< 1-tolerance ? tolerance : -tolerance
    const y0 = f(x0)
    const y1 = f(x0+dt)
    const dfdx0 = (y1-y0)/dt
    res = solve.lineSplitMethod(x0, f, dfdx0, maxIteration, tolerance)
  }

  if(!res.converged){
    const obj = {
      converged: false
    }
    return obj 
  }
  
  const s = res.value 
  if(s<0 || 1<s){
     const obj = {
      converged: false
    }
    return obj 
  }
  const crossPoint = basic.getCrossPointOfCurveNormals(p, pSpline, s, sSpline)
  const obj = {
    converged: true,
    p:p,
    s:s,
    C: crossPoint.C,
    S: crossPoint.S,
    P: crossPoint.P,
    dP: crossPoint.dP,
    dS: crossPoint.dS,
    radius:crossPoint.Rp, 
    pMag: crossPoint.mag[0],
    sMag: crossPoint.mag[1],
  }
  return obj 
}

const minimizeMethod = (pF, pMag0, alpha, p, pSpline, sSpline,  maxIteration, tolerance)=>{
  const pObj = basic.getPointObject(p, pSpline)
  const P = pObj.point
  const dP = pObj.normal
  const sIni = pF.crossFlag ? pF.t : p 
  const f = makeErrorFunc(p, pSpline, sSpline, sIni, alpha, maxIteration, tolerance)
  const x0 = pF.crossFlag ? pF.magVec/2: 
             pMag0 ? pMag0 : 0.1 
  const y0 = f(x0)
  const y1 = f(x0+tolerance)
  const dfdx0 = (y1-y0)/tolerance
  const res = solve.lineSplitMethod(x0, f, dfdx0, maxIteration, tolerance)

  if(!res.converged){
    const obj = {
     converged: false
    }
    return obj 
  } 
  const t = res.value 
  const C = matrix.addVec(P, matrix.mulScalarVec(t, dP)) 
  const res2 = minimizeDistance(C, sSpline, sIni,alpha, maxIteration, tolerance)
  const s = res2.s
  if(!res2.converged || s<0 || 1<s){
     const obj = {
      converged: false
    }
    return obj 
  }
  const sObj = basic.getPointObject(s, sSpline)
  const S = sObj.point
  const dS = sObj.normal

  const radius = matrix.absVec(matrix.subVec(C,P)) 
  const CP = [C[0]-P[0], C[1]-P[1]]
  const CS = [C[0]-S[0], C[1]-S[1]]
  const CPdotdP = matrix.innerProductVec(CP, dP)
  const CSdotdS = matrix.innerProductVec(CS, dS)
  const tp = matrix.absVec(CP)/matrix.absVec(dP)*Math.sign(CPdotdP) 
  const ts = matrix.absVec(CS)/matrix.absVec(dS)*Math.sign(CSdotdS) 
  const mag = [tp, ts]
 
  const obj = {
    converged:true,
    p:p,
    s:s,
    C: C,
    S: S,
    P: P,
    dP: dP,
    dS: dS,
    radius:radius, 
    pMag: mag[0],
    sMag: mag[1],
  }
  return obj
}

const makeDoubleMiniError = (P, dP, sSpline)=>{
  return (x)=>{
    const t =x[0]
    const s =x[1]
    const C = matrix.addVec(P, matrix.mulScalarVec(t, dP))
    const sObj = basic.getPointObject(s, sSpline)
    const S = sObj.point
    const dS = sObj.normal
    const R1 = Math.abs(t)*matrix.absVec(dP)
    const SC = matrix.subVec(C, S)
    const R2 = matrix.absVec(SC)
    const distance = R2- R1
    const dSabs = matrix.absVec(dS)
    const SCabs = matrix.absVec(SC)
    const cos = matrix.innerProductVec(SC,dS)/(dSabs*SCabs)
    const target = cos -1
    const error = [distance, target]
    return error
  }
}

const doubleMinimizeMethod = (pF, pMag0, p, pSpline, sSpline,  maxIteration, tolerance)=>{
  const pObj = basic.getPointObject(p, pSpline)
  const P = pObj.point
  const dP = pObj.normal


  const t0 = pF.crossFlag ? pF.magVec/2: 
             pMag0 ? pMag0 : 0.1 

  const s0 = pF.crossFlag ? pF.t : p 
  const f = makeDoubleMiniError(P, dP, sSpline)
  const x0 = [t0, s0]
  const y0 = f([t0, s0])
  const y1 = f([t0+tolerance, s0])
  const y2 = f([t0, s0+tolerance])
  const dddt0 = (y1[0]-y0[0])/tolerance
  const dvpdt0 = (y1[1]-y0[1])/tolerance
  const ddds0 = (y2[0]-y0[0])/tolerance
  const dvpds0 = (y2[1]-y0[1])/tolerance
  const B0 = [
    [dddt0, dvpdt0],
    [ddds0, dvpds0],
  ]
  //console.log(x0,y0,B0)
  const invB0 = matrix.invMat(B0)
  const res = solve.broydenMethod(x0, f, invB0, maxIteration, tolerance)
  //console.log(res)
  const t = res.value[0]
  const s = res.value[1]
  if(!res.converged || s<0 || 1<s){
    const obj = {
     converged: false
    }
    return obj 
  } 
  const C = matrix.addVec(P, matrix.mulScalarVec(t, dP)) 
 
  const sObj = basic.getPointObject(s, sSpline)
  const S = sObj.point
  const dS = sObj.normal

  const radius = matrix.absVec(matrix.subVec(C,P)) 
  const CP = [C[0]-P[0], C[1]-P[1]]
  const CS = [C[0]-S[0], C[1]-S[1]]
  const CPdotdP = matrix.innerProductVec(CP, dP)
  const CSdotdS = matrix.innerProductVec(CS, dS)
  const tp = matrix.absVec(CP)/matrix.absVec(dP)*Math.sign(CPdotdP) 
  const ts = matrix.absVec(CS)/matrix.absVec(dS)*Math.sign(CSdotdS) 
  const mag = [tp, ts]
 
  const obj = {
    converged:true,
    p:p,
    s:s,
    C: C,
    S: S,
    P: P,
    dP: dP,
    dS: dS,
    radius:radius, 
    pMag: mag[0],
    sMag: mag[1],
  }
  return obj
}

const fitting = (pF, pMag0,s0,  p, pSpline, sSpline, N,alpha,
                                  maxIteration, tolerance) =>{
  if(pF.crossFlag){
    const s = pF.t
    const dP = pF.dP
    const sObj = basic.getPointObject(s, sSpline) 
    const dS = sObj.normal
    const vectorProduct = dP[0]*dS[1] - dP[1]*dS[0]
    const sine = vectorProduct/ (matrix.absVec(dP)*matrix.absVec(dS))
    const flag = Math.abs(sine) < Math.sin(3/180*Math.PI)
    if(flag){
      const res = doubleMinimizeMethod(pF, pMag0,  p, pSpline, sSpline,  maxIteration, tolerance)
      if(res.converged){
        //console.log("doubleMinimizeMethod 1 converged")
        return res
      }
      //console.log("doubleMinimizeMethod 1 diverged")

      const res2 = minimizeMethod(pF, pMag0, alpha, p, pSpline, sSpline,
                                                  maxIteration, tolerance)
      if(res2.converged){
       // console.log("minimizeMethod 1 converged")
        return res2
      }
      //console.log("minimizeMethod 1 diverged")
      const res3 = crossPointMethod(s0,pF, N, p, pSpline, sSpline,
                                          maxIteration, tolerance)
      //console.log("crossMethod 1")
      return res3
    }
    else{
      //console.log("sin", Math.asin(sine)*180/Math.PI)
      //console.log("s", s)
      const res = crossPointMethod(s0,pF, N, p, pSpline, sSpline,maxIteration, tolerance)
      if(res.converged){
       // console.log("crossMethod 2 converged")
        return res
      }
      //console.log("crossMethod 2 diverged")
      const res2 =doubleMinimizeMethod(pF, pMag0, p, pSpline, sSpline,
                                                maxIteration, tolerance)
       if(res2.converged){
        //console.log("double minimizeMethod 2 converged")
        return res2
      }
      //console.log("doubleMinimizeMethod 2 diverged")
      const res3 =minimizeMethod(pF, pMag0, alpha, p, pSpline, sSpline,
                                                maxIteration, tolerance)

      //console.log("minimizeMethod 2")
      return res3
    }
  }
  else{
    const res = crossPointMethod(s0,pF, N, p, pSpline, sSpline,
                                       maxIteration, tolerance)
    if(res.converged){
      //console.log("crossMethod 3 converged")
      return res
    }
    //console.log("crossMethod 3 diverged")
    const res2 =doubleMinimizeMethod(pF, pMag0, p, pSpline, sSpline,
                                                maxIteration, tolerance)
    if(res2.converged){
      //console.log("doubleminimizeMethod 3 converged")
      return res2
    }
    //console.log("doubleminimizeMethod 3 diverged")
    const res3 =minimizeMethod(pF, pMag0, alpha, p, pSpline, sSpline,
                                                maxIteration, tolerance)

    //console.log("minimizeMethod 3")
    return res3
  }

}

export const getFittingCircleOfCurves = (p, pSpline, sSpline, 
                             N=100, alpha=[0.001], pMag0=0.1,s0=0, 
                              maxIteration=30, tolerance=1E-5) => {
  const pObj = basic.getPointObject(p, pSpline)
  const P = pObj.point
  const dP = pObj.normal
  const pF = basic.getPerdendicularFootOfCurves(p,pSpline,sSpline, s0, maxIteration, tolerance)
  const res = fitting(pF, pMag0, s0,  p, pSpline, sSpline, N,alpha, 
                                        maxIteration, tolerance) 
  return res
}


export const getFittingCirclesOfCurves=(pSpline, sSpline, divisions=10, N=100, alpha=[0.001], pMagIni=0.1, sIni=0,maxIteration=30, tolerance=1E-5)=>{

  const getFittingCircleCurried = (p, pMag0,s0) =>
    getFittingCircleOfCurves(p, pSpline, sSpline, N, alpha, pMag0,s0, maxIteration, tolerance)
  
  const pMag0List = [pMagIni]
  const s0List = [sIni]
  const fittingCircles = [...Array(divisions+1)].map((v,i)=>{
    //console.log("iteraion",i)
    const pMag0 =  pMag0List[i] 
    const s0 =  s0List[i] 
    const fittingCircle = getFittingCircleCurried(i/divisions, pMag0,s0)
    pMag0List.push(fittingCircle.pMag)
    s0List.push(fittingCircle.s)
    return fittingCircle
  })
  return fittingCircles 
}

