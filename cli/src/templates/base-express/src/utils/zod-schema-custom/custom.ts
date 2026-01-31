import { Types } from 'mongoose'
import {z} from 'zod'

export const ObjectIdSchema = (message?: string) =>{
    z.union([z.string(),z.instanceof(Types.ObjectId)]).refine((val)=> Types.ObjectId.isValid(val),{
        message: message || 'Invalid Id'
    }).transform((val) => new Types.ObjectId(val))
}

