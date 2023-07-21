import useSWR from "swr";
import { fetcher } from "../constants";
export default function fetchById(id: string) {
  const { data, error, isLoading } = useSWR(`/todos/${id}`, fetcher);
  return {
    todo: data,
    isLoading,
    isError: error,
  };
}
