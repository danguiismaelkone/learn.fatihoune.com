import { test, expect } from '@playwright/test'

test.describe('Site public', () => {
  test('affiche l’accueil avec le titre validé', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/FATIHOUNE/)
    await expect(page.locator('h1').first()).toHaveText('Cabinet de formation à Abidjan, habilité par le FDFP')
  })

  test('parcours P1 : page domaine → formulaire pré-rempli', async ({ page }) => {
    await page.goto('http://localhost:3000/formations/management')
    await page.getByRole('link', { name: /Demander cette formation : Manager avec performance/ }).click()
    await expect(page).toHaveURL(/\/contact\?type=quote/)
    await expect(page.locator('#topic')).toHaveValue(/Manager avec performance/)
  })

  test('le formulaire refuse un envoi incomplet', async ({ page }) => {
    await page.goto('http://localhost:3000/contact')
    await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
    await expect(page.getByText('Indiquez votre nom et votre prénom.')).toBeVisible()
  })
})

test.describe('Recherche', () => {
  test('trouve une formation depuis l’accueil', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.getByRole('searchbox', { name: 'Rechercher une formation' }).fill('iso 45001')
    await page.getByRole('button', { name: 'Rechercher' }).click()
    await expect(page).toHaveURL(/\/recherche\?q=iso/)
    await expect(page.getByRole('status')).toContainText('3 formations')
  })

  test('propose le sur-mesure quand rien ne correspond', async ({ page }) => {
    await page.goto('http://localhost:3000/recherche?q=zzzz')
    await expect(page.getByRole('link', { name: 'Demander une formation sur mesure' })).toBeVisible()
  })
})
