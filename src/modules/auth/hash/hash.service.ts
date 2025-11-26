export abstract class HashService {
  public abstract hash(password: string): Promise<string>;
  public abstract compare(password: string, hash: string): Promise<boolean>;
}
