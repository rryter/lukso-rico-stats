import { getGreeting } from '../support/app.po';
import { ethers } from 'ethers';
describe('ERC 725 Home', () => {
  beforeEach(() =>
    cy.visit('/', {
      onBeforeLoad(win: any) {
        win.ethereum = false;
      },
    })
  );

  it('should display call to action', () => {
    cy.contains('Create Your On-Chain Wallet / Profile');
  });

  it('should create account and fund it with 100 LYX', () => {
    cy.get('[data-cy="new-account__create-account"]').click();
    cy.get('[data-cy="progress__make-account-managable"]', { timeout: 20000 }).click();

    cy.get('[data-cy="proxy-account__top-up"]').click();
    cy.get('[data-cy="amount__value"]').type('100', { force: true });
    cy.get('[data-cy="amount__accept"]').click();

    cy.get('[data-cy="proxy-account__value"]').contains(100);

    cy.get('[data-cy="privileges__keys"]')
      .contains('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      .parent()
      .contains('Management');

    cy.get('[data-cy="proxy-account__withdraw"]').click();
    cy.get('[data-cy="amount__value"]').type('100', { force: true });
    cy.get('[data-cy="amount__accept"]').click();

    cy.get('[data-cy="proxy-account__value"]').contains(0.0);

    cy.get('[data-cy="keymanager__add-key"]').click();
    cy.get('[data-cy="add-key__address"]').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    cy.get('[data-cy="add-key__confirm"]').click();

    cy.get('[data-cy="privileges__keys"]')
      .contains('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      .parent()
      .contains('Execution');
  });
});
