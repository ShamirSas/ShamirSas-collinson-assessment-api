import { HttpMethod } from "./http-client.enum";

export interface IHttpClientOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export interface IHttpClientOptionsParams {
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export interface IHttpClient {
  get(url: string, options?: IHttpClientOptions): Promise<Response>;
  getJson<DataType = any>(
    url: string,
    options?: IHttpClientOptionsParams,
  ): Promise<DataType>;
  // Commented these because it's not needed for this implementation.
  // post(url: string, data: any, options?: IHttpClientOptions): Promise<Response>;
  // postJson<DataType = any>(
  //   url: string,
  //   data: any,
  //   options?: IHttpClientOptions,
  // ): Promise<DataType>;
  // put(url: string, data: any, options?: IHttpClientOptions): Promise<Response>;
  // putJson<DataType = any>(
  //   url: string,
  //   data: any,
  //   options?: IHttpClientOptions,
  // ): Promise<DataType>;
  // delete(url: string, options?: IHttpClientOptions): Promise<Response>;
  // deleteJson<DataType = any>(
  //   url: string,
  //   options?: IHttpClientOptions,
  // ): Promise<DataType>;
  // patch(
  //   url: string,
  //   data: any,
  //   options?: IHttpClientOptions,
  // ): Promise<Response>;
  // patchJson<DataType = any>(
  //   url: string,
  //   data: any,
  //   options?: IHttpClientOptions,
  // ): Promise<DataType>;
}
