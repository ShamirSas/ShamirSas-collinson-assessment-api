import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ApolloServer } from "@apollo/server";
import { ApolloApp } from "../apollo-app";
import { IApolloAppServerArgs } from "../apollo-app.interface";
import { LocationLib } from "../modules/location";
import { RankingLib } from "../modules/ranking";
import { resolvers } from "../resolvers";

describe("ApolloApp", () => {
  beforeEach(() => {
    jest.spyOn(LocationLib, "getLocations").mockResolvedValue({
      locations: [],
    });
    jest.spyOn(RankingLib, "getRanking").mockResolvedValue({
      activities: ["Mock activity"],
    });
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await ApolloApp.stop();
  });

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

  it("server getter should be undefined initially", () => {
    expect(ApolloApp.server).toBeUndefined();
  });

  it("should create a server instance", async () => {
    const server = ApolloApp.createServerInstance(getApolloAppServerArgs());
    await ApolloApp.startStandaloneServer(0);
    expect(server).toBeDefined();
  });

  it("should set server getter to the server instance", async () => {
    const server = ApolloApp.createServerInstance(getApolloAppServerArgs());
    await ApolloApp.startStandaloneServer(0);
    expect(ApolloApp.server).toBe(server);
  });

  it("should start and stop a standalone server", async () => {
    ApolloApp.createServerInstance(getApolloAppServerArgs());
    const spyOnServerStop = jest.spyOn(ApolloApp.server as ApolloServer, "stop");

    const { url } = await ApolloApp.startStandaloneServer(
      0,
      getApolloAppServerArgs(),
    );
    expect(url).toBeDefined();
    expect(url).toMatch(/http:\/\/localhost:\d+/);

    expect(spyOnServerStop).not.toHaveBeenCalled();
    await ApolloApp.stop();
    expect(spyOnServerStop).toHaveBeenCalled();
  });

  it("should remove server getter if the server is stopped", async () => {
    const server = ApolloApp.createServerInstance(getApolloAppServerArgs());
    await ApolloApp.startStandaloneServer(0);
    expect(ApolloApp.server).toBe(server);
    await ApolloApp.stop();
    expect(ApolloApp.server).toBeUndefined();
  });

  it("should execute Query.getRanking using mocked resolver dependencies", async () => {
    const server = ApolloApp.createServerInstance(getApolloAppServerArgs());
    await server.start();

    const result = await server.executeOperation({
      query: `query { getRanking(longitude: 18.4, latitude: -33.9) { activities } }`,
    });

    expect(result.body.kind).toBe("single");
    if (result.body.kind === "single") {
      expect(result.body.singleResult.errors).toBeUndefined();
      expect(result.body.singleResult.data).toEqual({
        getRanking: {
          activities: ["Mock activity"],
        },
      });
    }

    expect(RankingLib.getRanking).toHaveBeenCalledWith(18.4, -33.9);
    await server.stop();
  });

  it("should throw an error if no typeDefs and resolvers are provided", () => {
    expect(ApolloApp.server).toBeUndefined();
    expect(() => ApolloApp.startStandaloneServer(9000)).toThrow(
      "Unable to start standalone server: Please provide typeDefs and resolvers",
    );
  });
});
