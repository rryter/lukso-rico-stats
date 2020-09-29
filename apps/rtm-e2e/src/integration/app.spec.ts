import { getGreeting } from '../support/app.po';

describe('rtm', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to rtm!');
  });
});
