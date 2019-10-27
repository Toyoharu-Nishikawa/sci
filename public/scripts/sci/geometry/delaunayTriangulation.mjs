/*! -----------------------------------------------------
  ドロネー三角形分割のためのユーティリティ関数
--------------------------------------------------------- */

const getMinMax = points => {
  let minX= points[0][0]
  let maxX= points[0][0]
  let minY= points[0][1]
  let maxY= points[0][1]

  for(let i=1;i<points.length;i++){
    const x = points[i][0]
    const y = points[i][1]

    if(x<minX) minX=x
    if(x>maxX) maxX=x
    if(y<minY) minY=y
    if(y>maxY) maxY=y
  }

  const minmax = {
    minX : minX,
    maxX : maxX,
    minY : minY,
    maxY : maxY,
  }
  return minmax
}



/**
 * 外接円を得る
 * @param {Triangle} triangle 外接円を得たい三角形
 * @return {Circle} 外接円
 */
const getCircumscribedCircle = triangle => {
  const x1 = triangle[0][0]
  const y1 = triangle[0][1]
  const x2 = triangle[1][0]
  const y2 = triangle[1][1]
  const x3 = triangle[2][0]
  const y3 = triangle[2][1]

  const x1_2 = x1 * x1
  const x2_2 = x2 * x2
  const x3_2 = x3 * x3
  const y1_2 = y1 * y1
  const y2_2 = y2 * y2
  const y3_2 = y3 * y3

  // 外接円の中心座標を計算
  const c = 2 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1))
  const x = ((y3 - y1) * (x2_2 - x1_2 + y2_2 - y1_2) + (y1 - y2) * (x3_2 - x1_2 + y3_2 - y1_2)) / c
  const y = ((x1 - x3) * (x2_2 - x1_2 + y2_2 - y1_2) + (x2 - x1) * (x3_2 - x1_2 + y3_2 - y1_2)) / c
  const _x = (x1 - x)
  const _y = (y1 - y)
  const r = Math.sqrt((_x * _x) + (_y * _y))
  
  const circle = {
    center: [x, y],    
    radius: r,
  }

  return circle 
}


/**
 * 与えられた四角形が内接する三角形を得る
 * @param {Rectangle} rect wrapped points rectangle.
 * @return {Triangle}
 */
const getExternalTriangle = (minX, maxX, minY, maxY) => {
  const w = maxX - minX
  const h = maxY - minY

  const A = [minX-w/2, minY]
  const B = [maxX+w/2, minY]
  const C = [minX+w/2, maxY+h]
  
  const triangle = [A, B, C]

  return triangle 
}

const hasPointInExternalCircle = (triangle, point) => {
  const external_circle = getCircumscribedCircle(triangle)
  
  return external_circle.hitTest(point);
}

//与えられた点が円の中に含まれているかを判定する
//@param circle = {center: [double, double], radius: double}
//@param point = [double, double]
const hitTest = (circle, point) => {
  const x = point[0] - circle.center[0]
  const y = point[1] - circle.center[1]
  const len = Math.sqrt((x * x) + (y * y));
  const flag = len < circle.radius
    
  return flag
}

//三角形の辺を取得する
const getEdgesFromTriangle = triangle => {
  const edgeA = [triangle[0], triangle[1]]
  const edgeB = [triangle[1], triangle[2]]
  const edgeC = [triangle[2], triangle[0]]

  const edges = [edgeA, edgeB, edgeC]
  
  return edges
}

//Pointが同一であるかをチェック
const isEqualPoint = (point1, point2) => {
  const flag = (point1[0] === point2[0]) && (point1[1] === point2[1])
  return flag 
}

//Edgeが同一であるかをチェック
const isEqualEdge = (edge1, edge2) => {
  const flagC = isEqualPoint(edge1[0], edge2[0]) && isEqualPoint(edge1[1], edge2[1])
  const flagA = isEqualPoint(edge1[0], edge2[1]) && isEqualPoint(edge1[1], edge2[0])

  const flag = flagC || flagA 
  return flag 
}

/**
* 三角形が与えられた点を含んでいるかチェック
* @param {Edge} edge 調査対象の辺
* @return {boolean} 与えられた辺を含んでいたらtrue
*/   
const edgeHasPoint = (edge, point) => {
  for(let i = 0; i<edge.length; i++){
    const flag = isEqualPoint(edge[i], point)
    if(flag){
      return true
    }
  }
  return false
}

/**
 * 与えられた辺を含んでいるかチェック
 * @param {Edge} edge 調査対象の辺
 * @return {boolean} 与えられた辺を含んでいたらtrue
 */
