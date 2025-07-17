<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Holidays for country: {{ code }}</h2>

    <div v-if="loading">Loading holidays...</div>
    <div v-else-if="error">❌ Error: {{ error.message }}</div>

    <ul v-else class="list-disc pl-5 space-y-1">
      <li v-for="holiday in holidays" :key="holiday.date">
        {{ holiday.date }} — {{ holiday.localName }} ({{ holiday.name }})
      </li>
    </ul>

    <NuxtLink to="/" class="mt-4 inline-block text-blue-600 hover:underline">
      ← Back to country list
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHolidays } from '~/composables/useHolidays'

const route = useRoute()
const code = route.params.code as string

const { holidays, loading, error } = useHolidays(code)
</script>
