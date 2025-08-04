import React, { useState, useRef } from 'react';
import { Plus, Download, Eye, Palette, Type, Image, QrCode, Save } from 'lucide-react';
import { BadgeTemplate, BadgeField } from '../../types';
import QRCodeLib from 'react-qr-code';

interface BadgeDesignerProps {
  templates: BadgeTemplate[];
  onSaveTemplate: (template: Partial<BadgeTemplate>) => void;
  onGenerateBadges: (templateId: string) => void;
}

const defaultTemplate: Partial<BadgeTemplate> = {
  name: 'New Template',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  dimensions: { width: 400, height: 600 },
  fields: [],
};

export const BadgeDesigner: React.FC<BadgeDesignerProps> = ({
  templates,
  onSaveTemplate,
  onGenerateBadges,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Partial<BadgeTemplate>>(defaultTemplate);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Tech Corp',
    title: 'Software Engineer',
  });

  const addField = (type: BadgeField['type']) => {
    const newField: BadgeField = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Sample Text' : type === 'qr' ? 'QR-CODE-DATA' : '',
      position: { x: 50, y: 100 },
      size: { width: type === 'qr' ? 100 : 200, height: type === 'qr' ? 100 : 40 },
      style: {
        fontSize: 16,
        fontWeight: 'normal',
        color: selectedTemplate.textColor || '#000000',
      },
    };

    setSelectedTemplate(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }));
    setSelectedField(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<BadgeField>) => {
    setSelectedTemplate(prev => ({
      ...prev,
      fields: prev.fields?.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ) || [],
    }));
  };

  const deleteField = (fieldId: string) => {
    setSelectedTemplate(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== fieldId) || [],
    }));
    setSelectedField(null);
  };

  const renderField = (field: BadgeField) => {
    if (!field) {
      return null;
    }

    const style = {
      position: 'absolute' as const,
      left: field.position.x,
      top: field.position.y,
      width: field.size.width,
      height: field.size.height,
      fontSize: field.style.fontSize,
      fontWeight: field.style.fontWeight,
      color: field.style.color,
      cursor: 'pointer',
      border: selectedField === field.id ? '2px solid #3B82F6' : '1px solid transparent',
      borderRadius: '4px',
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedField(field.id);
    };

    switch (field.type) {
      case 'text':
        return (
          <div
            key={field.id}
            style={style}
            onClick={handleClick}
            className="flex items-center justify-center bg-transparent"
          >
            {field.content.includes('{') ? 
              field.content.replace('{firstName}', previewData.firstName)
                          .replace('{lastName}', previewData.lastName)
                          .replace('{email}', previewData.email)
                          .replace('{company}', previewData.company)
                          .replace('{title}', previewData.title)
              : field.content
            }
          </div>
        );
      case 'qr':
        return (
          <div
            key={field.id}
            style={style}
            onClick={handleClick}
            className="flex items-center justify-center bg-white p-1"
          >
            <QRCodeLib value={field.content || 'SAMPLE-QR-CODE'} size={field.size.width - 8} />
          </div>
        );
      default:
        return null;
    }
  };

  const selectedFieldData = selectedTemplate.fields?.find(f => f.id === selectedField);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Badge Designer</h2>
          <p className="text-gray-500 mt-1">Create and customize badge templates</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedTemplate(defaultTemplate)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
          <button
            onClick={() => onSaveTemplate(selectedTemplate)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Library */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Templates</h3>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <p className="font-medium text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500">
                  {template.isVipTemplate ? 'VIP Template' : 'Regular Template'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Design Canvas */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Design Canvas</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => addField('text')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Add Text"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => addField('qr')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Add QR Code"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden shadow-lg"
              style={{
                width: selectedTemplate.dimensions?.width || 400,
                height: selectedTemplate.dimensions?.height || 600,
                backgroundColor: selectedTemplate.backgroundColor || '#ffffff',
                minHeight: '400px',
              }}
              onClick={() => setSelectedField(null)}
            >
              {selectedTemplate.fields?.map(renderField)}
              
              {selectedTemplate.fields?.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 mx-auto mb-2" />
                    <p>Click the buttons above to add elements</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
          
          <div className="space-y-4">
            {/* Template Properties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={selectedTemplate.name || ''}
                onChange={(e) => setSelectedTemplate(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={selectedTemplate.backgroundColor || '#ffffff'}
                  onChange={(e) => setSelectedTemplate(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="w-8 h-8 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  value={selectedTemplate.backgroundColor || '#ffffff'}
                  onChange={(e) => setSelectedTemplate(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVip"
                checked={selectedTemplate.isVipTemplate || false}
                onChange={(e) => setSelectedTemplate(prev => ({ ...prev, isVipTemplate: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isVip" className="ml-2 text-sm text-gray-700">
                VIP Template
              </label>
            </div>

            {/* Field Properties */}
            {selectedFieldData && (
              <>
                <hr className="border-gray-200" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Selected Element</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <textarea
                        value={selectedFieldData.content}
                        onChange={(e) => updateField(selectedField!, { content: e.target.value })}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-20 resize-none"
                        placeholder="Enter text or use {firstName}, {lastName}, {email}, {company}, {title}"
                      />
                    </div>

                    {selectedFieldData.type === 'text' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Font Size
                          </label>
                          <input
                            type="number"
                            value={selectedFieldData.style.fontSize || 16}
                            onChange={(e) => updateField(selectedField!, { 
                              style: { ...selectedFieldData.style, fontSize: parseInt(e.target.value) }
                            })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            min="8"
                            max="72"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Font Weight
                          </label>
                          <select
                            value={selectedFieldData.style.fontWeight || 'normal'}
                            onChange={(e) => updateField(selectedField!, { 
                              style: { ...selectedFieldData.style, fontWeight: e.target.value }
                            })}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="normal">Normal</option>
                            <option value="bold">Bold</option>
                            <option value="lighter">Light</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={selectedFieldData.style.color || '#000000'}
                              onChange={(e) => updateField(selectedField!, { 
                                style: { ...selectedFieldData.style, color: e.target.value }
                              })}
                              className="w-6 h-6 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              value={selectedFieldData.style.color || '#000000'}
                              onChange={(e) => updateField(selectedField!, { 
                                style: { ...selectedFieldData.style, color: e.target.value }
                              })}
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      onClick={() => deleteField(selectedField!)}
                      className="w-full bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete Element
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Data */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Preview Data</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(previewData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs text-gray-600 mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setPreviewData(prev => ({ ...prev, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};