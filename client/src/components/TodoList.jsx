import React, { useState, useEffect } from "react";
import Todos from "./Todos";
import NewTodo from "./NewTodo";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((response) => response.json())
      .then((todos) => {
        setTodos(todos);
      })
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const createNewTodo = async (todoText) => {
    const res = await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({ todo: todoText, status: false }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("Failed to add todo");
      return;
    }

    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
  };

  return (
    <div className="flex-col justify-items-center mt-8">
      <NewTodo onNewTodo={createNewTodo} />
      <Todos todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default TodoList;
