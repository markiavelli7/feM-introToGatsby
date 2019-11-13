import React from "react"
import { css } from "@emotion/core"
import { Link } from "gatsby"
import Image from "gatsby-image"

import ReadLink from "./read-link"

function PostPreview({ post }) {
  return (
    <article
      css={css`
        border-bottom: 1px solid #ddd;
        display: flex;
        margin-top: 0.75rem;
        padding-bottom: 1rem;

        &:first-of-type {
          margin-top: 1.5rem;
        }
      `}
    >
      <Link
        to={post.slug}
        css={css`
          margin: 1rem 1rem 0 0;
          width: 150px;
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
      <div>
        <h3>
          <Link to={post.slug}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <ReadLink to={post.slug}>Read this post &rarr;</ReadLink>
      </div>
    </article>
  )
}

export default PostPreview
