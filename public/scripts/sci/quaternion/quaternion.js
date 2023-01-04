import {normalizeVec, absVec,vectorProduct,innerProductVec} from "../matrix/matrix.js"

export const makeQuaternion = (vec, theta) => {
  const vec2 = normalizeVec(vec)
  const sin = Math.sin(theta/2)
  const cos = Math.cos(theta/2)
  const q0 = vec2[0]*sin
  const q1 = vec2[1]*sin
  const q2 = vec2[2]*sin
  const q3 = cos
  const Q = [q0, q1, q2, q3]
  return Q
}

const makeNormalizedOrthogonalVctor = (vec) => {
  const [x,y,z] = vec
  const u = vec[2] !=0 ? [   1,    0, -x/z]:
            vec[0] !=0 ? [-y/x,    1,    0]:
            vec[1] !=0 ? [   0, -z/y,    1]:
                         [   0,    0,    0]
  const n = normalizeVec(u)
  return n
}

export const makeQuaternionFromVectors = (vec1, vec2) => {
  const cross = vectorProduct(vec1,vec2)
  const dot = innerProductVec(vec1,vec2)
  const absCross = absVec(cross)
  const abs1 = absVec(vec1)
  const abs2 = absVec(vec2)

  const cos = dot/(abs1*abs2)

  const axis = cos == 1 ? [0,0,0] :
               cos ==-1 ? makeNormalizedOrthogonalVctor(vec1):
                          normalizeVec(cross)

  const sin_2 = Math.sqrt((1-cos)/2)
  const cos_2 = Math.sqrt((1+cos)/2)

  const q0 = axis[0]*sin_2
  const q1 = axis[1]*sin_2
  const q2 = axis[2]*sin_2
  const q3 = cos_2

  const Q = [q0, q1, q2, q3]
  return Q
}

export const calcRotationAxisAndAngleFromVectors = (vec1, vec2) => {
  const cross = vectorProduct(vec1,vec2)
  const dot = innerProductVec(vec1,vec2)
  const axis = normalizeVec(cross)
  const abs1 = absVec(vec1)
  const abs2 = absVec(vec2)

  const cos = dot/(abs1*abs2)
  const angle = Math.acos(cos)

  const obj = {axis, angle}

  return obj 
}


export const invQuaternion = q => {
  const invQ = [-q[0], -q[1],-q[2],q[3]]
  return invQ
}

const multiple = (q, p) => {
  const Q = [
    q[3]*p[0] - q[2]*p[1] + q[1]*p[2] + q[0]*p[3],
    q[2]*p[0] + q[3]*p[1] - q[0]*p[2] + q[1]*p[3],
   -q[1]*p[0] + q[0]*p[1] + q[3]*p[2] + q[2]*p[3],
   -q[0]*p[0] - q[1]*p[1] - q[2]*p[2] + q[3]*p[3],
  ]  
  return Q
}

export const mulQQ = (...list) => {
  const e = [0,0,0,1]
  const res = list.reduce((p,c)=>multiple(p,c), e)
  return res
}

export const createRotationFuncFromQuaternion = (q) => {
  return vec => {
    const p = [vec[0],vec[1],vec[2], 0]
    const invQ = invQuaternion(q)
    const u = mulQQ(q,p,invQ)
    const vec2 = [u[0],u[1],u[2]]

    return vec2
  }
}

export const quaternionToRotationMatrix = (q) => {
  const qx =q[0]
  const qy =q[1]
  const qz =q[2]
  const qw =q[3]

  const M00 = qx**2-qy**2-qz**2+qw**2
  const M01 = 2*(qx*qy-qz*qw)
  const M02 = 2*(qx*qz+qy*qw)

  const M10 = 2*(qx*qy+qz*qw)
  const M11 = -1*qx**2+qy**2-qz**2+qw**2
  const M12 = 2*(qy*qz-qx*qw)

  const M20 = 2*(qx*qz-qy*qw)
  const M21 = 2*(qy*qz+qx*qw)
  const M22 = -1*qx**2-qy**2+qz**2+qw**2

  const M = [
    [M00, M01, M02],
    [M10, M11, M12],
    [M20, M21, M22],
  ]

  return M
}
