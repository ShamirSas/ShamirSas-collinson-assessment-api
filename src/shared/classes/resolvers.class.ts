import { ResolveTypeFunction } from "../interfaces/resolvers";

export abstract class ResolveType {
  public abstract __resolveType: ResolveTypeFunction<any, string>;
}
