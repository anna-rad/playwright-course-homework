import { test, expect } from '@playwright/test';
import owners from '../test-data/owners.json';
import owner2012 from '../test-data/owner2012.json';

test('Validate owners list and visit list count', async ({ page }) => {
    await page.route('*/**/api/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners),
            contentType: 'application/json'
        });
    });
    await page.route('*/**/api/owners/2012', async route => {
        await route.fulfill({
            body: JSON.stringify(owner2012),
            contentType: 'application/json'
        });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'OWNERS' }).click();
    await page.getByRole('link', { name: 'Search' }).click();
    const ownerTable = page.locator('#ownersTable');
    const ownerKateryna = ownerTable.getByRole('row', { name: 'Kateryna Chystyakova' });
    const ownerMelania = ownerTable.getByRole('row', { name: 'Melania Rakitska' });
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
    const visitList = page.locator('app-pet-list').getByRole('row').first().locator('app-visit-list table > tr');
    await expect(visitList).toHaveCount(10);
});

test('Validate specialties list for veterinarian', async ({ page }) => {
    const specialtiesList = [
        { id: 1, name: 'radiology' },
        { id: 2, name: 'surgery' },
        { id: 3, name: 'dentistry' },
        { id: 4, name: 'nutrition' },
        { id: 5, name: 'dermatology' },
        { id: 6, name: 'ophthalmology' },
        { id: 7, name: 'cardiology' },
        { id: 8, name: 'neurology' },
        { id: 9, name: 'oncology' },
        { id: 10, name: 'immunology' }
    ];

    await page.route('*/**/api/vets', async route => {
        const vetsResponse = await route.fetch();
        const vetsResponseBody = await vetsResponse.json();
        vetsResponseBody[5].specialties = specialtiesList;
        await route.fulfill({
            body: JSON.stringify(vetsResponseBody)
        });
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'VETERINARIANS' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    const vetSharon = page.getByRole('row', { name: 'Sharon Jenkins' });
    await expect(vetSharon).toBeVisible();
    const vetSharonSpecialties = (await vetSharon.getByRole('cell').nth(1).locator('div').allTextContents()).map(s => s.trim());
    expect(vetSharonSpecialties).toEqual(specialtiesList.map(s => s.name));
});