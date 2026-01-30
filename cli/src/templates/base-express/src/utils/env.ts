import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve(__dirname, '../../.env')})

const NODE_ENV = ['dev','prod','test'] as const

type TNodeEnv = (typeof NODE_ENV)[number]

export type TEnv = {
  port: number
  db_url: string
  node_env: TNodeEnv
}

export const env: TEnv = {
  port: parseInt(process.env.PORT || '8000'),
  db_url: process.env.MONGO_DB_URL || 'NA',
  node_env:( process.env.NODE_ENV as TEnv['node_env']) || 'dev'
}