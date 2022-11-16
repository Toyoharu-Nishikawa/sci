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
