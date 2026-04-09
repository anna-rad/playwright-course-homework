import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: ' OWNERS' }).click();
  await page.getByRole('listitem', { name: 'Search' }).click();
  await expect(page.getByRole('heading')).toHaveText('Owners');
})

test('Validate selected pet types from the list', async ({ page }) => {
  await page.getByRole('link', { name: 'George Franklin' }).click();
  await expect(page.locator('.ownerFullName')).toHaveText('George Franklin');
  const cellOfPetLeo = page.locator('td').filter({ hasText: 'Leo' });
  await cellOfPetLeo.getByRole('button', { name: 'Edit Pet' }).click();
  await expect(page.getByRole('heading')).toHaveText('Pet');
});

test('Validate the pet type update', async ({ page }) => {
  await page.getByRole('link', { name: 'Eduardo Rodriguez' }).click();
});
