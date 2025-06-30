import 'dotenv/config' // carrega as variáveis de ambiente
import { z } from 'zod'

// as variáveis de ambiente serão objetos
// process.env: { NODE_ENV: 'dev', ...}

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333), //coerce realiza a conversão de um tipo ex, string, para o tipo pretendindo ex, number

})

// valida o process.env usando o método safeParse
const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('❌ Invalid enviroment variables', _env.error.format())

    throw new Error('Invalid enviroment variables.')// não permite executar mais o código, derruba a aplicação
}

export const env = _env.data // caso seja um sucesso