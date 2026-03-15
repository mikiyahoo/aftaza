'use client';

import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  X,
  Image as ImageIcon,
  FileText,
  Users,
  Settings
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'file';
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
  description: string;
}

export default function AdminComponentsPage() {
  const [templates, setTemplates] = useState<FormTemplate[]>([
    {
      id: 'property-form',
      name: 'Property Form',
      description: 'Form template for property listings',
      fields: [
        {
          id: 'title',
          type: 'text',
          label: 'Property Title',
          placeholder: 'Enter property title',
          required: true
        },
        {
          id: 'price',
          type: 'number',
          label: 'Price (ETB)',
          placeholder: 'Enter price in ETB',
          required: true
        },
        {
          id: 'location',
          type: 'text',
          label: 'Location',
          placeholder: 'Enter property location',
          required: true
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          placeholder: 'Enter property description',
          required: true
        },
        {
          id: 'property_type',
          type: 'select',
          label: 'Property Type',
          options: ['Residential', 'Commercial', 'Land', 'Mixed Use'],
          required: true
        }
      ]
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addField = () => {
    if (!selectedTemplate) return;
    
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter field label'
    };

    setSelectedTemplate({
      ...selectedTemplate,
      fields: [...selectedTemplate.fields, newField]
    });
  };

  const removeField = (fieldId: string) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate({
      ...selectedTemplate,
      fields: selectedTemplate.fields.filter(f => f.id !== fieldId)
    });
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    if (!selectedTemplate) return;
    
    setSelectedTemplate({
      ...selectedTemplate,
      fields: selectedTemplate.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    });
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            id={`rendered-select-${field.id}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'file':
        return (
          <div>
            <label htmlFor={`file-input-${field.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={`file-input-${field.id}`}
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required={field.required}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Components</h1>
          <p className="text-gray-600">Manage form templates and reusable components</p>
        </div>
                <button
                  onClick={() => setShowFormBuilder(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  aria-label="Create new template"
                >
                  <Plus className="w-5 h-5" aria-hidden="true" />
                  <span>New Template</span>
                </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowPreview(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="Preview"
                  aria-label="Preview template"
                >
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Preview template</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowFormBuilder(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600"
                  title="Edit"
                  aria-label="Edit template"
                >
                  <Edit className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Edit template</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this template?')) {
                      setTemplates(templates.filter(t => t.id !== template.id));
                    }
                  }}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Delete"
                  aria-label="Delete template"
                >
                  <Trash2 className="w-5 h-5" aria-hidden="true" />
                  <span className="sr-only">Delete template</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Fields</span>
                <span className="font-medium">{template.fields.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Required</span>
                <span className="font-medium">
                  {template.fields.filter(f => f.required).length}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {template.fields.slice(0, 3).map((field) => (
                <span key={field.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {field.label}
                </span>
              ))}
              {template.fields.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{template.fields.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Form Builder Modal */}
      {showFormBuilder && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Form Builder</h2>
                  <p className="text-sm text-gray-600">{selectedTemplate.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowFormBuilder(false);
                    setSelectedTemplate(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close form builder"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Field Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Fields</h3>
                  <button
                    onClick={addField}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    aria-label="Add new field"
                  >
                    Add Field
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedTemplate.fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Field {index + 1}</span>
                        <button
                          onClick={() => removeField(field.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                      <label htmlFor={`label-${field.id}`} className="block text-xs text-gray-600 mb-1">Label</label>
                      <input
                        id={`label-${field.id}`}
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                        </div>
                        <div>
                          <label htmlFor={`type-${field.id}`} className="block text-xs text-gray-600 mb-1">Type</label>
                          <select
                            id={`type-${field.id}`}
                            value={field.type}
                            onChange={(e) => updateField(field.id, { type: e.target.value as FormField['type'] })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="textarea">Textarea</option>
                            <option value="number">Number</option>
                            <option value="select">Select</option>
                            <option value="file">File</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor={`placeholder-${field.id}`} className="block text-xs text-gray-600 mb-1">Placeholder</label>
                          <input
                            id={`placeholder-${field.id}`}
                            type="text"
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <label className="flex items-center space-x-2 text-xs">
                            <input
                              type="checkbox"
                              checked={field.required || false}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            />
                            <span>Required</span>
                          </label>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div>
                          <label htmlFor={`options-${field.id}`} className="block text-xs text-gray-600 mb-1">Options (comma-separated)</label>
                          <input
                            id={`options-${field.id}`}
                            type="text"
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(field.id, { 
                              options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean) 
                            })}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="font-medium mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label htmlFor={`preview-field-${field.id}`} className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label="Cancel">
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2" aria-label="Save form">
                      <Save className="w-4 h-4" aria-hidden="true" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{selectedTemplate.name}</h2>
                  <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {selectedTemplate.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={`preview-modal-field-${field.id}`} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" aria-label="Submit form">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}