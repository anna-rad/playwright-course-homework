import { test } from '../fixtures/test-options';
import { expect } from '@playwright/test';

test('Visit and pet deletion', async ({ page, petOwner }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'OWNERS' }).click();
    await page.getByRole('link', { name: 'Search' }).click();
    const ownerRow = page.getByRole('row', { name: petOwner.ownerFirstName + ' ' + petOwner.ownerLastName });
    await ownerRow.getByRole('link').click();
    const petData = page.locator('app-pet-list', { hasText: petOwner.petName });
    await petData.locator('app-visit-list table').getByRole('row', { name: petOwner.visitDescription }).getByRole('button', { name: 'Delete Visit' }).click();
    await page.waitForResponse('**/api/visits/**');
    await expect(petData.locator('app-visit-list table').getByRole('row', { name: petOwner.visitDescription })).not.toBeVisible();
    await petData.getByRole('button', { name: 'Delete Pet' }).click();
    await page.waitForResponse('**/api/pets/**');
    await expect(petData).not.toBeVisible();
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(ownerRow.getByRole('cell').nth(4)).toBeEmpty();
});