
import fs from 'fs/promises';
const res = await fetch(
  'https://api.github.com/repos/nodejs/node'
)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const repo = await res.json()
console.log(repo.name, repo.stargazers_count)
const dadosParaGuardar = {
  name: repo.name,
  stargazers_count: repo.stargazers_count
};
await fs.writeFile('repo.json', JSON.stringify(dadosParaGuardar, null, 2));
console.log('Ficheiro repo.json criado com sucesso!');