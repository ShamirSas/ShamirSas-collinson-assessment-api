import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { FetchHttpClient } from "../fetch-http-client";

describe("FetchHttpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls fetch with GET method when no options are provided", async () => {
    const expectedResponse = { ok: true } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(expectedResponse);

    const client = new FetchHttpClient();
    const response = await client.get("https://example.com/forecast");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("https://example.com/forecast", {
      method: "GET",
    });
    expect(response).toBe(expectedResponse);
  });

  it("passes headers to fetch when provided", async () => {
    const expectedResponse = { ok: true } as unknown as Response;
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(expectedResponse);

    const client = new FetchHttpClient();
    await client.get("https://example.com/locations", {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(fetchSpy).toHaveBeenCalledWith("https://example.com/locations", {
      method: "GET",
      headers: {
        Authorization: "Bearer test-token",
      },
    });
  });

  it("returns parsed JSON from getJson", async () => {
    const payload = { temperature: 23, unit: "celsius" };
    const jsonMock = jest.fn(async () => payload);
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jsonMock,
    } as unknown as Response);

    const client = new FetchHttpClient();
    const result = await client.getJson<typeof payload>(
      "https://example.com/weather",
    );

    expect(result).toEqual(payload);
    expect(jsonMock).toHaveBeenCalledTimes(1);
  });

  it("propagates fetch errors for getJson", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network unavailable"));

    const client = new FetchHttpClient();

    await expect(
      client.getJson("https://example.com/failing-endpoint"),
    ).rejects.toThrow("Network unavailable");
  });
});
