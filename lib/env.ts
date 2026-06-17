import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envCache: Record<string, string> = {};

const parseEnvFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;

  const contents = fs.readFileSync(filePath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = line.slice(0, equalsIndex).trim();
    const value = line.slice(equalsIndex + 1).trim();
    if (key && !(key in envCache)) {
      envCache[key] = value;
    }
  }
};

const loadEnvFromRoots = () => {
  const moduleRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const startDirs = [process.cwd(), moduleRoot];

  for (const startDir of startDirs) {
    let currentDir = startDir;

    for (let i = 0; i < 5; i += 1) {
      parseEnvFile(path.join(currentDir, ".env.local"));
      parseEnvFile(path.join(currentDir, ".env"));
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break;
      currentDir = parentDir;
    }
  }
};

loadEnvFromRoots();

export const getEnv = (key: string) => process.env[key] ?? envCache[key];
