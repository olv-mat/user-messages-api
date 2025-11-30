export class ResponseMapper {
  public static toResponse<T>(
    dto: new (...args: unknown[]) => T,
    ...args: ConstructorParameters<typeof dto>
  ): T {
    return new dto(...args);
  }
}
