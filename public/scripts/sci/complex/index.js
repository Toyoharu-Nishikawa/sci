const Complex = class {
  constructor(re, im){
    this.re  = re
    this.im  = im
    
    const abs = Math.sqrt(re**2 + im**2) 
    const arg = Math.atan2(im,re)  
    this.abs = abs
    this.arg = arg
  }
  add(z){
    if(typeof z ==="number" && Number.isFinite(z)){
      const re = this.re + z
      const im = this.im
      return new Complex(re,im)
    }
    else if(z instanceof Complex){
      const re = this.re + z.re    
      const im = this.im + z.im
      return new Complex(re,im)
    }
    else{
      return null
    }
  } 
  subtract(z){
    if(typeof z ==="number" && Number.isFinite(z)){
      const re = this.re - z
      const im = this.im
      return new Complex(re,im)
    }
    else if(z instanceof Complex){
      const re = this.re - z.re    
      const im = this.im - z.im
      return new Complex(re,im)
    }
    else{
      return null
    }   
  }
  multiply(z){
    if(typeof z ==="number" && Number.isFinite(z)){
      const re = this.re * z
      const im = this.im * z
      return new Complex(re,im)
    }
    else if(z instanceof Complex){
      const re = this.re * z.re - this.im*z.im
      const im = this.re * z.im + this.im*z.re 
      return new Complex(re,im)
    }
    else{
      return null
    }   
  }
  divide(z){
    if(typeof z ==="number" && Number.isFinite(z)){
      const re = this.re / z
      const im = this.im / z
      return new Complex(re,im)
    }
    else if(z instanceof Complex){
      const re = (this.re * z.re + this.im*z.im)/(z.re**2+z.im**2)
      const im = (this.im*z.re - this.re*z.im)/(z.re**2+z.im**2)
      return new Complex(re,im)
    }
    else{
      return null
    }   
  }
  pow(z, n=0){
    if(typeof z ==="number" && Number.isFinite(z)){
      const abs = Math.pow(this.abs, z) 
      const arg = this.arg*z 
      const re = abs * Math.cos(arg)
      const im = abs * Math.sin(arg)
      return new Complex(re,im)
    }
    else if(z instanceof Complex){
      const abs = Math.pow(this.abs, z.re)*Math.exp(2*Math.PI*z.re*n-z.im*this.arg)
      const arg = z.re*Math.arg + z.im*Math.log(this.abs) + 2*Math.PI*z.im*n 
      const re = abs * Math.cos(arg)
      const im = abs * Math.sin(arg)
      return new Complex(re,im)
    }
    else{
      return null
    }   
  }
  exp(){
    const abs = Math.exp(this.re)
    const arg = this.im 
    const re = abs * Math.cos(arg)
    const im = abs * Math.sin(arg)
    return new Complex(re,im)
  }
  log(n=0){
    const re = this.abs 
    const im = this.arg + 2*Math.PI*n
    return new Complex(re,im)
  }
  sqrt(returnAll=false){
    const abs = Math.sqrt(this.abs)
    if(!returnAll){
      const arg = this.arg/2 

      const re = abs * Math.cos(arg)
      const im = abs * Math.sin(arg)
      return new Complex(re,im)
    }
    else{
      const arg1 = this.arg/2 
      const re1 = abs * Math.cos(arg1)
      const im1 = abs * Math.sin(arg1)
      const comp1 = new Complex(re1,im1)
      
      const arg2 = this.arg/2 + Math.PI
      const re2 = abs * Math.cos(arg2)
      const im2 = abs * Math.sin(arg2)
      const comp2 = new Complex(re2,im2)
      
      const compList = [comp1, comp2]
      return compList
    }
  }
  cbrt(returnAll=false){
    const abs = Math.cbrt(this.abs)
    if(!returnAll){
      const arg = this.arg/3
      const re = abs * Math.cos(arg)
      const im = abs * Math.sin(arg)
      return new Complex(re,im)
    }
    else{
      const arg1 = this.arg/3
      const re1 = abs * Math.cos(arg1)
      const im1 = abs * Math.sin(arg1)
      const comp1 = new Complex(re1,im1)
      
      const arg2 = this.arg/3 + 2*Math.PI/3
      const re2 = abs * Math.cos(arg2)
      const im2 = abs * Math.sin(arg2)
      const comp2 = new Complex(re2,im2)
      
      const arg3 = this.arg/3 + 4*Math.PI/3
      const re3 = abs * Math.cos(arg3)
      const im3 = abs * Math.sin(arg3)
      const comp3 = new Complex(re3,im3)
 
      const compList = [comp1, comp2, comp3]
      return compList
    }
  }
}

export const set = (a,b) => {
  return new Complex(a,b)
}

export const add = (...zList) => {
  const ini = set(0,0) 
  const z3 = zList.reduce((p,c)=>p.add(c),ini) 
  return z3
}

export const subtract = (z1, z2) => {
  const z1New = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
                 z1 instanceof Complex                         ? z1        :
                                                                 null 
  const z3 = z1New.subtract(z2) 
  return z3
}

export const multiply = (...zList) => {
  const ini = set(1,0) 
  const z3 = zList.reduce((p,c)=>p.multiply(c),ini) 
  return z3
}

export const devide = (z1, z2) => {
  const z1New = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
                 z1 instanceof Complex                         ? z1        :
                                                                 null 
  const z3 = z1New.devide(z2) 
  return z3
}

export const pow = (z1, z2, n=0) => {
  const z1New = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
                 z1 instanceof Complex                         ? z1        :
                                                                 null 
  const z3 = z1New.pow(z2, n) 
  return z3
}


export const exp = (z1)=>{
  const z2 = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
              z1 instanceof Complex                         ? z1        :
                                                              null 
  const z3 = z2.exp()
  return z3
}

export const log = (z1, n=0) => {
  const z2 = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
              z1 instanceof Complex                         ? z1        :
                                                              null 
  const z3 = z2.log(n)
  return z3
} 

export const sqrt = (z1, returnAll=false) => {
  const z2 = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
              z1 instanceof Complex                         ? z1        :
                                                              null 
  const z3 = z2.sqrt(returnAll)
  return z3

} 

export const cbrt = (z1, returnAll=false) => {
  const z2 = (typeof z1 ==="number" && Number.isFinite(z1)) ? set(z1,0) :
              z1 instanceof Complex                         ? z1        :
                                                              null 
  const z3 = z2.cbrt(returnAll)
  return z3
} 

