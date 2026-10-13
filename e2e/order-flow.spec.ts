import { expect, test } from "@playwright/test";

test("лендинг показывает заголовок и пакеты или ошибку загрузки", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Новый интерьер по вашим фото" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Создать проект" })).toBeVisible();
});

test("вход открывается без сессии", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page.getByRole("heading", { name: "Вход" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("кабинет без сессии уводит на вход", async ({ page }) => {
  await page.goto("/cabinet/orders");
  await expect(page).toHaveURL(/\/auth\/login\?next=/);
});
