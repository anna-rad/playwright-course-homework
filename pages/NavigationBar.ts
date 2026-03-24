import { Page, Locator} from '@playwright/test';

export class NavigationBar {
  readonly page: Page;

  // Locators 
 public readonly petTypesNavItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.petTypesNavItem = page.getByRole('link', { name: 'PET TYPES' })
    
  }
}