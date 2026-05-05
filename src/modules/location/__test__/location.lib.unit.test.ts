import { LocationLib } from "../location.lib";
import { describe, it, expect } from "@jest/globals";
describe("LocationLib", () => {
  it("should return an empty array if the search text is empty", async () => {
    await expect(LocationLib.getLocation("ascasc")).resolves.toBe({});
  });
});