// components/TodoModal.tsx

import { Todo } from '@/interface/todo.types';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Partial<Todo>) => void;
  todo?: Todo;
}

const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, onSave, todo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [todo]);

  const handleSubmit = () => {
    if (!title) {
      toast.error('Title is required');
      return;
    }

    onSave({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl mb-4">{todo ? 'Edit Todo' : 'Add Todo'}</h2>
        <label className="block mb-2">
          Title
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Description
          <textarea
            className="w-full border border-gray-300 rounded p-2 mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoModal;
