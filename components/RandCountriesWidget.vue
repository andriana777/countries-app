<template>
    <div class="p-4 border rounded-xl shadow bg-white">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">🎲 Random Countries</h2>
        </div>

        <div v-if="loading">Loading countries...</div>
        <div v-else-if="error">❌ Failed to load countries</div>
        <ul v-else class="space-y-2">
            <li v-for="country in randomCountries" :key="country.countryCode">
                <NuxtLink :to="`/country/${country.countryCode}`" class="text-blue-600 hover:underline">
                    {{ country.name }} ({{ country.countryCode }})
                </NuxtLink>
                <div class="text-sm text-gray-600 ml-2 mt-1">
                    <span v-if="holidayMap[country.countryCode]">
                        🎉 {{ holidayMap[country.countryCode].name }} — {{ holidayMap[country.countryCode].date }}
                    </span>
                    <span v-else>🔄 Loading holiday...</span>
                </div>
            </li>
        </ul>
        <UButton @click="reshuffle" icon="i-heroicons-arrow-path">
            Reshuffle
        </UButton>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCountries } from '~/composables/useCountries'

const { countries, loading, error } = useCountries()
const randomCountries = ref<any[]>([])

const holidayMap = ref<Record<string, { name: string; date: string }>>({})

async function fetchNextHoliday(countryCode: string) {
    try {
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${countryCode}`)
        const data = await response.json()
        const today = new Date()

        const next = data.find((holiday: any) => new Date(holiday.date) >= today)
        if (next) {
            holidayMap.value[countryCode] = {
                name: next.localName,
                date: next.date
            }
        } else {
            holidayMap.value[countryCode] = {
                name: 'No upcoming holidays',
                date: ''
            }
        }
    } catch (e) {
        holidayMap.value[countryCode] = {
            name: 'Failed to load holiday',
            date: ''
        }
    }
}

async function reshuffle() {
    if (countries.value.length < 3) return

    const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)
    randomCountries.value = selected

    holidayMap.value = {}

    await Promise.all(selected.map(c => fetchNextHoliday(c.countryCode)))
}

watchEffect(() => {
    if (!loading.value && countries.value.length > 0) {
        reshuffle()
    }
})
</script>
