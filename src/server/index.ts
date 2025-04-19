import express from "express";
import env from "./env";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.router";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRouter);

app.listen(env.SERVER_PORT, env.SERVER_HOST, () => {
    console.log(
        `Server is running at http://${env.SERVER_HOST}:${env.SERVER_PORT}`,
    );
});
