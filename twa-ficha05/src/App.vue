<script setup>
import { ref, computed, watch } from 'vue'
import { byCategory, search, categories, sortByPrice } from './catalog.js'
import { useLoad } from './composables/useLoad.js'
import { getJSON } from './api/getJSON.js'
import ItemList from './components/ItemList.vue'
import ItemDetail from './components/ItemDetail.vue'
import ItemForm from './components/ItemForm.vue'

const { status, error, data: items, load } = useLoad(() => getJSON('/items.json'))

const query = ref('')
const category = ref('')
const dir = ref('asc')
const selectedId = ref(null)

watch(query, () => {
  selectedId.value = null
})

const cats = computed(() => (items.value ? categories(items.value) : []))

const visible = computed(() => {
  if (!items.value) return []
  let res = items.value
  if (category.value) res = byCategory(res, category.value)
  if (query.value) res = search(res, query.value)
  return sortByPrice(res, dir.value)
})

const selected = computed(() =>
  items.value?.find((i) => i.id === selectedId.value) ?? null
)

const nextId = computed(() =>
  Math.max(0, ...(items.value ?? []).map((i) => i.id)) + 1
)

function addItem(item) {
  items.value.push({ id: nextId.value, ...item })
}
</script>

<template>
  <main>
    <h1>Catálogo de Videojogos</h1>

    <p v-if="status === 'loading'">A carregar...</p>

    <div v-else-if="status === 'error'">
      <p>Erro: {{ error }}</p>
      <button @click="load">Retry</button>
    </div>

    <div v-else>
      <section class="controls">
        <input v-model="query" placeholder="Pesquisar..." />

        <select v-model="category">
          <option value="">Todas as categorias</option>
          <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
        </select>

        <select v-model="dir">
          <option value="asc">Preço: Crescente</option>
          <option value="desc">Preço: Decrescente</option>
        </select>
      </section>

      <ItemForm :cats="cats" @save="addItem" />

      <ItemList
        :items="visible"
        :selected-id="selectedId"
        @select="selectedId = $event"
      />

      <ItemDetail :item="selected" />
    </div>
  </main>
</template>