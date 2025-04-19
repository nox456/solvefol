import db from "../db";
import type { UserAuth } from "../../lib/types";
import {
    BadRequestResponse,
    ForbiddenResponse,
    NotFoundResponse,
    OKResponse,
} from "../utils/Response";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../env";

export default class AuthService {
    static async signup(user: UserAuth) {
        const userExists = await db.user.findUnique({
            where: { username: user.username },
        });
        if (userExists) return new BadRequestResponse("Usuario ya existente!");
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(user.password, salt);
        const { id } = await db.user.create({
            data: {
                username: user.username,
                password: encryptedPassword,
            },
        });
        const token = jwt.sign(id, env.JWT_SECRET);
        return new OKResponse("Usuario Creado!", token);
    }
    static async signin(user: UserAuth) {
        const userFounded = await db.user.findUnique({
            where: { username: user.username },
        });
        if (!userFounded) return new NotFoundResponse("Usuario no encontrado!");
        const passwordMatch = await bcrypt.compare(
            user.password,
            userFounded.password,
        );
        if (!passwordMatch)
            return new ForbiddenResponse("Contraseña incorrecta!");
        const token = jwt.sign(userFounded.id, env.JWT_SECRET);

        return new OKResponse("Sesion iniciada!", token);
    }
}
