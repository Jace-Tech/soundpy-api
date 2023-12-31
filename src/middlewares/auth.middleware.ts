import { RequestAlt } from '../types/common';
import { NextFunction } from 'express';
import { Response, Request } from 'express';
import User from '../models/User';
import { UnAuthorizedError } from '../utils/customError';
import { verifyToken } from '../utils/token';

export const authMiddleware = (roles: string[]) => async ( req: Request & RequestAlt, res: Response, next: NextFunction) => {
  
  const { authorization } = req.headers
  if(!authorization) throw new UnAuthorizedError("No authorization header was provided")
  
  const token = authorization.split(' ')[1]
  if(!token) throw new UnAuthorizedError("No token found")
  
  const data = verifyToken(token)
  if(!data) throw new UnAuthorizedError("Invalid token")
  
  const user = await User.findOne({ _id: data?.userId }).populate("genre")
  if(!user) throw new UnAuthorizedError("Unauthorized: Unknown user")
  if(!roles.includes(data.role)) throw new UnAuthorizedError("Unauthorized: You do not have permission to access this route")
  
  // Add user to request object
  req.user = user
  next()
}