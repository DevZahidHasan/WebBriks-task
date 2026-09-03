export interface SanitizedUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResponseDto {
  accessToken: string;
  user: SanitizedUser;
}
