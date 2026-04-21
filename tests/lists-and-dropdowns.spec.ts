import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: ' OWNERS' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page.getByRole('heading')).toHaveText('Owners');
})

test('Validate selected pet types from the list', async ({ page }) => {
  await page.getByRole('link', { name: 'George Franklin' }).click();
  await expect(page.locator('.ownerFullName')).toHaveText('George Franklin');
  const cellOfPetLeo = page.locator('td').filter({ hasText: 'Leo' });
  await cellOfPetLeo.getByRole('button', { name: 'Edit Pet' }).click();
  await expect(page.getByRole('heading')).toHaveText('Pet');
  await expect(page.locator('#owner_name')).toHaveValue('George Franklin');
  const typeField = page.locator('#type1')
  await expect(typeField).toHaveValue('cat');
  const optionsList = page.locator('#type');
  const pets = ["cat", "dog", "lizard", "snake", "bird", "hamster"];
  for (const pet of pets) {
    await optionsList.selectOption(pet);
    await expect(typeField).toHaveValue(pet);
  }
});


test('Validate the pet type update', async ({ page }) => {
  await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click();
  const cellOfPetRosy = page.locator('td').filter({ hasText: 'Rosy' });
  await cellOfPetRosy.getByRole('button', { name: 'Edit Pet' }).click();
   await expect(page.locator('#name')).toHaveValue('Rosy');
  const typeField = page.locator('#type1')
  await expect(typeField).toHaveValue('dog');
  const optionsList = page.locator('#type')
  await optionsList.selectOption('bird');
  await expect(typeField).toHaveValue('bird');
  await expect(optionsList).toHaveValue('bird');
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await expect(cellOfPetRosy).toContainText('bird');
  await cellOfPetRosy.getByRole('button', { name: 'Edit Pet' }).click();
  await expect(typeField).toHaveValue('bird');
  await optionsList.selectOption('dog');
  await expect(typeField).toHaveValue('dog');
  await expect(optionsList).toHaveValue('dog');
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await expect(cellOfPetRosy).toContainText('dog');
});
