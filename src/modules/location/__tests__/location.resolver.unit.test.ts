import { describe, expect, it } from "@jest/globals";
import { NoDataFoundMessage } from "../../../shared/classes";
import { LocationsSearchResponseResolver } from "../location.resolver";

describe("LocationsSearchResponseResolver", () => {
  const resolver = new LocationsSearchResponseResolver();

  it("returns Locations when response contains locations", () => {
    const result = resolver.__resolveType({
      locations: [],
    });

    expect(result).toBe("Locations");
  });

  it("returns ResponseMessage when response contains a message", () => {
    const result = resolver.__resolveType(new NoDataFoundMessage());

    expect(result).toBe("ResponseMessage");
  });

  it("returns null when response shape is not supported", () => {
    const result = resolver.__resolveType({} as never);

    expect(result).toBeNull();
  });
});
