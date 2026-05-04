import { ApolloApp } from "../apollo-app";
import books from "./books.json";
import { TestUtil } from "./test-util.test";

describe("ApolloApp", () => {
  it("should create a server instance", () => {
    const server = ApolloApp.createServerInstance(
      TestUtil.getApolloAppServerBooksArgs(),
    );
    expect(server).toBeDefined();
  });

  it("should start and stop a standalone server", async () => {
    const spyOnServerStop = jest.spyOn(ApolloApp.server, "stop");
    const { url } = await ApolloApp.startStandaloneServer(
      9000,
      TestUtil.getApolloAppServerBooksArgs(),
    );
    expect(url).toBeDefined();
    expect(url).toMatch(/http:\/\/localhost:\d+/);

    expect(spyOnServerStop).not.toHaveBeenCalled();
    ApolloApp.stop();
    expect(spyOnServerStop).toHaveBeenCalled();
  });
});
