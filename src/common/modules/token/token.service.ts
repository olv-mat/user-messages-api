export abstract class TokenService {
  public abstract sign(payload: object): Promise<string>;
  public abstract verify<T extends object>(token: string): Promise<T>;
}
