import { useState, useEffect } from 'react';
import { fetchTodos, addTodo, deleteTodo, updateTodoStatus, deleteTodosByIds, updateTodo } from '@/services/todoServices';
import TodoCard from '@/components/TodoCard';
import TodoModal from '@/components/TodoModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Todo } from '@/interface/todo.types';

export default function IndexPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const fetchAllTodos = async () => {
    try {
      const todosData = await fetchTodos();
      setTodos(todosData);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to fetch todos. Please try again later.');
    }
  };

  const handleSaveTodo = async (todo: Partial<Todo>) => {
    try {
      if (editingTodo) {
        const updatedTodo = await updateTodo(editingTodo.id, todo);
        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t))
        );
        toast.success('Todo updated successfully.');
      } else {
        const newTodo = await addTodo(todo);
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        toast.success('Todo added successfully.');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving todo:', error);
      toast.error('Failed to save todo. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success('Todo deleted successfully.');
    } catch (error) {
      console.error(`Error deleting todo with id ${id}:`, error);
      toast.error('Failed to delete todo. Please try again.');
    }
  };

  const handleStatusChange = async (id: number) => {
    try {
      await updateTodoStatus(id);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
      );
      toast.success('Todo status updated successfully.');
    } catch (error) {
      console.error(`Error updating status for todo with id ${id}:`, error);
      toast.error('Failed to update todo status. Please try again.');
    }
  };
  

  const handleDeleteSelected = async () => {
    try {
      await deleteTodosByIds(selectedTodos);
      setTodos(prevTodos => prevTodos.filter(todo => !selectedTodos.includes(todo.id)));
      setSelectedTodos([]);
      toast.success('Selected todos deleted successfully.');
    } catch (error) {
      console.error('Error deleting selected todos:', error);
      toast.error('Failed to delete selected todos. Please try again.');
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTodos(todos.map(todo => todo.id));
    } else {
      setSelectedTodos([]);
    }
  };

  const handleSelectTodo = (id: number) => {
    if (selectedTodos.includes(id)) {
      setSelectedTodos(prevSelected => prevSelected.filter(todoId => todoId !== id));
    } else {
      setSelectedTodos(prevSelected => [...prevSelected, id]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={selectedTodos.length === todos.length}
              onChange={handleSelectAll}
            />
            Select All
          </label>
        </div>
        <div className='flex justify-between'>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded mr-2"
            onClick={() => {
              setEditingTodo(null);
              setIsModalOpen(true);
            }}
          >
            Add New
          </button>
          <button
            className={`px-4 py-2 ${selectedTodos.length === 0 ? 'bg-gray-400' : 'bg-red-500'} text-white rounded`}
            onClick={handleDeleteSelected}
            disabled={selectedTodos.length === 0}
          >
            Delete Selected
          </button>
        </div>
        
      </div>
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onEdit={() => {
            setEditingTodo(todo);
            setIsModalOpen(true);
          }}
          onDelete={() => handleDelete(todo.id)}
          onStatusChange={() => handleStatusChange(todo.id)}
          onSelect={handleSelectTodo}
          selected={selectedTodos.includes(todo.id)}
        />
      ))}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTodo}
        todo={editingTodo || undefined}
      />
      <ToastContainer />
    </div>
  );
}
