import { ref } from 'vue'
import type { Ref } from 'vue'

export type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'

export interface UseHttpOptions<TBody = unknown> {
  url: string
  method?: HttpMethod
  headers?: HeadersInit
  body?: TBody
  immediate?: boolean
  credentials?: RequestCredentials
}

export function useApiRequest<TResponse = unknown, TBody = unknown>(
    options: UseHttpOptions<TBody>
) {
  const data: Ref<TResponse | null> = ref(null)
  const error: Ref<unknown | null> = ref(null)
  const status: Ref<number | null> = ref(null)

  const loading = ref(false)
  const success = ref(false)

  const execute = async (overrideOptions?: Partial<UseHttpOptions<TBody>>) => {
    loading.value = true
    success.value = false
    error.value = null

    const finalOptions = {
      ...options,
      ...overrideOptions,
    }

    try {
      const response = await fetch(finalOptions.url, {
        method: finalOptions.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...finalOptions.headers,
        },
        body:
            finalOptions.body !== undefined
                ? JSON.stringify(finalOptions.body)
                : undefined,
        credentials: finalOptions.credentials,
      })

      status.value = response.status

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      data.value = contentType?.includes('application/json')
          ? await response.json()
          : ((await response.text()) as unknown as TResponse)

      success.value = true
      return data.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  if (options.immediate !== false) {
    execute()
  }

  return {
    data,
    error,
    status,
    loading,
    success,
    execute,
  }
}
