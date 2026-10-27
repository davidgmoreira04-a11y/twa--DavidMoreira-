<script setup>
import { reactive, computed } from 'vue'

defineProps({
  cats: { type: Array, required: true },
})

const emit = defineEmits(['save'])

const empty = {
  name: '',
  category: '',
  price: null,
  tags: '',
}

const form = reactive({ ...empty })

const errors = computed(() => {
  const e = {}
  if (form.name.length < 3) e.name = 'at least 3 characters'
  if (!form.category) e.category = 'pick one'
  if (!(form.price > 0)) e.price = 'must be > 0'
  return e
})

const isValid = computed(() => Object.keys(errors.value).length === 0)

function save() {
  if (!isValid.value) return
  emit('save', {
    ...form,
    tags: form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  })
  Object.assign(form, empty)
}
</script>

<template>
  <form @submit.prevent="save">
    <div>
      <input v-model.trim="form.name" placeholder="Name" required />
      <small v-if="errors.name">{{ errors.name }}</small>
    </div>

    <div>
      <select v-model="form.category" required>
        <option value="" disabled>Category...</option>
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>
      <small v-if="errors.category">{{ errors.category }}</small>
    </div>

    <div>
      <input
        v-model.number="form.price"
        type="number"
        min="0"
        step="0.01"
        placeholder="Price"
        required
      />
      <small v-if="errors.price">{{ errors.price }}</small>
    </div>

    <div>
      <input v-model.trim="form.tags" placeholder="tags, comma separated" />
    </div>

    <button type="submit" :disabled="!isValid">Add</button>
  </form>
</template>