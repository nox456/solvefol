const { SERVER_PORT, SERVER_HOST, JWT_SECRET, CLIENT_HOST } = process.env;

type EnvVars = {
    SERVER_PORT: number;
    SERVER_HOST: string;
    JWT_SECRET: string;
    CLIENT_HOST: string;
};

const env: EnvVars = {
    SERVER_PORT: SERVER_PORT ? parseInt(SERVER_PORT) : 3000,
    SERVER_HOST: SERVER_HOST ?? "localhost",
    JWT_SECRET: JWT_SECRET ?? "",
    CLIENT_HOST: CLIENT_HOST ?? "",
};

export default env;
