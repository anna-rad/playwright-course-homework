import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json';
import owner2012 from '../test-data/owner2012.json';

test('Validate owners list and visit list count', async ({ page }) => {
    await page.route('https://petclinic-api.bondaracademy.com/petclinic/api/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners),
            contentType: 'application/json'
        });
    });
    await page.route('https://petclinic-api.bondaracademy.com/petclinic/api/owners/2012', async route => {
        await route.fulfill({
            body: JSON.stringify(owner2012),
            contentType: 'application/json'
        });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'OWNERS' }).click();
    await page.getByRole('link', { name: 'Search' }).click();
    const ownerTable = page.locator('#ownersTable');
    const ownerRows = ownerTable.getByRole('row');
    const ownerKateryna = ownerTable.getByRole('row', { name: 'Kateryna Chystyakova' });
    const ownerMelania = ownerTable.getByRole('row', { name: 'Melania Rakitska' });
    await ownerKateryna.waitFor({ state: 'visible' });
    await expect(page.locator('#ownersTable tbody > tr')).toHaveCount(2);
    await expect(ownerKateryna.getByRole('cell').nth(4).getByRole('row')).toHaveCount(2);
    await expect(ownerMelania.getByRole('cell').nth(4).getByRole('row')).toHaveCount(5);
    const firstOwnerName = await ownerKateryna.getByRole('cell').nth(0).textContent();
    const firstOwnerAddress = await ownerKateryna.getByRole('cell').nth(1).textContent();
    const firstOwnerCity = await ownerKateryna.getByRole('cell').nth(2).textContent();
    const firstOwnerPhone = await ownerKateryna.getByRole('cell').nth(3).textContent();
    const firstOwnerPets = await ownerKateryna.locator('tbody tr').nth(0).getByRole('cell').nth(4).allTextContents();
    await ownerKateryna.getByRole('link').click();
    await expect(page.getByRole('heading', { name: 'Owner Information' })).toBeVisible();
    const ownerDetails = page.locator('app-owner-detail');
    await expect(ownerDetails.getByRole('row', { name: 'Name' }).first().locator('td')).toHaveText(`${firstOwnerName}`);
    await expect(ownerDetails.getByRole('row', { name: 'Address' }).locator('td')).toHaveText(`${firstOwnerAddress}`);
    await expect(ownerDetails.getByRole('row', { name: 'City' }).locator('td')).toHaveText(`${firstOwnerCity}`);
    await expect(ownerDetails.getByRole('row', { name: 'Telephone' }).locator('td')).toHaveText(`${firstOwnerPhone}`);
    for (const petName of firstOwnerPets) {
        await expect(page.locator('app-pet-list').getByRole('row', { name: `Name ${petName}` })).toBeVisible();
    }
    const visitList = page.locator('app-pet-list').getByRole('row').first().locator('app-visit-list').getByRole('row');
    //checking for 11 because 1 row for column names and 10 rows for visits
    await expect(visitList).toHaveCount(11);
});