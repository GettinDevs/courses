import type { Request, Response, NextFunction } from 'express';

type ExpressFunction = (req: Request, res: Response) => void | Promise<void>;
export const asyncHandler = (fn: ExpressFunction) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res)).catch(next);
}