import { describe, it, expect } from "@jest/globals";
import { createApolloServer } from "../apolloApp";

describe("books GraphQL (unit)", () => {
  it("returns books via executeOperation", async () => {
    const server = createApolloServer();
    const response = await server.executeOperation({
      query: `{ books { title author } }`,
    });

    expect(response.body.kind).toBe("single");
    if (response.body.kind !== "single") {
      return;
    }
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.books).toEqual([
      { title: "The Awakening", author: "Kate Chopin" },
      {
        title: "City of Glass!!!!",
        author: "Paul Austeraascascasc!",
      },
    ]);
  });
});
