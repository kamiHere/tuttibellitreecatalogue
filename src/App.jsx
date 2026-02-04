const tree = {
  id: "001",
  commonName: "Ipê Amarelo",
  scientificName: "Handroanthus albus",
  location: "Passeio Público",
  lastUpdate: "Atualização: Setembro de 2024",
};

const photoPlaceholders = [
  { id: 1, label: "Foto frontal" },
  { id: 2, label: "Detalhe da copa" },
  { id: 3, label: "Tronco e plaqueta" },
];

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="brand">Projeto de Reflorestamento Scania</div>
        <h1>Catálogo de Árvores</h1>
        <p>
          Cada árvore possui uma plaqueta com QR code que direciona para esta
          página de referência. As informações e fotos são atualizadas ao longo
          do tempo.
        </p>
      </header>

      <main className="content">
        <section className="card highlight">
          <div>
            <span className="eyebrow">Árvore catalogada</span>
            <h2>
              {tree.commonName} <span>({tree.scientificName})</span>
            </h2>
          </div>
          <div className="id-pill">
            <span>ID</span>
            <strong>{tree.id}</strong>
          </div>
        </section>

        <section className="grid">
          <article className="card">
            <h3>Identificação</h3>
            <ul>
              <li>
                <span>Nome científico</span>
                <strong>{tree.scientificName}</strong>
              </li>
              <li>
                <span>Espécie popular</span>
                <strong>{tree.commonName}</strong>
              </li>
              <li>
                <span>Localização</span>
                <strong>{tree.location}</strong>
              </li>
            </ul>
            <p className="meta">{tree.lastUpdate}</p>
          </article>

          <article className="card">
            <h3>Fotos da árvore</h3>
            <p className="muted">
              Espaço reservado para imagens reais do projeto. Envie novas fotos
              sempre que houver crescimento ou manutenção.
            </p>
            <div className="photos">
              {photoPlaceholders.map((photo) => (
                <div className="photo" key={photo.id}>
                  <div className="photo-icon">+</div>
                  <span>{photo.label}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card info">
          <h3>Sobre o projeto</h3>
          <p>
            O catálogo digital facilita o acompanhamento das árvores plantadas
            na Scania. Cada página corresponde a um indivíduo identificado, com
            histórico de localização, espécie e registros fotográficos.
          </p>
        </section>
      </main>

      <footer className="footer">
        <span>Scania • Sustentabilidade e reflorestamento</span>
      </footer>
    </div>
  );
}
