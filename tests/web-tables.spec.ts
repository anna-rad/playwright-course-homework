import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'OWNERS' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
})

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

test('Validate specialty update', async ({page}) => {
  
});

test('Validate specialty lists', async ({page}) => {
  
});