import {bspline} from "./bspline.mjs"
import {linear} from "./linear.mjs"
import {cubicspline} from "./cubicspline.mjs"

export const interpolate = {
  bspline: bspline,
  linear: linear,
  cubicspline: cubicspline,
}
