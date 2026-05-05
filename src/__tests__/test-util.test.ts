import { IApolloAppServerArgs } from "../apollo-app.interface";
import booksJson from "./books.json";

interface IBook {
    title: string;
    author: string;
}

export class TestUtil {
    static getApolloAppServerBooksArgs(books: IBook[] = booksJson): IApolloAppServerArgs {
        return {
            typeDefs: `#graphql
                type Book {
                    title: String
                    author: String
                }

                type Query {
                books: [Book]
                }
            `,
            resolvers: {
                Query: {
                    books: () => books,
                },
            },
        };
    }

    static async doQuery(url: string, query: string): Promise<Response> {
        return fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ query }),
        });
    }
}