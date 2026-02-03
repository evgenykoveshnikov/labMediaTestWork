export type Validator<T = any> = (value: T) => true | string;

export interface FieldRules<T = any> {
  rules: Validator<T>[];
}

export type FormRules<T extends Record<string, any>> = {
  [K in keyof T]?: FieldRules<T[K]>;  // ? для опциональных полей
};
