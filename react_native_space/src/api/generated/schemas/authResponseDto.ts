// @ts-nocheck
import type { UserInfoDto } from './userInfoDto';

export interface AuthResponseDto {
  token: string;
  user: UserInfoDto;
}
