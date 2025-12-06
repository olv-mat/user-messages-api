export class AuthResponseDto {
  public readonly id: string;
  public readonly token: string;

  constructor(id: string, token: string) {
    this.id = id;
    this.token = token;
  }
}
