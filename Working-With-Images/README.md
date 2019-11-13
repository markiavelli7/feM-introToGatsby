# Adding a Hero Image Box

1. Create a new component called hero

/components/hero.js

```javascript
import React from "react"
import styled from "@emotion/styled"
import { Link, graphql, useStaticQuery } from "gatsby"

function Hero() {
  return (
    <div>
      <h1>Lol</h1>
      <p>
        Welcome to the Jungle! <Link to="/page-2">Go to page 2. &rarr;</Link>
      </p>
    </div>
  )
}

export default Hero
```

2. Set a background image.

```javascript
var ImageBackground = styled.div`
  background-image: url("/images/night-waterfall.jpg");
  background-position: top 20% center;
  background-size: cover;
  height: 40vh;
`
```

We have to place the image in the images folder inside of the static folder at the root of the site. By default this is where Gatsby will look for assets.

background-position: top 20% center; will be 20% offset from the top and centered horizontally.

background-size: cover; is going to make the image as big as it can be to occupy all of the available space. If it is wider than it is tall, the extra height will end up being cut off.

## Centering Text in the Hero Box

```javascript
var TextBox = styled.div`
  background-image: linear-gradient(to top, #ddbbffdd 2rem, #ddbbff00);
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
  padding: 0 calc((100vw - 920px) / 2) 2rem;
  width: 100%;

  h1 {
    text-shadow: 1px 1px 3px #eeddff66;
    font-size: 2.25rem;
    font-weight: 800;
  }

  p,
  a {
    color: #222;
    margin-top: 0;
  }

  a {
    margin-top: 0.5rem;
  }
`
```

## Optimizing Images With Sharp

1. Install the plugins

```javascript
yarn add gatsby-transformer-sharp gatsby-plugin-sharp gatsby-background-image
```

The plugin installs sharp and makes it available to do various things. The transformer looks for nodes that are images and will apply image transformations to them.

#### A transformer in Gatsby is a plugin that looks for data and will transform that data to a new type of data.

2. Add the plugins to gatsby-config.js

```javascript
plugins: [
  "gatsby-transformer-sharp",
  "gatsby-plugin-sharp",
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "images",
      path: `${__dirname}/src/images`,
    },
  },
]
```

The second thing that we have to do is tell Gatsby to add images that we put in our folder into the GraphQL layer, we do this again with a gatsby-source-filesystem configuration.

#### When we are sourcing our images from the new location in /src/images, we no longer need the /static/images folder. We can move our assets into the new images folder and delete these two folders.

3. Using Sharp Images with GraphQL

```javascript
{
  allFile(filter: {sourceInstanceName: {eq: "images"}}) {
    nodes {
      relativePath
      childImageSharp {
        original {
          src
        }
      }
    }
  }
}
```

With the sharp packages installed, we can use them in our graphql queries to do transformations.

hero.js

```javascript
import BackgroundImage from 'gatsby-background-image'

var ImageBackground = styled(BackgroundImage)`
  background-position: top 20% center;
  background-size: cover;
  height: 40vh;
`

function Hero() {
  var {image} = useStaticQuery(graphql`
    query {
      image: file(relativePath: {eq: "night-waterfall.jpg"}) {
        sharp: childImageSharp {
          fluid {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)

  return (
    <ImageBackground Tag="section" fluid={image.sharp.fluid}>
```

The ... inside of the GraphQL query is a fragment, it is kind of like the rest/spread syntax in JS.

The Tag Inside of <ImageBackground> is the tag we want to use. This could be a div, section, etc. Whichever makes the most sense.

fluid={image.sharp.fluid} refers to the image we want to use.

# Adding Images to MDX Posts

1. Inside of each post folder, create a new folder called images and add the images to these folders.

This lets us keep the images where we are going to use them.

2. Add the images to the frontmatter for the posts

```javascript
---
title: Hello World!
slug: hello-world
author: Mark Jensen
top-image: ./images/hello-world-one.jpg
---
```

Without having to do anything, Gatsby automatically makes the transformations to our images without having to be told:

```javascript
query {
  allMdx {
    nodes {
      frontmatter {
        top-image {
          childImageSharp {
            fluid {
              srcSet
            }
          }
        }
      }
    }
  }
}
```

3. Install the gatsby-image package

```javascript
yarn add gatsby-image
```

4. Make the sharp-image accessible from within GraphQL

use-posts.js

```javascript
function usePosts() {
  var data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            title
            slug
            author
            topImage {
              sharp: childImageSharp {
                fluid(
                  maxWidth: 150
                  maxHeight: 150
                  duotone: { shadow: "#663399", highlight: "#ddbbff" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
          excerpt
        }
      }
    }
  `)
  return data.allMdx.nodes.map(post => ({
    title: post.frontmatter.title,
    author: post.frontmatter.author,
    slug: post.frontmatter.slug,
    topImage: post.frontmatter.topImage,
    excerpt: post.excerpt,
  }))
}
```

5. Use gatsby-image in the target file.

post-preview.js

```javascript
import Image from "gatsby-image"
;<Link
  to={post.slug}
  css={css`
    margin: 1rem 1rem 0 0;
    width: 100px;
  `}
>
  <Image
    fluid={post.topImage.sharp.fluid}
    alt={post.title}
    css={css`
      * {
        margin-top: 0;
      }
    `}
  />
</Link>
```
