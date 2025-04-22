import type { Response, Request, CookieOptions } from "express";
import AuthService from "../services/auth.service";
import { ResponseStatus } from "../../lib/types";
import { validateFields } from "../utils/validator";

const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};

export default class AuthController {
    static async signup(req: Request, res: Response) {
        const { username, password } = req.body;
        const validationMsg = validateFields({ username, password });
        if (validationMsg) {
            res.status(ResponseStatus.BAD_REQUEST).json({
                message: validationMsg,
            });
        } else {
            try {
                const result = await AuthService.signup({
                    username,
                    password,
                });
                const { token, user } = result.data;
                if (result.code == 200) {
                    res.cookie("token", token, cookieOptions);
                }
                res.status(result.code).json({ message: result.msg, user });
            } catch (e) {
                console.error(e);
                res.status(ResponseStatus.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error!",
                });
            }
        }
    }
    static async signin(req: Request, res: Response) {
        const { username, password } = req.body;
        const validationMsg = validateFields({ username, password });
        if (validationMsg) {
            res.status(ResponseStatus.BAD_REQUEST).json({
                message: validationMsg,
            });
        } else {
            try {
                const result = await AuthService.signin({ username, password });
                const { token, user } = result.data;
                if (result.code == 200) {
                    res.cookie("token", token, cookieOptions);
                }
                res.status(result.code).json({ message: result.msg, user });
            } catch (e) {
                console.error(e);
                res.status(ResponseStatus.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error!",
                });
            }
        }
    }
    static async logout(_: any, res: Response) {
        res.clearCookie("token", cookieOptions).json({
            message: "Sesion cerrada!",
        });
    }
    static async isAuthenticated(req: Request, res: Response) {
        const { token } = req.cookies;
        if (token) {
            try {
                const result = await AuthService.isAuthenticated(token);
                if (result.code == 200) {
                    res.status(result.code).json(result.data);
                } else {
                    res.status(result.code).json({ message: result.msg });
                }
            } catch (e) {
                console.error(e);
                res.status(ResponseStatus.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error!",
                });
            }
        } else {
            res.status(ResponseStatus.FORBIDDEN).json({
                message: "No autenticado!",
            });
        }
    }
}
