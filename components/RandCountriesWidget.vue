<template>
  <div class="p-4 border rounded-xl shadow bg-white">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">🎲 Random Countries</h2>
      <UButton @click="reshuffle" icon="i-heroicons-arrow-path">Reshuffle</UButton>
    </div>

    <div v-if="loading">Loading countries...</div>
    <div v-else-if="error">❌ Failed to load countries</div>
    <ul v-else class="space-y-2">
      <li v-for="country in randomCountries" :key="country.countryCode">
        <NuxtLink
          :to="`/country/${country.countryCode}`"
          class="text-blue-600 hover:underline"
        >
          {{ country.name }} ({{ country.countryCode }})
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCountries } from '~/composables/useCountries'

const { countries, loading, error } = useCountries()
const randomCountries = ref<any[]>([])

function reshuffle() {
  if (countries.value.length < 3) return

  const shuffled = [...countries.value].sort(() => 0.5 - Math.random())
  randomCountries.value = shuffled.slice(0, 3)
}

// Вызываем один раз при загрузке
watchEffect(() => {
  if (!loading.value && countries.value.length > 0) {
    reshuffle()
  }
})
</script>

