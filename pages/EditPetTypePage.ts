import { Page, Locator} from '@playwright/test';

export class EditPetTypePage {
  readonly page: Page;

  // Locators 
 public readonly heading: Locator;
 public readonly nameInput: Locator;
 public readonly updateButton: Locator;
 public readonly cancelButton: Locator;
 public readonly nameInputValidationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.heading = page.getByRole('heading', { name: 'Edit Pet Type' });
    this.nameInput = page.locator('#name');
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.nameInputValidationMessage = this.nameInput.locator('..').getByText('Name is required');
  }
}