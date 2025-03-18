import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDueDate, setSelectedDueDate] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/todos");
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data);
        setFilteredTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = todos;

    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDueDate) {
      filtered = filtered.filter((todo) => {
        // Convert DB date format (3/16/2025, 12:00:00 AM) to YYYY-MM-DD
        const todoDate = new Date(todo.dueDate).toLocaleDateString("en-CA"); // Converts to YYYY-MM-DD

        return todoDate === selectedDueDate;
      });
    }

    if (selectedTag) {
      filtered = filtered.filter((todo) => todo.tags?.includes(selectedTag));
    }

    setFilteredTodos(filtered);
  }, [searchQuery, selectedDueDate, selectedTag, todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-900">My Todos</h2>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search Todos..."
                className="w-full border border-green-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-green-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                size="xs"
                className="absolute left-3 top-4 text-gray-500"
              />
            </div>

            {/* Due Date Filter */}
            <input
              type="date"
              value={selectedDueDate}
              onChange={(e) => setSelectedDueDate(e.target.value)}
              className="border rounded-lg px-4 py-2 border-green-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            />

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="border rounded-lg px-4 py-2 border-green-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-300"
            >
              <option value="">All Tags</option>
              {[...new Set(todos.flatMap((todo) => todo.tags || []))].map(
                (tag, index) => (
                  <option key={index} value={tag}>
                    {tag}
                  </option>
                )
              )}
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSelectedDueDate("");
                setSelectedTag("");
                setSearchQuery("");
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>

            {/* Create Todo Button */}
            <Link
              to="/createTodo"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
            >
              + Create Todo
            </Link>
          </div>
        </div>

        {/* Display Todos */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <Link
                  to={`/todo-details/${todo._id}`}
                  key={todo._id}
                  className="relative bg-white border border-gray-200 rounded-lg shadow-md p-4 transition transform hover:scale-105 hover:shadow-xl"
                >
                  {/* Todo Image */}
                  {todo.image && (
                    <img
                      src={todo.image}
                      alt={todo.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}

                  {/* Todo Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {todo.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {todo.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {todo.tags?.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {todo.tags?.length > 2 && (
                      <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                        +{todo.tags.length - 2} more
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-green-600 opacity-0 hover:opacity-10 transition duration-300"></div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">
                No matching todos found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
