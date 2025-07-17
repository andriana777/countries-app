<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Holidays for country: {{ country?.name || code }}</h2>

    <div v-if="loading">Loading holidays...</div>
    <div v-else-if="error">❌ Error: {{ error.message }}</div>

    <ul v-else class="list-disc pl-5 space-y-1">
      <li v-for="holiday in holidays" :key="holiday.date">
        {{ holiday.date }} — {{ holiday.localName }} ({{ holiday.name }})
      </li>
    </ul>

   <div class="flex gap-2 mb-6 flex-wrap">
      <button
        v-for="year in years"
        :key="year"
        @click="selectedYear = year"
        class="px-4 py-2 border rounded-md"
        :class="{
          'bg-blue-600 text-white': year === selectedYear,
          'bg-gray-100 hover:bg-gray-200': year !== selectedYear
        }"
      >
        {{ year }}
      </button>
    </div>

    <NuxtLink to="/" class="mt-4 inline-block text-blue-600 hover:underline">
      ← Back to country list
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHolidays } from '~/composables/useHolidays'
import { useCountries } from '~/composables/useCountries'

const route = useRoute()
const code = route.params.code as string
const years = Array.from({ length: 11 }, (_, i) => 2020 + i)
const selectedYear = ref(new Date().getFullYear())

const { holidays, loading, error, fetchHolidays } = useHolidays(code, selectedYear.value)
const { countries } = useCountries()

const country = computed(() =>
  countries.value.find(c => c.countryCode === code)
)


// watch(currentYear, (newYear) => {
//   // useHolidays уже слушает currentYear, если передать reactive, иначе придется добавить логику
// })

watch(selectedYear, (year) => {
  fetchHolidays(year)
})

</script>
