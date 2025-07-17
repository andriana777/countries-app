<template>
    <div class="container">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <CountriesList />
            <RandCountriesWidget />

        </div>
    </div>
</template>

<script setup lang="ts">
// import { data } from 'autoprefixer';
import RandCountriesWidget from '~/components/RandCountriesWidget.vue';

const value = ref('')

//const { data: page } = await useFetch('https://date.nager.at/api/v3')
// const data = fetch('https://date.nager.at/api/v3/AvailableCountries');

import { watchEffect } from 'vue'
import { useCountries } from '~/composables/useCountries'

const { countries, error, loading } = useCountries()

watchEffect(() => {
  if (loading.value) {
    console.log('Loading countries...')
  } else if (error.value) {
    console.error('Ошибка:', error.value)
  } else {
    console.log('Countries loaded:', countries.value)
  }
})


</script>