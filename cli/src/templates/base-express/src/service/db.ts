import 'color'
import { env } from "../utils/env"
import mongoose from 'mongoose'

export const connect_db = async ()=> {
    try{
        if(env.db_url === 'NA'){
            console.error('No database URL provider, skipping connection') //TODO: add color coding
            return
        }

        await mongoose.connect(env.db_url)
        const db_name = mongoose.connection.name
        console.log(`Database [${db_name}] connected successfully`)//TODO: add color coding
    }catch(error){
        console.error('database connection error:', error)
        throw error
    }
}

export const disconnect_db = async (): Promise<void> => {
    try{
        await mongoose.disconnect()
        console.log('Database disconnected successfully')//TODO: add color coding

    }catch(error) {
        console.error('Database disconnetion error:', error)
        throw error
    }
}