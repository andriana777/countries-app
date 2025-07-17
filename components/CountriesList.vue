<template>
    <div class="">
        <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search Input..." />
        <h2 class="text-xl text-green-600 font-semibold mb-4 mt-4">Countries List</h2>
        <div v-if="loading">Loading countries...</div>
        <div v-else-if="error">❌ Sorry, something went wrong... please, try later</div>
         <UAlert v-else-if="filteredCountries.length === 0 && !loading" 
         class="text-green-500" variant="subtle"
         title="No countries to show" />
        <ul v-else class="list-disc text-green-500 pl-5 space-y-1">
            <li v-for="country in filteredCountries" :key="country.countryCode">
                <!-- <NuxtLink :to="`/country/${country.countryCode}`" class="text-blue-600 hover:underline">
                    {{ country.name }} ({{ country.countryCode }})
                </NuxtLink> -->
                <ULink :to="`/country/${country.countryCode}`" class="text-green-500 font-semibold hover:underline"
                    v-html="highlightMatch(country.name, debouncedQuery) + ' - ' + country.countryCode" />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useCountries } from '~/composables/useCountries'
import { useDebounce } from '@vueuse/core'

const { countries, error, loading } = useCountries()
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery, 700)

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

</script>