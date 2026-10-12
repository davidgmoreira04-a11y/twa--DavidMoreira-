import './style.css'
import { search, byCategory, categories, sortByPrice } from './catalog.js'


const state = {
  status: 'loading', 
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null,
}


const qEl = document.querySelector('#q')
const categoryEl = document.querySelector('#category')
const sortEl = document.querySelector('#sort')
const statusEl = document.querySelector('#status')
const listEl = document.querySelector('#list')
const detailEl = document.querySelector('#detail')


async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${url}`)
  }
  return res.json()
}

async function load() {
  state.status = 'loading'
  state.error = null
  render()

  try {
    state.items = await getJSON('/items.json')
    state.status = 'ready'
  } catch (err) {
    state.status = 'error'
    state.error = err.message
  } finally {
    render()
  }
}


function getVisible() {
  let list = state.items
  list = search(list, state.query)
  if (state.category) list = byCategory(list, state.category)
  return sortByPrice(list, state.sortDir)
}

function toLi(item) {
  const li = document.createElement('li')
  li.textContent = `${item.name} · ${item.price} €`
  li.dataset.id = item.id
  if (item.id === state.selectedId) li.classList.add('selected')
  return li
}

function toDetail(item) {
  const box = document.createElement('div')

  const title = document.createElement('h2')
  title.textContent = item.name

  const price = document.createElement('p')
  price.textContent = `Preço: ${item.price} €`

  const tags = document.createElement('p')
  tags.textContent = `Tags: ${item.tags.join(', ')}`

  const dev = document.createElement('p')
  dev.textContent = `Developer: ${item.developer.name} (${item.developer.country})`

  box.append(title, price, tags, dev)
  return box
}

function renderCategories() {
  const options = [''].concat(categories(state.items)).map((cat) => {
    const opt = document.createElement('option')
    opt.value = cat
    opt.textContent = cat || 'Todas'
    return opt
  })
  categoryEl.replaceChildren(...options)
  categoryEl.value = state.category
}


function render() {
  if (state.status === 'loading') {
    statusEl.textContent = 'A carregar...'
  } else if (state.status === 'error') {
    statusEl.textContent = `Erro: ${state.error}`
  } else {
    statusEl.textContent = ''
  }

  if (state.status !== 'ready') {
    listEl.replaceChildren()
    detailEl.replaceChildren()
    return
  }

  renderCategories()

  const visible = getVisible()
  if (visible.length === 0) {
    statusEl.textContent = 'Sem resultados' 
  }
  listEl.replaceChildren(...visible.map(toLi))

  const selected = state.items.find((i) => i.id === state.selectedId)
  detailEl.replaceChildren(...(selected ? [toDetail(selected)] : []))
}


qEl.addEventListener('input', (e) => {
  state.query = e.target.value
  render()
})

categoryEl.addEventListener('change', (e) => {
  state.category = e.target.value
  render()
})

sortEl.addEventListener('click', () => {
  state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'
  render()
})


listEl.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]')
  if (!li) return
  state.selectedId = Number(li.dataset.id)
  render()
})


load()
state.items = await getJSON('https://api.github.com/repos/nodejs/nope')