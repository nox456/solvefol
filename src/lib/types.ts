export type UserAuth = {
    username: string;
    password: string;
};

export enum ResponseStatus {
    OK = 200,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum FormAction {
	SIGNUP = "signup",
	SIGNIN = "signin",
}

export type ServerResponse = {
	message: string;
};
