import { expect } from "chai";
import { UsersController } from "../../lib/controllers/users.controller";
import { AuthController } from "../../lib/controllers/auth.controller";
import { checkStatusCode, checkResponseTime, checkJsonSchema } from "../../../helpers/functionsForChecking.helper";

const users = new UsersController();
const auth = new AuthController();
const schemas = require("./schemas_testData.json");
const chai = require("chai");
chai.use(require("chai-json-schema"));

let accessToken: string;
let userId: number;
let email: string;
let userName: string;
let userNameDouble: string;
let password: string;
password = "Qwerty";

//1. Add user

describe("1. Add user", () => {
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
        checkResponseTime(response, 1000);
        checkStatusCode (response, 201);

        accessToken = response.body.token.accessToken.token;
        userId = response.body.user.id;
        email = response.body.user.email;
        userName = response.body.user.userName;
        userNameDouble = response.body.user.userName;

        //console.log(email, password);
    });
});

//1.1. Adding user with inwalid password (less than 4 symbols)

describe("1.1. Adding user with inwalid password (less than 4 symbols)", () => {
    it(`Registration vith valid data`, async () => {
        let userData: object = {
            id: 0,
            avatar: "string",
            email: "test@gmail.com",
            userName: "Olena",
            password: "123",
        };

        let response = await users.addUser(userData);
        checkStatusCode(response, 400);       
        checkResponseTime(response, 1000);        
    });
});

//2. Get all users
describe(`2. Get all users`, () => {
    it(`should return 200 status code and all users when getting the user collection`, async () => {
        let response = await users.getAllUsers();
        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        checkJsonSchema(response, schemas.schema_allUsers);
        
    });
});

//3. Login with creds

describe("3. Login check", () => {
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

//3.1. Login with invalid data

describe("3.1. Login with invalid password", () => {
    let invalidCredentialsDataSet = [
        { email: email, password: "" },
        { email: email, password: "      " },
        { email: email, password: "ATest2023! " },
        { email: email, password: "ATest 2021" },
        { email: email, password: "admin" },
        { email: email, password: "alex.qa.test@gmail.com" },
    ];

    invalidCredentialsDataSet.forEach((credentials) => {
        it(`should not login using invalid password : '${credentials.email}' + '${credentials.password}'`, async () => {
            let response = await auth.login(credentials.email, credentials.password);

            checkStatusCode(response, 400);
            checkResponseTime(response, 3000);
        });
    });
});

///3.2. Login with wrong email

describe("3.1. Login with invalid email", () => {
    let invalidCredentialsDataSet = [
        { email: "", password },
        { email: "      ", password },
        { email: "qweerrrty@x.com", password },
        { email: "email", password },
        { email: "me@me", password },
        { email: "me.com", password },
    ];

    invalidCredentialsDataSet.forEach((credentials) => {
        it(`should not login using invalid email : '${credentials.email}' + '${credentials.password}'`, async () => {
            let response = await auth.login(credentials.email, credentials.password);

            checkStatusCode(response, 404);
            checkResponseTime(response, 3000);
        });
    });
});



//4. Get user info from token
describe(`4. Get user info from token`, () => {
    it(`should return user details when getting user details with valid token`, async () => {
        let response = await users.getCurrentUser(accessToken);

        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        checkJsonSchema(response, schemas.schema_oneUser);
    });

    it(`Username from response is the same as registered`, async () => {
        let response = await users.getCurrentUser(accessToken);
        expect(response.body.userName).to.be.equal(userName, "Username is not the same");
    });
});

//5. Update user info
describe("5. Update user info", () => {
    let userDataBeforeUpdate, userDataToUpdate;

    it(`Login and get the token`, async () => {
        let response = await auth.login(email, password);
        checkStatusCode(response, 200);
    });

    it(`should return correct details of the currect user`, async () => {
        let response = await users.getCurrentUser(accessToken);
        checkStatusCode(response, 200);
        userDataBeforeUpdate = response.body;
        //console.log(response.body);
    });

    it(`should update username using valid data`, async () => {
        // replace the last 3 characters of actual username with random characters.
        // Another data should be without changes
        function replaceLastThreeWithRandom(str: string): string {
            return str.slice(0, -3) + Math.random().toString(36).substring(2, 5);
        }

        userDataToUpdate = {
            id: userDataBeforeUpdate.id,
            avatar: userDataBeforeUpdate.avatar,
            email: userDataBeforeUpdate.email,
            userName: replaceLastThreeWithRandom(userDataBeforeUpdate.userName),
        };

        let response = await users.updateUser(userDataToUpdate, accessToken);
        checkStatusCode(response, 204);
    });

    it(`should return correct user details by id after updating`, async () => {
        let response = await users.getUserById(userDataBeforeUpdate.id);
        checkStatusCode(response, 200);
        expect(response.body).to.be.deep.equal(userDataToUpdate, "User details isn't correct");
        userName = response.body.userName;
    });
});

//6. Get user info from token again
describe(`6. Get user info from token`, () => {
    it(`should return user details when getting user details with valid token`, async () => {
        let response = await users.getCurrentUser(accessToken);

        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        checkJsonSchema(response, schemas.schema_oneUser);
        
    });

    it(`Username from response is NOT the same as registered after updating`, async () => {
        let response = await users.getCurrentUser(accessToken);
        expect(response.body.userName).to.be.not.equal(userNameDouble, "Username is the same as before update!");
    });
});

//7. Get user info by ID
describe(`7. Users controller`, () => {
    before(`Login and get the token`, async () => {
        let response = await auth.login(email, password);
    });

    it(`should return user details when getting user details with valid token`, async () => {
        let response = await users.getUserById(userId);
        
        checkStatusCode(response, 200);
        checkResponseTime(response, 1000);
        checkJsonSchema(response, schemas.schema_oneUser);
            
    });

    it(`Username from response is the same as after updating`, async () => {
        let response = await users.getCurrentUser(accessToken);
        expect(response.body.userName).to.be.equal(userName, "Username is NOT the same as after update!");
    });
});

//8. Delete user

describe(`8. Delete user by id`, () => {
    it(`Deleting user`, async () => {
        let response = await users.deleteUser(userId, accessToken);

        checkStatusCode(response, 204);
        checkResponseTime(response, 1000);
    });
});