const triangleHasEdge = (triangle, edge) => {
  const edges = getEdgesFromTriangle(triangle)
  for (let i = 0; i<edges.length; i++) {
    const flag = isEqualEdge(edges[i], edge)
    if (flag) {
       return true
    }
  }
  return false
}

/**
* 三角形が与えられた点を含んでいるかチェック
* @param {Edge} edge 調査対象の辺
* @return {boolean} 与えられた辺を含んでいたらtrue
*/   
const triangleHasPoint = (triangle, point) => {
  for(let i = 0; i<triangle.length; i++){
    const flag = isEqualPoint(triangle[i], point)
    if(flag){
      return true;
    }
  }
  return false;
}



/**
 * 同値判定
 * @param {Triangle} triangle 判定対象の三角形
 * @return {boolean} 各頂点がすべて同じならtrue
 */
const isEqualTriangle = (triangle1, triangle2)=> {
  for(let i = 0; i<triangle2.length; i++) {
    const point = triangle2[i]
    const flag = triangleHasPoint(triangle1, point)
    if(!flag) {
      return false
    }
  }
  return true
}   

 /**
 * 与えられた辺を含まない点を返す
 * @param {Edge} edge 調査対象の辺
 * @return {Point} 与えられた辺に含まれない点
 */
const noCommonPointByEdgeOfTriangle = (triangle, edge) => {
  for(let i = 0; i<triangle.length; i++) {
    const flag = edgeHasPoint(edge, triangle[i])
    if(!flag) {
      return triangle[i] 
    }
  }
  return null
}

/**
 * 与えられた辺以外の辺を返す
 * @param {Edge} edge 調査対象の辺
 * @return {Array.<Edge>} 該当の辺以外の辺の配列
 */
const otherEdgeByEdge = (triangle,edge) => {
  const edges = getEdgesFromTriangle(triangle)
  const result = []
  for (let i = 0; i<edges.length; i++) {
    const flag = isEqualEdge(edge, edges[i])
    if (!flag) {
      result.push(edges[i])
    }
  }
  return result
}
   
/**
 * ドロネー三角形分割を計算
 * @params {Array.<Point>} points 計算対象の点群
 */
