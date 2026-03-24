import { Page, Locator} from '@playwright/test';

export class PetTypesPage {
  readonly page: Page;

  // Locators 
 public readonly heading: Locator;
 public readonly rows: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Pet Types' });
    this.rows = page.locator('tbody tr');
  }

  // Actions

clickEditButtonByPetType(name: string) {
  const row = this.page.getByRole('row', { name });
  const editButton = row.getByRole('button', { name: 'Edit' });
  return editButton.click();
}
}