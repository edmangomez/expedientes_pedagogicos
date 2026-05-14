import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const databasePath = path.join(root, "prisma", "dev.db");
const migrationPath = path.join(root, "prisma", "migrations", "202605140001_init", "migration.sql");

await mkdir(path.dirname(databasePath), { recursive: true });

const db = new DatabaseSync(databasePath);
const sql = readFileSync(migrationPath, "utf8");

db.exec(sql);
db.close();

console.log(`Base SQLite lista en ${databasePath}`);
