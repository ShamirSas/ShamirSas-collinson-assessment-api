import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { FetchHttpClient } from "../fetch-http-client";

describe("FetchHttpClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("get should return mocked responses for different status codes", async () => {
    const client = new FetchHttpClient();
    const url = "https://example.com/status";
    const statuses = [200, 404, 500];
    const fetchSpy = jest.spyOn(global, "fetch");

    for (const status of statuses) {
      const mockResponse = {
        status,
        ok: status >= 200 && status < 300,
      } as Response;
      fetchSpy.mockResolvedValueOnce(mockResponse);
    }

    const responses: Response[] = [];
    for (const _ of statuses) {
      responses.push(await client.get(url));
    }

    expect(fetchSpy).toHaveBeenCalledTimes(statuses.length);
    expect(responses.map((response) => response.status)).toEqual(statuses);
  });

  it("getJson should parse mocked JSON for different status codes", async () => {
    const client = new FetchHttpClient();
    const url = "https://example.com/status-json";
    const statuses = [200, 404, 500];
    const fetchSpy = jest.spyOn(global, "fetch");

    for (const status of statuses) {
      const jsonPayload = { status, message: `status-${status}` };
      const jsonMock = jest
        .fn<() => Promise<typeof jsonPayload>>()
        .mockResolvedValue(jsonPayload);
      const mockResponse = {
        status,
        json: jsonMock,
      } as unknown as Response;
      fetchSpy.mockResolvedValueOnce(mockResponse);
    }

    const results: Array<{ status: number; message: string }> = [];
    for (const _ of statuses) {
      results.push(
        await client.getJson<{ status: number; message: string }>(url),
      );
    }

    expect(fetchSpy).toHaveBeenCalledTimes(statuses.length);
    expect(results).toEqual([
      { status: 200, message: "status-200" },
      { status: 404, message: "status-404" },
      { status: 500, message: "status-500" },
    ]);
  });
});
