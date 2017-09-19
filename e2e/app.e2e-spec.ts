import { InsurancePage } from './app.po';

describe('insurance App', () => {
  let page: InsurancePage;

  beforeEach(() => {
    page = new InsurancePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
