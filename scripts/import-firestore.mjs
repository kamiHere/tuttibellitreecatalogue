import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import admin from "firebase-admin";

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  undefined;

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  "";

const collectionName = process.env.FIRESTORE_COLLECTION || "trees";
const dataPath = path.resolve("src", "data", "treesMap.json");

if (!fs.existsSync(dataPath)) {
  throw new Error(`Data file not found: ${dataPath}`);
}

if (serviceAccountPath && !fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found: ${serviceAccountPath}`);
}

if (serviceAccountPath) {
  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf-8"),
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId || serviceAccount.project_id,
  });
} else {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

const raw = fs.readFileSync(dataPath, "utf-8");
const data = JSON.parse(raw);
const entries = Object.entries(data);

if (entries.length === 0) {
  console.log("No data found in treesMap.json.");
  process.exit(0);
}

const collection = db.collection(collectionName);
let batch = db.batch();
let opCount = 0;
let total = 0;

const commitBatch = async () => {
  await batch.commit();
  batch = db.batch();
  opCount = 0;
};

for (const [id, doc] of entries) {
  const docRef = collection.doc(id);
  batch.set(docRef, { id, ...doc });
  opCount += 1;
  total += 1;

  if (opCount === 500) {
    // Firestore batch limit is 500 writes.
    // eslint-disable-next-line no-await-in-loop
    await commitBatch();
  }
}

if (opCount > 0) {
  await commitBatch();
}

console.log(
  `Imported ${total} documents into ${collectionName} in project ${db.projectId || "unknown"}.`,
);
