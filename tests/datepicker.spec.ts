import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'OWNERS' }).click();
  await page.getByRole('link', { name: 'Search' }).click();
})

test('Select the desired date in the calendar', async ({page}) => {
  await page.getByRole('row', { name: 'Harold Davis' }).getByRole('link').click();
  await page.getByRole('button', { name: 'Add New Pet' }).click();
  await page.getByLabel('Name').fill('Tom');
  await expect(page.locator('#name  ~ .glyphicon-remove')).not.toBeVisible();
  await expect(page.locator('#name  ~ .glyphicon-ok')).toBeVisible();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  await page.getByRole('button', { name: 'Choose month and year' }).click();
  await page.getByRole('button', {name: 'Previous 24 years'}).click();
  await page.getByRole('button', {name: '2014'}).click();
  await page.getByRole('button', {name: '05 2014'}).click();
  await page.getByRole('button', {name: '2014/05/02'}).click();
  await expect(page.locator('input[name="birthDate"]')).toHaveValue('2014/05/02');
  await page.locator('#type').selectOption("dog");
  await page.getByRole('button', { name: 'Save Pet' }).click();
  await expect(page.locator('app-pet-list', { hasText: 'Tom' }).locator('dt:has-text("Name") + dd')).toHaveText('Tom');
  await expect(page.locator('app-pet-list', { hasText: 'Tom' }).locator('dt:has-text("Birth Date") + dd')).toHaveText('2014-05-02');
  await expect(page.locator('app-pet-list', { hasText: 'Tom' }).locator('dt:has-text("Type") + dd')).toHaveText('dog');
  await page.locator('app-pet-list', { hasText: 'Tom' }).getByRole('button', { name: 'Delete Pet' }).click();
  await expect(page.locator('app-pet-list', { hasText: 'Tom' })).not.toBeVisible();
});

test('Select the dates of visits and validate dates order', async ({page}) => {
  await page.getByRole('row', { name: 'Jean Coleman' }).getByRole('link').click();
  await page.locator('app-pet-list', { hasText: 'Samantha' }).getByRole('button', { name: 'Add Visit' }).click();
  await expect(page.getByRole('heading')).toHaveText('New Visit');
  await expect(page.getByRole('row').getByRole('cell').nth(0)).toHaveText('Samantha');
  await expect(page.getByRole('row').getByRole('cell').nth(3)).toHaveText('Jean Coleman');

  //getting current date in the format YYYY/MM/DD and booking visit for that date
  await page.getByRole('button', { name: 'Open calendar' }).click();
  function formatDate(date: Date, separator: string = '/'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${separator}${month}${separator}${day}`;
  }
  const today = new Date();
  const currentDateForCalendar = formatDate(today);
  const currentDateForVisit = formatDate(today, '-');
  await page.getByRole('button', { name: currentDateForCalendar }).click();
  await expect(page.locator('input[name="date"]')).toHaveValue(currentDateForCalendar);
  await page.locator('#description').fill('dermatologists visit');
  await page.getByRole('button', { name: 'Add Visit' }).click();
  await expect(page.locator('app-pet-list', { hasText: 'Samantha' }).locator('app-visit-list').getByRole('row').nth(1)).toContainText(currentDateForVisit);
  
  //getting current date - 45 in the format YYYY/MM/DD and booking visit for that date
  await page.locator('app-pet-list', { hasText: 'Samantha' }).getByRole('button', { name: 'Add Visit' }).click();
  await page.getByRole('button', { name: 'Open calendar' }).click();
  const dateMinus45 = new Date(today);
  dateMinus45.setDate(today.getDate() - 45);
  const dateMinus45ForCalendar = formatDate(dateMinus45);
  const dateMinus45Year = dateMinus45.getFullYear();
  const dateMinus45Month = String(dateMinus45.getMonth() + 1).padStart(2, '0');
  const dateMinus45ForVisit = formatDate(dateMinus45, '-');
  await page.getByRole('button', { name: 'Choose month and year' }).click();
  await page.getByRole('button', { name: `${dateMinus45Year}`}).click();
  await page.getByRole('button', { name: `${dateMinus45Month} ${dateMinus45Year}`}).click();
  await page.getByRole('button', { name: dateMinus45ForCalendar }).click();
  await page.locator('#description').fill('massage therapy');
  await page.getByRole('button', { name: 'Add Visit' }).click();

  //get rows of current visit and previous and next rows and compare dates to validate order
  const visitsRow = page.locator('app-pet-list', { hasText: 'Samantha' }).locator('app-visit-list').getByRole('row');
  const allVisits = await visitsRow.all();
  const targetRow = visitsRow.filter({ hasText: dateMinus45ForVisit });
  const targetIndex = await targetRow.evaluate(
  el => Array.from(el.parentElement!.children).indexOf(el)
);
  const previousDateText = await visitsRow.nth(targetIndex - 1).getByRole('cell').first().textContent();
  const nextDateText = await visitsRow.nth(targetIndex + 1).getByRole('cell').first().textContent();
  const previousDate = new Date(previousDateText!.trim());
  const targetDate = new Date(dateMinus45ForVisit);
  const nextDate = new Date(nextDateText!.trim());
  expect(previousDate > targetDate).toBeTruthy();
  expect(nextDate < targetDate).toBeTruthy();

  //clean up - delete visits
  await page.locator('app-pet-list', { hasText: 'Samantha' }).locator('app-visit-list').getByRole('row', {name: dateMinus45ForVisit}).getByRole('button', { name: 'Delete Visit' }).click();
  await page.locator('app-pet-list', { hasText: 'Samantha' }).locator('app-visit-list').getByRole('row', {name: currentDateForVisit}).getByRole('button', { name: 'Delete Visit' }).click();
});