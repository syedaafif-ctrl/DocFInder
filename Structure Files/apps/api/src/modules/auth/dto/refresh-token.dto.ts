import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ description: 'JWT refresh token issued during login or registration' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
