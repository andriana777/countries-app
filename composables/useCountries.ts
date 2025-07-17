// Variant 1
// export const useCountries = () => {
//   const { fetcher } = useApi();

//   const getAll = () => fetcher<{ name: string; code: string }[]>('AvailableCountries');

//   return { getAll };
// };

// Variant 2
// export const useCountries = () => {
//   return useFetch('https://date.nager.at/api/v3/AvailableCountries')
// }

//Variant 3

// import { useFetch } from '#app'

// // const API_BASE = 'https://date.nager.at/api/v3'


// export function useCountries() {
//   const API_BASE = useRuntimeConfig().public.apiBase;
//   const { data, pending, error, refresh } = useFetch(`${API_BASE}/AvailableCountries`)

//   return {
//     countries: data,
//     loading: pending,
//     error,
//     refresh,
//   }
// }

// Пример использования:
// const { countries, loading, error } = useCountries()

//Variant 4
import { ref } from 'vue'

export function useCountries() {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  const NAGER_API = 'https://date.nager.at/api/v3'
  const countries = ref<any[]>([])
  const loading = ref(true)
  const error = ref<Error | null>(null)

  const fetchCountries = async () => {
    try {
      const res = await fetch(`${API_BASE}/AvailableCountries`)
      // const res = await fetch(`${NAGER_API}/AvailableCountries`)
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