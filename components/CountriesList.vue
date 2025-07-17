<template>
    <div class="">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search Input..." />
        <h2 class="text-xl text-green-600 font-semibold mb-4 mt-4">Countries List</h2>
        <div v-if="loading">Loading countries...</div>
        <div v-else-if="error">❌ Sorry, something went wrong... please, try later</div>
        <UAlert v-else-if="paginatedCountries.length === 0 && !loading" class="text-green-500" variant="subtle"
            title="No countries to show" />
        <ul v-else class="list-disc text-green-500 pl-5 space-y-1">
            <li v-for="country in paginatedCountries" :key="country.countryCode">
                <!-- <NuxtLink :to="`/country/${country.countryCode}`" class="text-blue-600 hover:underline">
                    {{ country.name }} ({{ country.countryCode }})
                </NuxtLink> -->
                <ULink :to="`/country/${country.countryCode}`" class="text-green-500 font-semibold hover:underline"
                    v-html="highlightMatch(country.name, debouncedQuery) + ' - ' + country.countryCode" />
            </li>
        </ul>
        <div class="text-sm text-gray-500">Current page: {{ currentPage }}</div>

        <UContainer class="mt-6 flex justify-center">
            <UPagination v-model:page="currentPage" :page-count="perPage"
             :total="filteredCountries.length" size="sm"
            :max="5" />
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { useCountries } from '~/composables/useCountries'
import { useDebounce } from '@vueuse/core'

const { countries, error, loading } = useCountries()
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 700)

const currentPage = ref(1)
const perPage = 10

const totalPages = computed(() =>
    Math.ceil(filteredCountries.value.length / perPage)
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

// const paginatedCountries = computed(() => {
//     const start = (currentPage.value - 1) * perPage
//     return filteredCountries.value.slice(start, start + perPage)
// })

const paginatedCountries = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredCountries.value.slice(start, end)
})
</script>