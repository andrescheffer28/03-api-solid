import { hash } from "bcryptjs"
import { prisma } from "src/lib/prisma"
import { UsersRepository } from "src/repositories/users-repository"

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


export class RegisterUserCase{ 
    // cada caso de uso terá um único método
    // como está sendo usado uma classe é possível usar um construtor

    constructor(private userRepository: UsersRepository){

    }

    async execute({
        name, email, password,
    }: registerUserCaseRequest) {
        const password_hash = await hash(password, 6)

        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email,  
            },
        })

        if (userWithSameEmail){
            throw new Error('E-mail already exists.')
        }

        await this.userRepository.create({
            name,
            email,
            password_hash,
        })
    }
}