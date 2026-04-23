import { test, expect } from '@playwright/test';

test('Add and delete pet type', async ({page}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'PET TYPES' }).click();
  await expect(page.getByRole('heading')).toHaveText('Pet Types');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.locator('app-pettype-add').getByRole('heading')).toHaveText('New Pet Type');
  await expect(page.locator('#name')).toBeVisible();
  await expect(page.locator('form').locator('label:has-text("Name")')).toBeVisible();
  await page.locator('#name').fill('pig');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('table tr').last().locator('input')).toHaveValue('pig');
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('Delete the pet type?');
    await dialog.accept();
  });
  await page.locator('table td').last().getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator('table tr').last().locator('input')).not.toHaveValue('pig');
});