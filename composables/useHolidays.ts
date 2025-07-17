import { ref } from 'vue'

export function useHolidays(countryCode: string, year: number) {
    const holidays = ref<any[]>([])
    const loading = ref(true)
    const error = ref<Error | null>(null)

    const fetchHolidays = async (year: number) => {
        try {
            // const year = new Date().getFullYear()
            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
            if (!res.ok) throw new Error('Failed to fetch holidays')
            holidays.value = await res.json()
        } catch (err) {
            error.value = err as Error
        } finally {
            loading.value = false
        }
    }

    fetchHolidays(year)

    return {
        holidays,
        loading,
        error,
        fetchHolidays
    }
}