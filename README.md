## Repository for API test project

### API Testing Framework

Test runner - [Mocha](https://mochajs.org/)<br/>
Request lib - [Got](https://github.com/sindresorhus/got)<br/>
Assertions - [Chai](https://www.chaijs.com/)<br/>

### Setup

1. Install [NodeJS](https://nodejs.org/en/) - LTS version is preferable
2. Clone the repository
3. Locate to the project folder and install dependencies. - `npm install`
4. To be able to run the `npm run allure-report` command, download the Java JDK from [here](https://www.oracle.com/java/technologies/downloads/#jdk17-windows), install it, and set the JAVA_HOME Environment Variable:  
    - Open Windows Search, type in “env”, and choose “Edit the system environment variables”.
    - Click on "Environment Variables..." -> "New" (under the system variables)
    - Fill in the "Variable name" field with "JAVA_HOME" and fill in the "Variable value" with the path to where Java is installed on your computer. (For me it is under "C:\Program Files\Java\<jdkversion>")
    - Click "OK" and close all dialogs.
    - Restart your IDE / Terminal (Do not skip this step!)
5. Run the script command from the `package.json` (e.g. `npm run api:tests`)

### Structure of the project

```
├───tests
    ├───api
    │   ├───config
    │   ├───lib
    │   │   ├───controllers
    │   │   │   |   ├───<functionality-name>.controller.ts
    │   │   │   |   ├───...
    │   │   │   ├───request.ts
    │   │───specs
    │   │   ├───<functionality-name>
    │   │   |   ├───data
    │   │   |   ├───..._api-test.ts
    │   │   ├───...
    ├───helpers
├───...

```

-   scripts - bash scripts, js modules for particular job to be done.
-   tests/api - test root folder with project folders.
-   tests/helpers - helpers to use across the tests
-   api/config - directory with configs to run tests depends on env
-   api/lib - all controllers, request builder and other important files are in here
-   api/specs - put your tests here inside corresponding folder
