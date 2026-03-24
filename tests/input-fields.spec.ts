import { test, expect } from '@playwright/test';
import { NavigationBar } from '../pages/navigationBar';
import { PetTypesPage } from '../pages/PetTypesPage';
import { EditPetTypePage } from '../pages/EditPetTypePage';

test.beforeEach( async({page}) => {
  const navigationBar = new NavigationBar(page); 
  const petTypesPage = new PetTypesPage(page); 
  await page.goto('/');
  await expect(navigationBar.petTypesNavItem).toBeVisible();
  await navigationBar.petTypesNavItem.click(); 
  await expect(petTypesPage.heading).toBeVisible();
})

test('Update pet type', async ({page}) => {
  const petTypesPage = new PetTypesPage(page);
  const editPetTypePage = new EditPetTypePage(page);
  await petTypesPage.clickEditButtonByPetType('cat');
  await expect(editPetTypePage.heading).toBeVisible();
  await editPetTypePage.nameInput.clear();
  await editPetTypePage.nameInput.fill('rabbit');
  await editPetTypePage.updateButton.click();
  await expect(petTypesPage.rows.first()).toHaveText('rabbit');
  await petTypesPage.clickEditButtonByPetType('rabbit');
  await editPetTypePage.nameInput.clear();
  await editPetTypePage.nameInput.fill('cat');
  await editPetTypePage.updateButton.click();
  await expect(petTypesPage.rows.first()).toHaveText('cat');
});

test('Cancel pet type update', async ({page}) => {
  const petTypesPage = new PetTypesPage(page);
  const editPetTypePage = new EditPetTypePage(page);
  await petTypesPage.clickEditButtonByPetType('dog');
  await editPetTypePage.nameInput.clear();
  await editPetTypePage.nameInput.fill('moose');
  await expect(editPetTypePage.nameInput).toHaveValue('moose');
  await editPetTypePage.cancelButton.click();
  const rowWithDog = petTypesPage.rows.filter({ hasText: 'dog' });
  const count = await rowWithDog.count();
  expect(count).toBe(1);

});

test('Validation of Pet type name is required', async ({page}) => {
  const petTypesPage = new PetTypesPage(page);
  const editPetTypePage = new EditPetTypePage(page);
  await petTypesPage.clickEditButtonByPetType('lizard');
  await editPetTypePage.nameInput.clear(); 
  await expect(editPetTypePage.nameInputValidationMessage).toBeVisible();
  await editPetTypePage.updateButton.click();
  await expect(editPetTypePage.heading).toBeVisible();
  await editPetTypePage.cancelButton.click();
  await expect(petTypesPage.heading).toBeVisible();
});

