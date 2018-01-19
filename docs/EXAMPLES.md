Examples
========

Some examples, mostly taken from the [math.js examples section](http://mathjs.org/examples/index.html):

## Basic usage
```js
// expressions
x = 2 * (2 + 4.5) // -> 13
x - 6 / 2 // -> 10
// functions and constants
sin(45 deg) ^ 2 // -> 0.5
atan2(3, -3) / pi
```

## Logical operators
```js
not (true xor true) // -> true
// conditional expressions
15 > 100 ? 1 : -1
// bitwise operators
(8 >> 1) & 7 // -> 4
// results are treated as signed integers
~2 // -> -3
```

## Complex numbers
```js
c = 5 + 3i + 3 - 7i // -> 8 - 4i
// from polar coordinates
d = complex({r: sqrt(2), phi: pi/4}) // -> 1 + i
// functions
re(c) // -> 8
sqrt(-4) // -> 2i
```

## Arrays
```js
v = [1, 2, 3, 4]
// indexing starts at 1
v[2] // -> 2
// functions on arrays (works on matrices too)
factorial(v) // -> [1, 2, 6, 24]
```

## Matrices
```js
A = [[1, 2], [3, 4]] // [[row 1], [row 2], ...]
B = [1, 2; 3, 4] // same thing, different syntax
A == B // -> [[true, true], [true, true]]
M = ones(4, 5)
// size
size(M) // -> [4, 5]
// indexing: [row, column]
A[2, 2] // -> 4
// index more than one element with a range: start:stop
// you can skip the start or end in the range
// : means all elements
// extracting a row
A[1, :] // -> [[1, 2]]
// extracting a column
A[:, 1] // -> [[1], [3]]
// replacing a submatrix
M[4:, :3] = zeros(1, 3) // set the first 3 colums in the last row to zero
// operations
D = A - B
M * eye(3, 2)
det(A) // -7
// column vector
[1; 2; 3]
```

## Units
```js
5 mm * 3 // -> 15 mm
// conversion
12.7 cm to inch // -> 5 inch
460 V * 20 A * 30 days to kWh // 6624 kWh
// simplification
9.81 m/s^2 * 100 kg * 40 m // -> 39.24 kJ
// arrays
[1, 2, 3] m/s * 5 -> [5 m / s, 10 m / s, 15 m / s]
```

## Formatting
```js
format(pi, 3) // -> "3.14"
format(pi * 100, { notation: "engineering", precision: 4 }) // -> "314.2e+0"
item = { name: "snake oil", price: 12.99 }
print("Special offer: $name, only $$price", item, 2) // -> "Special offer: snake oil, only $13"
```

## Misc
```js
// objects
k = {a: 1, b: 2}
k.a + k.b // -> 3
// strings
a = "123"
b = "456"
// adding with + will convert strings to numbers and use addition!
c = concat(a, b) // -> "123456"
number(c) // -> 123456
max("apple", "carrot", "snake") // -> snake
// fractions
f = fraction(1/3) // -> 0.(3)
// ranges
1:4 // -> [1,2,3,4]
// ranges with step value
1:3:10 // -> [1, 4, 7, 10]
// variable type
z = 2 + i
typeof(z) // -> Complex
```
