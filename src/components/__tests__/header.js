import React from "react"
import { render } from "@testing-library/react"
import Header from "../header"

test("temp", () => {
  expect(true).toBe(true)
})

test("Render Test", () => {
  var { debug } = render(<Header />)

  debug()
})
