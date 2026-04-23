import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'OWNERS' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
  await expect(page.getByRole('heading')).toHaveText('Owners');
})

test('Validate selected pet types from the list', async ({ page }) => {
  await page.getByRole('link', { name: 'George Franklin' }).click();
  await expect(page.locator('.ownerFullName')).toHaveText('George Franklin');
  const leoPetSection = page.locator('app-pet-list', { hasText: 'Leo' });
  await leoPetSection.getByRole('button', { name: 'Edit Pet' }).click(); 
  await expect(page.getByRole('heading')).toHaveText('Pet');
  await expect(page.locator('#owner_name')).toHaveValue('George Franklin');
  const typeField = page.locator('#type1')
  await expect(typeField).toHaveValue('cat');
  const petTypeOptions = await page.locator('#type option').allTextContents();
  for (const pet of petTypeOptions) {
   await page.locator('#type').selectOption(pet);
   await expect(typeField).toHaveValue(pet);
 }
});


test('Validate the pet type update', async ({ page }) => {
  await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click();
  const rosyPetSection = page.locator('app-pet-list', { hasText: 'Rosy' });
  await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click(); 
  await expect(page.locator('#name')).toHaveValue('Rosy');
  const typeField = page.locator('#type1')
  await expect(typeField).toHaveValue('dog');
  const petTypeDropdown = page.locator('#type')
  await petTypeDropdown.selectOption('bird');
  await expect(typeField).toHaveValue('bird');
  await expect(petTypeDropdown).toHaveValue('bird');
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await expect(rosyPetSection.locator('dd').nth(2)).toHaveText('bird');
  await rosyPetSection.getByRole('button', { name: 'Edit Pet' }).click();
  await expect(typeField).toHaveValue('bird');
  await petTypeDropdown.selectOption('dog');
  await expect(typeField).toHaveValue('dog');
  await expect(petTypeDropdown).toHaveValue('dog');
  await page.getByRole('button', { name: 'Update Pet' }).click();
  await expect(rosyPetSection.locator('dd').nth(2)).toHaveText('dog');
});
