import { useState, useEffect } from 'react';

export function EditableField({ 
  value, 
  onSave, 
  type = 'text',
  placeholder = '',
  className = '',
  rows = 3
}: { 
  value: string | number; 
  onSave: (val: string) => void;
  type?: 'text' | 'textarea' | 'number';
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  const [localVal, setLocalVal] = useState(value || '');

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const handleBlur = () => {
    if (localVal !== (value || '')) {
      onSave(localVal.toString());
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.currentTarget.blur();
    }
  };

  if (type === 'textarea') {
    return (
      <textarea
        className={className}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }

  return (
    <input
      type={type}
      className={className}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
}
