type TodoState = {
  id: number
  text: string
  done: boolean
}
type AppActionTodo = {
  type: string
  payload: any
}

export const initialState = [
  {
    id: 1,
    text: "Jujutsu kaisen"
  },
  { id: 2, text: "Zoom 100" },
  {
    id: 3,
    text: "Engage Kiss"
  },
  { id: 4, text: "Eminence in shadow" }
]

export const todoReducer = (state: TodoState[], action: AppActionTodo) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { ...action.payload }]
    case "DELETE":
      return state.filter((t: TodoState) => t.id !== action.payload)

    default:
      return [...state]
  }
}
