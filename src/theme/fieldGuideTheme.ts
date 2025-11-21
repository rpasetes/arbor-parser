/**
 * Field Guide CodeMirror Theme
 *
 * A naturalist's notebook aesthetic for code editing.
 * Inspired by hand-annotated field guides and botanical specimens.
 */

import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// Color palette (matching naturalist.css)
const colors = {
  // Paper & ink
  paper: '#faf8f3',
  ink: '#2d1f14',
  inkBrown: '#3d2817',
  inkFaded: '#5a4230',
  inkLight: '#6b5444',

  // Botanical accents (for syntax highlighting)
  vermillion: '#c84f31',  // keywords, operators
  indigo: '#3d5a7f',       // strings
  verdigris: '#4a6b5a',    // numbers, constants
  ochre: '#d4915e',        // functions, methods

  // UI elements
  selection: 'rgba(200, 79, 49, 0.15)',
  cursor: '#c84f31',
  lineNumber: '#8b7355',
  activeLineNumber: '#3d2817',
  gutterBg: '#f4efe1',
  activeLine: 'rgba(61, 40, 23, 0.04)',
};

// Theme definition
export const fieldGuideTheme = EditorView.theme({
  '&': {
    color: colors.ink,
    backgroundColor: colors.paper,
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    lineHeight: '1.6',
    height: '100%',
  },

  '.cm-content': {
    caretColor: colors.cursor,
    padding: '12px 0',
  },

  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: colors.cursor,
    borderLeftWidth: '2px',
  },

  '&.cm-focused .cm-cursor': {
    borderLeftColor: colors.cursor,
  },

  '&.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: colors.selection,
  },

  '.cm-selectionBackground': {
    backgroundColor: colors.selection,
  },

  '.cm-activeLine': {
    backgroundColor: colors.activeLine,
  },

  '.cm-gutters': {
    backgroundColor: colors.gutterBg,
    color: colors.lineNumber,
    border: 'none',
    borderRight: `2px solid ${colors.inkLight}`,
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
  },

  '.cm-activeLineGutter': {
    backgroundColor: colors.activeLine,
    color: colors.activeLineNumber,
    fontWeight: '600',
  },

  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 12px 0 8px',
    minWidth: '40px',
    textAlign: 'right',
  },

  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'var(--font-mono)',
  },

  // Custom scrollbar styling (matching naturalist.css)
  '.cm-scroller::-webkit-scrollbar': {
    width: '10px',
    height: '10px',
  },

  '.cm-scroller::-webkit-scrollbar-track': {
    background: colors.gutterBg,
    borderLeft: `1px solid ${colors.inkLight}`,
  },

  '.cm-scroller::-webkit-scrollbar-thumb': {
    background: colors.inkLight,
    borderRadius: '2px',
    border: `2px solid ${colors.gutterBg}`,
  },

  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    background: colors.inkBrown,
  },

  // Matching bracket highlighting
  '&.cm-focused .cm-matchingBracket': {
    backgroundColor: 'rgba(200, 79, 49, 0.15)',
    outline: `1px solid ${colors.vermillion}`,
    borderRadius: '2px',
  },

  '&.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: 'rgba(200, 79, 49, 0.1)',
  },

  // Search/selection
  '.cm-searchMatch': {
    backgroundColor: 'rgba(212, 145, 94, 0.3)',
    outline: `1px solid ${colors.ochre}`,
  },

  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: 'rgba(212, 145, 94, 0.5)',
  },

  // Tooltips
  '.cm-tooltip': {
    backgroundColor: colors.paper,
    border: `1.5px solid ${colors.inkLight}`,
    borderRadius: '4px',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    boxShadow: '0 4px 12px rgba(61, 40, 23, 0.15)',
  },

  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: colors.selection,
      color: colors.ink,
    },
  },
}, { dark: false });

// Syntax highlighting
const fieldGuideHighlightStyle = HighlightStyle.define([
  // Keywords (vermillion - scientific terminology)
  { tag: t.keyword, color: colors.vermillion, fontWeight: '600' },
  { tag: t.controlKeyword, color: colors.vermillion, fontWeight: '600' },
  { tag: t.modifier, color: colors.vermillion },

  // Operators (vermillion - critical symbols)
  { tag: t.operator, color: colors.vermillion },
  { tag: t.punctuation, color: colors.inkBrown },
  { tag: t.bracket, color: colors.inkBrown },
  { tag: t.brace, color: colors.inkBrown },

  // Strings (indigo - specimen labels)
  { tag: t.string, color: colors.indigo, fontStyle: 'italic' },
  { tag: t.regexp, color: colors.indigo },
  { tag: t.escape, color: colors.vermillion },

  // Numbers & constants (verdigris - measurements)
  { tag: [t.number, t.bool, t.null], color: colors.verdigris, fontWeight: '500' },

  // Functions & methods (ochre - active elements)
  { tag: t.definition(t.function(t.variableName)), color: colors.ochre, fontWeight: '500' },

  // Types & classes (brown ink - classification)
  { tag: t.typeName, color: colors.inkBrown, fontWeight: '600' },
  { tag: t.className, color: colors.inkBrown, fontWeight: '600' },
  { tag: t.namespace, color: colors.inkBrown },

  // Variables (ink - standard notation)
  { tag: t.variableName, color: colors.ink },
  { tag: t.propertyName, color: colors.ink },
  { tag: t.attributeName, color: colors.ink },
  { tag: t.labelName, color: colors.ink, fontWeight: '500' },

  // Comments (faded ink - marginalia)
  { tag: t.comment, color: colors.inkFaded, fontStyle: 'italic' },
  { tag: t.lineComment, color: colors.inkFaded, fontStyle: 'italic' },
  { tag: t.blockComment, color: colors.inkFaded, fontStyle: 'italic' },
  { tag: t.docComment, color: colors.inkLight, fontStyle: 'italic' },

  // Special (light ink)
  { tag: t.meta, color: colors.inkLight },
  { tag: t.processingInstruction, color: colors.inkLight },

  // Invalid/error (vermillion emphasis)
  { tag: t.invalid, color: colors.vermillion, textDecoration: 'underline wavy' },
]);

export const fieldGuide: Extension = [
  fieldGuideTheme,
  syntaxHighlighting(fieldGuideHighlightStyle),
];
