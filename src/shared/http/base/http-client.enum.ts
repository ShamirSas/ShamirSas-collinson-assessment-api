export enum HttpHeaders {
  Authorization = "authorization",
  Cookie = "cookie",
  ContentDisposition = "content-disposition",
  ContentLength = "content-length",
  ContentType = "content-type",
  SetCookie = "set-cookie",
}

export enum HttpContentType {
  ApplicationJson = "application/json",
  ApplicationXWwwFormUrlencoded = "application/x-www-form-urlencoded",
  ApplicationXWwwFormUrlencodedCharsetUTF8 = "application/x-www-form-urlencoded;charset=UTF-8",
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum HttpResponseType {
  Stream = "stream",
}
