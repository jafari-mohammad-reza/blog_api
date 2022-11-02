import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/models/user.interface";
import {from, Observable} from "rxjs";
import * as argon2 from "argon2";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/models/user.entity";
import {Repository} from "typeorm";
import {MailService} from "../mail/mail.service";
import {LoginDto} from "./dtos/login.dto";
import {IncomingHttpHeaders} from "http";
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>, private readonly mailService: MailService) {
    }

    hashPassword(password: string): Observable<string> {
        return from(argon2.hash(password))
    }

    async compareHashedPassword(password: string, hashedPassword: string): Promise<boolean>{
        return await argon2.verify(hashedPassword , password)
    }

    async verifyToken(token:string){
        return await this.jwtService.verifyAsync(token,{algorithms:["RS256"]})
    }

    async login(loginDto: LoginDto): Promise<{access_token: string, refresh_token: string}> {
        const {email, password, rememberMe} = loginDto
        const existUser = await this.repository.findOneBy({email})
        if (!existUser) throw new BadRequestException("make sure to insert your credentials correctly")
        if (!await this.compareHashedPassword(password, existUser.password)) throw new BadRequestException("make sure to insert your credentials correctly")
        if (!existUser.isVerified) throw new BadRequestException("Please verify your account first by the link we sent to your email.")
        const access_token = await this.jwtService.signAsync(existUser.email)
        const refresh_token = await this.jwtService.signAsync(existUser.id.toString())
        await this.repository.update(existUser.id, {access_token, refresh_token})
        return {access_token, refresh_token}
    }

    async register(user: User): Promise<void> {
        const {username, email, password} = user
        const existUsers = await this.repository.find({
            where: [
                {username},
                {email}
            ]
        })
        if (existUsers.length) {
            throw new BadRequestException("Exist user.")
        }
        const hashedPassword = await argon2.hash(password)
        const createdUser = await this.repository.create({email, password: hashedPassword, username})
        const verificationToken = await this.jwtService.signAsync(createdUser.email)
        await this.repository.save(createdUser)
        this.mailService.sendConfirmationLink(createdUser.email, verificationToken)
    }

    async verifyAccount(token: string): Promise<void> {
        console.log(token)
        const encoded = await this.verifyToken(token)
        const existUser = await this.repository.findOneBy({email:encoded})
        if (!existUser) {
            throw new BadRequestException("Invalid token")
        }
        if (encoded.expiresIn > new Date().getTime()) {
            const verificationToken = await this.jwtService.signAsync(encoded)
            await this.mailService.sendConfirmationLink(encoded, verificationToken)
            throw new BadRequestException("token is expired we sent you a new one")
        }
        await this.repository.update(existUser.id, {isVerified: true}).catch(err => {
            throw new BadRequestException(`Update failed Error : ${err.message}`)
        })
    }

    async sendForgotPasswordLink(email: string): Promise<void> {
        const user = await this.repository.findOneBy({email})
        if (!user) throw new NotFoundException("there is no user with this email.")
        if (user.resetPassword_attempts >= 3) throw new BadRequestException("you have reached maximum reset password attempts")
        const token = await this.jwtService.signAsync(user.id.toString())
        const url = `${process.env.APPLICATION_ADDRESS}/auth/reset_password/${token}`
        this.mailService.sendEmail(email, "Reset your password", `<a href=${url}>Click!</a>`)
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const encoded = await this.verifyToken(token).catch(err => {
            throw new BadRequestException("Token is invalid")
        })
        if (!encoded) throw new BadRequestException("Not valid token")
        const user = await this.repository.findOneBy({id: Number(encoded)})
        if (user.resetPassword_attempts >= 3) throw new BadRequestException("you have reached maximum reset password attempts")
        if (await this.compareHashedPassword(password, user.password)) throw new BadRequestException("the new password cannot be same as old one")
        const newHashedPassword = await argon2.hash(password)
        const newResetPasswordAttempts = user.resetPassword_attempts++
        await this.repository.update(encoded, {
            password: newHashedPassword,
            resetPassword_attempts: newResetPasswordAttempts
        })
    }
     async logout(access_token:string){
        const email =   await this.verifyToken(access_token)
         const existUser = await this.repository.findOneBy({email})
         if(existUser){
             await this.repository.update(existUser.id , {access_token:"",refresh_token:""})
         }
    }
}
