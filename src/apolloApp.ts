import { ApolloServer } from "@apollo/server";

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass!!!!",
    author: "Paul Austeraascascasc!",
  },
];

const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

export function createApolloServer(): ApolloServer {
  return new ApolloServer({
    typeDefs,
    resolvers,
  });
}
