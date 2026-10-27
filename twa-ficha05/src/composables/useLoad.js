import { ref, onMounted } from 'vue'

export function useLoad(fetcher) {
  const status = ref('loading') // 'loading' | 'error' | 'ready'
  const error = ref(null)
  const data = ref(null)

  async function load() {
    status.value = 'loading'
    error.value = null
    try {
      data.value = await fetcher()
      status.value = 'ready'
    } catch (err) {
      status.value = 'error'
      error.value = err.message
    }
  }

  onMounted(load)
  return { status, error, data, load }
}