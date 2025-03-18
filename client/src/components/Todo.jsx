import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const Todo = (props) => {
  const { todo, status, _id } = props.todo;

  const [checked, setChecked] = useState(status);

  const handleCheckboxChange = async () => {
    const newStatus = !checked; 

    try {
      const res = await fetch(`http://localhost:3000/api/todos/${_id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setChecked(newStatus); 
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

const handleDelete = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/todos/${_id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      props.setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== _id));
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

  return (
    <div className="bg-amber-200 mt-3 p-3 rounded-md flex justify-between items-center">
      <span>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className="w-6 h-6 border-2 border-gray-300 rounded-sm cursor-pointer transition duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500"
        />
      </span>
      <h3 className={`text-2xl ${checked ? "line-through text-gray-500" : ""}`}>
        {todo}
      </h3>
      <button className="text-3xl text-red-600" onClick={handleDelete}>
        {" "}
        <FontAwesomeIcon icon={faTrash} size="xs" />
      </button>
    </div>
  );
};

export default Todo;
