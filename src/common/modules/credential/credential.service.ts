export abstract class CredentialService {
  public abstract sign(payload: object): Promise<string>;
  public abstract verify<T extends object>(token: string): Promise<T>;
  public abstract refresh(payload: object): Promise<string>;
}
