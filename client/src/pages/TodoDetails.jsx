import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate} from "react-router";

const TodoDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [todo, setTodo] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`);
        if (!response.ok) {
          throw new Error("Todo not found");
        }
        const data = await response.json();
        setTodo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!todo) return <p className="text-center text-red-500">Todo not found!</p>;

const handleDelete = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      navigate("/"); 
    } else {
      console.error("Failed to delete todo");
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <Link
          to="/"
          className="text-green-600 hover:text-green-800 transition mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>

        <img
          src={todo.image}
          alt={todo.title}
          className="w-full h-64 object-contain rounded-md mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-800">{todo.title}</h2>
        <p className="text-gray-600 mt-2">{todo.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {todo.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() =>
              navigate(`/edit/${todo._id}`)
            }
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Edit Todo
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;
