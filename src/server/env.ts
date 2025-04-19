const { SERVER_PORT, SERVER_HOST, JWT_SECRET } = process.env;

type EnvVars = {
    SERVER_PORT: number;
    SERVER_HOST: string;
    JWT_SECRET: string;
};

const env: EnvVars = {
    SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 3000,
    SERVER_HOST: SERVER_HOST ?? "localhost",
    JWT_SECRET,
};

export default env;
