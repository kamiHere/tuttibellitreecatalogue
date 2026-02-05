export const formatScientificName = (value) => {
  if (!value) return "";
  const [genus, species, ...rest] = value.trim().split(/\s+/);
  const formattedGenus =
    genus.charAt(0).toUpperCase() + genus.slice(1).toLowerCase();
  const formattedSpecies = species ? species.toLowerCase() : "";
  const formattedRest = rest.map((part) => part.toLowerCase()).join(" ");
  return [formattedGenus, formattedSpecies, formattedRest]
    .filter(Boolean)
    .join(" ");
};
