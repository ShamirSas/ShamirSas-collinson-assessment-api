import { ApolloApp } from "./apollo-app.js";

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

const { url } = await ApolloApp.startStandaloneServer(9000, {
  typeDefs,
  resolvers,
});
console.log(`🚀  Server ready at: ${url}`);
