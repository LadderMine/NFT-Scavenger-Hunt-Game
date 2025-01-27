import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from 'src/auth/constant/auth-constant';
import { AuthType } from '../enums/auth-type.enum';

// export const Auth = (...args: string[]) π=> SetMetadata('auth', args);
export const Auth = (...authTypes: AuthType[])=>
    SetMetadata(AUTH_TYPE_KEY, authTypes)
