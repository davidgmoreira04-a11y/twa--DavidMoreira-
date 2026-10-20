<script setup>
import { ref, computed } from 'vue'
import { search, byCategory, sortByPrice, categories } from './catalog.js'

// Passo 1: Estado reativo
const status = ref('loading')
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

// Passo 2: Carregar os dados
async function load() {
  status.value = 'loading'
  error.value = null
  try {
    const res = await fetch('/items.json')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    items.value = await res.json()
    status.value = 'ready'
  } catch (err) {
    error.value = err.message
    status.value = 'error'
  }
}

// Passo 3: Valores derivados (computed)
const visible = computed(() => {
  let list = search(items.value, query.value)
  if (category.value) {
    list = byCategory(list, category.value)
  }
  return sortByPrice(list, sortDir.value)
})

const cats = computed(() => categories(items.value))

const selected = computed(() =>
  items.value.find((item) => item.id === selectedId.value)
)

load()
</script>
<template>
  <main>
    <h1>Catálogo</h1>

    <div class="controls">
      <input v-model="query" placeholder="Pesquisar..." />

      <select v-model="category">
        <option value="">Todas as categorias</option>
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>

      <button @click="sortDir = sortDir === 'desc' ? 'asc' : 'desc'">
        Preço: {{ sortDir === 'desc' ? '↓ Desc' : '↑ Asc' }}
      </button>
    </div>

    <p v-if="status === 'loading'">Loading...</p>

    <p v-else-if="status === 'error'">
      Error: {{ error }}
      <button @click="load">Retry</button>
    </p>

    <template v-else>
      <p>{{ visible.length }} items</p>

      <div class="layout">
        <ul>
          <li
            v-for="item in visible"
            :key="item.id"
            :class="{ selected: item.id === selectedId }"
            @click="selectedId = item.id"
          >
            {{ item.name }} — {{ item.price.toFixed(2) }} €
          </li>
        </ul>

        <section v-if="selected" class="detail">
          <h2>{{ selected.name }}</h2>
          <p><strong>Categoria:</strong> {{ selected.category }}</p>
          <p><strong>Preço:</strong> {{ selected.price.toFixed(2) }} €</p>

          <p v-if="selected.tags">
            <strong>Tags:</strong> {{ selected.tags.join(', ') }}
          </p>

          <!-- Mostra automaticamente o objeto aninhado do teu item -->
          <div v-for="(val, key) in selected" :key="key">
            <div v-if="val && typeof val === 'object' && !Array.isArray(val)">
              <h3>{{ key }}</h3>
              <ul>
                <li v-for="(subVal, subKey) in val" :key="subKey">
                  <strong>{{ subKey }}:</strong> {{ subVal }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </template>
  </main>
</template>

<style scoped>
main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #5b1f2e;
}

.controls {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.controls input,
.controls select,
.controls button {
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.controls button {
  cursor: pointer;
  background-color: #f5f5f5;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  margin-bottom: 0.4rem;
  border-radius: 4px;
  cursor: pointer;
}

li:hover {
  background-color: #f9f9f9;
}

/* Classe obrigatória pedida no Passo 5 */
.selected {
  background-color: #5b1f2e;
  color: #ffffff;
  border-color: #5b1f2e;
  font-weight: bold;
}

.selected:hover {
  background-color: #461723;
}

.detail {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #fafafa;
}

.detail h2 {
  margin-top: 0;
  color: #5b1f2e;
}
</style>