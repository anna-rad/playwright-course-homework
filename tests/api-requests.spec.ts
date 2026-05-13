import { test, expect } from '@playwright/test';

test('Validation of delete specialty', async ({ page, request }) => {
    const newSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            name: "api testing expert"
        }
    });
    expect(newSpecialtyResponse.status()).toBe(201);
    await page.goto('/');
    await page.getByRole('link', { name: 'SPECIALTIES' }).click();
    const newSpecialtyRow = page.getByRole('row', { name: 'api testing expert' });
    await expect(newSpecialtyRow).toBeVisible();
    await newSpecialtyRow.getByRole('button', { name: 'Delete' }).click();
    await expect(newSpecialtyRow).not.toBeVisible();
});


test('Add and delete veterinarian', async ({ page }) => {

});

test('New specialty is displayed', async ({ page }) => {

});