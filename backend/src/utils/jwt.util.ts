import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../interfaces/user.interface';

export const generateToken = (id: number): string => {
  console.log('JWT Util - Generating token for userId:', id);
  try {
    const secret = 'revmak-jwt-secret-key-2023';
    const expiresIn = '3h';
    
    console.log('JWT Util - Token configuration:', {
      expiresIn,
      usingFixedSecret: true
    });
    
    const token = jwt.sign({ id: id }, secret, { expiresIn });
    
    console.log('JWT Util - Token generated successfully');
    return token;
  } catch (error) {
    console.error('JWT Util - Error generating token:', (error as Error).message);
    throw error;
  }
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  console.log('JWT Util - Creating and sending token for user:', {
    id: user.id,
    email: user.email,
    statusCode
  });
  
  const token = generateToken(Number(user.id));

  const cookieExpiresIn = 3;
  const cookieOptions: any = {
    expires: new Date(
      Date.now() + cookieExpiresIn * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  console.log('JWT Util - Setting cookie with options:', {
    cookieExpiresIn: `${cookieExpiresIn} hours`,
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    environment: process.env.NODE_ENV || 'development'
  });

  res.cookie('jwt', token, cookieOptions);

  const userObject = user.toJSON();
  const { password, ...userWithoutPassword } = userObject;

  console.log('JWT Util - Sending response with token', {
    statusCode,
    tokenProvided: !!token
  });
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword,
    },
  });
}; 