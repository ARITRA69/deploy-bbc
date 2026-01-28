import { NextFunction, Request, Response} from 'express'

type TSuccessHandler= {
    req: Request,
    res: Response,
    next: NextFunction
}

export const success_handler = (
    {req, res, next} :  TSuccessHandler)=>{

        const original_json = res.json

        res.json = function (json: any): Response {
            //TODO: logic to have logger and other success resposne parsing
            return original_json.call(this,json)
        }

        next();
}