# Static Testing

Catch typos and type errors as we write the code.

Pre-commit hooks will help us catch errors before we make a Git commit.

To use pre-commit hooks, we are going to use the npm husky package and lint-staged

1. Install the packages

```javascript
npm i -D husky lint-staged
```

2. Create a lint-staged.config.js file with the checks we want to run on our code pre-commit:

```javascript
module.exports = {
  "*.js": "eslint",
  "*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx)": [
    "prettier --write",
    "git add",
  ],
}
```

Here, we are checking every .js file with eslint, as well as running our files through prettier and then adding them all.

3. Inside of our package.json file, we want to set up husky to look to run our lint-staged file on commit:

```javascript
"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  }
```

4. We also want to make sure that we have set up a .eslintrc.json file inside of our root directory so that linting is run.

Husky lets us use git hooks to do different things, in our case, we are tying into pre-commits.

# End to End Testing

1. Install Cypress

```javascript
npm i -D cypress
```

Cypress is an electron app that has the full Chrome browser and uses it to run all of our tests.

What is unique with Cypress, is that the browser that is running our tests is basically just like the regular Chrome. We have full access to developer tools including the React developer tools.

2. Open Cypress
   Inside of package.json, we want to set up a script command to open Cypress

```javascript
  "cy:open": "cypress open"
```

Then we can run npm cy:open to open Cypress.

3. Tell Cypress where our app is running.
   Inside of the pre-generated cypress.json file is where we are going to tell Cypress our app is running.

```javascript
{
  "baseUrl": "http://localhost:8000",
  "integrationFolder":"cypress/e2e",
}
```

Instead of using the cypress/integration folder, we want to create our own folder and call it e2e (End-to-end).

Inside of the cypress/fixtures folder, there is an example.json file. This file has to stay there for Cypress to work properly. We can just leave this as an empty object. We can delete the profile.json and users.json files though.

Inside of cypress/plugins, there is an index.js file that may break some of our eslint configs. This file does have to exist for Cypress to work.

```javascript
module.exports = (_on, _config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
}
```

The cypress/screenshots folder we are going to want to add to our .gitignore if we are using screenshots. If we are not, we can delete this folder.

The cypress/support folder is where we can add custom commands. This is where we can add or override certain commands that Cypress has.

# Add the Cypress Testing Library

1. Install the library

```javascript
npm i -D cypress-testing-library
```

2. Add the library to the cypress/support/commands.js file

```javascript
import "@testing-library/cypress/add-commands"
```

# Adding a Test

1. Inside of our cypress/e2e folder we want to add a new test file called smoke.js.

Cypress uses Mocha under the hood as its testing framework. So we have describe blocks, it blocks, etc.

2. Inside of smoke.js, we want to define a test:

```javascript
describe('app'() => {
  it('works', () => {
    cy.visit('/').findByText(/Go to page 2/i).click()
  })
})
```

This is a basic test where we will visit the homepage to verify that our site is working.

2. Run the test

```javascript
npm run cy:open
```

Select the &rarr; Run all specs option from the top right of the Cypress App that just opened.

3. Run more tests from page 2:

```javascript
describe('app'() => {
  it('works', () => {
    cy.visit('/')
    .findByText(/Go to page 2/i)
    .click()
    .findByText(/Hi From the Second page/i)
  })
})
```

4. Make our eslint tests pass again now that Cypress in installed:

```javascript
npm i -D eslint-plugin-cypress
```

Then we want to create a new .eslintrc.json file inside of the cypress folder because we need only really need the new plugin there.

.eslintrc.json

```javascript
{
  "plugins": ["cypress"],
  "env": {
    "cypress/globals": true
  }
}
```
