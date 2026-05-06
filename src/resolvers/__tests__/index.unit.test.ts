import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { ResolveType, Resolver } from "../../shared/classes";
import { getResolverFiles, isResolverClass, loadResolvers } from "../index";

describe("resolvers/index", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("finds resolver files recursively and includes ts/js resolver files only", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "resolver-files-"));
    const rootResolverFile = path.join(tempRoot, "root.resolver.ts");
    const nestedDir = path.join(tempRoot, "nested");
    const nestedResolverFile = path.join(nestedDir, "location.resolver.js");
    const ignoredFile = path.join(nestedDir, "not-a-resolver.ts");

    try {
      fs.mkdirSync(nestedDir, { recursive: true });
      fs.writeFileSync(rootResolverFile, "export class RootResolver {}");
      fs.writeFileSync(
        nestedResolverFile,
        "export class LocationResolver {}",
      );
      fs.writeFileSync(ignoredFile, "export const value = 1;");

      const resolverFiles = getResolverFiles(tempRoot).sort();

      expect(resolverFiles).toEqual([
        nestedResolverFile,
        rootResolverFile,
      ]);
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("returns true only for subclasses of ResolveType or Resolver", () => {
    class QueryResolver extends Resolver {}
    class LocationsSearchResponseResolver extends ResolveType {
      public __resolveType = () => "Locations" as const;
    }
    class NonResolverClass {}

    expect(isResolverClass(QueryResolver)).toBe(true);
    expect(isResolverClass(LocationsSearchResponseResolver)).toBe(true);
    expect(isResolverClass(NonResolverClass)).toBe(false);
    expect(isResolverClass(123)).toBe(false);
    expect(isResolverClass({})).toBe(false);
  });

  it("loads all resolvers from modules and instantiates them", () => {
    const resolvers = loadResolvers();

    expect(resolvers.Query).toBeInstanceOf(Resolver);
    expect(resolvers.LocationsSearchResponse).toBeInstanceOf(ResolveType);
  });
});
