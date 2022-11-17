//import * as moment from "../sci/geometry/moment.js"
import * as sci from "../sci/index.js"

const points = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]

const points2 = points.map(v=>[v[0],v[1]+1])

//const spec = moment.calcSpecOfPolygon(points)
const spec = sci.geometry.calcSpecOfPolygon(points)
console.log("spec", spec)

const spec2 = sci.geometry.calcSpecOfPolygon(points2)
console.log("spec2", spec2)


const spec3  = sci.geometry.calcSpecOfAxisymmetricBody(points)
console.log("spec3",spec3)

const points3 = points.map(v=>[v[0]-0.5,v[1]])
const spec4  = sci.geometry.calcSpecOfAxisymmetricBody(points3)
console.log("spec4",spec4)

const points4 = points.map(v=>[v[0]+0.5,v[1]])
const spec5  = sci.geometry.calcSpecOfAxisymmetricBody(points4)
console.log("spec5",spec5)
