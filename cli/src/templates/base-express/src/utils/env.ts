import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve(__dirname, '../../.env')})

export type TEnv = {
  port: number
}

export const env: TEnv = {
  port: parseInt(process.env.PORT || '8000');
}