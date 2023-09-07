import useSWR from "swr"
import { fetcher } from "../utils/fetcher"
export default function FetchById(id: string) {
  const { data, error, isLoading } = useSWR(`/tasks/${id}`, fetcher)
  return {
    todo: data,
    isLoading,
    isError: error
  }
}
