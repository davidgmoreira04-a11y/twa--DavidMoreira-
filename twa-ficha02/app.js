import { items } from './data.js';
import { byCategory, search, top, total, categories } from './catalog.js';
import { writeFile } from 'node:fs/promises';

const [cmd, arg] = process.argv.slice(2);

if (!cmd) {
  
  console.log(items);
} else if (cmd === 'search') {
  
  console.log(search(items, arg));
} else if (cmd === 'top') {
 
  console.log(top(items, Number(arg)));
} else if (cmd === 'report') {

  const reportData = {
    count: items.length,
    total: total(items),
    categories: categories(items),
    top3: top(items, 3)
  };
  await writeFile('report.json', JSON.stringify(reportData, null, 2));
  console.log('Ficheiro report.json gerado com sucesso!');
} else {

  console.log(byCategory(items, cmd));
}