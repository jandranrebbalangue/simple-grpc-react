import useSWR from "swr"
import { fetcher } from "../constants"
export default function FetchById(id: string) {
  const { data, error, isLoading } = useSWR(`/tasks/${id}`, fetcher)
  return {
    todo: data,
    isLoading,
    isError: error
  }
}
