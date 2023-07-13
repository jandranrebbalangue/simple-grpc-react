import React, { useReducer } from "react";
import "./App.css";
import { initialState, todoReducer } from "./reducers/todosReducer";

type TodoProps = {
  id: number;
  text: string;
  done: boolean;
};
function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <>
      <div className="card">
        {state.map((item: TodoProps) => {
          return (
            <React.Fragment key={item.id}>
              <p>
                {item.id} &nbsp;
                {item.text}
              </p>
              <p>{item.done}</p>
              <button
                onClick={() => dispatch({ type: "DELETE", payload: item.id })}
              >
                Delete
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}

export default App;
