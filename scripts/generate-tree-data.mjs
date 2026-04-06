import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "src", "data", "raw", "source");

const SOURCE_FILE_NAME =
  process.env.TREE_SOURCE_FILE ??
  fs
    .readdirSync(sourceDir)
    .find((name) =>
      name.startsWith("R01-LOCALIZAÇÃO VIA PLANTA - 325 ÁRVORES ATUAL"),
    );

if (!SOURCE_FILE_NAME) {
  throw new Error(`Source CSV not found in ${sourceDir}.`);
}

const sourcePath = path.join(sourceDir, SOURCE_FILE_NAME);
const treesPath = path.join(rootDir, "src", "data", "trees.json");
const treesMapPath = path.join(rootDir, "src", "data", "treesMap.json");

const parseSpecies = (value) => {
  const normalized = value.trim();
  const match = normalized.match(/^(.*)\(([^()]*)\)\s*$/);

  if (!match) {
    return {
      commonName: normalized,
      scientificName: "",
    };
  }

  return {
    commonName: match[1].trim(),
    scientificName: match[2].trim(),
  };
};

const lines = fs
  .readFileSync(sourcePath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const trees = lines.map((line, index) => {
  const columns = line.split(",");

  if (columns.length < 3) {
    throw new Error(`Invalid CSV row at line ${index + 1}: ${line}`);
  }

  const id = columns[0].trim();
  const location = columns.at(-1).trim();
  const species = columns.slice(1, -1).join(",").trim();
  const { commonName, scientificName } = parseSpecies(species);

  return {
    id,
    commonName,
    scientificName,
    location,
  };
});

const treesMap = Object.fromEntries(
  trees.map(({ id, ...tree }) => [id, tree]),
);

fs.writeFileSync(treesPath, `${JSON.stringify(trees, null, 2)}\n`, "utf8");
fs.writeFileSync(treesMapPath, `${JSON.stringify(treesMap, null, 2)}\n`, "utf8");

console.log(
  `Generated ${trees.length} trees from ${path.relative(rootDir, sourcePath)}.`,
);
