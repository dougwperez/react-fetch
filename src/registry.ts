// Challenge and solution files are loaded as raw text: the challenge file seeds
// the editor, the solution file backs the read-only Solution tab. Nothing here
// is imported as a module — the editor's contents are compiled at runtime.

const challengeSources = import.meta.glob('./challenges/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const solutionSources = import.meta.glob('./solutions/*.tsx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const TITLES: Record<string, string> = {
  '01': 'Fetch & display users',
  '02': 'Search & filter',
  '03': 'Sort users',
  '04': 'Group posts by user',
  '05': 'Todo completion stats',
  '06': 'Dependent fetch',
  '07': 'Parallel fetch & join',
  '08': 'Pagination',
  '09': 'Loading, error & abort',
  '10': 'Transform into a table',
}

export const DEFAULT_CSS = `/* These styles apply to the preview pane only.
   Write plain selectors — they get scoped for you. */

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 6px 2px;
  border-bottom: 1px solid #262b38;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 6px 10px;
  border-bottom: 1px solid #262b38;
  text-align: left;
}

button {
  margin-right: 6px;
}
`

export type Entry = {
  id: string
  title: string
  file: string
  brief: string
  starter: string
  solution: string
}

function brief(source: string): string {
  const match = source.match(/\/\*([\s\S]*?)\*\//)
  return match ? match[1].replace(/^\s*Challenge:\s*/, '').trim() : ''
}

export const entries: Entry[] = Object.keys(challengeSources)
  .sort()
  .map((path) => {
    const file = path.split('/').pop() ?? path
    const id = file.slice(0, 2)
    const starter = challengeSources[path]

    return {
      id,
      title: TITLES[id] ?? file,
      file,
      brief: brief(starter),
      starter,
      solution: solutionSources[`./solutions/${file}`] ?? '// No solution for this one yet.',
    }
  })
