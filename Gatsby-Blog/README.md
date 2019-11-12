# React and MDX

MDX lets us use React components inside of markdown.

## Getting MDX Set Up

1. Install the Dependencies

```javascript
yarn add gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
```

2. Configure gatsby-mdx in the gatsby-config.js file

```javascript
plugins: [
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      defaultLayouts: {
        default: require.resolve("./src/components/layout.js"),
      },
    },
  },
]
```

The option that we are passing is what layout we want to use on our Gatsby MDX files.

We are passing in our default layout.js file using require.resolve to get the absolute path name to the layout.js file.

## Adding a React Component to MDX

1. Create a new component
   /components/wave.js

```javascript
import React, { useState } from "react"
import { css } from "@emotion/core"

function Wave() {
  var [waves, setWaves] = useState(0)
  var label = `👋 ${waves} ${waves == 1 ? "wave" : "waves"}`

  return (
    <button
      onClick={() => setWaves(waves + 1)}
      css={css`
        background: rebeccapurple;
        border: none;
        color: white;
        font-size: 1.25rem;
      `}
    >
      {label}
    </button>
  )
}

export default Wave
```

2. Using the component
   /pages/contact.mdx

```javascript
import Wave from "../components/wave"

...

<Wave />
```

# Building a Blog With MDX

1. Create a new folder called posts.
   This folder can be anywhere inside the project directory, it doesn't have to be in the src directory.

Inside of this, we can create new posts. We will build a folder for each post:

hello-world/hello-world.mdx

2. Coding the Post

```javascript
---
title: Hello World!
slug: hello-world
author: Mark Jensen
---

This is my first blog post. I wrote it with MDX
```

The slug is the url that the page is going to have.

3. Getting the Blog Posts into Gatsby

#### Install gatsby-source-filesystem

```javascript
yarn add gatsby-source-filesystem
```

gatsby-source-filesystem is a way to use local files as part of the GraphQL data layer.

#### Setup gatsby-source-filesystem in gatsby-config.js

```javascript
{
  resolve: "gatsby-source-filesystem",
  options: {
    name: 'posts',
    path: require.resolve("/posts"),
  }
}
```

The only option that is required is the path, but we include name here just in case we want to search for it.

#### Querying for All MDX Posts

From the GraphQL Playground:

```javascript
query {
  allMdx {
    nodes {
      frontmatter {
        title
        slug
        author
      }
      excerpt
    }
  }
}
```

Nodes represent the data itself. Edges are the relationships between the certain nodes.

### Edges describe the relationship. Nodes describe the data itself.

## Creating a Hook to Load Blog Posts

/hooks/use-posts.js

```javascript
import { graphql, useStaticQuery } from "gatsby"

function usePosts() {
  var data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            title
            slug
            author
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
    excerpt: post.excerpt,
  }))
}

export default usePosts
```

## Display the Posts From the Homepage

```javascript
import usePosts from "../components/hooks/use-posts";

...
const posts = usePosts();

return (
  ...
  <h2>Read my blog</h2>
  {posts.map(post => {
    return (
      <pre>{JSON.stringify(post, null, 2)}</pre>
    )
  })}
)
```

Using JSON.stringify(post, null, 2) is a great tool for debugging JSON results in React.

The first argument (post) is the thing that we wont to log.

The second argument (null) is the replacer function. This is a function that alters the behavior of the stringification process, or it can be an array of String and Number objects that serve as a whitelist for selecting/filtering the properties of the value object to be included in the JSON string. If the value is null, or not provided, all properties of the object are included in the resulting JSON string.

The third argument (2) is used to insert whitespace into the output JSON string for readability purposes.

## Creating a Post Preview

/src/components/post-preview.js

```javascript
import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"

function PostPreview({ post }) {
  return (
    <article>
      <h3>
        <Link to={post.slug}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <Link to={post.slug}>Read this post &rarr;</Link>
    </article>
  )
}

export default PostPreview
```

Now, we can use this component in our homepage
/pages/index.js

```javascript
import PostPreview from "../../components/post-preview"

{
  posts.map(post => {
    return <PostPreview key={post.slug} post={post} />
  })
}
```

## Using Styled Components that Don't Render

/components/read-link.js

```javascript
import styled from "@emotion/styled"
import { Link } from "gatsby"

var ReadLink = styled(Link)`
  display: inline-block;
  font-size: 0.875rem;
`

export default ReadLink
```

## Programmatic Page Generation - Generating Post Pages

gatsby-node.js

