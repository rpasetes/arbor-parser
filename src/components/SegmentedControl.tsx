interface SegmentedControlProps {
  options: string[];
  selected: string;
  onChange: (option: string) => void;
}

export function SegmentedControl({ options, selected, onChange }: SegmentedControlProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        backgroundColor: '#2a2a2a',
        borderRadius: '6px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option.toLowerCase())}
          style={{
            padding: '6px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: selected === option.toLowerCase() ? '#444' : 'transparent',
            color: selected === option.toLowerCase() ? '#fff' : '#aaa',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: selected === option.toLowerCase() ? '600' : '400',
            transition: 'all 0.15s ease',
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
