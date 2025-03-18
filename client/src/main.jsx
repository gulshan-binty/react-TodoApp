import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import CreateTodo from './pages/CreateTodo.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TodoDetails from './pages/TodoDetails.jsx';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/createTodo" element={<CreateTodo />} />
      <Route path="/todo-details/:id" element={<TodoDetails />} />
      <Route path="/edit/:id" element={<CreateTodo />} />
    </Routes>
  </BrowserRouter>
);
