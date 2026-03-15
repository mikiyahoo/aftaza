import { useState } from 'react';

interface BulkActionsProps {
  count: number;
  onAction: (action: string) => void;
  onClear: () => void;
}

export default function BulkActions({ count, onAction, onClear }: BulkActionsProps) {
  const [action, setAction] = useState('');

  const handleAction = () => {
    if (action) {
      onAction(action);
      setAction('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {count} items selected
          </span>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            aria-label="Bulk action"
          >
            <option value="">Select action</option>
            <option value="activate">Activate</option>
            <option value="deactivate">Deactivate</option>
            <option value="delete">Delete</option>
            <option value="archive">Archive</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAction}
            disabled={!action}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Action
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}