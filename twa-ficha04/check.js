import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  byCategory,
  search,
  total,
  top,
  categories,
  withDiscount,
  sortByPrice,
} from './src/catalog.js'

const items = JSON.parse(readFileSync('./public/items.json', 'utf8'))

assert.equal(byCategory(items, 'RPG').length, 2)
assert.deepEqual(search(items, 'DIFFICULT').map((i) => i.id), [3, 5, 6])
assert.equal(total([{ price: 2 }, { price: 3.5 }]), 5.5)
assert.deepEqual(top(items, 2).map((i) => i.id), [5, 1])
assert.deepEqual(categories(items), ['Metroidvania', 'Platformer', 'Puzzle', 'RPG', 'Roguelike', 'Sandbox', 'Simulation'])

const before = structuredClone(items)
assert.equal(withDiscount(items, 10)[0].price, 26.99)
assert.deepEqual(items, before)

// Ficha 03: sortByPrice - new array, both directions
const desc = sortByPrice(items, 'desc')
const asc = sortByPrice(items, 'asc')
assert.deepEqual(desc.slice(0, 2).map((i) => i.id), [5, 1])
assert.equal(asc[0].id, 2)
assert.equal(asc.at(-1).id, 5)
assert.deepEqual(sortByPrice([{ price: 9 }, { price: 10 }], 'desc').map((i) => i.price), [10, 9])
assert.notEqual(desc, items)
assert.deepEqual(items, before)