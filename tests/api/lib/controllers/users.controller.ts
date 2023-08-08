import { ApiRequest } from "../request";

const baseUrl: string = global.appConfig.baseUrl;

export class UsersController {
    async getAllUsers() {
        const response = await new ApiRequest().prefixUrl(baseUrl).method("GET").url(`api/Users`).send();
        return response;
    }

    async getUserById(id) {
        const response = await new ApiRequest().prefixUrl(baseUrl).method("GET").url(`api/Users/${id}`).send();
        return response;
    }

    async getCurrentUser(accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("GET")
            .url(`api/Users/fromToken`)
            .bearerToken(accessToken)
            .send();
        return response;
    }

    async updateUser(userData: object, accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("PUT")
            .url(`api/Users`)
            .body(userData)
            .bearerToken(accessToken)
            .send();
        return response;
    }

    async addUser(userData: object) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("POST")
            .url(`api/Register`)
            .body(userData)
            .send();
        return response;
    }

    async deleteUser(id, accessToken) {
        const response = await new ApiRequest()
        .prefixUrl(baseUrl)
        .method("DELETE")
        .url(`api/Users/${id}`)
        .bearerToken(accessToken)
        .send();
        return response;
    }
}