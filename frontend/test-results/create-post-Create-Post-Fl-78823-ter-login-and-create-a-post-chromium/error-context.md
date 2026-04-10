# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: create-post.spec.ts >> Create Post Flow >> User can register, login and create a post
- Location: tests\create-post.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  locator('h2').filter({ hasText: 'Tạo bài viết' })
Expected: hidden
Received: visible
Timeout:  15000ms

Call log:
  - Expect "toBeHidden" with timeout 15000ms
  - waiting for locator('h2').filter({ hasText: 'Tạo bài viết' })
    18 × locator resolved to <h2 class="text-xl font-bold">Tạo bài viết</h2>
       - unexpected value "visible"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e7]:
      - img [ref=e8]
    - generic [ref=e11]:
      - button "Open issues overlay" [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: "0"
          - generic [ref=e15]: "1"
        - generic [ref=e16]: Issue
      - button "Collapse issues badge" [ref=e17]:
        - img [ref=e18]
  - alert [ref=e20]
  - generic [ref=e21]:
    - banner [ref=e22]:
      - link "Pulse" [ref=e23] [cursor=pointer]:
        - /url: /feed
        - generic [ref=e24]: Pulse
      - generic [ref=e26]:
        - img
        - searchbox "Tìm kiếm..." [ref=e27]
      - navigation [ref=e28]:
        - link "Feed" [ref=e29] [cursor=pointer]:
          - /url: /feed
          - img [ref=e30]
          - generic [ref=e33]: Feed
        - link "Trang cá nhân" [ref=e34] [cursor=pointer]:
          - /url: /profile
          - img [ref=e35]
          - generic [ref=e38]: Trang cá nhân
        - link "Thông báo" [ref=e39] [cursor=pointer]:
          - /url: /notifications
          - img [ref=e40]
          - generic [ref=e43]: Thông báo
        - link "Tin nhắn" [ref=e44] [cursor=pointer]:
          - /url: /messages
          - img [ref=e45]
          - generic [ref=e47]: Tin nhắn
      - button "T" [ref=e50]:
        - generic [ref=e51]: T
    - main [ref=e52]:
      - generic [ref=e53]:
        - complementary [ref=e54]:
          - link "Elena Rodriguez Elena Rodriguez" [ref=e55] [cursor=pointer]:
            - /url: /profile
            - img "Elena Rodriguez" [ref=e58]
            - generic [ref=e59]: Elena Rodriguez
          - link "👥 Bạn bè" [ref=e60] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e61]: 👥
            - generic [ref=e62]: Bạn bè
          - link "🏠 Nhóm" [ref=e63] [cursor=pointer]:
            - /url: /groups
            - generic [ref=e64]: 🏠
            - generic [ref=e65]: Nhóm
          - link "🛍️ Marketplace" [ref=e66] [cursor=pointer]:
            - /url: /marketplace
            - generic [ref=e67]: 🛍️
            - generic [ref=e68]: Marketplace
          - link "🎬 Video" [ref=e69] [cursor=pointer]:
            - /url: /video
            - generic [ref=e70]: 🎬
            - generic [ref=e71]: Video
          - link "📅 Sự kiện" [ref=e72] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e73]: 📅
            - generic [ref=e74]: Sự kiện
        - generic [ref=e75]:
          - generic [ref=e77]:
            - generic [ref=e78] [cursor=pointer]:
              - generic [ref=e79]: +
              - generic [ref=e80]: Thêm tin
            - button "Sarah Jenkins Sarah Jenkins Sarah" [ref=e81]:
              - generic [ref=e82]:
                - img "Sarah Jenkins" [ref=e84]
                - img "Sarah Jenkins" [ref=e88]
              - generic [ref=e90]: Sarah
            - button "David Chen David Chen David" [ref=e91]:
              - generic [ref=e92]:
                - img "David Chen" [ref=e94]
                - img "David Chen" [ref=e98]
              - generic [ref=e99]: David
            - button "Aisha Patel Aisha Patel Aisha" [ref=e100]:
              - generic [ref=e101]:
                - img "Aisha Patel" [ref=e103]
                - img "Aisha Patel" [ref=e107]
              - generic [ref=e109]: Aisha
            - button "Marcus Lee Marcus Lee Marcus" [ref=e110]:
              - generic [ref=e111]:
                - img "Marcus Lee" [ref=e113]
                - img "Marcus Lee" [ref=e117]
              - generic [ref=e119]: Marcus
            - button "Chloe Martin Chloe Martin Chloe" [ref=e120]:
              - generic [ref=e121]:
                - img "Chloe Martin" [ref=e123]
                - img "Chloe Martin" [ref=e127]
              - generic [ref=e128]: Chloe
          - generic [ref=e129]:
            - generic [ref=e130]:
              - img "Elena Rodriguez" [ref=e133]
              - button "Bạn đang nghĩ gì vậy, Elena?" [ref=e135]
            - generic [ref=e136]:
              - button "Video trực tiếp" [ref=e137]:
                - img [ref=e138]
                - generic [ref=e141]: Video trực tiếp
              - button "Ảnh/Video" [ref=e142]:
                - img [ref=e143]
                - generic [ref=e147]: Ảnh/Video
              - button "Cảm xúc" [ref=e148]:
                - img [ref=e149]
                - generic [ref=e152]: Cảm xúc
          - generic [ref=e154]:
            - generic [ref=e155]:
              - heading "Tạo bài viết" [level=2] [ref=e156]
              - button [ref=e157]:
                - img [ref=e158]
            - generic [ref=e161]:
              - generic [ref=e162]:
                - img "Elena Rodriguez" [ref=e165]
                - generic [ref=e166]:
                  - paragraph [ref=e167]: Elena Rodriguez
                  - generic [ref=e168]: Công khai
              - textbox "Bạn đang nghĩ gì thế, Elena?" [ref=e169]: Hello this is an e2e test post from Playwright!
              - generic [ref=e170]:
                - generic [ref=e171]: Thêm vào bài viết
                - generic [ref=e172]:
                  - button [ref=e173]:
                    - img [ref=e174]
                  - button [ref=e178]:
                    - img [ref=e179]
                  - button [ref=e182]:
                    - img [ref=e183]
              - button "Đăng" [ref=e186]
          - generic [ref=e187]:
            - article [ref=e188]:
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - img "Sarah Jenkins" [ref=e193]
                  - generic [ref=e195]:
                    - paragraph [ref=e196]: Sarah Jenkins
                    - paragraph [ref=e197]: khoảng 2 năm trước
                - button [ref=e198]:
                  - img [ref=e199]
              - paragraph [ref=e204]: Just finished the latest project wrap-up. The architectural designs are looking incredible. Can't wait to see the physical structure start taking shape in Seattle! 🏗️🏙️
              - generic [ref=e207]:
                - generic [ref=e208]:
                  - img [ref=e209]
                  - text: "47"
                - generic [ref=e211]: 12 bình luận · 5 chia sẻ
              - generic [ref=e212]:
                - button "Thích" [ref=e213]:
                  - img [ref=e214]
                  - text: Thích
                - button "Bình luận" [ref=e216]:
                  - img [ref=e217]
                  - text: Bình luận
                - button "Chia sẻ" [ref=e219]:
                  - img [ref=e220]
                  - text: Chia sẻ
            - article [ref=e226]:
              - generic [ref=e227]:
                - generic [ref=e228]:
                  - img "David Chen" [ref=e231]
                  - generic [ref=e232]:
                    - paragraph [ref=e233]: David Chen
                    - paragraph [ref=e234]: khoảng 2 năm trước
                - button [ref=e235]:
                  - img [ref=e236]
              - paragraph [ref=e241]: Is there anything better than a morning hike in the mountains? The air is crisp, the coffee tastes better, and the view is unmatched. ⛰️☕️
              - generic [ref=e244]:
                - generic [ref=e245]:
                  - img [ref=e246]
                  - text: "134"
                - generic [ref=e248]: 28 bình luận · 14 chia sẻ
              - generic [ref=e249]:
                - button "Thích" [ref=e250]:
                  - img [ref=e251]
                  - text: Thích
                - button "Bình luận" [ref=e253]:
                  - img [ref=e254]
                  - text: Bình luận
                - button "Chia sẻ" [ref=e256]:
                  - img [ref=e257]
                  - text: Chia sẻ
            - article [ref=e263]:
              - generic [ref=e264]:
                - generic [ref=e265]:
                  - img "Elena Rodriguez" [ref=e268]
                  - generic [ref=e270]:
                    - paragraph [ref=e271]: Elena Rodriguez
                    - paragraph [ref=e272]: khoảng 2 năm trước
                - button [ref=e273]:
                  - img [ref=e274]
              - paragraph [ref=e279]: "The way the light hits the studio in the morning is just something else. Current mood: monochromatic and focused. ☁️"
              - generic [ref=e280]:
                - generic [ref=e281]:
                  - img [ref=e282]
                  - text: "89"
                - generic [ref=e284]: 7 bình luận · 2 chia sẻ
              - generic [ref=e285]:
                - button "Thích" [ref=e286]:
                  - img [ref=e287]
                  - text: Thích
                - button "Bình luận" [ref=e289]:
                  - img [ref=e290]
                  - text: Bình luận
                - button "Chia sẻ" [ref=e292]:
                  - img [ref=e293]
                  - text: Chia sẻ
            - article [ref=e299]:
              - generic [ref=e300]:
                - generic [ref=e301]:
                  - img "Aisha Patel" [ref=e304]
                  - generic [ref=e306]:
                    - paragraph [ref=e307]: Aisha Patel
                    - paragraph [ref=e308]: khoảng 2 năm trước
                - button [ref=e309]:
                  - img [ref=e310]
              - paragraph [ref=e315]: Highlights from last week's exhibition. So much inspiration and beautiful work from everyone.
              - generic [ref=e319]:
                - generic [ref=e320]:
                  - img [ref=e321]
                  - text: "203"
                - generic [ref=e323]: 45 bình luận · 31 chia sẻ
              - generic [ref=e324]:
                - button "Thích" [ref=e325]:
                  - img [ref=e326]
                  - text: Thích
                - button "Bình luận" [ref=e328]:
                  - img [ref=e329]
                  - text: Bình luận
                - button "Chia sẻ" [ref=e331]:
                  - img [ref=e332]
                  - text: Chia sẻ
        - complementary [ref=e338]:
          - generic [ref=e339]:
            - heading "Bạn bè đang online" [level=3] [ref=e340]
            - generic [ref=e341]:
              - button "Sarah Jenkins Sarah Jenkins" [ref=e342]:
                - img "Sarah Jenkins" [ref=e345]
                - generic [ref=e347]: Sarah Jenkins
              - button "Aisha Patel Aisha Patel" [ref=e348]:
                - img "Aisha Patel" [ref=e351]
                - generic [ref=e353]: Aisha Patel
              - button "Marcus Lee Marcus Lee" [ref=e354]:
                - img "Marcus Lee" [ref=e357]
                - generic [ref=e359]: Marcus Lee
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Create Post Flow', () => {
  4  |   const username = `testuser_${Date.now()}`;
  5  |   const email = `${username}@example.com`;
  6  |   const password = 'Password123!';
  7  | 
  8  |   test('User can register, login and create a post', async ({ page }) => {
  9  |     // 1. Register
  10 |     await page.goto('/register');
  11 |     
  12 |     // Fill in the form
  13 |     await page.fill('#register-fullname', 'Test User');
  14 |     await page.fill('#register-username', username);
  15 |     await page.fill('#register-email', email);
  16 |     await page.fill('#register-password', password);
  17 |     
  18 |     // Submit
  19 |     await page.click('#register-submit');
  20 | 
  21 |     // Wait for redirect to feed
  22 |     await page.waitForURL('/feed', { timeout: 15000 });
  23 | 
  24 |     // Ensure we are on feed page
  25 |     await expect(page).toHaveURL('/feed');
  26 | 
  27 |     // 2. Open Create Post Editor Modal
  28 |     // The button has the text roughly "Bạn đang nghĩ gì vậy"
  29 |     const openModalBtn = page.locator('button', { hasText: 'Bạn đang nghĩ gì vậy' }).first();
  30 |     await openModalBtn.waitFor({ state: 'visible' });
  31 |     await openModalBtn.click();
  32 | 
  33 |     // 3. Fill post content inside the modal
  34 |     // The textarea has autofocus, but we explicitly locate it via placeholder
  35 |     const editorTextarea = page.locator('textarea[placeholder^="Bạn đang nghĩ gì thế"]');
  36 |     await editorTextarea.waitFor({ state: 'visible' });
  37 |     await editorTextarea.fill('Hello this is an e2e test post from Playwright!');
  38 |     
  39 |     // Optionally attach a fake image using setInputFiles if we had a specific file,
  40 |     // but text-only post is enough to verify the API pipeline!
  41 | 
  42 |     // 4. Submit post
  43 |     const submitBtn = page.locator('button[type="submit"]:has-text("Đăng")');
  44 |     await expect(submitBtn).toBeEnabled();
  45 |     await submitBtn.click();
  46 | 
  47 |     // 5. Verify the post succeeds and modal closes
  48 |     // We expect the modal header "Tạo bài viết" to be hidden since onClose() is called
> 49 |     await expect(page.locator('h2', { hasText: 'Tạo bài viết' })).toBeHidden({ timeout: 15000 });
     |                                                                   ^ Error: expect(locator).toBeHidden() failed
  50 | 
  51 |     console.log('Post created successfully!');
  52 |   });
  53 | });
  54 | 
```