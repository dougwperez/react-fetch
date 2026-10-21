import { useEffect, useRef } from 'react'
import { EditorState, Prec, type Extension } from '@codemirror/state'
import { EditorView, keymap, scrollPastEnd } from '@codemirror/view'
import { acceptCompletion } from '@codemirror/autocomplete'
import { indentWithTab } from '@codemirror/commands'
import { basicSetup } from 'codemirror'
import { javascript, scopeCompletionSource } from '@codemirror/lang-javascript'
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

    const lang = language === 'css' ? css() : javascript({ jsx: true, typescript: true })

    const extensions: Extension[] = [
      basicSetup,
      lang,
      // Completions otherwise only cover identifiers already in the file. This
      // adds the runtime globals the challenges actually reach for — fetch,
      // console, JSON, Promise — along with their members.
      ...(language === 'css'
        ? []
        : [lang.language.data.of({ autocomplete: scopeCompletionSource(globalThis) })]),
      oneDark,
      // Room to scroll past the last line, so the bottom of the file doesn't sit
      // jammed against the edge of the pane while you're editing it.
      scrollPastEnd(),
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': { fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' },
        '.cm-content': { paddingBottom: '24px' },
      }),
      // Prec.high keeps Tab ahead of anything basicSetup binds. Tab takes the
      // open completion; with no completion showing it falls through to indent.
      Prec.high(keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab])),
      keymap.of([
        {
          key: 'Mod-Enter',
          preventDefault: true,
          run: () => {
            handlers.current.onRun?.()
            return true
          },
        },
        {
          // Binding Tab means it no longer moves focus, so keyboard users need
          // a way out. This sits below the completion keymap, which takes
          // Escape first while the popup is open.
          key: 'Escape',
          run: (view) => {
            view.contentDOM.blur()
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
