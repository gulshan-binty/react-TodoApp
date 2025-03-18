import React from 'react'
import Todo from './Todo'

const Todos = (props) => {
  
  return (
    <div className="w-xl">
      {props.todos.map((todo) => (
        <Todo todo={todo} key={todo._id} setTodos={props.setTodos}/>
      ))}
    </div>
  );
}

export default Todos