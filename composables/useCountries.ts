import { ref } from 'vue'

export function useCountries() {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  const countries = ref<any[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_BASE}/AvailableCountries`)
      if (!res.ok) throw new Error('Failed to fetch countries')
      countries.value = await res.json()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  fetchCountries()

  return { countries, loading, error }
}