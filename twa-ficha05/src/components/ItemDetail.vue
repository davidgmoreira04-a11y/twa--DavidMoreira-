<script setup>
defineProps({
  item: { type: Object, default: null },
})
</script>

<template>
  <section v-if="item" class="detail">
    <h2>{{ item.name }}</h2>
    <p><strong>Categoria:</strong> {{ item.category }}</p>
    <p><strong>Preço:</strong> {{ item.price }} €</p>
    <p v-if="item.developer">
      <strong>Developer:</strong> {{ item.developer.name }} ({{ item.developer.country }})
    </p>
    <p v-if="item.tags?.length">
      <strong>Tags:</strong> {{ item.tags.join(', ') }}
    </p>
  </section>
</template>