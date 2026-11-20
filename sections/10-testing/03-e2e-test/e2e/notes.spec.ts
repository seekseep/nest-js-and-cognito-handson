import { expect, test } from '@playwright/test';

/** テストごとに違うタイトルにする。API のメモは、テストの間で共有されるため。 */
function uniqueTitle(name: string) {
  return `${name} ${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'メモ' })).toBeVisible();
});

test('メモを追加すると一覧に出て、読み込み直しても残っている', async ({
  page,
}) => {
  const title = uniqueTitle('買い物');

  await page.getByPlaceholder('タイトル').fill(title);
  await page.getByPlaceholder('本文').fill('牛乳と卵');
  await page.getByRole('button', { name: '追加' }).click();

  const note = page.getByRole('listitem').filter({ hasText: title });
  await expect(note).toBeVisible();
  await expect(note).toContainText('牛乳と卵');
  await expect(note).toContainText('持ち主: alice');
  // 入力欄は空に戻る
  await expect(page.getByPlaceholder('タイトル')).toHaveValue('');

  // 画面の中だけでなく、API に保存されている
  await page.reload();
  await expect(note).toBeVisible();
});

test('削除すると一覧から消える', async ({ page }) => {
  const title = uniqueTitle('消すメモ');
  await page.getByPlaceholder('タイトル').fill(title);
  await page.getByRole('button', { name: '追加' }).click();

  const note = page.getByRole('listitem').filter({ hasText: title });
  await note.getByRole('button', { name: '削除' }).click();
  await expect(note).toHaveCount(0);
});

test('タイトルが空だと、API の入力チェックのエラーが出る', async ({ page }) => {
  await page.getByRole('button', { name: '追加' }).click();
  // Next.js も、画面の切り替えを読み上げるための空の alert を置いているので、文言で絞る
  await expect(
    page.getByRole('alert').filter({ hasText: 'title' }),
  ).toBeVisible();
});
