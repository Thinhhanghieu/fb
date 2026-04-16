# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: realtime-chat.spec.ts >> Real-time Chat Flow >> Two users can chat in real-time
- Location: tests\realtime-chat.spec.ts:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Real-time Hello! ID: 1776331503303')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=Real-time Hello! ID: 1776331503303')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "Pulse" [ref=e4] [cursor=pointer]:
        - /url: /feed
        - generic [ref=e5]: Pulse
      - generic [ref=e8]:
        - img
        - textbox "Tìm kiếm..." [ref=e9]
      - navigation [ref=e10]:
        - link "Feed" [ref=e11] [cursor=pointer]:
          - /url: /feed
          - img [ref=e13]
          - generic [ref=e16]: Feed
        - link "Trang cá nhân" [ref=e17] [cursor=pointer]:
          - /url: /profile
          - img [ref=e19]
          - generic [ref=e22]: Trang cá nhân
        - link "Thông báo" [ref=e23] [cursor=pointer]:
          - /url: /notifications
          - img [ref=e25]
          - generic [ref=e28]: Thông báo
        - link "Tin nhắn" [ref=e29] [cursor=pointer]:
          - /url: /messages
          - img [ref=e31]
          - generic [ref=e33]: Tin nhắn
      - button "U" [ref=e36]:
        - generic [ref=e37]: U
    - main [ref=e38]:
      - generic [ref=e40]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - generic [ref=e44]:
              - heading "Tin nhắn" [level=2] [ref=e45]
              - generic [ref=e46]:
                - button [ref=e47]:
                  - img [ref=e49]
                - button [ref=e52]:
                  - img [ref=e54]
            - generic [ref=e56]:
              - img
              - textbox "Tìm kiếm trên Messenger" [ref=e57]
          - button "U User Bob Bắt đầu trò chuyện" [ref=e59] [cursor=pointer]:
            - generic:
              - generic:
                - generic:
                  - generic: U
            - generic:
              - generic:
                - paragraph: User Bob
              - generic:
                - paragraph: Bắt đầu trò chuyện
            - img [ref=e61]
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - generic [ref=e71]: U
              - generic [ref=e72]:
                - heading "User Bob" [level=3] [ref=e73]
                - paragraph [ref=e74]: Hoạt động 5 phút trước
            - generic [ref=e75]:
              - button [ref=e76]:
                - img [ref=e78]
              - button [ref=e80]:
                - img [ref=e82]
              - button [ref=e85]:
                - img [ref=e87]
          - generic [ref=e89]:
            - generic [ref=e90]:
              - generic [ref=e93]: "?"
              - heading "User Bob" [level=4] [ref=e94]
              - paragraph [ref=e95]: Các bạn là bạn bè trên Facebook. Sống tại Hà Nội.
              - button "Xem trang cá nhân" [ref=e96]
            - generic [ref=e100]: "Real-time Hello! ID: 1776331503303"
          - generic [ref=e102]:
            - generic [ref=e103]:
              - button [ref=e104]:
                - img [ref=e106]
              - button [ref=e110]:
                - img [ref=e112]
            - generic [ref=e115]:
              - textbox "Aa" [active] [ref=e116]
              - button [ref=e117]:
                - img [ref=e118]
            - button [ref=e121]:
              - img [ref=e123]
  - button "Open Next.js Dev Tools" [ref=e130] [cursor=pointer]:
    - img [ref=e131]
  - alert [ref=e134]
