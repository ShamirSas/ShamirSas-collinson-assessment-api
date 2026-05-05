import { loadSchemaSync } from "@graphql-tools/load";
import { ApolloApp } from "./apollo-app";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";

const schema = loadSchemaSync("./src/modules/**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers: resolvers,
});

async function main(): Promise<void> {
  const { url } = await ApolloApp.startStandaloneServer(4000, {
    schema: schemaWithResolvers,
  });
  console.log(`🚀  Server ready at: ${url}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
