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
