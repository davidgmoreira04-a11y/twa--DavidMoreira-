<script setup>
defineProps({
  items: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])
</script>

<template>
  <ul>
    <li
      v-for="item in items"
      :key="item.id"
      :class="{ selected: item.id === selectedId }"
      @click="emit('select', item.id)"
    >
      {{ item.name }} — {{ item.price }} €
    </li>
  </ul>
</template>