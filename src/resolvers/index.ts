import fs from "node:fs";
import path from "node:path";
import { ResolveType, Resolver } from "../shared/classes";

type ResolverClass = new () => ResolveType | Resolver;

function getResolverFiles(directoryPath: string): string[] {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getResolverFiles(fullPath));
      continue;
    }

    if (/\.resolver\.(ts|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function isResolverClass(value: unknown): value is ResolverClass {
  if (typeof value !== "function") {
    return false;
  }

  const resolverClass = value as ResolverClass;
  return (
    resolverClass.prototype instanceof ResolveType ||
    resolverClass.prototype instanceof Resolver
  );
}

export function loadResolvers(): Record<string, ResolveType | Resolver> {
  const modulesPath = path.join(__dirname, "../modules");
  const resolverFiles = getResolverFiles(modulesPath);

  return resolverFiles.reduce<Record<string, ResolveType | Resolver>>(
    (acc, resolverFile) => {
      const moduleExports: Record<string, unknown> = require(resolverFile);

      for (const exportedValue of Object.values(moduleExports)) {
        if (!isResolverClass(exportedValue)) {
          continue;
        }

        const resolverName = exportedValue.name.replace(/Resolver$/, "");

        if (!resolverName) {
          continue;
        }

        acc[resolverName] = new exportedValue();
      }

      return acc;
    },
    {},
  );
}

export const resolvers = loadResolvers();
