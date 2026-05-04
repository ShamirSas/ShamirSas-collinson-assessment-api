import { afterAll, beforeAll, describe, it, expect } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloApp } from "../apollo-app";
import { TestUtil } from "./test-util.test";

describe("books GraphQL (e2e)", () => {
  let server: ApolloServer;
  let baseUrl: string;

  beforeAll(async () => {
    server = ApolloApp.createServerInstance(
      TestUtil.getApolloAppServerBooksArgs()
    );
    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
    });
    baseUrl = url;
  });

  afterAll(async () => {
    await server.stop();
  });

  it("returns books over HTTP", async () => {
    const res: Response = await TestUtil.doQuery(baseUrl, `{ books { title author } }`);
    expect(res.ok).toBe(true);
    const json = (await res.json()) as {
      data?: { books: Array<{ title: string; author: string }> };
      errors?: unknown[];
    };
    expect(json.errors).toBeUndefined();
    expect(json.data?.books).toEqual([
      { title: "The Awakening", author: "Kate Chopin" },
      {
        title: "City of Glass!!!!",
        author: "Paul Austeraascascasc!",
      },
    ]);
  });
});
