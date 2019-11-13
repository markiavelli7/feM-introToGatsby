import React from "react"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import { Link, graphql, useStaticQuery } from "gatsby"
import BackgroundImage from "gatsby-background-image"

function Hero() {
  var { image } = useStaticQuery(graphql`
    query {
      image: file(relativePath: { eq: "night-waterfall.jpg" }) {
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
      <TextBox>
        <h1>Picture Me Rollin&apos;</h1>
        <p
          css={css`
            margin-bottom: 0;
          `}
        >
          Welcome to the Jungle! <Link to="/page-2">Go to page 2. &rarr;</Link>
        </p>
      </TextBox>
    </ImageBackground>
  )
}

export default Hero

var ImageBackground = styled(BackgroundImage)`
  background-position: top 20% center;
  background-size: cover;
  height: 40vh;
`

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
