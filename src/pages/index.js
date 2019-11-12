import React from "react"
import { Link } from "gatsby"
import usePosts from "../components/hooks/use-posts"
import PostPreview from "../components/post-preview"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  var posts = usePosts()
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link>

      <h2>Read my blog</h2>
      {posts.map(post => {
        return <PostPreview key={post.slug} post={post} />
      })}
    </Layout>
  )
}

export default IndexPage
