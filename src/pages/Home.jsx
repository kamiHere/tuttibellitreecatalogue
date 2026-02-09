import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import scaniaLogo from "../assets/scanialogo.png";
import tuttiBelliLogo from "../assets/tuttibelli-logo.png";
import { formatScientificName } from "../lib/formatters.js";
import { fetchTrees } from "../lib/firestore.js";

export default function Home() {
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("Todas");
  const [speciesFilter, setSpeciesFilter] = useState("Todas");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [trees, setTrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isActive = true;
    const loadTrees = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await fetchTrees();
        if (isActive) setTrees(data);
      } catch (error) {
        if (isActive) {
          setLoadError(
            "Não foi possível carregar os dados do catálogo. Tente novamente.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    loadTrees();
    return () => {
      isActive = false;
    };
  }, []);

  const locations = useMemo(() => {
    const unique = new Set(trees.map((tree) => tree.location));
    return ["Todas", ...Array.from(unique).sort()];
  }, [trees]);

  const species = useMemo(() => {
    const unique = new Set(
      trees.map((tree) => tree.commonName).filter(Boolean)
    );
    return ["Todas", ...Array.from(unique).sort()];
  }, [trees]);

  const speciesCount = useMemo(() => {
    const unique = new Set(
      trees.map((tree) => tree.commonName?.toLowerCase()).filter(Boolean)
    );
    return unique.size;
  }, [trees]);

  const filteredTrees = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return trees.filter((tree) => {
      const matchesLocation =
        locationFilter === "Todas" || tree.location === locationFilter;
      const matchesSpecies =
        speciesFilter === "Todas" || tree.commonName === speciesFilter;
      if (!matchesLocation || !matchesSpecies) return false;
      if (!normalized) return matchesLocation;
      return (
        [tree.id, tree.commonName, tree.scientificName, tree.location]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalized))
      );
    });
  }, [query, locationFilter, speciesFilter, trees]);

  const scrollPageToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const saved = window.sessionStorage.getItem("homeScrollY");
    if (!saved) return;
    const target = Number(saved);
    if (Number.isFinite(target) && target > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: target });
      });
    }
  }, []);

  const handleCardClick = () => {
    window.sessionStorage.setItem("homeScrollY", String(window.scrollY));
  };

  return (
    <div className="page">
      <Link className="scania-header" to="/">
        <img src={scaniaLogo} alt="Scania" />
        <div className="scania-title">Projeto de Reflorestamento Scania</div>
      </Link>

      <header className="hero">
        <div className="title-row">
          <div>
            <div className="title-meta">
              <span className="eyebrow">Catálogo digital</span>
              <span className="inline-tag">TCRA Nº 3549/2024</span>
            </div>
            <h1>Inventário completo de árvores</h1>
          </div>
        </div>
        <p className="hero-copy">
          A lista oficial reúne todas as árvores catalogadas no projeto de
          reflorestamento da Scania. Selecione um local ou pesquise por espécie
          para encontrar rapidamente o indivíduo desejado.
        </p>
      </header>

      <main className="content">
        <section className="grid">
          <article className="card identification">
            <h3>Resumo do catálogo</h3>
            <ul>
              <li>
                <span>Total de árvores</span>
                <strong>{isLoading ? "-" : trees.length}</strong>
              </li>
              <li>
                <span>Espécies registradas</span>
                <strong>{isLoading ? "-" : speciesCount}</strong>
              </li>
              <li>
                <span>Locais monitorados</span>
                <strong>{isLoading ? "-" : locations.length - 1}</strong>
              </li>
            </ul>
            <p className="meta">Atualização: Fevereiro de 2026</p>
          </article>

          <article className="card info">
            <h3>Sobre o projeto</h3>
            <p>
              O catálogo digital facilita o acompanhamento das árvores plantadas
              na Scania. Cada registro corresponde a um indivíduo identificado,
              com localização, espécie e dados associados ao QR code.
            </p>
            <p className="muted">
              Scania Latin America Ltda • Logistic Parts Center (LPC).
            </p>
            <p className="muted">
              Endereço: R. Comendador João Lucas Vinhedo, 580 - Distrito
              Industrial, Vinhedo - SP, 13288-184.
            </p>
          </article>
        </section>

        <section className="card catalog">
          <div className="catalog-header">
            <div>
              <h3>Lista completa de árvores</h3>
              <p className="muted">
                {isLoading
                  ? "Carregando registros..."
                  : `${filteredTrees.length} resultados encontrados de ${trees.length}.`}
              </p>
            </div>
            <div className="filters">
              <div className="field">
                <label htmlFor="search">Busca</label>
                <input
                  id="search"
                  type="search"
                  placeholder="ID, espécie, local..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="species">Espécie</label>
                <select
                  id="species"
                  value={speciesFilter}
                  onChange={(event) => setSpeciesFilter(event.target.value)}
                >
                  {species.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="location">Localização</label>
                <select
                  id="location"
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="tree-scroll">
            <div className="tree-grid">
            {loadError ? (
              <article className="card info">
                <h3>Erro ao carregar</h3>
                <p>{loadError}</p>
              </article>
            ) : (
              filteredTrees.map((tree) => (
                <article key={tree.id} className="tree-card">
                  <div className="tree-header">
                    <span className="tree-id">ID {tree.id}</span>
                    <span className="tree-location">{tree.location}</span>
                  </div>
                  <h4>{tree.commonName}</h4>
                  <span className="scientific-name">
                    {formatScientificName(tree.scientificName)}
                  </span>
                  <Link
                    className="tree-link"
                    to={`/arvore/${tree.id}`}
                    onClick={handleCardClick}
                  >
                    Ver ficha da árvore
                  </Link>
                </article>
              ))
            )}
            </div>
          </div>

          <div className={`scroll-actions${showScrollTop ? "" : " hidden"}`}>
            <button
              type="button"
              className="scroll-top"
              onClick={scrollPageToTop}
              aria-label="Voltar ao topo da página"
            >
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span>Projeto realizado por Tutti Belli</span>
          <img src={tuttiBelliLogo} alt="Tutti Belli" />
        </div>
      </footer>
    </div>
  );
}
