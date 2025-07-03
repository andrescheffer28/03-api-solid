import { UsersRepository } from "src/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

// o q eu espero receber para fazer a autenticação
interface AuthenticateUserCaseRequest {
    email: string
    password: string
}

//o  q espero devolver para informar se o usuário foi autenticado
interface AuthenticateUserCaseResponse {
    user: User
}

export class AuthenticateUserCase {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({ 
        email, 
        password,
    }: AuthenticateUserCaseRequest): Promise<AuthenticateUserCaseResponse>{

        const user = await this.usersRepository.findByEmail(email)

        if(!user){
            throw new InvalidCredentialsError()
        }

        //boolean sempre deve ser semantico if does password Matches
        // "is" "has" "does"

         //para validar q uma senha é valida, é necessário realizar um novo hashing e comparar com o hashing antigo
        const doesPasswordMatches = await compare(password, user.password_hash)

        if(!doesPasswordMatches){
            throw new InvalidCredentialsError()
        }

        return {
            user,
        }
    }
}