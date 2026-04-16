import { test, expect, Page } from '@playwright/test';

test.describe('Real-time Chat Flow', () => {
  const timestamp = Date.now();
  const userA = {
    fullname: 'User Alice',
    username: `usera_${timestamp}`,
    email: `usera_${timestamp}@example.com`,
    password: 'Password123!'
  };
  const userB = {
    fullname: 'User Bob',
    username: `userb_${timestamp}`,
    email: `userb_${timestamp}@example.com`,
    password: 'Password123!'
  };

  test('Two users can chat in real-time', async ({ browser }) => {
    // Thiết lập timeout cho toàn bộ test là 60s
    test.setTimeout(60000);

    const contextA = await browser.newContext();
    const contextB = await browser.newContext();
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    console.log('--- Đăng ký User A và User B ---');
    await registerUser(pageA, userA);
    await registerUser(pageB, userB);

    // 2. User A tìm kiếm User B
    console.log(`--- User A tìm kiếm User B (@${userB.username}) ---`);
    await pageA.goto(`/search?q=${userB.username}`);
    
    // Đợi kết quả tìm kiếm hiển thị
    const profileLink = pageA.locator(`a:has-text("${userB.fullname}")`).first();
    await profileLink.waitFor({ state: 'visible', timeout: 15000 });
    console.log('--- Đã tìm thấy User B, đang vào Profile ---');
    await profileLink.click();

    // 3. User A nhấn "Nhắn tin"
    console.log('--- User A nhấn nút Nhắn tin ---');
    const messageBtn = pageA.locator('button:has-text("Nhắn tin")');
    await messageBtn.waitFor({ state: 'visible' });
    await messageBtn.click();
    
    // Đợi chuyển sang trang chat
    await pageA.waitForURL(/\/messages\?c=.*/, { timeout: 15000 });
    console.log('--- Đã mở khung chat tại User A ---');

    // 4. User B chuẩn bị nhận tin
    console.log('--- User B mở trang Tin nhắn để chờ ---');
    await pageB.goto('/messages');
    
    // Đợi User A xuất hiện trong danh sách hội thoại của B
    const conversationItem = pageB.locator(`text=${userA.fullname}`).first();
    await conversationItem.waitFor({ state: 'visible', timeout: 20000 });
    await conversationItem.click();

    // 5. User A gửi tin nhắn
    const testMessage = `Real-time Hello! ID: ${timestamp}`;
    console.log('--- User A gửi tin: ' + testMessage);
    const inputA = pageA.locator('input[placeholder="Aa"]');
    await inputA.waitFor({ state: 'visible' });
    await inputA.fill(testMessage);
    await inputA.press('Enter');

    // 6. KIỂM TRA REAL-TIME TẠI USER B
    console.log('--- Chờ User B nhận tin nhắn... ---');
    const receivedMessage = pageB.locator(`text=${testMessage}`);
    
    // Kiểm tra tin nhắn xuất hiện mà không cần reload
    await expect(receivedMessage).toBeVisible({ timeout: 15000 });
    console.log('--- THÀNH CÔNG: User B đã nhận được tin nhắn tức thì! ---');

    await contextA.close();
    await contextB.close();
  });
});

async function registerUser(page: Page, user: any) {
  await page.goto('/register');
  await page.fill('#register-fullname', user.fullname);
  await page.fill('#register-username', user.username);
  await page.fill('#register-email', user.email);
  await page.fill('#register-password', user.password);
  await page.click('#register-submit');
  await page.waitForURL('/feed', { timeout: 20000 });
}
