import jwt, { JwtPayload } from 'jsonwebtoken';

interface SignOption {
  expiresIn: string | number;
}

const DEFAULT_SIGN_OPTIONS: SignOption = {
  expiresIn: '1h',
};

export function signJwtAccessToken(
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTIONS
) {
  const secret_key = process.env.JWT_SECRET || 'turing0210';
  const token = jwt.sign(payload, secret_key!, options);
  return token;
}

export function verifyJwt(token: string) {
  try {
    const secret_key = process.env.JWT_SECRET || 'turing0210';
    const cleanedToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(cleanedToken, secret_key!);
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Token Invalido');
  }
}
