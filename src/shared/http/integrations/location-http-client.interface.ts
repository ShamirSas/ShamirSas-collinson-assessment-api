import { Location } from "../../schemas";
import { ResponseMessage } from "../../classes";

export type LocationSearchResponse = { locations: Location[] } | ResponseMessage;
export type LocationSearchApiResponseData = { results?: Location[] };