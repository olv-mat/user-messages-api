export class DefaultResponseDto {
  public readonly id: number;
  public readonly message: string;

  constructor(id: number, message: string) {
    this.id = id;
    this.message = message;
  }
}
