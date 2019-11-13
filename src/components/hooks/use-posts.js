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

export default usePosts
