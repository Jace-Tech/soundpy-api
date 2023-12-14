import { RequestAlt } from '../types/common';
import { NextFunction } from 'express';
import { Response, Request } from 'express';
import { UnAuthorizedError } from '../utils/customError';

export const isActiveMiddleware =  async (req: Request & RequestAlt, res: Response, next: NextFunction) => {
  if(!req.user) throw new UnAuthorizedError("Unauthorized, Please login to continue")
  if(!req.user.isActive) throw new UnAuthorizedError("Account is inactive, please contact the administrator")
  next()
}