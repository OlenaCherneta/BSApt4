import { expect } from "chai";
import { UsersController } from "../../lib/controllers/users.controller";
import { AuthController } from "../../lib/controllers/auth.controller";
import { checkStatusCode, checkResponseTime, checkJsonSchema } from "../../../helpers/functionsForChecking.helper";
import { PostController } from "../../lib/controllers/posts.controller";

const users = new UsersController();
const auth = new AuthController();
const posts = new PostController();
const schemas = require("./schemas_testData.json");
const chai = require("chai");
chai.use(require("chai-json-schema"));

let accessToken: string;
let userId: number;
let email: string;
let userName: string;
let password: string;
let postID: string;

password = "Qwerty";


//1. Add user

describe("1. Add user for posting tests", () => {
    it(`Registration vith valid data`, async () => {
        let userData: object = {
            id: 0,
            avatar: "string",
            email: "testing@gmail.com",
            userName: "Olena",
            password: password,
        };

        let response = await users.addUser(userData);
        checkJsonSchema(response, schemas.schema_oneUser);
        checkStatusCode(response, 201);
        checkResponseTime(response, 1000);

        accessToken = response.body.token.accessToken.token;
        userId = response.body.user.id;
        email = response.body.user.email;
        userName = response.body.user.userName;
        
    });
});
  
//2. Login user

describe("2. Login user for posting tests", () => {
    before(`Login and get the token`, async () => {
        let response = await auth.login(email, password);
        checkStatusCode(response, 200);
    });

    it(`Login`, async () => {
        let userData: object = {
            id: userId,
            avatar: "string",
            email: email,
            userName: userName,
        };

        let response = await users.updateUser(userData, accessToken);
        checkStatusCode(response, 204);        
    });
});

//3. User gets all posts

describe(`3. User gets all posts`, () => {
    it(`should return 200 status code and all posts  when getting the posts collection`, async () => {
        let response = await posts.getAllPosts(accessToken);

        checkStatusCode(response, 200);
        checkResponseTime(response, 7000);
        checkJsonSchema(response, schemas.schema_allPosts);        
    });
});

// 4. Create post
describe("4. Create a post", () => {

        it(`Create a post with valid data`, async () => {
        let body: string = "Abracadabra!";
        let postData: object = {
            authorId: userId,
            previewImage: "Qwerty",
            body: body,
        };

        let response = await posts.addPost(postData, accessToken);
        checkStatusCode(response, 200);     
        checkJsonSchema(response, schemas.schema_onePost);     
        checkResponseTime(response, 1000);
        expect(response.body.body, `Post body is not the same as sent`).to.be.equal(body);
        postID = response.body.id;
        
    });
});
// 5. Add reaction

describe("5. Add reaction to post", () => {
    it(`Create a post with valid data`, async () => {
        let postData: object = {
            entityId: postID,
            isLike: true,
            userId: userId,
        };

        let response = await posts.likePost(postData, accessToken);
        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        });
});


// 6. Add comment
describe("6. Add comment to the post", () => {
    it(`Adding comment to the post`, async () => {
        let comentBody: string = "Hello, is anybody here?";
        let postData: object = {
            authorId: userId,
            postId: postID,
            body: comentBody,
        };

        let response = await posts.commentPost(postData, accessToken);
        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        checkJsonSchema(response, schemas.schema_oneComment);
                
        expect(response.body.body, "Comment body is in responce").to.be.equal(comentBody);
    });

    afterEach(`Deleting user`, async () => {
        let response = await users.deleteUser(userId, accessToken);

        checkStatusCode(response, 204);
        checkResponseTime(response, 1000);
    });
});
