<template>
  <div>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <pre v-else-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
    <button @click="execute()" :disabled="loading">
      {{ loading ? 'Загрузка...' : 'Получить данные' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useApiRequest } from '../composables/useApiRequest/useApiRequest.ts'
interface User {
  id: number;
  name: string;
  email: string;
}

const {loading, data, error, execute} = useApiRequest<User>({
  url: 'https://jsonplaceholder.typicode.com/users/1',
  method: 'GET',
  immediate: false,
});
</script>
