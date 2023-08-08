import { ApiRequest } from "../request";

export class AuthController {
    async login(emailValue: string, passwordValue: string) {
        const response = await new ApiRequest()
            .prefixUrl("http://tasque.lol/")
            .method("POST")
            .url(`api/Auth/login`)
            .body({
                email: emailValue,
                password: passwordValue,
            })
            .send();
        return response;
    }
}
