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


test('Add and delete veterinarian', async ({ page, request }) => {
    const vetFirstName = "Samantha";
    const vetLastName = "Snow";
    const newVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            firstName: vetFirstName,
            id: null,
            lastName: vetLastName,
            specialties: []
        }
    });
    const vetId = (await newVetResponse.json()).id;
    expect(newVetResponse.status()).toBe(201);
    expect((await newVetResponse.json()).firstName).toBe(vetFirstName);

    await page.goto('/');
    await page.getByRole('button', { name: 'VETERINARIANS' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    const newVetRow = page.getByRole('row', { name: `${vetFirstName} ${vetLastName}` });
    await expect(newVetRow).toBeVisible();
    await expect(newVetRow.getByRole('cell').nth(1)).toBeEmpty();
    await newVetRow.getByRole('button', { name: 'Edit Vet' }).click();
    await page.locator('.dropdown-display').click();
    await page.getByRole('checkbox', { name: 'dentistry' }).check();
    await page.locator('.dropdown-display').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText('dentistry');

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`);
    expect(deleteVetResponse.status()).toBe(204);

    const listOfVetsResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets');
    const listOfVets = await listOfVetsResponse.json();
    const vetIds = listOfVets.map((item: { id: number }) => item.id);
    expect(vetIds).not.toContain(vetId);
});


test('New specialty is displayed', async ({ page, request }) => {
    const newSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            name: "api testing ninja"
        }
    });
    expect(newSpecialtyResponse.status()).toBe(201);
    const specialtyId = (await newSpecialtyResponse.json()).id;

    const firstName = "John";
    const lastName = "Doe";
    const newVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
            firstName: firstName,
            lastName: lastName,
            id: null,
            specialties: [
                {
                    id: 4259,
                    name: "surgery"
                }
            ]
        }
    });
    expect(newVetResponse.status()).toBe(201);
    const vetId = (await newVetResponse.json()).id;

    await page.goto('/');
    await page.getByRole('button', { name: 'VETERINARIANS' }).click();
    await page.getByRole('link', { name: 'All' }).click();
    const newVetRow = page.getByRole('row', { name: `${firstName} ${lastName}` });
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText('surgery');
    await newVetRow.getByRole('button', { name: 'Edit Vet' }).click();
    await page.locator('.dropdown-display').click();
    await page.getByRole('checkbox', { name: 'api testing ninja' }).check();
    await page.getByRole('checkbox', { name: 'surgery' }).uncheck();
    await page.locator('.dropdown-display').click();
    await page.getByRole('button', { name: 'Save Vet' }).click();

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`);
    expect(deleteVetResponse.status()).toBe(204);

    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtyId}`);
    expect(deleteSpecialtyResponse.status()).toBe(204);

    await page.getByRole('link', { name: 'SPECIALTIES' }).click();
    await expect(page.getByRole('row', { name: 'api testing ninja' })).not.toBeVisible();
});