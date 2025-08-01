<template>
    <div class="">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search Input..." />
        <h2 class="text-xl text-green-600 font-semibold mb-4 mt-4">Countries List</h2>
        <div class="flex items-center gap-2">
            <label for="itemsPerPage" class="text-sm">Show per page:</label>
            <select id="itemsPerPage" v-model="itemsPerPage" class="border rounded px-2 py-1">
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
            </select>
        </div>

        <div v-if="loading">Loading countries...</div>
        <div v-else-if="error">❌ Sorry, something went wrong... please, try later</div>
        <UAlert v-else-if="paginatedCountries.length === 0 && !loading" class="text-green-500" variant="subtle"
            title="No countries to show" />
        <ul v-else class="list-disc text-green-500 pl-5 space-y-1">
            <li v-for="country in paginatedCountries" :key="country.countryCode">
                <ULink :to="`/country/${country.countryCode}`" class="text-green-500 font-semibold hover:underline"
                    v-html="highlightMatch(country.name, debouncedQuery) + ' - ' + country.countryCode" />
            </li>
        </ul>

        <UContainer class="mt-6 flex justify-center">
            <UPagination v-model:page="currentPage" :page-count="itemsPerPage" :total="filteredCountries.length"
                size="sm" :max="5" />
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { useCountries } from '~/composables/useCountries'
import { useDebounce } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

const { countries, error, loading } = useCountries()
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 700)

const currentPage = ref(Number(route.query.page) || 1)
const itemsPerPage = ref(10)

onMounted(() => {
    if (process.client) {
        const storedLimit = Number(localStorage.getItem('itemsPerPage'))
        const queryLimit = Number(route.query.limit)
        const validLimit = [5, 10, 20, 50]

        const finalLimit = validLimit.includes(queryLimit)
            ? queryLimit
            : validLimit.includes(storedLimit)
                ? storedLimit
                : 10

        itemsPerPage.value = finalLimit
    }
})

const totalPages = computed(() =>
    Math.ceil(filteredCountries.value.length / itemsPerPage.value)
)

function highlightMatch(text: string, query: string): string {
    if (!query) return text
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
}

const filteredCountries = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return countries.value.filter(
        c =>
            c.name.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(debouncedQuery.value.toLowerCase())
    )
})

const paginatedCountries = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredCountries.value.slice(start, end)
})

watch(currentPage, (newPage) => {
    router.replace({ query: { ...route.query, page: String(newPage) } })
})

watch(searchQuery, () => {
    currentPage.value = 1
})


//  update URL и localStorage in case of limit change
watch(itemsPerPage, (newLimit) => {
    currentPage.value = 1
    if (process.client) {
        localStorage.setItem('itemsPerPage', String(newLimit))
    }
    router.replace({
        query: {
            ...route.query,
            limit: String(newLimit),
            page: '1',
        },
    })
})
</script>