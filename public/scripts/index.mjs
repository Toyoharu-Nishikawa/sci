import * as sci from "./sci/index.mjs"

"use strict"

console.log("start broyden method test")

const x0 = [1.1, 1.1] 
const f = (x)=>{
  return [
    x[0]**2-x[1]**2,
    2*x[0]**2-2*x[1]**3,
  ]
}

const invB0=[
  [1.153846154, -0.34965035],
  [0.699300699, -0.34965035],
]

const result = sci.solve.broydenMethod(x0,f,invB0, 10, 1E-5)
console.log(result)
console.log("test finished")
