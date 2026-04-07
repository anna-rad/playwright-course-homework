import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: ' VETERINARIANS' }).click();
  await page.getByRole('link', { name: 'All' }).click();
})

test('Validate selected specialties', async ({ page }) => {
  await expect(page.getByRole('heading')).toHaveText('Veterinarians');
  await page.getByRole('row', { name: 'Helen Leary' }).getByRole('button', { name: 'Edit Vet' }).click();
  await expect(page.locator('.selected-specialties')).toHaveText('radiology');
  await page.locator('.dropdown-arrow').click();
  expect(await page.getByRole('checkbox', { name: 'radiology' }).isChecked()).toBeTruthy();
  expect(await page.getByRole('checkbox', { name: 'surgery' }).isChecked()).toBeFalsy();
  expect(await page.getByRole('checkbox', { name: 'dentistry' }).isChecked()).toBeFalsy();
  await page.getByRole('checkbox', { name: 'surgery' }).check();
  await page.getByRole('checkbox', { name: 'radiology' }).uncheck();
  await expect(page.locator('.selected-specialties')).toHaveText('surgery');
  await page.getByRole('checkbox', { name: 'dentistry' }).check();
  await expect(page.locator('.selected-specialties')).toHaveText('surgery, dentistry');
});

test('Select all specialties', async ({ page }) => {
  await page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('button', { name: 'Edit Vet' }).click();
  await expect(page.locator('.selected-specialties')).toHaveText('surgery');
  await page.locator('.dropdown-arrow').click();
  const allSpecialties = page.getByRole('checkbox');
  const expectedNames = [];

  for (const specialty of await allSpecialties.all()) {
   await specialty.check();
   await expect(specialty).toBeChecked();
   const name = await specialty.getAttribute('label');
   if (name) 
     expectedNames.push(name);
   }
  await expect(page.locator('.selected-specialties')).toContainText(expectedNames);
});

test('Unselect all specialties', async ({ page }) => {
    await page.getByRole('row', { name: 'Linda Douglas' }).getByRole('button', { name: 'Edit Vet' }).click();
    await expect(page.locator('.selected-specialties')).toHaveText('dentistry, surgery');
    await page.locator('.dropdown-arrow').click();
    const allSpecialties = page.getByRole('checkbox');
    for (const specialty of await allSpecialties.all()) {
      await specialty.uncheck();
      await expect(specialty).not.toBeChecked();
    }
    await expect(page.locator('.selected-specialties')).toHaveText('');
});