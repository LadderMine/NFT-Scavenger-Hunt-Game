import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    ttl: parseInt(process.env.JWT_TOKEN_TTL ?? '300'),
    Rttl: parseInt(process.env.JWT_REFRESH_TTL ?? '7776000', 10),
  };
});