```

# Test source

```ts
  1  | import { test, expect, Page } from '@playwright/test';
  2  | 
  3  | test.describe('Real-time Chat Flow', () => {
  4  |   const timestamp = Date.now();
  5  |   const userA = {
  6  |     fullname: 'User Alice',
  7  |     username: `usera_${timestamp}`,
  8  |     email: `usera_${timestamp}@example.com`,
  9  |     password: 'Password123!'
  10 |   };
  11 |   const userB = {
  12 |     fullname: 'User Bob',
  13 |     username: `userb_${timestamp}`,
  14 |     email: `userb_${timestamp}@example.com`,
  15 |     password: 'Password123!'
  16 |   };
  17 | 
  18 |   test('Two users can chat in real-time', async ({ browser }) => {
  19 |     // Thiết lập timeout cho toàn bộ test là 60s
  20 |     test.setTimeout(60000);
  21 | 
  22 |     const contextA = await browser.newContext();
  23 |     const contextB = await browser.newContext();
  24 |     const pageA = await contextA.newPage();
  25 |     const pageB = await contextB.newPage();
  26 | 
  27 |     console.log('--- Đăng ký User A và User B ---');
  28 |     await registerUser(pageA, userA);
  29 |     await registerUser(pageB, userB);
  30 | 
  31 |     // 2. User A tìm kiếm User B
  32 |     console.log(`--- User A tìm kiếm User B (@${userB.username}) ---`);
  33 |     await pageA.goto(`/search?q=${userB.username}`);
  34 |     
  35 |     // Đợi kết quả tìm kiếm hiển thị
  36 |     const profileLink = pageA.locator(`a:has-text("${userB.fullname}")`).first();
  37 |     await profileLink.waitFor({ state: 'visible', timeout: 15000 });
  38 |     console.log('--- Đã tìm thấy User B, đang vào Profile ---');
  39 |     await profileLink.click();
  40 | 
  41 |     // 3. User A nhấn "Nhắn tin"
  42 |     console.log('--- User A nhấn nút Nhắn tin ---');
  43 |     const messageBtn = pageA.locator('button:has-text("Nhắn tin")');
  44 |     await messageBtn.waitFor({ state: 'visible' });
  45 |     await messageBtn.click();
  46 |     
  47 |     // Đợi chuyển sang trang chat
  48 |     await pageA.waitForURL(/\/messages\?c=.*/, { timeout: 15000 });
  49 |     console.log('--- Đã mở khung chat tại User A ---');
  50 | 
  51 |     // 4. User B chuẩn bị nhận tin
  52 |     console.log('--- User B mở trang Tin nhắn để chờ ---');
  53 |     await pageB.goto('/messages');
  54 |     
  55 |     // Đợi User A xuất hiện trong danh sách hội thoại của B
  56 |     const conversationItem = pageB.locator(`text=${userA.fullname}`).first();
  57 |     await conversationItem.waitFor({ state: 'visible', timeout: 20000 });
  58 |     await conversationItem.click();
  59 | 
  60 |     // 5. User A gửi tin nhắn
  61 |     const testMessage = `Real-time Hello! ID: ${timestamp}`;
  62 |     console.log('--- User A gửi tin: ' + testMessage);
  63 |     const inputA = pageA.locator('input[placeholder="Aa"]');
  64 |     await inputA.waitFor({ state: 'visible' });
  65 |     await inputA.fill(testMessage);
  66 |     await inputA.press('Enter');
  67 | 
  68 |     // 6. KIỂM TRA REAL-TIME TẠI USER B
  69 |     console.log('--- Chờ User B nhận tin nhắn... ---');
  70 |     const receivedMessage = pageB.locator(`text=${testMessage}`);
  71 |     
  72 |     // Kiểm tra tin nhắn xuất hiện mà không cần reload
> 73 |     await expect(receivedMessage).toBeVisible({ timeout: 15000 });
     |                                   ^ Error: expect(locator).toBeVisible() failed
  74 |     console.log('--- THÀNH CÔNG: User B đã nhận được tin nhắn tức thì! ---');
  75 | 
  76 |     await contextA.close();
  77 |     await contextB.close();
  78 |   });
  79 | });
  80 | 
  81 | async function registerUser(page: Page, user: any) {
  82 |   await page.goto('/register');
  83 |   await page.fill('#register-fullname', user.fullname);
  84 |   await page.fill('#register-username', user.username);
  85 |   await page.fill('#register-email', user.email);
  86 |   await page.fill('#register-password', user.password);
  87 |   await page.click('#register-submit');
  88 |   await page.waitForURL('/feed', { timeout: 20000 });
  89 | }
  90 | 
```