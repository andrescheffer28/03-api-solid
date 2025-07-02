import { hash } from "bcryptjs"
import { UsersRepository } from "src/repositories/users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { User } from "@prisma/client"

// para criar um usuário é necessário
interface registerUserCaseRequest {
    name: string
    email: string
    password: string
}

// SOLID

// D - Dependency Inversion Principle
// ao inves do caso de uso instanciar a dependencia
// a dependencias serão recebidas como parâmetros

interface RegisterUserCaseResponse{
    user: User
}

export class RegisterUserCase{ 
    // cada caso de uso terá um único método
    // como está sendo usado uma classe é possível usar um construtor

    constructor(private userRepository: UsersRepository){

    }

    async execute({ name, email, password, }: registerUserCaseRequest): Promise<RegisterUserCaseResponse> {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await this.userRepository.findByEmail(email)

        if (userWithSameEmail){
            throw new UserAlreadyExistsError()
        }

        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
        })

        //sempre retornar em forma de objeto, mesmo q seja um item
        // para q caso a função venha retornar outras coisas, é só adicionar
        // sem mudar a estrutura de retorno
        return {
            user,
        }
    }
}