import { GraphQLSchema } from "graphql";

export interface IApolloAppServerArgsWithTypeDefsAndResolvers {
  typeDefs: string;
  resolvers: Record<string, any>;
}

export interface IApolloAppServerArgsWithSchema {
  schema: GraphQLSchema;
}

export type IApolloAppServerArgs = IApolloAppServerArgsWithTypeDefsAndResolvers | IApolloAppServerArgsWithSchema;