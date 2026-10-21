/*
Challenge:

Fetch a 14-day forecast for London from:
https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=UTC&forecast_days=14

Note the shape — this API returns PARALLEL ARRAYS, not an array of objects:

  daily.time               = ["2026-09-18", "2026-09-19", ...]
  daily.temperature_2m_max = [20.2, 19.4, ...]
  daily.temperature_2m_min = [12.4, 11.8, ...]
  daily.precipitation_sum  = [0.2, 0, ...]

1. Create state for the rows.
2. Fetch the API data when the component mounts.
3. Zip the parallel arrays into one object per day:
     { date, max, min, range, rain }
   where range = max - min, rounded to 1 decimal place.
4. Render a <table>, formatting the date with toLocaleDateString().
5. Flag the warmest day in the set.
*/

export default function TransformTable() {
  return <div>fuck you</div>
}
