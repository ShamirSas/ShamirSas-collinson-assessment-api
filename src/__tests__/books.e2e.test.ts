import { afterAll, beforeAll, describe, it, expect } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "../apolloApp";

describe("books GraphQL (e2e)", () => {
  let server: ApolloServer;
  let baseUrl: string;

  beforeAll(async () => {
    server = createApolloServer();
    const { url } = await startStandaloneServer(server, {
      listen: { port: 0 },
    });
    baseUrl = url;
  });

  afterAll(async () => {
    await server.stop();
  });

  it("returns books over HTTP", async () => {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query: `{ books { title author } }` }),
    });

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
