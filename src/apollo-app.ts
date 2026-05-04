import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { IApolloAppServerArgs } from "./apollo-app.interface.js";

export class ApolloApp {
  static #serverInstance: ApolloServer | undefined;

  static get server(): ApolloServer | undefined {
    return ApolloApp.#serverInstance;
  }

  /**
   * Creates a server instance with the given typeDefs and resolvers.
   * Note: This method does not start the server.
   * @param typeDefs - The type definitions for the server.
   * @param resolvers - The resolvers for the server.
   * @returns The server instance.
   */
  static createServerInstance({
    typeDefs,
    resolvers,
  }: IApolloAppServerArgs): ApolloServer {
    ApolloApp.#serverInstance = new ApolloServer({ typeDefs, resolvers });
    return ApolloApp.#serverInstance;
  }

  /**
   * Starts the standalone server on the given port if a server instance is not already created.
   * If a server instance is not created, it will create one with the given typeDefs and resolvers.
   * If no typeDefs and resolvers are provided, it will throw an error.
   * @param port - The port to start the server on.
   * @param typeDefs - The type definitions for the server.
   * @param resolvers - The resolvers for the server.
   * @returns A promise that resolves to the url of the server.
   */
  static startStandaloneServer(port: number): Promise<{ url: string }>;
  static startStandaloneServer(
    port: number,
    serverArgs: IApolloAppServerArgs,
  ): Promise<{ url: string }>;
  static startStandaloneServer(
    port: number,
    { typeDefs, resolvers }: Partial<IApolloAppServerArgs> = {},
  ): Promise<{ url: string }> {
    if (!ApolloApp.#serverInstance) {
      if (typeDefs && resolvers) {
        ApolloApp.createServerInstance({ typeDefs, resolvers });
      } else {
        throw new Error(
          "Unable to start standalone server: Please provide typeDefs and resolvers",
        );
      }
    }

    // The #serverInstance should be defined at this point, but we'll check anyway for safety.
    if (!ApolloApp.#serverInstance) {
      throw new Error(
        "Unable to start standalone server: No server instance found",
      );
    }

    return startStandaloneServer(ApolloApp.#serverInstance, {
      listen: { port },
    });
  }

  /**
   * Stops the server instance if it exists.
   */
  static async stop(): Promise<void> {
    if (!ApolloApp.#serverInstance) {
      return;
    }

    await ApolloApp.#serverInstance.stop();
    ApolloApp.#serverInstance = undefined;
  }
}