```javascript
exports.createPages = async ({ actions, graphql, reporter }) => {
  const results = await graphql(`
    query {
      allMdx {
        nodes {
          frontmatter {
            slug
          }
        }
      }
    }
  `)

  if (results.errors) {
    reporter.panic("Failed to create posts", results.errors)
  }

  const posts = results.data.allMdx.nodes

  posts.forEach(post => {
    actions.createPage({
      path: post.frontmatter.slug,
      component: require.resolve("./src/templates/post.js"),
      context: {
        slug: post.frontmatter.slug,
      },
    })
  })
}
```

Because we are loading data, we make this an async function.

With createPages, we get a whole bunch of actions and a graphql helper. We also get a reporter that lets us write things to the console.

In contrast to when we are inside React where we use tagged template literals for our graphql call, in gatsby-node.js we are inside of the Node.js environment, so graphql(``) is a function call.

Inside of our query, we are only interested in the slug property of the frontmatter. This is because we don't want to have to load all of the content and then shove that content into a component. Instead, we want to create our pages and then have the pages query for the data that they want.

### We want to locate the data queries where they are actually used instead of having pass through data that is hard to track.

Checking our results with if(results.error) becomes very useful when we are dealing with external data sources and things can go wrong with APIs.

reporter.panic() stops that build and reports the error so that we have a chance to fix it.

If we get past the result.errors, we are able to assume that we got our posts and things worked as expected.

We use forEach() instead of map() because we don't want to return anything, map returns an array.

createPage() takes three arguments:

1. The path, this is where we want the page to live
2. A component. We need to tell it which component we want it to use.
3. The context.

## Creating the createPage Post Component

A good convention is to create a new folder called templates for this.

/templates/post.js

```javascript
import React from "react"
import { graphql } from "gatsby"
import { css } from "@emotion/core"
import Layout from "../components/layout"
import ReadLink from "../components/read-link"

function PostTemplate() {
  return (
    <Layout>
      <h1>Post title</h1>
      <p>Posted by author</p>
      <p>Post body goes here</p>
      <ReadLink to="/">&larr; Back to All Posts</ReadLink>
    </Layout>
  )
}

export default PostTemplate
```

### createPage() context

The context property gives us the ability to access the component.

/post.js

```javascript
function PostTemplate({pageContext}) {
  ...
  <pre>{JSON.stringify(pageContext, null, 2)}</pre>
}

// {
  // "isCreatedByStatefulCreatePages":false,
  // "slug": "/hello-world"
}
```

We can see that the slug comes through. We can use that in our data.

Theoretically, we could put the title, body, etc inside of the pageContext, the catch is that this can get unwieldy over time when data gets more complex, etc. Instead, we want to access the data from within our template:

/post.js

```javascript
import ReadLink from ...

export var query = graphql`

`

function PageTemplate ...
```

#### Variables in GraphQL

This is how we are going to query our individual posts.

```javascript
query {
  mdx(frontmatter: {slug: {eq: "hello-world"}}) {
    frontmatter {
      title
      author
    }
  }
}
```

But, we still need to be able to pass variables into our queries:

```javascript
query($slug: String!) {
  mdx(frontmatter: {slug: {eq: $slug}}) {
    frontmatter {
      title
      author
    }
  }
}
```

#### Anything that Gatsby provides as pageContext, it also provides for us as a graphql variable. Because we provided slug as a property to context inside of gatsby-node.js createPage, we have access to a graphql variable called \$slug.

So what we are doing with query($slug: String!) is telling graphql that we are going to have a variable named $slug that is going to be of type String, and it is required.

Now that we have our query all set up, we will need a way to render our MDX inside of our PostTemplate file. For this we need to use the MDX Renderer

post.js

```javascript
import { MDXRenderer } from "gatsby-plugin-mdx"

export var query = graphql`
  query($slug: String!) {
    mdx(frontmatter: { slug: { eq: $slug } }) {
      frontmatter {
        title
        author
      }
      body
    }
  }
`
```

### Anything that we query using graphql is going to become available as data, so we can use this inside of our PostTemplate

The results of: export var query = graphql BECOME accessible as data

```javascript
function PostTemplate({ data: { mdx: post } }) {
  return (
    <Layout>
      <h1>{post.frontmatter.title}</h1>
      <p>
        <MDXRenderer>{post.body}</MDXRenderer>
      </p>
      <p>{post.frontmatter.author}</p>
      <ReadLink to="/">&larr; Back to All Posts</ReadLink>
    </Layout>
  )
}
```

Above, we are doing some basic destructuring to get access to an individual post. We destructure data and refere to mdx as post to make things a bit more readable.

The only place that we need to use the MDXRenderer is for the post body, in its natural habitat, it displays a whole bunch of illegible JS, we use MDXRenderer to do all of the re-formatting of the body for us.
