export class LoginResponseDto {
  public readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
