import React from "react"
import { graphql } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"
import Layout from "../components/layout"
import ReadLink from "../components/read-link"

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

export default PostTemplate
