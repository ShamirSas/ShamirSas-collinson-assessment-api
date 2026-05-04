import { startStandaloneServer } from "@apollo/server/standalone";
import { createApolloServer } from "./apolloApp.js";

const server = createApolloServer();

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
