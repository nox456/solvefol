import { z } from "zod";

export const LoginSchema = z.object({
    username: z.string().nonempty("Nombre de usuario requerido!"),
    password: z.string().nonempty("Contraseña requerida!"),
});

export type ErrorType = {
    msg: string;
    type: "validation" | "query";
    field?: string;
};
