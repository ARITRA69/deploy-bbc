import { http_server } from "./app"
import { connect_db, disconnect_db } from "./service/db"
import { env } from "./utils/env"


const FATAL_ERROR_TYPE = ['rejection', 'exception'] as const

type TFatalErrorType = (typeof FATAL_ERROR_TYPE)[number]

type THandleFatalError = {
  error: Error
  type: TFatalErrorType
}

const start_server = async () => {
 try {

    await connect_db()
    http_server.listen(env.port, ()=> {
      if (env.node_env ==='dev') {

        console.log(`Server is live on : http://localhost:${env.port}`)

      } else {
        
        console.log( `Server is line on PORT: ${env.port}`)

      }

    })
 }catch(error) {

  console.error('Failed to start server...\n',error)
  process.exit(1)
  
 }
}


const graceful_shutdown = async () => {
  try{

    console.log('Shutting down gracefully...\n')
    await disconnect_db()
    process.exit(0)

  }catch(error){

    console.error('Error during shutdown...\n',error)
    process.exit(1)

  }
}


const handle_fatal_error = ({error, type}: THandleFatalError) => {
  console.error(`Shutting down due to unhandled ${type}...\n`, error)
  graceful_shutdown()
}

start_server()

process.on('SIGTERM', graceful_shutdown)
process.on('SIGINT',graceful_shutdown)

process.on('unhandledRejection',(error:Error) => {
  handle_fatal_error({error,type:'rejection'})
})

process.on('uncaughtException',(error: Error) => {
  handle_fatal_error({error,type: 'exception'})
})