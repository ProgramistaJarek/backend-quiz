import { NextFunction, Request, Response } from 'express';

export const errorHandeler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(400).send({ error: err.message });
};
