import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import scaniaLogo from "../assets/scanialogo.png";
import tuttiBelliLogo from "../assets/tuttibelli-logo.png";
import trees from "../data/trees.json";
import { formatScientificName } from "../lib/formatters.js";

const photoPlaceholders = [
  { id: 1, label: "Foto geral" },
  { id: 2, label: "Foto da placa" },
  { id: 3, label: "+ fotos", isAdd: true },
];

export default function TreeDetail() {
  const { id } = useParams();
  const [activePhoto, setActivePhoto] = useState(null);

  const tree = useMemo(() => trees.find((item) => item.id === id), [id]);

  const openPhoto = (photo) => setActivePhoto(photo);
  const closePhoto = () => setActivePhoto(null);

  return (
    <div className="page">
      <Link className="scania-header" to="/">
        <img src={scaniaLogo} alt="Scania" />
        <div className="scania-title">Projeto de Reflorestamento Scania</div>
      </Link>

      {tree ? (
        <>
          <div className="detail-actions">
            <Link className="back-home" to="/">
              Retornar ao início
            </Link>
          </div>
          <header className="hero">
            <div className="title-row">
              <div>
                <div className="title-meta">
                  <span className="eyebrow">Árvore catalogada</span>
                  <span className="inline-tag">ID {tree.id}</span>
                </div>
                <h1>
                  {tree.commonName}
                  <span className="scientific-name">
                    {formatScientificName(tree.scientificName)}
                  </span>
                </h1>
              </div>
            </div>
            <p className="hero-copy">
              Cada árvore possui uma plaqueta com QR code que direciona para esta
              página de referência. As informações e fotos são atualizadas ao
              longo do tempo.
            </p>
          </header>

          <main className="content">
            <section className="grid">
              <article className="card identification">
                <h3>Identificação</h3>
                <ul>
                  <li>
                    <span>Nome científico</span>
                    <strong className="scientific-name">
                      {formatScientificName(tree.scientificName)}
                    </strong>
                  </li>
                  <li>
                    <span>Espécie popular</span>
                    <strong>{tree.commonName}</strong>
                  </li>
                  <li>
                    <span>Localização</span>
                    <strong>{tree.location}</strong>
                  </li>
                  <li>
                    <span>Termo de Compromisso de Recuperação Ambiental</span>
                    <strong>TCRA Nº 3549/2024</strong>
                  </li>
                </ul>
                <p className="meta">Atualização: Fevereiro de 2026</p>
              </article>

              <article className="card">
                <h3>Fotos</h3>
                <p className="muted">
                  Espaço reservado para imagens reais do projeto. Envie novas
                  fotos sempre que houver crescimento ou manutenção.
                </p>
                <div className="photos">
                  {photoPlaceholders.map((photo) => (
                    <button
                      type="button"
                      className={`photo${photo.isAdd ? " add" : ""}`}
                      key={photo.id}
                      onClick={() => openPhoto(photo)}
                    >
                      <div className="photo-preview">
                        <div className="photo-icon">+</div>
                      </div>
                      <span className="photo-label">{photo.label}</span>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            <section className="card info">
              <h3>Sobre o projeto</h3>
              <p>
                O catálogo digital facilita o acompanhamento das árvores
                plantadas na Scania. Cada página corresponde a um indivíduo
                identificado, com histórico de localização, espécie e registros
                fotográficos.
              </p>
            </section>
          </main>
        </>
      ) : (
        <header className="hero">
          <div className="title-row">
            <div>
              <div className="title-meta">
                <span className="eyebrow">Árvore não encontrada</span>
                <span className="inline-tag">ID {id}</span>
              </div>
              <h1>Registro indisponível</h1>
            </div>
          </div>
          <p className="hero-copy">
            Não encontramos uma árvore com essa tag. Volte ao catálogo para
            selecionar outro registro.
          </p>
        </header>
      )}

      <footer className="footer">
        <div className="footer-brand">
          <span>Projeto realizado por Tutti Belli</span>
          <img src={tuttiBelliLogo} alt="Tutti Belli" />
        </div>
      </footer>

      {activePhoto && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-backdrop"
            onClick={closePhoto}
            aria-label="Fechar visualização ampliada"
          />
          <div className="lightbox-content">
            <div className="lightbox-preview">
              <div className="photo-icon">+</div>
            </div>
            <div className="lightbox-meta">
              <span>Prévia ampliada</span>
              <strong>{activePhoto.label}</strong>
            </div>
            <button type="button" className="lightbox-close" onClick={closePhoto}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
