import { getCreateAccountButton } from '../support/components/new-account.component.e2e-selectors';

describe('ERC 725 Home', () => {
  before(() => cy.visit('/'));

  it('should display call to action', () => {
    cy.contains('Create Your On-Chain Wallet / Profile');
  });

  it('should create account and fund it with 100 LYX', () => {
    getCreateAccountButton().click();
    cy.getByAttr('progress__make-account-managable').click();
    cy.getByAttr('proxy-account__top-up').click();
    cy.getByAttr('amount__value').type('100', { force: true });
    cy.getByAttr('amount__accept').click();
    cy.getByAttr('proxy-account__value').contains(100);
    cy.getByAttr('privileges__keys')
      .contains('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
      .parent()
      .contains('Management');

    cy.getByAttr('proxy-account__withdraw').click();
    cy.getByAttr('amount__value').type('100', { force: true });
    cy.getByAttr('amount__accept').click();
    cy.getByAttr('proxy-account__value').contains(0.0);
    cy.getByAttr('keymanager__add-key').click();
    cy.getByAttr('add-key__address').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    cy.getByAttr('add-key__confirm').click();
    cy.getByAttr('privileges__keys')
      .contains('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
      .parent()
      .contains('Execution');
  });
});
