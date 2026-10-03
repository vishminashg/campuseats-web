import { useCallback, useEffect, useState } from 'react'

// The backend URL comes from an environment variable (not hard-coded),
// so it can differ between local development and production.
const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const DEMO_MENU = [
  { id: 1, name: 'Chicken Kottu', price: 850, category: 'Mains' },
  { id: 2, name: 'Vegetable Fried Rice', price: 650, category: 'Mains' },
  { id: 3, name: 'Egg Hopper', price: 120, category: 'Snacks' },
  { id: 4, name: 'Fish Cutlet', price: 90, category: 'Snacks' },
  { id: 5, name: 'Iced Milo', price: 300, category: 'Drinks' },
]

export default function App() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    if (!API) {
      // No backend configured: show demo data so the page still works.
      setItems(DEMO_MENU)
      setStatus(null)
      setLoading(false)
      return
    }

    try {
      const [menuRes, statusRes] = await Promise.all([
        fetch(`${API}/api/menu`),
        fetch(`${API}/api/status`),
      ])
      if (!menuRes.ok) {
        throw new Error(`Menu request failed (HTTP ${menuRes.status})`)
      }
      setItems(await menuRes.json())
      setStatus(statusRes.ok ? await statusRes.json() : null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="page">
      <header className="hero">
        <h1>🍽️ CampusEats</h1>
        <p>Order food from your campus canteen</p>
      </header>

      <section className="panel">
        <h2>Deployment status</h2>
        <ul className="status">
          <li><b>Frontend mode:</b> {import.meta.env.MODE}</li>
          <li><b>API URL:</b> {API || 'not configured (showing demo menu)'}</li>
          {status && (
            <>
              <li><b>API environment:</b> {status.environment}</li>
              <li>
                <b>Database:</b>{' '}
                <span className={status.database === 'connected' ? 'ok' : 'warn'}>
                  {status.database}
                </span>
              </li>
              <li><b>Server time (UTC):</b> {status.serverTime}</li>
            </>
          )}
        </ul>
      </section>

      <section className="panel">
        <h2>Today&apos;s menu</h2>

        {loading && (
          <p>Loading menu… (a free-tier backend may take up to a minute to wake up)</p>
        )}

        {error && (
          <div className="error">
            <p>⚠️ Could not load the menu: {error}</p>
            <button onClick={load}>Retry</button>
          </div>
        )}

        {!loading && !error && items.length === 0 && <p>No menu items available</p>}

        <div className="grid">
          {!loading &&
            !error &&
            items.map((item) => (
              <article className="card" key={item.id}>
                <span className="tag">{item.category}</span>
                <h3>{item.name}</h3>
                <p className="price">Rs. {Number(item.price).toFixed(2)}</p>
              </article>
            ))}
        </div>
      </section>

      <footer>SE3090 • Lab 11 • DevOps &amp; Cloud Hosting</footer>
    </div>
  )
}
