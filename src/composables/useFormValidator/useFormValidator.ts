import type {FormRules} from './types.ts'
import { ref, reactive, computed, watch, type Ref } from 'vue';

export function useFormValidator<T extends Record<string, any>>(
    formData: Ref<T>,
    rules: FormRules<T>
) {
  // Реактивные ошибки по полям
  const fieldErrors = reactive<Record<string, string | null>>({});
  const isTouched = ref(false);

  // Проверка одного поля
  const validateField = <K extends keyof T>(field: K): boolean => {
    const value = formData.value[field];
    const fieldRules = rules[field].rules;
    for (const rule of fieldRules) {
      const result = rule(value as any);
      if (result !== true) {
        fieldErrors[field as string] = result;
        return false;
      }
    }
    fieldErrors[field as string] = null;
    return true;
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    isTouched.value = true;
    let isValid = true;
    Object.keys(rules).forEach((key) => {
      if (!validateField(key as keyof T)) {
        isValid = false;
      }
    });
    return isValid;
  };

  // Реактивная валидность формы
  const isFormValid = computed(() => {
    return !isTouched.value || Object.values(fieldErrors).every((error) => error === null);
  });

  const touchAndValidateField = <K extends keyof T>(field: K) => {
    validateField(field);
  };

  // Автовалидация при изменении полей (опционально)
  // watch(formData, () => {
  //   Object.keys(rules).forEach((key) => validateField(key as keyof T));
  // }, { deep: true });

  // Сброс ошибок
  const resetErrors = () => {
    Object.keys(fieldErrors).forEach((key) => {
      fieldErrors[key] = null;
    });
  };

  return {
    fieldErrors,
    isFormValid,
    validateField,
    validateForm,
    touchAndValidateField,
    resetErrors: () => {
      Object.keys(fieldErrors).forEach(k => fieldErrors[k] = null);
      isTouched.value = false;
    }
  };
}
