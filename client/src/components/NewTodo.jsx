import React,{useState} from 'react'

const NewTodo = (props) => {
  const [todo, setTodo] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
    if (todo.trim() === "") return; 
    props.onNewTodo(todo);
    setTodo(""); 
  };

  return (
    <form onClick={handleSubmit} className="bg-gray-500 py-4 text-white text-center w-md rounded-md">
     
        <input
          type="text"
          id="newtodo"
          name="newtodo"
          value={todo}
          placeholder='enter a new todo....'
          onChange={(e) => setTodo(e.target.value)}
          className="border-1 mx-3 p-1 rounded-sm w-1/2"
        />
   
      <button className="bg-gray-700 p-2 font-medium rounded-sm hover:bg-gray-600">
        Create Todo
      </button>
    </form>
  );
};

export default NewTodo;


