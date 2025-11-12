import { LanguageMode } from '../utils/parser';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  mode: LanguageMode;
  onModeChange: (mode: LanguageMode) => void;
}

/**
 * CodeEditor Component
 *
 * COMPILER INSIGHT: The Source Code Phase
 * ==========================================
 * This is where everything starts. Before parsing, before ASTs, before execution,
 * there's just text. Raw characters that humans write.
 *
 * The compiler's first job is to take this text and make sense of it.
 * That's what our parser does when we pass it to parseCode().
 */
export function CodeEditor({ value, onChange, mode, onModeChange }: CodeEditorProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      width: '100%',
      flex: 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label htmlFor="code-input" style={{ fontWeight: 'bold' }}>
          Source Code:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onModeChange('javascript')}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: mode === 'javascript' ? '#646cff' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            JavaScript
          </button>
          <button
            onClick={() => onModeChange('typescript')}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: mode === 'typescript' ? '#646cff' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            TypeScript
          </button>
        </div>
      </div>
      <textarea
        id="code-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        style={{
          width: '100%',
          flex: 1,
          minHeight: '200px',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '0.75rem',
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          border: '1px solid #444',
          borderRadius: '4px',
          resize: 'none',
        }}
        placeholder="Enter JavaScript or TypeScript code..."
      />
    </div>
  );
}