export const delaunayTriangulation = originalPoints => {
  const points = originalPoints.map(v=>v) 

  // 見つかった三角形を保持する配列
  const triangles = []

  // 一番外側の巨大三角形を生成
  // ここでは画面内の点限定として画面サイズを含む三角形を作る
  const {minX, maxX, minY, maxY} = getMinMax(points)
  const super_triangle = getExternalTriangle(minX, maxX, minY, maxY)
  console.log("super_triangle",super_triangle)

    // 生成した巨大三角形をドロネー三角形郡に追加
    triangles.push(super_triangle)

    while(points.length!== 0) {
        // ひとつ目の点を取り出す
        const point = points.pop()

        // 外接円に点が含まれる三角形を見つける
        const hit_triangles = []
        for(let i = 0; i<triangles.length;  i++) {
          const triangle = triangles[i]
          const circle = getCircumscribedCircle(triangle)
          const flag = hitTest(circle, point)
          if (flag) {
            hit_triangles.push(triangle)
          }
        }

        const edge_stack = []
        for (let i = 0; i<hit_triangles.length; i++) {
            const ht = hit_triangles[i]
            // 見つかった三角形の辺をスタックに積む
            const edges = getEdgesFromTriangle(ht) 
            edge_stack.push(edges[0])
            edge_stack.push(edges[1])
            edge_stack.push(edges[2])



            // 見つかった三角形を配列から削除
            const index = triangles.indexOf(ht)
            triangles.splice(index, 1);

            // 見つかった三角形を該当の点で分割し、
            // 新しく3つの三角形にする
            const A = ht[0]
            const B = ht[1]
            const C = ht[2]

            const new_triangle1 = [A, B, point]
            const new_triangle2 = [B, C, point]
            const new_triangle3 = [C, A, point]

            triangles.push(new_triangle1)
            triangles.push(new_triangle2)
            triangles.push(new_triangle3)

            // for DEBUG.
            // debugger;
            // drawPoint(ctx, point);
            // drawTriangles(ctx, triangles);
        }

        // スタックが空になるまで繰り返す
        while (edge_stack.length !== 0) {

            // スタックから辺を取り出す
            const edge = edge_stack.pop()

            // 辺を共有する三角形を見つける
            const common_edge_triangles = []
            for(let i = 0; i<triangles.length; i++) {
              const t = triangles[i]
              const flag = triangleHasEdge(t, edge) 
              if(flag) {
                common_edge_triangles.push(t)
              }
            }

            // 共有辺（これを辺ABとする）を含む2個の三角形をABC, ABDとする
            // もし、三角形ABCの外接円に点Dが入る場合は、共有辺をflipし、辺AD/DB/BC/CAをスタックにpushする
            // つまり、見つかった三角形をリストから削除し、新しい辺リストをスタックに積む
            // さらに、新しくできた三角形をリストに加える
            const triangle_ABC = common_edge_triangles[0]
            const triangle_ABD = common_edge_triangles[1]

            // 共有する辺を持つ三角形がふたつ見つからなければスキップ
            if(!triangle_ABD) {
                continue
            }

            // 選ばれた三角形が同一のものの場合はそれを削除して次へ
            if(isEqualTriangle(triangle_ABC, triangle_ABD)){
              const index_ABC = triangles.indexOf(triangle_ABC)
              triangles.splice(index_ABC, 1)
              const index_ABD = triangles.indexOf(triangle_ABD)
              triangles.splice(index_ABD, 1)
              continue
            }

            // あとで使うため、頂点A,Bを保持しておく
            const point_A = edge[0]
            const point_B = edge[1]

            // 三角形ABCの頂点のうち、共有辺以外の点を取得（つまり点C）
            const point_C = noCommonPointByEdgeOfTriangle(triangle_ABC, edge)

            // 三角形ABDの頂点のうち、共有辺以外の点を取得（つまり点D）
            const point_D = noCommonPointByEdgeOfTriangle(triangle_ABD, edge)

            // 三角形ABCの外接円を取得
            const external_circle = getCircumscribedCircle(triangle_ABC)
            // for DEBUG.
            // debugger;
            // ctx.clearRect(0, 0, win.innerWidth, win.innerHeight);
            // utils.drawTriangle(ctx, triangle_ABC);
            // utils.drawTriangle(ctx, triangle_ABD);
            // utils.drawCircle(ctx, external_circle);

            // 頂点Dが三角形ABCの外接円に含まれてるか判定
            if (hitTest(external_circle, point_D)) {

                // 三角形リストから三角形を削除
                const index1 = triangles.indexOf(common_edge_triangles[0]);
                triangles.splice(index1, 1);
                const index2 = triangles.indexOf(common_edge_triangles[1]);
                triangles.splice(index2, 1);

                // 共有辺をflipしてできる三角形を新しく三角形郡に追加
                const triangle_ACD = [
                    point_A,
                    point_C,
                    point_D
                ]
                const triangle_BCD = [
                    point_B,
                    point_C,
                    point_D
                ]

                triangles.push(triangle_ACD)
                triangles.push(triangle_BCD)

                // for DEBUG.
                // ctx.clearRect(0, 0, w, h);
                // drawTriangles(ctx, triangles);
                // drawTriangle(ctx, triangle_ACD);
                // drawTriangle(ctx, triangle_BCD);

                // 上記三角形の辺をedge stackに追加
                const other_edge1 = triangle_ABC.otherEdgeByEdge(edge)
                const other_edge2 = triangle_ABD.otherEdgeByEdge(edge)

                edge_stack.push(other_edge1)
                edge_stack.push(other_edge2)
            }
        }
    }

    // 最後に、巨大三角形と頂点を共有している三角形をリストから削除
    const final_triangles = [];
    for (let i = 0, sp; sp = super_triangle[i]; i++) {
        for (let j = 0, l = triangles.length; j < l; j++) {
            if (triangles[j] && triangleHasPoint(triangles[j], sp)) {
                triangles[j] = null
            }
        }
    }
    for (let i = 0, l = triangles.length; i < l; i++) {
        if (triangles[i]) {
            final_triangles.push(triangles[i])
        }
    }
    //triangles = null;
    
   //const index_super_triangle = triangles.indexOf(super_triangle)
   //triangles.splice(index_super_triangle, 1)
 
   return final_triangles
}

export const innerTriangle = (triangle, point) => {
  const p1 = triangle[0]
  const p2 = triangle[1]
  const p3 = triangle[2]
  const p4 = point
  
  const u12 = [p2[0]-p1[0], p2[1]-p1[1]] 
  const u13 = [p3[0]-p1[0], p3[1]-p1[1]] 
  const u14 = [p4[0]-p1[0], p4[1]-p1[1]]
  
  const det = u12[0]*u13[1] - u12[1]*u13[0]
  const Uint = [
    [u13[1]/det, -u13[0]/det],
    [-u12[1]/det, u12[0]/det],
  ]
 
  const s = [
    Uint[0][0]*u14[0]+Uint[0][1]*u14[1], 
    Uint[1][0]*u14[0]+Uint[1][1]*u14[1], 
  ] 

  const flag1 = 0<= s[0] && s[0] <=1
  const flag2 = 0<= s[1] && s[1] <=1
  const flag3 = 0<= 1-s[0]- s[1]  && 1-s[0]-s[1]<=1

  const flag = flag1 && flag2 && flag3
 
  return flag
}

