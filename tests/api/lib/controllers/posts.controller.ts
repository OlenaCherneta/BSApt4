import { ApiRequest } from "../request";

const baseUrl: string = global.appConfig.baseUrl;

export class PostController {
    async getAllPosts(accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("GET")
            .url(`api/Posts`)
            .bearerToken(accessToken)
            .send();
        return response;
    }

    async addPost(postData: object, accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("POST")
            .url(`api/Posts`)
            .body(postData)
            .bearerToken(accessToken)
            .send();
        return response;
    }

    async likePost(postData: object, accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("POST")
            .url(`api/Posts/like`)
            .body(postData)
            .bearerToken(accessToken)
            .send();
        return response;
    }
    async commentPost(postData: object, accessToken: string) {
        const response = await new ApiRequest()
            .prefixUrl(baseUrl)
            .method("POST")
            .url(`api/Comments`)
            .body(postData)
            .bearerToken(accessToken)
            .send();
        return response;
    }
}
