import { Request, Response } from "express"

export const get_users = async (req: Request, res: Response) => {
  //Logic to get all users

  res.status(200).json({
    message: "User fetch successfully",
    data: [],
    pagination: {
      page:1,
      limit:20,
      total_pages: 1,
      total_count:0
    }
  })
}


