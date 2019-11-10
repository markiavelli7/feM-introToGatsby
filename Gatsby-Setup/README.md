## Setup the GraphQL Playground as the default GraphQL IDE

1. Add a .env.devlopment file to the root directory
2. Add a configuration to the root directory:

```javascript
GATSBY_GRAPHQL_IDE = playground
```

3. Install the env-cmd npm package:

```javascript
npm i env-cmd
```

4. Pull in the .env.development file into the build process inside of package.json:

```javascript
"build": "env-cmd -f .env.production gatsby build",
```
