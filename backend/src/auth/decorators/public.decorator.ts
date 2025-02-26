import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constant/auth-constant';
import { AuthType } from '../enums/auth-type.enum';

export const Public = () => SetMetadata(AUTH_TYPE_KEY, [AuthType.None]);
