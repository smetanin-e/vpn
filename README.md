# 🌐 VPN Management System

**Полнофункциональное веб-приложение для управления VPN-инфраструктурой с интегрированной системой биллинга**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## 📖 Описание

Это **портфолио-проект** начинающего разработчика (Junior High / Low Middle), демонстрирующий:

- ✅ Понимание **Clean Architecture** и архитектурных паттернов
- ✅ Полнофункциональную **Full-Stack** систему с фронтенд + бэкенд + БД
- ✅ Работу с **реальными бизнес-процессами** (биллинг, синхронизация трафика)
- ✅ **Type-safe** разработку на TypeScript с Zod валидацией
- ✅ Работу с **PostgreSQL** и **Prisma ORM** включая сложные миграции

### Основной функционал:

| Функция                  | Описание                                                         |
| ------------------------ | ---------------------------------------------------------------- |
| 🔐 **Авторизация**       | Credentials-based с JWT и bcrypt-шифрованием                     |
| 👥 **Управление пирами** | Создание, удаление, включение/отключение VPN-конфигов            |
| 💰 **Биллинг**           | Система с балансом, ежедневным списанием, историей платежей      |
| 📊 **Аналитика трафика** | Отслеживание трафика с месячной статистикой и ежедневными логами |
| 🔄 **Синхронизация**     | CRON-задачи для автоматической синхронизации метрик с серверами  |
| 📱 **Конфигурирование**  | Скачивание WireGuard конфигов и генерация QR-кодов               |
| 🎨 **Modern UI**         | Темная тема, отзывчивый дизайн, интуитивный интерфейс            |
| 🖥️ **Мульти-сервер**     | Поддержка WireGuard и Amnezia VPN протоколов                     |

---

## 🏗️ Архитектура и Технологии

### Stack

```
Frontend:        Next.js 16 + React 19 + TypeScript
Backend:         Next.js API Routes + Server Actions
Database:        PostgreSQL + Prisma ORM v7
UI Framework:    shadcn/ui + Tailwind CSS 4 + Radix UI
State Mgmt:      TanStack React Query (бесконечная пагинация)
Forms:           React Hook Form + Zod валидация
Auth:            NextAuth.js (Credentials Provider)
Utilities:       Axios, bcrypt, QR code generation
```

### Архитектурные паттерны

```
src/
├── entities/           # 🧱 Доменные модели (User, Peer, Server, Client)
│   ├── model/         # Типы данных и интерфейсы
│   ├── repository/    # Data Access Layer (Prisma)
│   └── ui/            # UI компоненты для сущности
│
├── features/          # 💼 Бизнес-логика и use cases
│   ├── auth/          # Аутентификация
│   ├── peer/          # Управление VPN пирами
│   ├── billing/       # Система расчетов
│   └── ...
│
├── shared/            # 🔧 Переиспользуемые утилиты
│   ├── api/           # API клиенты и конфиги
│   ├── components/    # Общие UI компоненты
│   ├── constants/     # Константы приложения
│   └── lib/           # Вспомогательные функции
│
└── widgets/           # 📦 Сложные UI компоненты
    ├── peers/         # Виджет списка пиров
    ├── transactions/  # Виджет транзакций
    └── charge-logs/   # Виджет логов платежей
```

**Примененные паттерны:**

- 🎯 **Clean Architecture** — четкое разделение слоев
- 🔌 **Repository Pattern** — абстракция доступа к БД
- 🔄 **Adapter Pattern** — унификация API разных VPN серверов
- 🛡️ **Server Actions** — безопасные мутации с валидацией на сервере
- ♾️ **Infinite Query** — эффективная пагинация больших списков

---

## 🚀 Быстрый Старт

### Предварительные требования

- **Node.js** 18+
- **PostgreSQL** 14+
- **pnpm** (или npm/yarn)

### Установка

```bash
# 1. Клонируем репозиторий
git clone <repository-url>
cd new-vpn

# 2. Установляем зависимости
pnpm install

# 3. Настраиваем переменные окружения
cp .env.example .env.local
# ✏️ Отредактируй .env.local с твоими данными:
#    DATABASE_URL=postgresql://user:password@localhost:5432/vpn_db
#    NEXTAUTH_SECRET=your-secret-key
#    NEXTAUTH_URL=http://localhost:3000

# 4. Применяем миграции БД
pnpm exec prisma migrate deploy

# 5. Запускаем dev сервер
pnpm dev
```

