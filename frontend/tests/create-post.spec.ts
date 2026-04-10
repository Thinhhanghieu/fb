import { test, expect } from '@playwright/test';

test.describe('Create Post Flow', () => {
  const username = `testuser_${Date.now()}`;
  const email = `${username}@example.com`;
  const password = 'Password123!';

  test('User can register, login and create a post', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    
    // Fill in the form
    await page.fill('#register-fullname', 'Test User');
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    
    // Submit
    await page.click('#register-submit');

    // Wait for redirect to feed
    await page.waitForURL('/feed', { timeout: 15000 });

    // Ensure we are on feed page
    await expect(page).toHaveURL('/feed');

    // 2. Open Create Post Editor Modal
    // The button has the text roughly "Bạn đang nghĩ gì vậy"
    const openModalBtn = page.locator('button', { hasText: 'Bạn đang nghĩ gì vậy' }).first();
    await openModalBtn.waitFor({ state: 'visible' });
    await openModalBtn.click();

    // 3. Fill post content inside the modal
    // The textarea has autofocus, but we explicitly locate it via placeholder
    const editorTextarea = page.locator('textarea[placeholder^="Bạn đang nghĩ gì thế"]');
    await editorTextarea.waitFor({ state: 'visible' });
    await editorTextarea.fill('Hello this is an e2e test post from Playwright!');
    
    // Optionally attach a fake image using setInputFiles if we had a specific file,
    // but text-only post is enough to verify the API pipeline!

    // 4. Submit post
    const submitBtn = page.locator('button[type="submit"]:has-text("Đăng")');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // 5. Verify the post succeeds and modal closes
    // We expect the modal header "Tạo bài viết" to be hidden since onClose() is called
    await expect(page.locator('h2', { hasText: 'Tạo bài viết' })).toBeHidden({ timeout: 15000 });

    console.log('Post created successfully!');
  });
});
