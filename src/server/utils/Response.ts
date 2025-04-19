import type { ResponseStatus } from "../../lib/types";

class Response {
    code: ResponseStatus;
    msg: String;
    data: any;
    constructor(code: ResponseStatus, msg: String, data: any) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
}

export class OKResponse extends Response {
    constructor(msg: String, data: any) {
        super(200, msg, data);
    }
}
export class BadRequestResponse extends Response {
    constructor(msg: String) {
        super(400, msg, null);
    }
}
export class NotFoundResponse extends Response {
    constructor(msg: String) {
        super(404, msg, null);
    }
}
export class InternalServerResponse extends Response {
    constructor(msg: String) {
        super(500, msg, null);
    }
}
export class ForbiddenResponse extends Response {
    constructor(msg: String) {
        super(403, msg, null);
    }
}
