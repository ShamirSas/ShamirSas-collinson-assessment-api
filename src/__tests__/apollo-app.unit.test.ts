import { ApolloServer } from "@apollo/server";
import { ApolloApp } from "../apollo-app";
import { TestUtil } from "./test-util.test";

describe("ApolloApp", () => {
  it("server getter should be undefined initially", () => {
    expect(ApolloApp.server).toBeUndefined();
  });

  it("should create a server instance", () => {
    const server = ApolloApp.createServerInstance(
      TestUtil.getApolloAppServerBooksArgs(),
    );
    expect(server).toBeDefined();
  });

  it("should set server getter to the server instance", () => {
    const server = ApolloApp.createServerInstance(
      TestUtil.getApolloAppServerBooksArgs(),
    );
    expect(ApolloApp.server).toBe(server);
  });


  it("should start and stop a standalone server", async () => {
    const spyOnServerStop = jest.spyOn(ApolloApp.server as ApolloServer, "stop");
    const { url } = await ApolloApp.startStandaloneServer(
      9000,
      TestUtil.getApolloAppServerBooksArgs(),
    );
    expect(url).toBeDefined();
    expect(url).toMatch(/http:\/\/localhost:\d+/);

    expect(spyOnServerStop).not.toHaveBeenCalled();
    await ApolloApp.stop();
    expect(spyOnServerStop).toHaveBeenCalled();
  });

  it("should remove server getter if the server is stopped", async () => {
    const server = ApolloApp.createServerInstance(
      TestUtil.getApolloAppServerBooksArgs(),
    );
    await ApolloApp.startStandaloneServer(9000);
    expect(ApolloApp.server).toBe(server);
    await ApolloApp.stop();
    expect(ApolloApp.server).toBeUndefined();
  });

  it("should throw an error if no typeDefs and resolvers are provided", () => {
    expect(ApolloApp.server).toBeUndefined();
    expect(() => ApolloApp.startStandaloneServer(9000)).toThrow(
      "Unable to start standalone server: Please provide typeDefs and resolvers",
    );
  });
});
