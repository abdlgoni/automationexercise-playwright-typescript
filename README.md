#  Automation Exercise — Playwright TypeScript


> Proyek automation testing end-to-end untuk website [AutomationExercise](https://automationexercise.com) menggunakan **Playwright** dan **TypeScript** dengan arsitektur **Page Object Model (POM)** dan pipeline **CI/CD GitHub Actions**.

---

## Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack](#-tech-stack)
- [Arsitektur & Pola Desain](#-arsitektur--pola-desain)
- [Struktur Project](#-struktur-project)
- [Test Coverage](#-test-coverage)
- [Cara Menjalankan](#-cara-menjalankan)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Troubleshooting](#-troubleshooting)

---

## Tentang Proyek

Proyek ini dibuat untuk mendemonstrasikan kemampuan **QA Automation Engineering** menggunakan tools dan pola desain modern yang dipakai di industri.

**Yang diuji:**
- Alur autentikasi — login valid, login invalid, registrasi user baru
- Manajemen keranjang belanja — tambah produk, verifikasi harga, hapus produk
- Konsistensi data antar halaman — harga di halaman produk vs halaman cart

---

## Tech Stack

| Tool | Kegunaan |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & test runner |
| [TypeScript](https://www.typescriptlang.org) | Type-safe scripting language |
| [Node.js v20](https://nodejs.org) | Runtime environment |
| [tsx](https://github.com/privatenumber/tsx) | Eksekusi TypeScript langsung |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |
| [dotenv](https://github.com/motdotla/dotenv) | Manajemen environment variables |

---

## Arsitektur & Pola Desain

### 1. Page Object Model (POM)

Setiap halaman direpresentasikan sebagai class TypeScript yang meng-extend `BasePage`. Locator dan interaksi dienkapsulasi di dalam class — test file hanya berisi test logic.

```
BasePage (parent)
    ├── HomePage
    ├── LoginPage
    ├── RegisterPage
    ├── ProductPage
    └── CartPage
```

```typescript
// Contoh — LoginPage.ts
export class LoginPage extends BasePage {
    // Locator dienkapsulasi, tidak bisa diakses dari luar
    private emailInput = this.page.getByPlaceholder('Email Address')

    // Test file hanya panggil method, tidak tahu soal locator
    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}
```

### 2. Dynamic Data Capture

Pendekatan ini menghindari hardcode data yang bergantung pada website eksternal. Data diambil langsung dari halaman sumber, lalu diverifikasi konsistensinya di halaman tujuan.

```typescript
// Ambil harga aktual dari halaman produk
const productDetail = await productpage.getProductDetail(0)

// Verifikasi harga di cart SAMA dengan di halaman produk
// Kalau ada bug harga → test langsung fail ❌
await cartpage.verifyPriceConsistency(
    productDetail.name,
    productDetail.price
)
```

### 3. Fixtures & Test Isolation

Custom fixtures menggantikan setup manual di setiap test. Teardown otomatis memastikan cart selalu bersih setelah setiap test — tidak ada shared state antar test.

```typescript
// utils/fixtures.ts
cartpage: async ({ page }, use) => {
    const cartpage = new CartPage(page)

    await use(cartpage)          // jalankan test

    await cartpage.clearCart()   // ✅ teardown otomatis — cart selalu bersih
}
```

### 4. Storage State (Auth)

Session login disimpan sekali ke `auth.json`, lalu di-load ulang oleh setiap test yang butuh autentikasi. Menghilangkan kebutuhan login berulang di setiap test.

```typescript
// utils/saveSession.ts — jalankan sekali
await page.context().storageState({ path: 'auth.json' })

// playwright.config.ts — semua test logged-in load session ini
{
    name: 'with-auth',
    use: { storageState: 'auth.json' }
}
```

---

## Struktur Project

```
automationexercise-playwright-ts/
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD pipeline
│
├── pages/                       # Page Object classes
│   ├── BasePage.ts              # Parent class — navigate, screenshot
│   ├── HomePage.ts
│   ├── DetailProductPage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
│
├── tests/
│   ├── auth/                    # Test tanpa login
│   │   ├── auth.spec.ts         # Login & logout
│   │   └── register.spec.ts     # Registrasi user baru
│   │
│   └── logged-in/               # Test dengan login (pakai auth.json)
│       ├── cart.spec.ts         # Manajemen keranjang belanja
│       └── checkout.spec.ts     # Alur checkout
│
├── utils/
│   ├── fixtures.ts              # Custom fixtures & teardown otomatis
│   ├── testData.ts              # Data test & interface definitions
│   └── saveSession.ts           # Generate auth.json untuk storage state
│
├── .env                         # Environment variables (tidak di-commit)
├── .gitignore
├── playwright.config.ts         # Konfigurasi Playwright & project setup
├── package.json
└── tsconfig.json
```

---

## Test Coverage

> Test akan terus bertambah seiring pengembangan proyek.

| Suite | File | Skenario |
|---|---|---|
| Authentication | `auth.spec.ts` | Login valid, login invalid |
| Registration | `register.spec.ts` | Register user baru, delete akun |
| Cart | `cart.spec.ts` | Tambah produk, verifikasi harga, hapus produk |
| Checkout | `checkout.spec.ts` | *(dalam pengembangan)* |

---

## Cara Menjalankan

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org) v20+
- npm v9+

```bash
node --version   # v20.x.x
npm --version    # v9.x.x
```

### 1. Clone & Install

```bash
git clone https://github.com/abdlgoni/automationexercise-playwright-ts.git
cd automationexercise-playwright-ts

npm ci
npx playwright install chromium
```

### 2. Setup Environment

Buat file `.env` di root project:

```bash
# .env
VALID_EMAIL=your-email@example.com
VALID_PASSWORD=yourpassword
```

### 3. Generate Session Login

```bash
npx tsx utils/saveSession.ts
```

### 4. Jalankan Test

```bash
# Semua test
npm test

# Per project
npm run test:auth          # test tanpa login
npm run test:loggedin      # test dengan login

# Mode lainnya
npm run test:headed        # browser visible
npm run test:ui            # UI mode (recommended untuk debug)
npm run test:report        # buka HTML report
```

---

## CI/CD Pipeline

Pipeline otomatis berjalan setiap **push ke semua branch** via GitHub Actions.

### Alur Pipeline

```
Push ke GitHub
      │
      ├─── Job 1: test-no-auth ──────────────────────────────┐
      │         install deps                                  │
      │         install chromium                             │  paralel
      │         npx playwright test --project=no-auth        │
      │         upload report                                │
      │                                                      │
      └─── Job 2: test-with-auth ────────────────────────────┘
                install deps
                install chromium
                buat .env dari GitHub Secrets
                npx tsx utils/saveSession.ts
                npx playwright test --project=with-auth
                upload report
```


## License

MIT © [Abdul Goni](https://github.com/abdlgoni)

