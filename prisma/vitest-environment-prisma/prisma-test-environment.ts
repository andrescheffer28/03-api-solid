import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { prisma } from 'src/lib/prisma'
import type { Environment } from 'vitest/environments'

function generateDataBaseUrl(schema: string){ // shcema é o id gerado
    
    //n pode executar os testes e2e sem uma conexão com o banco de dados
    if(!process.env.DATABASE_URL){
        throw new Error('Please provide a DATABASE_URL env variable')
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr', //o código será totalmente transformado pelo lado do servidor
    async setup(){
        // criar o banco de testes
        const schema = randomUUID()
        const dataBaseUrl = generateDataBaseUrl(schema)

        console.log(dataBaseUrl)

        process.env.DATABASE_URL = dataBaseUrl

        execSync('npx prisma migrate deploy')

        return {
            async teardown(){
                // apagar o banco de testes
                await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`), //cascade deleta 
                                                                            // as tabelas sem gerar conflito
            
                await prisma.$disconnect()
            }
        }
    }
}