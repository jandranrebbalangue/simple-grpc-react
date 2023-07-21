import useSWR from "swr";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fetcher } from "./constants";

type TodosProps = {
  id: string;
  text: string;
};

async function addTodo(body: TodosProps) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/todos`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
function App() {
  const { data, isLoading, mutate } = useSWR("/todos", fetcher);
  if (isLoading) return <CircularProgress />;
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Anime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item: TodosProps) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button
        onClick={async () => {
          const newTodo = {
            id: "3",
            text: "oshi no ko",
          };
          await mutate(addTodo(newTodo), {
            optimisticData: [newTodo],
          });
        }}
      >
        Add Todo
      </button>
    </>
  );
}

export default App;
