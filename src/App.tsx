function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">ELEXON · WIND OPERATIONS</p>
        <h1>Wind Procurement Insight</h1>
        <p className="subtitle">UK day-ahead wind forecast performance</p>
      </header>
      <section className="foundation-card" aria-labelledby="foundation-title">
        <p className="eyebrow">Dashboard foundation</p>
        <h2 id="foundation-title">January 2026 analysis is ready to connect</h2>
        <p>
          The frontend foundation is configured for the FastAPI analysis and forecast-version
          endpoints. Dashboard views are being built on top of the typed API contract.
        </p>
      </section>
    </main>
  );
}

export default App;
