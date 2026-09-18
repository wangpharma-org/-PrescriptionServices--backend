# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev

# Build
npm run build

# Run (production)
npm run start:prod

# Lint (auto-fix)
npm run lint

# Format
npm run format

# Tests
npm run test                  # all unit tests
npm run test:watch            # watch mode
npm run test:cov              # with coverage
npm run test:e2e              # end-to-end tests

# Run a single test file
npx jest src/api/auth/auth.service.spec.ts

# Database migrations
npm run migration:generate    # auto-generate from entity changes
npm run migration:create      # create a blank migration
npm run migration:run         # apply pending migrations
npm run migration:revert      # revert last migration
```

## Environment Variables

```env
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=prescriptiondb
```

โค้ดอ่าน env แค่ 6 ตัวนี้ (`grep -rhoE "process\.env\.[A-Z_]+" src`)

`app.module.ts` อ่าน `DATABASE_*` โดยมี `|| 'localhost'` เป็น fallback และตั้ง
**`synchronize: true`** — ตารางถูกสร้าง/แก้อัตโนมัติจาก entity ใช้ได้เฉพาะ local
เท่านั้น production ต้องปิดแล้วใช้ migration

> `package.json` มี script `migration:generate` / `migration:run` / `seed:run` อยู่
> แต่ `src/migrations/` **ยังว่าง 0 ไฟล์** — ยังไม่เคยใช้จริง

---

## Architecture

NestJS REST API + Kafka บน PostgreSQL ผ่าน TypeORM — จัดการใบสั่งยาและรายการยาในใบสั่ง

### Module structure

- **AppModule** (`src/app.module.ts`) — root; ลงทะเบียน TypeORM (Postgres) + ConfigModule
- **PrescriptionModule** (`src/prescription/`) — ใบสั่งยา
- **PrescriptionItemModule** (`src/prescription-item/`) — รายการยาในใบสั่ง
  (nested route ใต้ใบสั่ง)

### Layer pattern (ทุก module ใช้เหมือนกัน)

โครงแบบ DDD 4 ชั้น:

```
<module>/
├── domain/          entity + interface ของ repository
├── application/     use case / service — logic อยู่ชั้นนี้
├── infrastructure/  TypeORM repository implementation
└── presentation/    controller + DTO
```

**ห้ามข้ามชั้น** — controller เรียก application, application เรียก interface ของ
repository ไม่ใช่ TypeORM ตรง ๆ

### Kafka

`main.ts` เรียก `connectMicroservice(Transport.KAFKA)` + `startAllMicroservices()`
service นี้เป็นทั้ง REST API และ Kafka client ในโปรเซสเดียว

| ทิศทาง | topic | หมายเหตุ |
|---|---|---|
| publish | `prescription.created.v1` | ผู้รับคือ StockService |
| consume | `stock.reserved.v1` | รู้ว่าจองสต็อกสำเร็จแล้ว |

เป็น request/response แบบ async — ส่งใบสั่งไปแล้วรอ StockService ตอบกลับว่าจองได้ไหม
ไม่ได้เรียก API ตรง

### `src/common/` — ใช้ร่วมกันทั้ง 4 service ของ pharmacy-storage

| ไฟล์ | ทำอะไร |
|---|---|
| `entities/base.entity.ts` | base ของทุก entity |
| `guards/jwt-auth.guard.ts` | JWT guard |
| `decorators/public.decorator.ts` | ยกเว้น endpoint ไม่ต้องใช้ JWT |
| `decorators/current-user.decorator.ts` | ดึง user จาก token |
| `services/hash.service.ts` | bcrypt |
| `utils/pagination.util.ts` · `utils/filter.util.ts` | ตัวช่วย query |

### API endpoints

| Method | Path |
|---|---|
| GET/POST/PATCH/DELETE | `/prescriptions` |
| GET/POST/PATCH/DELETE | `/prescriptions/:prescriptionId/items` |

ทุก controller ใช้รูปแบบเดียวกัน: `GET /` (list) · `POST /` (create) ·
`GET /:id` · `PATCH /:id` · `DELETE /:id`

### Swagger

`/api-docs` — สร้างจาก `DocumentBuilder` ใน `main.ts`

> ⚠️ `setTitle()` ใน `main.ts` ของ repo นี้ตั้งเป็น **"Prescription Service API"**
> ซึ่งไม่ตรงกับ service — ยังไม่ได้แก้ในการอัปเดตเอกสารครั้งนี้เพราะเป็นการแก้โค้ด
> ควรเปิด PR แยก

### ยังต้องให้ทีมเติม

เอกสารส่วนนี้เขียนจากสิ่งที่ตรวจสอบได้จากโค้ดเท่านั้น ยังขาด:

- business rule ที่ไม่ชัดจากโค้ด (เช่น เงื่อนไขการ reserve stock)
- ทำไมถึงออกแบบเป็น event choreography แทน orchestration
- ข้อควรระวัง/กับดักที่เจอตอนใช้งานจริง

---

> **event flow ทั้งกลุ่ม pharmacy-storage**
>
> ```
> MedicineService ──medicine.created.v1──► StockService
> PrescriptionSvc ──prescription.created.v1──► StockService
> StockService    ──stock.reserved.v1──► PrescriptionService
> ```
>
> ทั้งสามคุยกันผ่าน Kafka ล้วน ไม่มีการเรียก REST ข้ามระบบ

---

## Rules

- Use Clean Architecture
- No business logic inside controllers
- DTOs must use class-validator decorators

## Code Style

### TypeScript Rules

- Strict mode enabled.
- No `any`.
- Explicit return types required.
- Avoid type assertion unless necessary.

### Naming Conventions

- Classes: PascalCase
- Variables: camelCase
- DTO: End with `Dto`
- Repository files: `<module>.repository.ts`

### NestJS Conventions

- Use @Injectable() for services and repositories.
- Use constructor injection.
- Use DTO + class-validator for input validation.
- Do not use raw request object in services.

### TypeORM Rules

- Use QueryBuilder for dynamic filtering.
- Do not use raw SQL unless necessary.
- Avoid N+1 queries.
- Use transactions for multi-step database operations.

### Folder Rules

- One module per folder.
- No cross-module imports except through exported services.
- Shared utilities must be in src/common.

## Testing
### Unit Testing Rules

- Use Jest.
- Test service logic only.
- Mock repositories.
- Do not mock business logic.

### Test Structure

- File naming: *.spec.ts
- Use describe per class.
- Use beforeEach to reset mocks.

### Coverage Requirements

- Minimum 80% coverage for services.
- Test success case.
- Test failure case.
- Test validation errors.

### E2E Testing

- Use Supertest.
- Test auth flow:
  - Login success
  - Login failure
  - Unauthorized access

## Security
### JWT Rules

- Never expose JWT secret.
- Use environment variables for secrets.
- Access tokens must not contain sensitive data.

### Password Handling

- Always hash passwords using bcrypt.
- Never return password hash in API response.
- Validate password strength.

### Validation Rules

- All input must use class-validator.
- Do not trust request body directly.
- Validate email format.
- Validate required fields.

### Database Security

- Use parameterized queries.
- Never concatenate raw SQL strings.
- Do not expose internal IDs unnecessarily.

### Error Handling

- Do not leak internal error messages.
- Use standardized HTTP exceptions.

## Answer
### Langauge
- only English 

## Comments & Documentation Rules
### General Principles
- Write comments only where necessary.
- Do not comment obvious code.
- Comments must explain why, not what.
- Avoid redundant or trivial comments.
- Keep comments concise and professional.
- All comments must be written in English.
