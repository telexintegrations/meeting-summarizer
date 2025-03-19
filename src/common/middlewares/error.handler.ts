import { Request, Response } from "express";

import { configService } from "../../config";

export const globalErrorHandler = (err: Error, req: Request, res: Response) => {
  res.status(500).json({
    success: false,
    status: 500,
    message: err.message || "Internal Server Error!",
    stack: configService.NODE_ENV === "development" ? err.stack : undefined,
  });

  return;
};
