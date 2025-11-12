import { useState } from 'react';
import { parseCode, LanguageMode } from './utils/parser';
import { CodeEditor } from './components/CodeEditor';
import { ASTTree } from './components/ASTTree';

/**
 * Main App Component
 *
 * COMPILER INSIGHT: The Complete Pipeline
 * =========================================
 * This app demonstrates the first phase of compilation:
 *
 * 1. SOURCE CODE (text) → what humans write
 * 2. LEXICAL ANALYSIS → break into tokens
 * 3. SYNTACTIC ANALYSIS → build tree structure (AST)
 * 4. [Future phases: semantic analysis, optimization, code generation]
 *
 * We're showing steps 1-3. This is what every compiler does first,
 * whether it's JavaScript, TypeScript, Python, Rust, or C++.
 */
function App() {
  const [sourceCode, setSourceCode] = useState('const add = (a, b) => a + b');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('javascript');

  // Parse the code whenever it changes
  const parseResult = parseCode(sourceCode, languageMode);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderBottom: '1px solid #444',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', margin: 0 }}>
          Compile Time
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', margin: '0.5rem 0 0 0' }}>
          Watch your code transform into a tree. This is what the engine sees.
        </p>
      </div>

      {/* Split layout: Editor left, Tree right */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        {/* Left half: Code Editor */}
        <div style={{
          width: '50%',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <CodeEditor
            value={sourceCode}
            onChange={setSourceCode}
            mode={languageMode}
            onModeChange={setLanguageMode}
          />
        </div>

        {/* Right half: AST Tree */}
        <div style={{
          width: '50%',
          padding: '1rem',
          overflowY: 'auto',
          overflowX: 'auto',
        }}>
          {parseResult.success ? (
            <ASTTree ast={parseResult.ast} />
          ) : (
            <div style={{
              padding: '1rem',
              backgroundColor: '#3a1a1a',
              border: '1px solid #844',
              borderRadius: '4px',
              color: '#faa',
            }}>
              <strong>Parse Error:</strong> {parseResult.error}
              {parseResult.line && parseResult.column && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Line {parseResult.line}, Column {parseResult.column}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
