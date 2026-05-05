import { HttpMethod } from "./http-client.enum";
import {
  IHttpClient,
  IHttpClientOptions,
  IHttpClientOptionsParams,
} from "./http-client.interface";

/**
 * This HttpClient is a wrapper around the fetch API.
 * It provides a consistent interface for making HTTP requests.
 */
export class FetchHttpClient implements IHttpClient {
  async get(
    url: string,
    options?: IHttpClientOptionsParams,
  ): Promise<Response> {
    return fetch(url, this.buildHttpClientOptions(HttpMethod.GET, options));
  }

  getJson<ResponseDataType = any>(
    url: string,
    options?: IHttpClientOptionsParams,
  ): Promise<ResponseDataType> {
    return this.get(url, options).then(this.toJson<ResponseDataType>);
  }

  // Commented these because it's not needed for this implementation.
  // TODO: Implement these if needed.
  // post<InputDataType = any>(
  //   url: string,
  //   data: InputDataType,
  //   options?: IHttpClientOptionsParams,
  // ): Promise<Response> {
  //   return fetch(url, {
  //     ...this.buildHttpClientOptions(HttpMethod.POST, options),
  //     body: JSON.stringify(data),
  //   });
  // }

  // postJson<ResponseDataType = any, InputDataType = any>(
  //   url: string,
  //   data: InputDataType,
  //   options?: IHttpClientOptionsParams,
  // ): Promise<ResponseDataType> {
  //   return this.post(url, data, options).then(this.toJson<ResponseDataType>);
  // }

  private async toJson<ResponseDataType = any>(
    response: Response,
  ): Promise<ResponseDataType> {
    const res: ResponseDataType = (await response.json()) as ResponseDataType;
    return res as ResponseDataType;
  }

  private buildHttpClientOptions(
    method: HttpMethod,
    options?: IHttpClientOptionsParams,
  ): IHttpClientOptions {
    const httpOptions: IHttpClientOptions = {
      method,
    };

    if (options?.headers) {
      httpOptions.headers = options.headers;
    }
    
    return httpOptions;
  }
}
