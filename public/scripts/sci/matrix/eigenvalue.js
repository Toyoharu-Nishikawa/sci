import {normalizeVec,vectorProduct, absVec} from "./matrix.js"
import {solveQuadraticEquation} from "../solve/quadraticEquation.js"
import {solveCubicEquation} from "../solve/cubicEquation.js"
import {linEqGauss} from "../solve/linearEquation.js"

export const solveEigenvalue2D = (A) => {
  const a = 1
  const b = -(A[0][0]+A[1][1])  
  const c = (A[0][0]*A[1][1]-A[0][1]*A[1][0])  

  const ans = solveQuadraticEquation(a,b,c)
  const eigenvalues = ans.solutions
  const numberOfRealSolutions = ans.numberOfRealSolutions
  if(numberOfRealSolutions==2){
    const eigenvectors = eigenvalues.map(v=>{
      const u0tmp = A[0][1]
      const u1tmp = v-A[0][0]
      const l = Math.sqrt(u0tmp**2+u1tmp**2)
      const u0 = u0tmp/l1
      const u1 = u1tmp/l1
      const u = [u0, u1]
      return u
    })
    const P = [
      [eigenvectors[0][0],eigenvectors[1][0] ],
      [eigenvectors[0][1],eigenvectors[1][1] ],
    ] 
    const D = [
      [eigenvalues[0],  0           ],
      [0,             eigenvalues[1]],
    ]
    const diagonalizable = true
    const isRealNumberEigenvalue = true
    const ans = {
      eigenvalues,
      eigenvectors,
      P,D,
      diagonalizable,
      isRealNumberEigenvalue,
    }
    return ans
  }
  else if(numberOfRealSolutions==1){
    const diagonalizable = Math.abs(A[0][1])<Number.EPSILON&&Math.abs(A[1][0])<Number.EPSILON
    const isRealNumberEigenvalue = true
    if(diagonalizable){
      const eigenvector = [
        [1,0],
        [0,1],
      ]
      const P = [
        [1,0],
        [0,1],
      ]
      const D = [
        [eigenvalues[0],  0           ],
        [0,             eigenvalues[1]],
      ]
      const ans = {
        eigenvalues,
        eigenvectors,
        P,D,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
    else{
      const ans = {
        eigenvalues,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
  }
  else{
    const diagonalizable = true
    const isRealNumberEigenvalue = false
    const ans = {
      eigenvalues,
      diagonalizable,
      isRealNumberEigenvalue,
    }
    return ans
  }
}

export const solveEigenvalue3D = (A) => {
  const isDiagonalMatrix =  Math.abs(A[0][1])<Number.EPSILON 
                         && Math.abs(A[0][2])<Number.EPSILON
                         && Math.abs(A[1][0])<Number.EPSILON
                         && Math.abs(A[1][2])<Number.EPSILON
                         && Math.abs(A[2][0])<Number.EPSILON
                         && Math.abs(A[2][1])<Number.EPSILON

  const isOrthogonalMatrix =  A[0][1] == A[1][0]
                           && A[0][2] == A[2][0]
                           && A[1][2] == A[2][1]


  if(isDiagonalMatrix){
    const eigenvalues = [A[0][0],A[1][1],A[2][2]]
    const eigenvectors = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    const P = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    const D = [
      [A[0][0],        0,       0],
      [0       , A[1][1],       0],
      [0       ,       0, A[2][2]],
    ]

    const diagonalizable = true
    const isRealNumberEigenvalue = true
    const ans = {
      eigenvalues,
      eigenvectors,
      P,D,
      diagonalizable,
      isRealNumberEigenvalue,
    }
    return ans
  }

  const a = 1
  const b = -(A[0][0]+A[1][1]+A[2][2])  
  const c = (A[0][0]*A[1][1]-A[0][1]*A[1][0])  
           +(A[1][1]*A[2][2]-A[1][2]*A[2][1])
           +(A[0][0]*A[2][2]-A[0][2]*A[2][0])
  const d = -A[0][0]*A[1][1]*A[2][2]
            -A[0][1]*A[1][2]*A[2][0] 
            -A[0][2]*A[1][0]*A[2][1]
            +A[0][2]*A[1][1]*A[2][0]
            +A[0][1]*A[1][0]*A[2][2]
            +A[0][0]*A[1][2]*A[2][1]

  const ans = solveCubicEquation(a,b,c,d)

  const eigenvalues = ans.solutions

  const numberOfRealSolutions = ans.numberOfRealSolutions
  const numberOfImaginarySolutions = ans.numberOfImaginarySolutions
  const multiplicities = ans.multiplicities
  if(numberOfRealSolutions==3){
    const eigenvectors = eigenvalues.map(v=>getEigenvectorForSingleSolution(v,A))
    const P = [
      [eigenvectors[0][0], eigenvectors[1][0], eigenvectors[2][0]],
      [eigenvectors[0][1], eigenvectors[1][1], eigenvectors[2][1]],
      [eigenvectors[0][2], eigenvectors[1][2], eigenvectors[2][2]],
    ] 
    const D = [
      [eigenvalues[0], 0             ,              0],
      [0,              eigenvalues[1],              0],
      [0,                           0, eigenvalues[2]],
    ]
    const diagonalizable = true
    const isRealNumberEigenvalue = true
    const ans = {
      eigenvalues,
      eigenvectors,
      P,D,
      diagonalizable,
      isRealNumberEigenvalue,
    }
    return ans
  }
  else if(numberOfRealSolutions==2){
    let eigenvectors = null 
    if(multiplicities[0]==1){
      const u0 = getEigenvectorForSingleSolution(eigenvalues[0], A)
      const [u1,u2] = getEigenvectorsForDoubleSolution(eigenvalues[1], A)
      eigenvectors = [u0,u1,u2]
    }
    else{
      const [u0,u1] = getEigenvectorsForDoubleSolution(eigenvalues[0], A)
      const u2 = getEigenvectorForSingleSolution(eigenvalues[2], A)
      eigenvectors = [u0,u1,u2]
    }
    const P = [
      [eigenvectors[0][0], eigenvectors[1][0], eigenvectors[2][0]],
      [eigenvectors[0][1], eigenvectors[1][1], eigenvectors[2][1]],
      [eigenvectors[0][2], eigenvectors[1][2], eigenvectors[2][2]],
    ] 
    const D = [
      [eigenvalues[0], 0             ,              0],
      [0,              eigenvalues[1],              0],
      [0,                           0, eigenvalues[2]],
    ]

    const diagonalizable = true
    const isRealNumberEigenvalue = true
    const ans = {
      eigenvalues,
      eigenvectors,
      P,D,
      diagonalizable,
      isRealNumberEigenvalue,
    }
    return ans
  }
  else if(numberOfRealSolutions==1&&numberOfImaginarySolutions==0){
    const diagonalizable = isOrthogonalMatrix 
    const isRealNumberEigenvalue = true
    if(isOrthogonalMatrix){
      const eigenvectors = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
      ]
      const P = [
        [1,0,0],
        [0,1,0],
        [0,0,1],
      ]
      const D = [
        [eigenvalues[0], 0             ,              0],
        [0,              eigenvalues[1],              0],
        [0,                           0, eigenvalues[2]],
      ]
      const ans = {
        eigenvalues,
        eigenvectors,
        P,D,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
    else{
      const ans = {
        eigenvalues,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
  }
  else{
    if(isOrthogonalMatrix){
      //deal with numerical error
      const absEigenvalue = eigenvalues[1].abs
      const u0 = getEigenvectorForSingleSolution(eigenvalues[0], A)
      const [u1,u2] = getEigenvectorsForDoubleSolution(absEigenvalue, A)
      const eigenvectors = [u0,u1,u2]

      const P = [
        [eigenvectors[0][0], eigenvectors[1][0], eigenvectors[2][0]],
        [eigenvectors[0][1], eigenvectors[1][1], eigenvectors[2][1]],
        [eigenvectors[0][2], eigenvectors[1][2], eigenvectors[2][2]],
      ] 
      const D = [
        [eigenvalues[0], 0            ,             0],
        [0,              absEigenvalue,             0],
        [0,                          0, absEigenvalue],
      ]
  
      const eigenvaluesCorrected = [eigenvalues[0],absEigenvalue,absEigenvalue]
      const diagonalizable = true
      const isRealNumberEigenvalue = true
      const ans = {
        eigenvalues: eigenvaluesCorrected,
        eigenvectors,
        P,D,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
    else{
      const diagonalizable = true
      const isRealNumberEigenvalue = false
      const ans = {
        eigenvalues,
        diagonalizable,
        isRealNumberEigenvalue,
      }
      return ans
    }
  }
}

const getEigenvectorForSingleSolution = (v, A) =>{
  const B = [
    [v-A[0][0],  -A[0][1], -A[0][2]], 
    [ -A[1][0], v-A[1][1], -A[1][2]], 
    [ -A[2][0],  -A[2][1], v-A[2][2]], 
  ]
  const B0 = B[0]
  const B1 = B[1]
  const B2 = B[2]

  const areaVec0 = vectorProduct(B0,B1)
  const areaVec1 = vectorProduct(B1,B2)
  const areaVec2 = vectorProduct(B2,B0)
  const area0 = absVec(areaVec0)
  const area1 = absVec(areaVec1)
  const area2 = absVec(areaVec2)

  const utmp = area2<=area0 && area1<=area0? 
      [
        B[0][1]*B[1][2] - B[0][2]*B[1][1],
        B[0][2]*B[1][0] - B[0][0]*B[1][2],
        B[0][0]*B[1][1] - B[0][1]*B[1][0],
      ]:
    area0<=area1 && area2<=area1? 
      [
        B[1][1]*B[2][2] - B[1][2]*B[2][1],
        B[1][2]*B[2][0] - B[1][0]*B[2][2],
        B[1][0]*B[2][1] - B[1][1]*B[2][0],
      ]:
      [
        B[0][1]*B[2][2] - B[0][2]*B[2][1],
        B[0][2]*B[2][0] - B[0][0]*B[2][2],
        B[0][0]*B[2][1] - B[0][1]*B[2][0],
      ]


  const u = normalizeVec(utmp) 

  return u

}

const getEigenvectorsForDoubleSolution = (v, A) =>{
  const a0 = v-A[0][0]
  const a1 = -A[0][1]
  const a2 = -A[0][2]


  if(Math.abs(a1)<Number.EPSILON&&Math.abs(a2)<Number.EPSILON){
    const u = [0,1,0]
    const w = [0,0,1]
    const U = [u,w]
    return U
  }
  else{
    const u1tmp = -a2
    const u2tmp =  a1
    const l = Math.sqrt(u1tmp**2+u2tmp**2)
    const u0 = 0 
    const u1 = u1tmp/l
    const u2 = u2tmp/l

    const u = [u0, u1, u2]

    const wtmp = [
      a1**2+a2**2,
      -a0*a1,
      -a0*a2
    ] 
    const ll = Math.sqrt(wtmp.reduce((p,c)=>p+c**2,0))
    const w = wtmp.map(x=>x/ll)

    const U = [u,w]

    return U

  }
}



