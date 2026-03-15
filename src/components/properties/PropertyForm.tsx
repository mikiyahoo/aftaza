'use client';

import { useState } from 'react';
import Spinner from '@/components/ui/Spinner';

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
}

export default function PropertyForm({ initialData, onSubmit }: PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
      // Show success message
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
      
      {/* Submit button with loading state */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Spinner size="sm" color="white" />
            <span>Saving...</span>
          </>
        ) : (
          <span>{initialData ? 'Update' : 'Create'} Property</span>
        )}
      </button>
    </form>
  );
}