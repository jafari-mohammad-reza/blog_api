import {Body, Controller, Get, Param, Post, Req, Res, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiParam, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "./dtos/login.dto";
import {AuthService} from "./auth.service";
import {Request, Response} from "express";
import {RegisterDto} from "./dtos/register.dto";
import {ResetPasswordDto} from "./dtos/reset-password.dto";
import {ForgotPasswordDto} from "./dtos/forgot-password.dto";
    import {GoogleAuthGuard} from "./utils/GoogleAuth.Guard";
import { paginateRawAndEntities } from "nestjs-typeorm-paginate";
import { Throttle } from "@nestjs/throttler";


@Controller('auth')
@ApiTags("Authentication")
export class AuthController {
    constructor(private readonly authService:AuthService) {

    }
    @Post("/login")
    @ApiBody({type: LoginDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    @Throttle(3,60)
    async login(@Body() body:LoginDto, @Res({passthrough:false}) res:Response){
        const {access_token,refresh_token} = await this.authService.login(body)
        return res.status(200)
            .cookie("access_token",access_token,{httpOnly:true,sameSite:true, maxAge: body.rememberMe ? Number(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)) : Number(new Date(Date.now() + 1000 * 60 * 60 * 24))})
            .cookie("refresh_token",refresh_token,{httpOnly:true,sameSite:true, maxAge:Number(new Date(Date.now() + 1000 * 60 * 60 * 24 * 356))})
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
    @Throttle(1,120)
    async forgotPassword(@Body() body :ForgotPasswordDto){
        await this.authService.sendForgotPasswordLink(body.email)
        return "We sent you a link include a link to reset your password"
    }
    @Post("/reset_password/:token")
    @ApiParam({name:"token",type:"string",required:true})
    @ApiBody({type:ResetPasswordDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    @Throttle(4,60)
    async resetPassword(@Body() body : ResetPasswordDto,@Param("token") token:string,@Res({passthrough:true}) res:Response){
        await this.authService.resetPassword(token,body.password)
        return res.status(200).clearCookie("access_token").clearCookie("refresh_token").json({
            message :"Your password has reset successfully."
        })
    }
    @Get("/logout")
     async logout(@Res({passthrough:false}) response : Response ,@Req() request:Request){
        return response.status(200).clearCookie("access_token").clearCookie("refresh_token").json({
            message :"You logged out successfully."
        })
    }

    @Get("google/login")
    @UseGuards(GoogleAuthGuard)
    @Throttle(2,60)
    googleLogin(){
        return "Google Authentication"
    }
    @Get("google/redirect")
    @UseGuards(GoogleAuthGuard)
    async googleRedirect(@Req() request:Request , @Res({passthrough:true}) response : Response){
        const   {accessToken ,refreshToken} = await this.authService.validateOAuthUser(request.user)
        request.user = null
          response.cookie("access_token",accessToken,{httpOnly:true,sameSite:true, maxAge: Number(new Date(Date.now() + 1000 * 60 * 60 * 24 * 30))})
          .cookie("refresh_token",refreshToken,{httpOnly:true,sameSite:true, maxAge:Number(new Date(Date.now() + 1000 * 60 * 60 * 24 * 356))})
        return response.redirect("/api-docs")
    }

}
