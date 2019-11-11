describe("app", () => {
  it("works", () => {
    cy.visit("/")
      .findByText(/Go to page 2/i)
      .click()
      .findByText(/Hi From the Second page/i)
  })
})
