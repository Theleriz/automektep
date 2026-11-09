# Деплой нұсқаулығы — AutoMektep → GitHub → Vercel

Бұл жоба **толық статикалық** (Next.js static export): сервер, дерекқор, ақылы қызмет қажет емес.
Деплой 5–10 минут алады.

---

## Қадам 0. Файлдарды алу

`automektep-deploy.zip` файлын жүктеп алып, кез келген қалтаға распаковка жасаңыз.
Ішінде `node_modules`, `.next`, `out` жоқ — оларды Vercel өзі орнатады/жинайды.

```
automektep/
├── app/  components/  content/  legacy/  public/
├── package.json  package-lock.json
├── next.config.mjs  tsconfig.json  vercel.json
├── .gitignore  .nvmrc  next-env.d.ts
├── README.md  DEPLOY.md
└── .github/workflows/build.yml
```

---

## Қадам 1. GitHub-та репозиторий ашу

1. [github.com/new](https://github.com/new) ашыңыз.
2. **Repository name**: `automektep` (кез келген атауға болады).
3. **Public** немесе **Private** — екеуі де жарайды (Vercel екеуімен жұмыс істейді).
4. ⚠️ **«Add a README file», «Add .gitignore», «Choose a license» — белгілемеңіз.** Бұл файлдар жобада бар, қақтығыс болмас үшін бос репозиторий керек.
5. **Create repository** → келесі беттегі `…or push an existing repository` блогындағы командаларды есте сақтаңыз.

## Қадам 2. Жобаны жүктеу (терминал)

Распаковка жасаған қалтаға кіріп (`automektep` ішінде `package.json` тұруы керек):

```bash
git init
git add .
git commit -m "AutoMektep 3.0 — Next.js сайты"
git branch -M main
git remote add origin https://github.com/<сенің-логинің>/automektep.git
git push -u origin main
```

`<сенің-логинің>` орнына өз GitHub логиніңізді жазыңыз. Пароль сұраса — GitHub-тың
**Personal Access Token**-ын қолданыңыз (Settings → Developer settings → Tokens) немесе
GitHub Desktop / VS Code арқылы push жасаңыз.

Тексеру: `git ls-files | wc -l` ≈ **29 файл** болуы керек (ішінде `node_modules` жоқ).

> **GitHub интерфейсімен де болады:** репозиторийде «uploading an existing file» → файлдарды сүйреп тастау.
> Бірақ `.github`, `.gitignore` сияқты жасырын файлдар жоғалуы мүмкін — терминал әдісі сенімдірек.

## Қадам 3. Vercel-ге импорттау

1. [vercel.com](https://vercel.com) → **Sign up with GitHub** (немесе кіріңіз).
2. **Add New… → Project** → `automektep` репозиторийін табыңыз → **Import**.
3. Барлық баптау автоматты анықталады — **өзгертпеңіз**:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (немесе `npm run build`)
   - Output Directory: `out` (жобада `output: 'export'` қосулы)
   - Install Command: `npm ci`
   - Node.js: **20.x** (`.nvmrc` және `package.json → engines` арқылы бекітілген)
4. **Deploy** басыңыз. Бірінші build ≈ 1–2 минут.
5. Дайын болғанда сілтеме шығады: `https://automektep-<hash>.vercel.app`

## Қадам 4. Домен және сайт мекенжайы (міндетті емес, бірақ ұсынылады)

1. **Project → Settings → Environment Variables** → `Add New`:
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://automektep.kz` (нақты доменіңіз)
   - Environments: **Production** (қаласаңыз Preview-ге де)
2. **Settings → Domains → Add** → доменді енгізіңіз → DNS-те берілген A/CNAME жазбаларын тіркеңіз.
   SSL сертификаты автоматты беріледі.
3. Айнымалыны қосқаннан кейін **Deployments → ⋯ → Redeploy** жасаңыз (canonical, Open Graph және sitemap дұрыс доменмен шығуы үшін).

## Қадам 5. Тексеру чек-листі

| Тексеру | Күтілетін нәтиже |
| --- | --- |
| Басты бет ашылады | Лендинг: hero, бағалар, нұсқауыштар, FAQ |
| `Ctrl/Cmd + U` → `<title>` | «AutoMektep — Алматыдағы автомектеп: A, B, C санаттары» |
| `/robots.txt`, `/sitemap.xml` | 200 жауап, домен дұрыс |
| `/kez-kelgen-bet` | AutoMektep стиліндегі **404** беті |
| Кіру → «Толтыру» → Кіру | Әкімші панелі ашылады (`admin@automektep.test` / `Admin2026!`) |
| Оқушымен кіру | Кабинет: сабақтар, төлемдер, тест (`aliya@automektep.test` / `Student2026!`) |
| Телефонмен ашу | Мобильді нұсқа, көлденең сырғыту жоқ |
| Қараңғы тақырып (🌙) | Барлық беттерде дұрыс көрінеді |

## Жаңартуларды шығару

```bash
git add .
git commit -m "Не өзгерді"
git push
```
Vercel әр push-та автоматты жаңарады: `main` → **Production**, басқа тармақтар → **Preview** сілтемесі.

## Жиі кездесетін қиындықтар

| Мәселе | Себебі / шешімі |
| --- | --- |
| Build: «No Output Directory named `out`» | `next.config.mjs` ішінде `output: 'export'` өшіп қалған — қайта қосыңыз |
| Build: `npm ci` қатесі | `package-lock.json` жоқ немесе `package.json`-мен сәйкес емес. Жобадағы екеуін бірге жүктеңіз |
| Node нұсқасы туралы ескерту | Settings → General → **Node.js Version: 20.x** |
| Сайт ашылады, бірақ интерфейс қозғалмайды | Браузерде JavaScript өшірулі; консольде қате болса — Redeploy жасап көріңіз |
| Деректер басқа құрылғыда көрінбейді | **Бұл дұрыс:** демо деректер әр браузердің `localStorage`-інде сақталады (README, 7-бөлім) |
| Доменнен кейін OG/sitemap ескі доменмен | `NEXT_PUBLIC_SITE_URL` қосып, **Redeploy** жасаңыз |

## Балама әдістер

- **GitHub-сыз (CLI):** жоба қалтасында `npm i -g vercel` → `vercel login` → `vercel --prod`.
- **Басқа хостинг:** `npm run build` → `out/` қалтасын Netlify, Cloudflare Pages, GitHub Pages немесе кез келген статикалық хостингке жүктеуге болады.
- **Автоматты тексеру:** `.github/workflows/build.yml` әр push-та `npm ci && npm run build` іске қосады — build құласа, GitHub-та бірден көрінеді.
