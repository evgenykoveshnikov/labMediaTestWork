<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.email" type="email" @blur="touchAndValidateField('email')"/>
    <span v-if="errors.email" class="error">{{ errors.email }}</span>

    <input v-model="form.password" type="password" @blur="touchAndValidateField('password')"/>
    <span v-if="errors.password" class="error">{{ errors.password }}</span>

    <button :disabled="!isValid">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormValidator } from '../composables/useFormValidator/useFormValidator.ts';

const form = ref({
  email: '',
  password: ''
});

const rules = {
  email: {
    rules: [
      (v: string) => !!v || 'Email обязателен',
      (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Неверный email'
    ]
  },
  password: {
    rules: [
      (v: string) => !!v || 'Пароль обязателен',
      (v: string) => v.length >= 6 || 'Минимум 6 символов'
    ]
  }
};

const { fieldErrors: errors, isFormValid: isValid, validateForm, touchAndValidateField } =
    useFormValidator(form, rules);

const handleSubmit = () => {
  if (validateForm()) {
    console.log('Форма валидна!',form.value);
  }
};
</script>
