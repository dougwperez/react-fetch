/*
Challenge:

Fetch both of these at the same time:
https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/users

1. Fetch both in parallel with Promise.all — not one after the other.
2. Build a lookup of userId -> user name (a Map or a plain object).
3. Join the two: attach the author's name to each post.
4. Display the first 20 posts as "title — by Author Name".

Why this matters: two sequential awaits take twice as long for no reason.
*/

export default function ParallelJoin() {
  return <div>fuck you</div>
}
