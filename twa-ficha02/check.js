import assert from 'node:assert/strict';
import { items } from './data.js';
import { byCategory, search, total, top, categories, withDiscount } from './catalog.js';

assert.equal(byCategory(items, 'RPG').length, 2);

assert.equal(search(items, 'Hades').length, 1);

assert.ok(total(items) > 0);

assert.equal(top(items, 3).length, 3);

assert.ok(categories(items).includes('RPG'));

assert.equal(withDiscount([{ price: 100 }], 20)[0].price, 80);