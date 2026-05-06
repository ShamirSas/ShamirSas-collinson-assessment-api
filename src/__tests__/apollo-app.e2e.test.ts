import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import { ApolloApp } from "../apollo-app";
import { IApolloAppServerArgs } from "../apollo-app.interface";
import { resolvers } from "../resolvers";

describe("Apollo app (e2e)", () => {
  let baseUrl: string;

  function getApolloAppServerArgs(): IApolloAppServerArgs {
    const schema = loadSchemaSync("./src/modules/**/*.graphql", {
      loaders: [new GraphQLFileLoader()],
    });

    const schemaWithResolvers = addResolversToSchema({
      schema,
      resolvers,
    });

    return { schema: schemaWithResolvers };
  }

  async function doQuery(query: string): Promise<Response> {
    return fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
  }

  beforeAll(async () => {
    const { url } = await ApolloApp.startStandaloneServer(
      0,
      getApolloAppServerArgs(),
    );
    baseUrl = url;
  });

  afterAll(async () => {
    await ApolloApp.stop();
  });

  it("returns locations over HTTP using live integration requests", async () => {
    const res = await doQuery(
      `query {
        getLocations(name: "london") {
          __typename
          ... on Locations {
            locations {
              id
              name
              country
            }
          }
          ... on ResponseMessage {
            message
          }
        }
      }`,
    );
    expect(res.ok).toBe(true);
    const json = (await res.json()) as {
      data?: {
        getLocations:
          | { __typename: "Locations"; locations: Array<{ id: string; name: string; country: string }> }
          | { __typename: "ResponseMessage"; message: string };
      };
      errors?: unknown[];
    };

    expect(json.errors).toBeUndefined();
    expect(json.data?.getLocations).toBeDefined();
    expect(json.data?.getLocations.__typename).toMatch(
      /Locations|ResponseMessage/,
    );

    if (json.data?.getLocations.__typename === "Locations") {
      expect(Array.isArray(json.data.getLocations.locations)).toBe(true);
      expect(json.data.getLocations.locations.length).toBeGreaterThan(0);
      expect(json.data.getLocations.locations[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          country: expect.any(String),
        }),
      );
    } else {
      expect(json.data?.getLocations).toEqual(
        expect.objectContaining({
          __typename: "ResponseMessage",
          message: expect.any(String),
        }),
      );
    }
  });

  it("returns ranking over HTTP using live integration requests", async () => {
    const res = await doQuery(
      `query { getRanking(longitude: 18.4, latitude: -33.9) { activities } }`,
    );
    expect(res.ok).toBe(true);
    const json = (await res.json()) as {
      data?: { getRanking: { activities: string[] } };
      errors?: unknown[];
    };
    expect(json.errors).toBeUndefined();
    expect(json.data?.getRanking).toEqual(
      expect.objectContaining({
        activities: expect.any(Array),
      }),
    );
    expect(json.data?.getRanking.activities.length).toBeGreaterThan(0);
    expect(json.data?.getRanking.activities.every((activity) => typeof activity === "string")).toBe(true);
  });
});
