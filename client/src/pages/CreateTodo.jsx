import React, { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import { useNavigate, useParams } from "react-router";

const TodoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const allTags = ["Work", "Personal", "Household", "Shopping", "Fitness"];
  const [tags, setTags] = useState(allTags); 
  const [deletedTags, setDeletedTags] = useState([]); 
  const [todoData, setTodoData] = useState({
    title: "",
    description: "",
    tags: [],
    dueDate: "",
    email:""
  });
  const [postImage, setPostImage] = useState({
    myFile: "",
  });

useEffect(() => {
  if (id) {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/todos/${id}`);
        if (!response.ok) {
          throw new Error("Todo not found");
        }
        const data = await response.json();
        setTodoData({
          ...data,
          tags: data.tags || [],
        });
        setTags(data.tags || []); 
        setPostImage(data.image || ""); 
      } catch (err) {
        console.error("Error fetching todo:", err);
      }
    };

    fetchTodo();
  }
}, [id]);


  const handleChange = (e) => {
    setTodoData({
      ...todoData,
      [e.target.name]: e.target.value,
    });
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    const removedTag = newTags.splice(index, 1);
    setTags(newTags);
    setDeletedTags([...deletedTags, ...removedTag]);
    setTodoData({ ...todoData, tags: newTags });
  };

  const restoreTag = (tag) => {
    setTags([...tags, tag]);
    setDeletedTags(deletedTags.filter((deletedTag) => deletedTag !== tag));
    setTodoData({ ...todoData, tags: [...tags, tag] });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await convertToBase64(file);
    setPostImage({ myFile: base64 }); 
    setTodoData({ ...todoData, image: base64 }); 
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  try {
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3000/api/todos/${id}`
      : "http://localhost:3000/api/todos";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (response.ok) {
      setTodoData({
        title: "",
        description: "",
        tags: [],
        dueDate: "",
        email:""
      });
      setTags(allTags);
      setDeletedTags([]);
      navigate("/");
    } else {
      console.error("Failed to submit todo");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-purple-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {id ? "Edit Todo" : "Create Todo"}
        </h2>

        <input
          placeholder="Enter Title"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          type="text"
          id="title"
          name="title"
          value={todoData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="description"
          name="description"
          placeholder="Enter Description"
          value={todoData.description}
          onChange={handleChange}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          placeholder="Enter email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          type="email"
          id="email"
          name="email"
          value={todoData.email}
          onChange={handleChange}
          required
        />
        <div className="mb-6">
          <DateTimePicker
            onChange={(date) =>
              setTodoData({ ...todoData, dueDate: date.toLocaleString() })
            }
            value={todoData.dueDate}
            className="w-full p-3 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image (optional)
          </label>
          <input
            type="file"
            name="myFile"
            accept=".jpeg, .png, .jpg"
            onChange={handleFileUpload}
            className="w-full p-3 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {(postImage.myFile || postImage) && (
          <div className="mb-6">
            <img
              src={postImage.myFile || postImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded-md shadow-md"
            />
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Select Your Tags
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gradient-to-r from-green-200 to-indigo-100 text-green-700 px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition duration-200 transform"
              >
                <span className="text-sm font-medium">{tag}</span>
                <button
                  className="ml-2 text-red-500 hover:text-red-700 transition"
                  type="button"
                  onClick={() => removeTag(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          {deletedTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Recently Removed Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {deletedTags.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => restoreTag(tag)}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-sm hover:bg-green-200 transition duration-200"
                  >
                    {tag} ↻
                  </button>
                ))}
              </div>
            </div>
          )}

          <ReactTagInput
            tags={tags}
            onChange={(newTags) => {
              setTags(newTags);
              setTodoData({ ...todoData, tags: newTags });
            }}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-700 text-white rounded-md hover:bg-green-600 transition duration-200"
        >
          {id ? "Update Todo" : "Create Todo"}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
