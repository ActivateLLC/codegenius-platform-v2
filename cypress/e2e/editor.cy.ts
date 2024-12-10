describe('Editor Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the editor', () => {
    cy.get('[data-testid="monaco-editor"]').should('exist');
  });

  it('loads the AI assistant', () => {
    cy.get('[data-testid="ai-assistant"]').should('exist');
  });

  it('can type in the editor', () => {
    cy.get('[data-testid="monaco-editor"]')
      .should('be.visible')
      .type('const test = "Hello World";');
  });
});