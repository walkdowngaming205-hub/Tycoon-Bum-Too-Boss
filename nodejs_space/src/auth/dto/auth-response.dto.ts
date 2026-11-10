import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  playerName!: string;

  @ApiProperty()
  avatarEmoji!: string;

  @ApiProperty({ required: false })
  createdAt?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  token!: string;

  @ApiProperty({ type: () => UserInfoDto })
  user!: UserInfoDto;
}

export class MeResponseDto {
  @ApiProperty({ type: () => UserInfoDto })
  user!: UserInfoDto;
}
