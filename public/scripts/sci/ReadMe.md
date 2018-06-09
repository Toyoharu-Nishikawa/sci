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


### interpolate

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

#### `solve.linEqGauss(A, v)`

returns `array`

solve simultaneous linear equations by Gauss elimination method 
* A : type of double array , coefficient matrix 
* v : type of array , constant term column vector

#### `solve.newtonMethod(x0, f, invJ, maxIteration, tolerance)`

returns `array`

solve nonlinear simultaneous equation by Newton method 
* x0 : type of array , initial value vector 
* f : type of function , nonlinear simultaneous equation
* invJ: type of function, inverse function of Jacob matrix
* maxIteration: type of integer, max number of iteration
* tolerance: type of float, solver torelance of residual sum of squares

#### `solve.broydenMethod(x0, f, invB0, maxIteration, tolerance)`

returns `array`

solve nonlinear simultaneous equation by Broyden method 
* x0 : type of array , initial value vector 
* f : type of function , nonlinear simultaneous equation
* invB0: type of double array, initial inverse of Broyden matrix
* maxIteration: type of integer, max number of iteration
* tolerance: type of float, solver torelance of residual sum of squares

initial inverse of Broyden matrix must be suggegested in some way

you have to know general behavior of equation or calculate inverse of Jacob matrix initally