Открой [http://localhost:3000](http://localhost:3000) в браузере.

### Другие команды

```bash
# Просмотр данных в БД (Prisma Studio)
pnpm exec prisma studio

# Создание новой миграции
pnpm exec prisma migrate dev --name migration_name

# Продакшн сборка
pnpm build
pnpm start

# Линтинг кода
pnpm lint
```

---

## 📊 Ключевые достижения

### ✅ Архитектура

- [x] Clean Architecture с явным разделением на слои
- [x] Repository Pattern для доступа к данным
- [x] Adapter Pattern для поддержки разных VPN API
- [x] Type-safe разработка: TypeScript + Zod валидация + Prisma типы

### ✅ Функциональность

- [x] Полная система авторизации с JWT
- [x] CRUD операции с пирами и конфигурациями
- [x] Сложная бизнес-логика биллинга (баланс + ежедневное списание)
- [x] CRON-синхронизация метрик трафика
- [x] Infinite pagination для больших списков

### ✅ Frontend

- [x] Современный UI с shadcn/ui компонентами
- [x] Темная тема с next-themes
- [x] Отзывчивый дизайн (mobile-first)
- [x] React Hook Form + Zod для валидированных форм
- [x] React Query для эффективного управления состоянием

### ✅ Backend & Database

- [x] Next.js API routes + Server Actions
- [x] PostgreSQL с Prisma ORM
- [x] 11 миграций БД (evolving schema)
- [x] Обработка ошибок с rollback механизмом

---

## 📚 Что я Изучил

В процессе создания этого проекта я освоил:

| Что                     | Результат                                                            |
| ----------------------- | -------------------------------------------------------------------- |
| **Next.js 16**          | App Router, Server Components, API routes, Server Actions            |
| **PostgreSQL + Prisma** | Сложные отношения между сущностями, миграции, транзакции             |
| **Clean Architecture**  | Разделение на слои, Repository Pattern, бизнес-логика отделена от UI |
| **TypeScript**          | Strict mode, типизированные компоненты, никогда не буду без него     |
| **React Query**         | Infinite queries, кеширование, синхронизация данных                  |
| **Form Handling**       | React Hook Form с Zod валидацией, client-side и server-side          |
| **Аутентификация**      | NextAuth.js, JWT, bcrypt, защита API endpoints                       |
| **Real-world features** | CRON-jobs, вычисления, синхронизация с внешними API                  |

---

## 🔧 Технические Детали

### Безопасность

- ✅ Хеширование паролей с bcrypt
- ✅ JWT токены для аутентификации
- ✅ Защита API endpoints с проверкой авторизации
- ✅ CRON_SECRET для защиты крон-задач
- ✅ Input валидация с Zod

### Масштабируемость

- ✅ Adapter Pattern позволяет легко добавлять новые VPN протоколы
- ✅ Repository Pattern отделяет логику доступа к БД
- ✅ Server Actions обеспечивают безопасные мутации
- ✅ Infinite Query оптимизирует загрузку больших списков

### Error Handling

- Rollback-механизм при ошибке создания peer'а
- Error messages логируются и передаются фронтенду
- Try-catch обработка в критичных местах

---

## 🎯 Возможные Улучшения

**Что я бы добавил дальше:**

- [ ] **Unit & Integration тесты** (Jest, Vitest) — критично для production
- [ ] **API документация** (Swagger/OpenAPI)
- [ ] **Логирование** (winston или pino) вместо console.log
- [ ] **Rate limiting** для защиты от brute-force
- [ ] **Redis кеширование** для часто запрашиваемых данных
- [ ] **CI/CD pipeline** (GitHub Actions)
- [ ] **Docker контейнеризация**
- [ ] **More comprehensive error boundaries**

---

## 📖 Как Использовать в Портфолио

Этот проект демонстрирует:

1. **Архитектурное мышление** — правильное использование паттернов
2. **Полный цикл разработки** — от идеи до рабочего функционала
3. **Бизнес-логика** — не просто CRUD, а реальная система
4. **Modern Stack** — Next.js 16, React 19, TypeScript, PostgreSQL
5. **Problem Solving** — как я решал сложные задачи (синхронизация, биллинг)

**Для интервью я бы подчеркнул:**

- "Самостоятельно разработал и развернул полнофункциональное приложение"
- "Применил Clean Architecture и архитектурные паттерны"
- "Работал с PostgreSQL и сложными миграциями"
- "Реализовал бизнес-логику (биллинг с ежедневным списанием)"
- "Использовал современный стек: Next.js 16, React 19, TypeScript"

---

## 📞 Контакты

- GitHub: [@YourUsername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: https://your-portfolio.com

---

## 📄 Лицензия

MIT License — используй свободно в образовательных целях.
