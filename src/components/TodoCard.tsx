import React, { useState } from 'react';
import moment from 'moment';
import { Todo } from '@/interface/todo.types';

interface TodoCardProps {
  todo: Todo;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: () => Promise<void>;
  onSelect: (id: number) => void;
  selected: boolean;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit, onDelete, onStatusChange, onSelect, selected }) => {
  const [showDescription, setShowDescription] = useState(false);

  const handleStatusChange = async () => {
    await onStatusChange();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(todo.id)}
            className="form-checkbox mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <p className="text-sm text-gray-500">{moment(todo.createdAt).format('YYYY-MMM-DD')}</p>
          </div>
        </div>
        <div
          className={`px-2 py-1 text-sm ${todo.isCompleted ? 'bg-green-500' : 'bg-blue-500'} text-white rounded cursor-pointer`}
          onClick={handleStatusChange}
        >
          {todo.isCompleted ? 'Completed' : 'Incomplete'}
        </div>
        <div className="flex">
          <button
            className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-2">
        <button
          className="text-blue-500"
          onClick={() => setShowDescription(!showDescription)}
        >
          {showDescription ? 'Hide Details' : 'Show Details'}
        </button>
        {showDescription && (
          <p className="mt-2 text-gray-700">
            {todo.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoCard;
