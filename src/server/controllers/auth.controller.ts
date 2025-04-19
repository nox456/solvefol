import type { Response, Request } from "express";
import AuthService from "../services/auth.service";
import { ResponseStatus } from "../../lib/types";
import { validateFields } from "../utils/validator";

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
                const result = await AuthService.signup({ username, password });
                if (result.code == 200) {
                    res.cookie("token", result.data, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                    });
                }
                res.status(result.code).json({ message: result.msg });
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
                if (result.code == 200) {
                    res.cookie("token", result.data, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                    });
                }
                res.status(result.code).json({ message: result.msg });
            } catch (e) {
                console.error(e);
                res.status(ResponseStatus.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error!",
                });
            }
        }

	}
}
