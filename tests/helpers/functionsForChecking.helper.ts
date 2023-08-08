import { expect } from "chai";

export function checkStatusCode(response, statusCode: 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 500) {
    expect(response.statusCode, `Status Code should be ${statusCode}`).to.equal(statusCode);
}

export function checkResponseTime(response, maxResponseTime: number = 3000) {
    expect(response.timings.phases.total, `Response time should be less than ${maxResponseTime}ms`).to.be.lessThan(
        maxResponseTime
    );
}

export function checkJsonSchema(response, JsonSchema) {
    expect(response.body, "JSON Schema is not as expected").to.be.jsonSchema(JsonSchema);
}