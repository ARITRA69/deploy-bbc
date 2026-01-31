import { Request, Response } from "express";
import { z } from 'zod'
import { ObjectIdSchema } from "../../utils/zod-schema-custom/custom";

export const get_user_by_id = async (req: Request, res: Response) => {
    const { user_id } = z_get_user_by_id_query.parse(req.params)

    res.status(200).json({
        message: "User fetch successfully",
        data: []
    })
}


const z_get_user_by_id_query = z.object({
    user_id: ObjectIdSchema('Invalid UserId')
})