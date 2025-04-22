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
        const userCreated = await db.user.create({
            data: {
                username: user.username,
                password: encryptedPassword,
            },
            include: {
                premises: true,
            },
            omit: {
                password: true,
            },
        });
        const token = jwt.sign(userCreated.id, env.JWT_SECRET);
        return new OKResponse("Usuario Creado!", {
            token,
            user: {
                username: userCreated.username,
                role: userCreated.role,
                premises: userCreated.premises,
            },
        });
    }
    static async signin(user: UserAuth) {
        const userFounded = await db.user.findUnique({
            where: { username: user.username },
            include: {
                premises: true,
            },
        });
        if (!userFounded) return new NotFoundResponse("Usuario no encontrado!");
        const passwordMatch = await bcrypt.compare(
            user.password,
            userFounded.password,
        );
        if (!passwordMatch)
            return new ForbiddenResponse("Contraseña incorrecta!");
        const token = jwt.sign(userFounded.id, env.JWT_SECRET);

        return new OKResponse(`Sesion iniciada! [${userFounded.role}]`, {
            token,
            user: {
                username: userFounded.username,
                role: userFounded.role,
                premises: userFounded.premises,
            },
        });
    }
    static async isAuthenticated(token: string) {
        const decoded = jwt.verify(token, env.JWT_SECRET).toString();
        const user = await db.user.findUnique({
            where: { id: decoded },
            include: {
                premises: true,
            },
            omit: {
                id: true,
                password: true,
            },
        });
        if (!user) return new NotFoundResponse("Usuario no encontrado!");
        return new OKResponse("Usuario autenticado!", user);
    }
}
