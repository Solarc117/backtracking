'use strict'
// @ts-ignore
const log = console.log.bind(console)

const subset = new Set(['a']),
  set = new Set([...subset])

// @ts-ignore
log(set.has(new Set([...subset])))
