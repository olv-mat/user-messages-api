export class AuthResponseDto {
  public readonly sub: number;
  public readonly accessToken: string;
  public readonly refreshToken: string;

  constructor(sub: number, accessToken: string, refreshToken: string) {
    this.sub = sub;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
