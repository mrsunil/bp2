import { AtlasPage } from './app.po';

describe('atlas App', () => {
  let page: AtlasPage;

  beforeEach(() => {
    page = new AtlasPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
