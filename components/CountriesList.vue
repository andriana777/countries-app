<template>
    <div class="p-4">
        <UInput v-model="searchQuery" placeholder="Search Input..." />
        <h2 class="text-xl font-semibold mb-4">Available Countries</h2>
        <div v-if="loading">Loading countries...</div>
        <div v-else-if="error">❌ Sorry, something went wrong... please, try later</div>

        <ul v-else class="list-disc pl-5 space-y-1">
            <li v-for="country in filteredCountries" :key="country.countryCode">
                <NuxtLink :to="`/country/${country.countryCode}`" class="text-blue-600 hover:underline">
                    {{ country.name }} ({{ country.countryCode }})
                </NuxtLink>
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

const filteredCountries = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return countries.value.filter(
    c =>
      c.name.toLowerCase().includes(query) ||
     c.name.toLowerCase().includes(debouncedQuery.value.toLowerCase())
  )
})

</script>