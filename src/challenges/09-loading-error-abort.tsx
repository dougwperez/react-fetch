/*
Challenge:

Fetch users from:
https://jsonplaceholder.typicode.com/users

This one is about doing the fetch *properly*.

1. Track three things in state: data, loading, error.
2. Check response.ok and throw when the request failed —
   fetch does NOT reject on a 404 or 500.
3. Render a different UI for each state: loading / error / success.
4. Add a "Reload" button that refetches.
5. Use an AbortController and abort the request in the effect cleanup,
   so an unmount mid-flight doesn't set state on a dead component.

Try pointing the URL at /userz to see your error branch actually run.
*/

export default function LoadingErrorAbort() {
  return <div>fuck you</div>
}
