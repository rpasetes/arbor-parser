import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { fieldGuide } from '../theme/fieldGuideTheme';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * CodeEditor Component
 *
 * PARSING INSIGHT: Before the Tree
 * =================================
 * Code starts as plain text—characters you type on a keyboard.
 * To computers, "const x = 5" is just a string, no different from "hello world".
 *
 * The parser's job is to read this text and understand its structure:
 * - What's a keyword vs a variable name?
 * - What's being assigned to what?
 * - How are expressions nested?
 *
 * When you press a key, this editor updates. When parseCode() runs,
 * text transforms into a tree—the foundation for every tool you use.
 *
 * Even the syntax highlighting you see here? That's parsing too.
 * CodeMirror tokenizes each line to know what colors to apply.
 */
export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        javascript({ typescript: true }), // TypeScript mode handles both JS and TS
        fieldGuide, // Field guide theme
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    // Ensure editor fills container and handles overflow
    view.dom.style.height = '100%';

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []); // Only create editor once

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-sm)',
      width: '100%',
      flex: 1,
      minHeight: 0, // Key for flex scrolling
    }}>
      <label
        className="specimen-label"
        style={{
          fontWeight: 600,
          letterSpacing: '0.02em',
          flexShrink: 0,
        }}
      >
        Source Code:
      </label>
      <div
        ref={editorRef}
        className="paper-elevated"
        style={{
          width: '100%',
          flex: 1,
          minHeight: 0, // Allow flex to constrain height
          overflow: 'hidden',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}
