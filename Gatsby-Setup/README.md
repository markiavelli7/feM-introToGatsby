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

## Adding Styles with Emotion

1. Install the emotion packages:

```javascript
npm i @emotion/core @emotion/styled gatsby-plugin-emotion
```

@emotion/core gives us access to global styles and to the css prop inside of our React components.

@emotion/styled gives us access a styled-components interface.

gatsby-plugin-emotion adds the things for Gatsby to build with emotion properly (a Babel plugin, etc).

2. Add the plugin to gatsby-config.js

```javascript
plugins: ["gatsby-plugin-emotion"]
```

## Creating a Common Layout with Global Styles

From the layout.js file

1. Import Global and css from Emotion Core.

```javascript
import { Global, css } from "@emotion/core"
```

2. Add Global styles to the layout

```javascript
return (
  <>
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
        }

        * + * {
          margin-top: 1rem;
        }
      `}
    />
  </>
)
```

Global is a React component that Emotion gives us that allows us to set up styles in the global scope. Kind of like traditional CSS.

The second selector is called the lobotomized owl, every sibling is going to get that style.

## Checking for the Current Page with Link

```javascript
&.current-page {
  border-bottom: 2px solid #ddd;
}
```

The & means 'this element', and the current-page class will be added to the Link element when it is on the current page.

```javascript
<Link to="/" activeClassName="current-page">
  Home
</Link>
```

## Using Props to Determine Styles

```javascript
;<NavLink fontWeight="bold">Lol</NavLink>

var NavLink = styled(Link)`
  font-weight: ${props => props.fontWeight || "normal"};
`
```

## Gatsby and GraphQL

### Adding site metadata

1. Add some site metadata to the gatsby-config.js file:

```javascript
module.exports = {
  siteMetadata: {
    title: "Frontend Masters Gatsby Workshop",
    description: "Riddit dit do do. From the Nard Dog.",
  },
}
```

If we want to add site metadata in gatsby-config.js, the property name siteMetadat is required.

Any time that we make changes to the GraphQL end of the site, we have to restart the server to see the changes.
