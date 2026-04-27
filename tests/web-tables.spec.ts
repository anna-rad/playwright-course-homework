import { test, expect } from '@playwright/test';

test.describe('Tests for Owners table', () => {
 test.beforeEach(async ({ page }) => {
   await page.goto('/')
   await page.getByRole('button', { name: 'OWNERS' }).click();
   await page.getByRole('link', { name: 'Search' }).click();
  });

 test('Validate the pet name city of the owner', async ({page}) => {
   const rowMrBlack = await page.getByRole('row', { name: 'Jeff Black' });
   await expect(rowMrBlack.getByRole('cell').nth(2)).toHaveText('Monona');
 });
  
 test('Validate owners count of the Madison city', async ({page}) => {
   const cityMadisonCells = page.locator('td', { hasText: 'Madison' });
   await expect(cityMadisonCells).toHaveCount(4);
 });
 
 test('Validate search by last name', async ({page}) => {
   await page.locator('input[name="lastName"]').fill('Black');
   await page.getByRole('button', { name: 'Find Owner' }).click();
   await expect(page.getByRole('row').nth(1).getByRole('cell').nth(0)).toHaveText(/\bBlack$/);
   await page.locator('input[name="lastName"]').fill('Davis');
   await page.getByRole('button', { name: 'Find Owner' }).click();
   const searchResultNameCells = page.getByRole('row').getByRole('cell').nth(0);
   for (const searchResultName of await searchResultNameCells.all()) {
     await expect(searchResultName).toHaveText(/\bDavis$/)
   }
   await page.locator('input[name="lastName"]').fill('Es');
   await page.getByRole('button', { name: 'Find Owner' }).click();
   for (const searchResultName of await searchResultNameCells.all()) {
     await expect(searchResultName).toContainText(/\bEs\w*$/);
   }
   await page.locator('input[name="lastName"]').fill('Playwright');
   await page.getByRole('button', { name: 'Find Owner' }).click();
   await expect(page.getByText('No owners with LastName starting with "Playwright"')).toBeVisible();
 });

 test('Validate phone number and pet name on the Owner Information page', async ({page}) => {
   const rowByPhone = await page.getByRole('row', { name: '6085552765' });
   const petName = await rowByPhone.getByRole('cell').nth(4).textContent();
   await rowByPhone.getByRole('link').click();
   await expect(page.locator('app-owner-detail').getByRole('row', { name: 'Telephone' })).toContainText('6085552765');
   await expect(page.locator('app-pet-list').getByRole('row', { name: 'Name' })).toContainText(`${petName}`);
 });

 test('Validate pets of the Madison city', async ({ page }) => {
   const listOfPets: string[] = [];
   const cityMadisonCell = page.locator('td', { hasText: 'Madison' });
   await cityMadisonCell.first().waitFor({ state: 'visible' });
   const rowsByCity = page.locator('tr', { has: cityMadisonCell });
   for (const row of await rowsByCity.all()) {
     const petName = await row.locator('td').nth(4).textContent();
     if (petName) {
       listOfPets.push(petName.trim());
     }
   }
   expect(listOfPets).toEqual(
     expect.arrayContaining(["Leo", "George", "Mulligan", "Freddy"])
   );
  });
});

test('Validate specialty update', async ({page}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'VETERINARIANS' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toContainText('surgery');
  await page.getByRole('link', { name: 'SPECIALTIES' }).click();
  await expect(page.getByRole('heading')).toHaveText('Specialties');
  await page.getByRole('row', { name: 'surgery' }).getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByRole('heading')).toHaveText('Edit Specialty');
  await expect(page.getByRole('textbox')).toHaveValue('surgery');
  await page.getByRole('textbox').fill('dermatology');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'VETERINARIANS' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.getByRole('row', { name: 'Rafael Ortega' }).getByRole('cell').nth(1)).toContainText('dermatology');
  await page.getByRole('link', { name: 'SPECIALTIES' }).click();
  await page.getByRole('row', { name: 'dermatology' }).getByRole('button', { name: 'Edit' }).click();
  await expect(page.getByRole('textbox')).toHaveValue('dermatology');
  await page.getByRole('textbox').fill('surgery');
  await page.getByRole('button', { name: 'Update' }).click();
});

test('Validate specialty lists', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'SPECIALTIES' }).click();
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('#name').fill('oncology');
  await page.getByRole('button', { name: 'Save' }).click();

  const allSpecialties: string[] = [];
  const specialtyNames = page.getByRole('textbox');
  for (const specialtyName of await specialtyNames.all()) {
    const specialty = await specialtyName.inputValue();
    if (specialty) {
      allSpecialties.push(specialty.trim());
    }
  }
  await page.getByRole('button', { name: 'VETERINARIANS' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('button', { name: 'Edit Vet' }).click();
  await page.locator('.dropdown-arrow').click();
  const specialtiesdDropdownOptions = await page.locator('.dropdown-content label').allTextContents();
  expect(specialtiesdDropdownOptions.sort()).toEqual(allSpecialties.sort());
  await page.getByLabel('oncology').check();
  await page.locator('.dropdown-arrow').click();
  await page.getByRole('button', { name: 'Save Vet' }).click();
  await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toContainText('oncology');
  await page.getByRole('link', { name: 'SPECIALTIES' }).click();
  await page.getByRole('row', { name: 'oncology' }).getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'VETERINARIANS' }).click();
  await page.getByRole('link', { name: 'All' }).click();
  await expect(page.getByRole('row', { name: 'Sharon Jenkins' }).getByRole('cell').nth(1)).toBeEmpty();
});