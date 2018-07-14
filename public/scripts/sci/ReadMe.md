sci
======
### science library 

science library similar to scipy library of python including matrix, solver, interpolate.

Install
------

```bash
$ npm install sci
```

Usage
------

### matrix
------

#### `matrix.mulScalarVec(a, u)`

returns `array`

scalar multipulation of vector, a*u
* a : type of float , scalar 
* v : type of array , vector

#### `matrix.addVecVec(u, v)`

returns `array`

addition of two vectors,  u + v
* u : type of array , vector 
* v : type of array , vector

#### `matrix.subVecVec(u, v)`

returns `array`

subtractions of two vectors, u - v
* u : type of array , vector 
* v : type of array , vector

#### `matrix.absVec(u)`

returns `float`

absolution of vector, |u|
* u : type of array , vector 

#### `matrix.innerProductVec(u, v)`

returns `float`

inner product of two vectors, (u,v)
* u : type of array , vector 
* v : type of array , vector 

#### `matrix.transpose(A)`

returns `double array`

transpose matrix, AT
* A : type of double array , matrix 

#### `matrix.unitMat(n)`

returns `double array`

make unit matrix, E
* n : type of integer , length of unit matrix 

#### `matrix.mulScalarMat(a, A)`

returns `double array`

slacar multipulation of matrix, a*A
* a : type of float , scalar 
* A : type of double array , matrix 

#### `matrix.addMatMat(A, B)`

returns `double array`

addtion of tow matrix, A + B
* A : type of double array , matrix 
* B : type of double array , matrix 

#### `matrix.subMatMat(A, B)`

returns `double array`

subtraction of tow matrix, A - B
* A : type of double array , matrix 
* B : type of double array , matrix 

#### `matrix.mulMatMat(A, B)`

returns `double array`

multipulation of tow matrix, AB
* A : type of double array , matrix 
* B : type of double array , matrix 

#### `matrix.invMat(A)`

returns `double array`

inverse matrix, invA
* A : type of double array , matrix 

#### `matrix.mulMatVec(A, u)`

returns `array`

multipulation of matrix and column vector, Av
* A : type of double array , matrix 
* v : type of double array , column vector 


### interpolate
------

#### `interpolate.linear(x, y)`

returns `function`

interpolates coordinate of y0 from coordinate of x0 by linear interpolation
* x : type of array , coordinate of x 
* y : type of array , coordinate of y

#### `interpolate.cubicspline(x, y [,a0=0, an=0, method="M",differentiation=0])`

returns `function`

interpolates coordinate of y0 from coordinate of x0 by cubic spline

a0=0, an=0, method="M" is natural cubic spline

* x : type of array , coordinate of x 
* y : type of array , coordinate of y
* a0 : type of float , start edge condition, default = 0
* an : type of float ,  end edge condition, default=0
* method: type of string , edge condition option , "M" or "m" , default = "M"
* differentiation: type of integer , differentiation , 0, 1 or 2, default = 0

    + 0: spline at x0
    + 1: first differentiation of spline at x0
    + 2: second differentiation of spline at x0
    + -1: integration of spline from x0 to x1

#### `interpolate.bspline(x, y [,degree=3, k])`

returns `function`

interpolates coordinate of y0 from coordinate of x0 by b-spline

* x : type of array , coordinate of x 
* y : type of array , coordinate of y
* degree : type of float , degree of spline curve, default = 3
* k : type of array ,  knot vector

if k is empty, uniform knot vector will be set automatically

k.length must be equal to sum of x.length + degree +1


### solve
------

#### `solve.linEqGauss(A, v)`

returns `array`

solve simultaneous linear equations by Gauss elimination method 
* A : type of double array , coefficient matrix 
* v : type of array , constant term column vector

#### `solve.lineSplitMethod(x0, f, dfdx0, maxIteration, tolerance)`

returns `objcct`
```javascript
{
    converged: "boolean", // true means converged and false means diverged
    error: "float", // the last error of convergence iteration
    count: "integer", // the last iteration count
    value: "array", //a result of comvergence method
}
```

solve nonlinear equation by line split method 
* x0 : type of float , initial value
* f : type of function , nonlinear simultaneous equation
* dfdx0: type of float, first differentiation at x0
* maxIteration: type of integer, max number of iteration
* tolerance: type of float, solver torelance of residual sum of squares


#### `solve.newtonMethod(x0, f, invJ, maxIteration, tolerance)`

returns `objcct`
```javascript
{
    converged: "boolean", // true means converged and false means diverged
    error: "float", // the last error of convergence iteration
    count: "integer", // the last iteration count
    value: "array", //a result of comvergence method
}
```

solve nonlinear simultaneous equation by Newton method 
* x0 : type of array , initial value vector 
* f : type of function , nonlinear simultaneous equation
* invJ: type of function, inverse function of Jacob matrix
* maxIteration: type of integer, max number of iteration
* tolerance: type of float, solver torelance of residual sum of squares

#### `solve.broydenMethod(x0, f, invB0, maxIteration, tolerance)`

returns `objcct`
```javascript
{
    converged: "boolean", // true means converged and false means diverged
    error: "float", // the last error of convergence iteration
    count: "integer", // the last iteration count
    value: "array", //a result of comvergence method
}
```

solve nonlinear simultaneous equation by Broyden method 
* x0 : type of array , initial value vector 
* f : type of function , nonlinear simultaneous equation
* invB0: type of double array, initial inverse of Broyden matrix
* maxIteration: type of integer, max number of iteration
* tolerance: type of float, solver torelance of residual sum of squares

initial inverse of Broyden matrix must be suggegested in some way

you have to know general behavior of equation or calculate inverse of Jacob matrix initally