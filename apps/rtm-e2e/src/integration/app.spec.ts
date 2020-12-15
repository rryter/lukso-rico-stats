import { getCreateAccountButton } from '../support/components/new-account.component.e2e-selectors';

describe('ERC 725 Home', () => {
  before(() => cy.visit('/'));

  it('should display call to action', () => {
    cy.contains('Welcome to the future!');
  });

  it('should create account and fund it with 100 LYX', () => {
    getCreateAccountButton().click();
    cy.getByAttr('image-editor__next-key').click();

    cy.getByAttr('profile-editor__nickName').type('Coaster');
    cy.getByAttr('profile-editor__bio').type('Web Developer located in Switzerland.');
    cy.getByAttr('profile-editor__next').click();

    cy.getByAttr('key-editor__add-key').click();

    cy.getByAttr('wallet__top-up').click();
    cy.getByAttr('amount__value').type('100', { force: true });
    cy.getByAttr('amount__accept').click();
    cy.getByAttr('wallet__value').contains(100);
    cy.getByAttr('overview-account__go-to-account-detail').click();

    cy.getByAttr('privileges__keys').contains('b92266').parent().contains('Management');
    cy.getByAttr('profile-editor__next').click();
    cy.getByAttr('key-editor__go-to-profile').click();

    cy.getByAttr('wallet__withdraw').click();
    cy.getByAttr('amount__value').type('100', { force: true });
    cy.getByAttr('amount__accept').click();
    cy.getByAttr('wallet__value').contains(0.0);
    cy.getByAttr('overview-account__go-to-account-detail').click();

    cy.getByAttr('keymanager__add-key').click();
    cy.getByAttr('add-key__address').type('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    cy.getByAttr('add-key__confirm').click();
    cy.getByAttr('privileges__keys').contains('dc79C8').parent().contains('Execution');
  });
});
