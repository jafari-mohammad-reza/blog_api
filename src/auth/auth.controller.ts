import {Body, Controller, Get, Param, Post, Req, Res} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiParam, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "./dtos/login.dto";
import {AuthService} from "./auth.service";
import {Response} from "express";
import {RegisterDto} from "./dtos/register.dto";
import {CreateUserDto} from "../user/dtos/create-user.dto";
import {empty} from "rxjs";
import {ResetPasswordDto} from "./dtos/reset-password.dto";
import {ForgotPasswordDto} from "./dtos/forgot-password.dto";

@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService:AuthService) {
    }
    @Post("/login")
    @ApiBody({type: LoginDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    async login(@Body() body:LoginDto, @Res({passthrough:false}) res:Response){
        const {access_token,refresh_token} = await this.authService.login(body)
        return res.status(200)
            .cookie("access_token",access_token,{httpOnly:true})
            .cookie("refresh_token",refresh_token,{httpOnly:true})
            .json({message:"You logged in successfully."})
    }
    @Post("/register")
    @ApiBody({type: RegisterDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    async register(@Body() body:RegisterDto){
        await this.authService.register(body)
        return "Registered successfully, Please verify your account by the link we sent to you."
    }
    @Get("/verify_account/:token")
    @ApiParam({name:"token",type:"string",required:true})
    async verifyAccount(@Param("token") token :string){
        await this.authService.verifyAccount(token)
        return "Your account verified successfully, Please login to your account."
    }
    @Post("/forget_password")
    @ApiConsumes("application/x-www-form-urlencoded")
    @ApiBody({type:ForgotPasswordDto})
    async forgotPassword(@Body() body :ForgotPasswordDto){
        await this.authService.sendForgotPasswordLink(body.email)
        return "We sent you a link include a link to reset your password"
    }
    @Post("/reset_password/:token")
    @ApiParam({name:"token",type:"string",required:true})
    @ApiBody({type:ResetPasswordDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    async resetPassword(@Body() body : ResetPasswordDto,@Param("token") token:string,@Res({passthrough:true}) res:Response){
        await this.authService.resetPassword(token,body.password)
        return res.status(200).clearCookie("access_token").clearCookie("refresh_token").json({
            message :"Your password has reset successfully."
        })
    }
    @Get("/logout")
     async logout(@Res({passthrough:true}) response : Response ,@Req() request:Request){
        await this.authService.logout(request.headers["cookie"].split("access_token=")[1].split(";")[0])
        return response.status(200).clearCookie("access_token").clearCookie("refresh_token").json({
            message :"You logged out successfully."
        })
    }
}
