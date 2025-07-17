export const useApi = () => {
  const baseURL = useRuntimeConfig().public.apiBase;

  const fetcher = async <T>(url: string): Promise<T> => {
    const { data, error } = await useFetch<T>(`${baseURL}/${url}`);
    if (error.value) throw new Error(error.value.message);
    return data.value as T;
  };

  return { fetcher };
};