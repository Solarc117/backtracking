'use strict'
// @ts-ignore
const log = console.log.bind(console)
/* 
                                            Template:

function isValid(state) {}

function getCandidates(state) { searches for states derived from the passed state }

function search(state, solutions) { uses getCandidates to search for further states, storing them if they are valid, and removing a state once all its derivatives have been assessed }

function solve(start) {
  const solutions = [],
    solutions = search(start, solutions)
  
  return solutions
}
*/

/*
Given an array "nums" of distinct integers, return an array containing ALL POSSIBLE PERMUTATIONS, in any order. Ex.:
[1] => [[1]]
[1, 2] => [[0, 1], [1, 0]]
[1, 2, 3] => [[1, 2, 3], [1, 3, 2], [2, 1, 3], [3, 1, 2], [3, 2, 1], [2, 3, 1]]
*/

{
  function perms(integers) {
    if (integers.length === 1) return [integers]

    const solutions = []

    for (const [i, int] of integers.entries()) {
      const subPerms = perms([
        ...integers.slice(0, i),
        ...integers.slice(i + 1, integers.length),
      ])
      for (const arr of subPerms) solutions.push([int, ...arr])
    }

    return solutions
  }
}

/*
Queens problem:

Given a whole number n, find all the possible positions that n queens may be positioned on an n x n board such that none can attack each other.
Ex., ---------------
    |   |   | Q |   |
     --------------- 
    | Q |   |   |   |
     ---------------   <= formatted as ['A3', 'B1', 'C4', 'D2'],   
    |   |   |   | Q |     row by row
     ---------------
    |   | Q |   |   |
     ---------------
*/

{
  // @ts-ignore
  Set.prototype.addAll = function (...vals) {
    for (const val of vals) this.add(val)
  }
  // @ts-ignore
  Set.prototype.deleteAll = function (...vals) {
    for (const val of vals) this.delete(val)
  }

  function columnCoords(column, n) {
    const coords = new Set()

    for (let i = 1; i <= n; i++) coords.add(`${column}${i}`)

    return coords
  }

  function rowCoords(row, n) {
    const coords = new Set(),
      minCharCode = 65,
      maxCharCode = minCharCode + n - 1

    for (
      let currCharCode = minCharCode;
      currCharCode <= maxCharCode;
      currCharCode++
    )
      coords.add(`${String.fromCharCode(currCharCode)}${row}`)

    return coords
  }

  function diagCoords(coord, n) {
    const coords = new Set(),
      origCharCode = coord.charCodeAt(0),
      minCharCode = 65,
      maxCharCode = minCharCode + n - 1

    for (
      let currCharCode = origCharCode - 1;
      currCharCode >= minCharCode;
      currCharCode--
    ) {
      const dist = currCharCode - origCharCode,
        diags = sideDiagCoords(n, coord, dist)

      if (diags.size === 0) break
      // @ts-ignore
      coords.addAll(...diags)
    }
    for (
      let currCharCode = origCharCode + 1;
      currCharCode <= maxCharCode;
      currCharCode++
    ) {
      const dist = currCharCode - origCharCode,
        diags = sideDiagCoords(n, coord, dist)

      if (diags.size === 0) break
      // @ts-ignore
      coords.addAll(...diags)
    }

    return coords
  }

  function sideDiagCoords(n, coord, dist) {
    // Assumes the charCode in the coord is within range, though it could check since n is passed.
    const coords = new Set(),
      currCharCode = coord.charCodeAt(0) + dist,
      origRow = +coord[1],
      row1 = origRow + dist,
      row2 = origRow - dist

    for (const row of [row1, row2])
      if (row >= 1 && row <= n)
        coords.add(`${String.fromCharCode(currCharCode)}${row}`)

    return coords
  }

  function isValid(n, queenCoords) {
    /* 
    Starting with the queen on the first column, and for every column right of that sequentially:
      If the queen is on an invalid square, return false.
      If the queen is the last queen, return true.
      Render the appropriate squares 'invalid' - that is, the current row, column, and diagonals, including the queen's current position..
     Return the result of the new board, with the invalid squares, and the current queen count.
    */
    if (!(queenCoords instanceof Set)) return false

    const invalidCoords = new Set()

    for (const [i, coord] of [...queenCoords].entries()) {
      if (invalidCoords.has(coord)) return false
      if (i === n - 1) return true
      if (i === queenCoords.size) return false

      const column = coord[0],
        row = coord[1]
      // @ts-ignore
      invalidCoords.addAll(
        ...columnCoords(column, n),
        ...rowCoords(row, n),
        ...diagCoords(coord, n)
      )
    }

    return false
  }

  function coordsFromN(n) {
    if (n < 1 || n % 1 !== 0 || n > 26) return new Set()

    const coords = new Set(),
      firstCharCode = 65,
      lastCharCode = firstCharCode + n - 1

    for (let charCode = firstCharCode; charCode <= lastCharCode; charCode++)
      for (let row = 1; row <= n; row++)
        coords.add(`${String.fromCharCode(charCode)}${row}`)

    return coords
  }

  function getCandidateCoords(n, queenCoords, valCoords = coordsFromN(n)) {
    const validCoords = new Set([...valCoords]),
      candidates = new Set()

    for (const coord of queenCoords) {
      const column = coord[0],
        row = coord[1]

      // @ts-ignore
      validCoords.deleteAll(
        ...columnCoords(column, n),
        ...rowCoords(row, n),
        ...diagCoords(coord, n)
      )
      if (validCoords.size === 0) return candidates
    }

    for (const coord of validCoords)
      candidates.add(new Set([...queenCoords, coord]))

    return candidates
  }

  function search(n, queenCoords, solutions) {
    if (isValid(n, queenCoords)) return solutions.add(queenCoords)

    for (const candQueenCoords of getCandidateCoords(n, queenCoords))
      search(n, candQueenCoords, solutions)

    return solutions
  }

  function nQueens(n) {
    const queenCoords = new Set(),
      solutions = new Set()

    return search(n, queenCoords, solutions)
  }   

  log([...nQueens(4)].map(set => [...set].sort()))
}
