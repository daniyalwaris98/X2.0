export const selectTodos = (state) => state.todos;

export const selectCompletedTodos = (state) => {
  const allTodos = selectTodos(state);
  return allTodos.filter((todo) => todo.completed);
};
