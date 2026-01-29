import type { Request, Response, NextFunction } from "express";
import CustomError from "../utils/CustomError";

type TSendErrorAsResponse = {
  error: Error | CustomError;
  req: Request;
  res: Response;
}

type TErrorResponse = {
  message: string;
  status_code: number;
  stack?: string;
}

export const error_handler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {

  console.error(`Error: ${err.message}`, err);
//TODO: Update error handler based on type of database and type of validator
  send_error_as_response({error:err,req,res})
};




const send_error_as_response =(
  {error,req,res}: TSendErrorAsResponse
) => {
//TODO: update send_error_as_response based on type of logger
  const error_response: TErrorResponse = {
    message: error.message,
    status_code: error instanceof CustomError ? error.status_code : 500,
    stack: error instanceof Error ? error.stack : undefined,
  };

  res.status(error_response.status_code).json(error_response);
};
