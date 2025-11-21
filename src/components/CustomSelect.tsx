import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

export function CustomSelect({ value, onChange, options, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div style={{ marginBottom: "var(--space-md)" }}>
      <label
        className="specimen-label"
        style={{
          display: "block",
          marginBottom: "var(--space-sm)",
        }}
      >
        {label}
      </label>

      <div ref={containerRef} style={{ position: 'relative' }}>
        {/* Custom select button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="custom-select-button"
          style={{
            width: '100%',
            padding: '0.618rem',
            paddingRight: '40px',
            backgroundColor: 'var(--paper-pristine)',
            color: 'var(--ink-fresh)',
            border: '1.5px solid var(--ink-light)',
            borderRadius: '3px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            textAlign: 'left',
            position: 'relative',
            transition: 'all var(--duration-quick) var(--ease-natural)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--paper-aged)';
            e.currentTarget.style.borderColor = 'var(--ink-brown)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--paper-pristine)';
            e.currentTarget.style.borderColor = 'var(--ink-light)';
          }}
        >
          {selectedOption?.label || 'Select...'}

          {/* Custom chevron arrow */}
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
              transition: 'transform var(--duration-quick) var(--ease-natural)',
              pointerEvents: 'none',
            }}
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#3d2817"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Custom dropdown menu */}
        {isOpen && (
          <div
            className="paper-elevated"
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--paper-pristine)',
              border: '1.5px solid var(--ink-light)',
              borderRadius: '3px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.618rem',
                  backgroundColor: option.value === value ? 'var(--paper-aged)' : 'transparent',
                  color: 'var(--ink-fresh)',
                  border: 'none',
                  borderBottom: '1px solid var(--paper-stained)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'background-color var(--duration-quick) var(--ease-natural)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--paper-weathered)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = option.value === value ? 'var(--paper-aged)' : 'transparent';
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
