import { useEffect, useRef } from 'react'
import { EditorState, type Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { oneDark } from '@codemirror/theme-one-dark'

type Props = {
  /** Changing this rebuilds the document — switch challenge, reset, load solution. */
  docKey: string
  value: string
  language: 'tsx' | 'css'
  readOnly?: boolean
  onChange?: (next: string) => void
  onRun?: () => void
}

export default function Editor({ docKey, value, language, readOnly, onChange, onRun }: Props) {
  const host = useRef<HTMLDivElement>(null)
  // Keep the newest callbacks reachable without rebuilding the editor on every render.
  const handlers = useRef({ onChange, onRun })
  handlers.current = { onChange, onRun }

  useEffect(() => {
    if (!host.current) return

    const extensions: Extension[] = [
      basicSetup,
      language === 'css' ? css() : javascript({ jsx: true, typescript: true }),
      oneDark,
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' },
      }),
      keymap.of([
        {
          key: 'Mod-Enter',
          preventDefault: true,
          run: () => {
            handlers.current.onRun?.()
            return true
          },
        },
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) handlers.current.onChange?.(update.state.doc.toString())
      }),
      EditorState.readOnly.of(Boolean(readOnly)),
      EditorView.editable.of(!readOnly),
    ]

    const view = new EditorView({
      state: EditorState.create({ doc: value, extensions }),
      parent: host.current,
    })

    return () => view.destroy()
    // `value` is intentionally excluded: it is the seed, and docKey controls reseeding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, language, readOnly])

  return <div className="editor" ref={host} />
}
