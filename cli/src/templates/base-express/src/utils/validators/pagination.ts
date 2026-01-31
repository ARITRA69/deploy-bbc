import z from "zod";
import { TPaginationResponse } from "../../types";

type TPaginationOption = {
    limit?: number
}

export const z_pagination = (optoins?: TPaginationOption) => {
    const default_limit = optoins?.limit ?? 10
    const max_limit = 50

    return z.object({ page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)), limit: z.string().optional().default(String(default_limit)).transform(Number).pipe(z.number().min(1).max(max_limit)) })
}