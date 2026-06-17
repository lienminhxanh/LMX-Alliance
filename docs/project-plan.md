# Kế hoạch Dự án — LMX Alliance Website
**Version:** 1.0  
**Ngày tạo:** 17/06/2026  
**Cập nhật:** 17/06/2026

---

## 1. Thông tin dự án

| Thông tin | Chi tiết |
|-----------|----------|
| Tên dự án | LMX Alliance Enterprise Website + Admin CMS |
| Khách hàng | Công ty Cổ phần Liên Minh Xanh LMX |
| Website staging | https://lmx-alliance-five.vercel.app |
| Stack | Next.js 14, TypeScript, Prisma, NextAuth, Tailwind CSS |
| Database | PostgreSQL (Vercel Postgres) |
| File storage | Cloudflare R2 |
| Deploy | Vercel |
| Ngôn ngữ | Tiếng Việt (mặc định), English, 中文 |

---

## 2. Phạm vi công việc (Scope)

### 2.1 Website công khai (Public)

| Trang | Mô tả | Trạng thái |
|-------|-------|------------|
| Trang chủ | Hero, thống kê, lĩnh vực, tin tức, CTA | ✅ Hoàn thành |
| Giới thiệu | Mission, Vision, Core Values, Ban lãnh đạo | ✅ Hoàn thành |
| Lĩnh vực hoạt động | Danh sách + Chi tiết từng lĩnh vực | ✅ Hoàn thành |
| Quan hệ cổ đông | Thư ban lãnh đạo + Tài liệu cổ đông | ✅ Hoàn thành |
| Tin tức | Danh sách + Chi tiết + Phân loại | ✅ Hoàn thành |
| Tuyển dụng | Danh sách vị trí + Form ứng tuyển | ✅ Hoàn thành |
| Liên hệ | Form liên hệ + Thông tin địa chỉ | ✅ Hoàn thành |

### 2.2 Admin Panel (CMS)

| Module | Mô tả | Trạng thái |
|--------|-------|------------|
| Dashboard | Thống kê tổng quan | ✅ Hoàn thành |
| Homepage Builder | Quản lý Hero, Statistics, Strategy | ✅ Hoàn thành |
| Business Sectors | CRUD lĩnh vực hoạt động | ✅ Hoàn thành |
| News | CRUD tin tức đa ngôn ngữ | ✅ Hoàn thành |
| Jobs | CRUD tuyển dụng + Xem ứng viên | ✅ Hoàn thành |
| Shareholder Relations | Quản lý thư lãnh đạo + tài liệu | ✅ Hoàn thành |
| Leadership | Quản lý ban lãnh đạo | ✅ Hoàn thành |
| Partners | Quản lý đối tác (marquee) | ✅ Hoàn thành |
| Projects | Quản lý dự án nổi bật | ✅ Hoàn thành |
| Media Library | Upload & quản lý file R2 | ✅ Hoàn thành |
| Contacts | Quản lý tin nhắn liên hệ | ✅ Hoàn thành |
| Users & RBAC | Quản lý người dùng + phân quyền | ✅ Hoàn thành |
| Settings | Cài đặt công ty, SEO, Social | ✅ Hoàn thành |
| Audit Logs | Nhật ký thao tác | ✅ Hoàn thành |

### 2.3 Tính năng kỹ thuật

| Tính năng | Mô tả | Trạng thái |
|-----------|-------|------------|
| i18n | Đa ngôn ngữ VI/EN/ZH với next-intl | ✅ Hoàn thành |
| Authentication | NextAuth + session management | ✅ Hoàn thành |
| RBAC | 4 roles: SUPER_ADMIN, CONTENT_MANAGER, IR_MANAGER, VIEWER | ✅ Hoàn thành |
| File Upload | Cloudflare R2 S3-compatible | ✅ Hoàn thành |
| Form Validation | React Hook Form + Zod | ✅ Hoàn thành |
| Server Actions | All mutations via Server Actions | ✅ Hoàn thành |
| Animations | Framer Motion AnimateIn | ✅ Hoàn thành |
| SEO | Metadata động, Sitemap | 🟡 Đang làm |
| Performance | Image optimization, Core Web Vitals | ⬜ Chưa xong |

---

## 3. Kiến trúc kỹ thuật

```
D:\lmx-website\
├── app/
│   ├── (public)/[locale]/     # Public website (VI/EN/ZH)
│   │   ├── page.tsx           # Trang chủ
│   │   ├── about/             # Giới thiệu
│   │   ├── business-segments/ # Lĩnh vực
│   │   ├── shareholder-relations/ # Quan hệ cổ đông
│   │   ├── news/              # Tin tức
│   │   ├── careers/           # Tuyển dụng
│   │   └── contact/           # Liên hệ
│   ├── admin/                 # Admin panel
│   └── api/                   # API routes (uploads only)
├── actions/                   # Server Actions
├── components/
│   ├── public/                # Header, Footer, ...
│   ├── admin/                 # Sidebar, ...
│   └── ui/                    # Shared UI components
├── content/                   # i18n JSON (vi.json, en.json, zh.json)
├── lib/                       # Utilities, auth, prisma, permissions
├── prisma/                    # Schema + migrations + seed
└── docs/                      # Tài liệu dự án
```

---

## 4. Môi trường & Credentials

| Thành phần | Môi trường | Ghi chú |
|-----------|-----------|---------|
| Vercel | Production + Preview | Auto-deploy từ main branch |
| PostgreSQL | Vercel Postgres | URL trong .env |
| Cloudflare R2 | Production | CDN: files.lmxalliance.com |
| NextAuth | Session-based | Secret trong .env |

---

## 5. Quy trình làm việc

```
Code → git commit (/commit) → git push → Vercel auto-deploy
                                    ↓
                              Preview URL → Review → Merge main
```

**Skills Claude Code có sẵn:**
- `/test` — Chạy TypeScript check + lint
- `/db-migrate` — Prisma migration
- `/seed-data` — Seed dữ liệu mẫu
- `/check-design` — Kiểm tra design system
- `/commit` — Smart conventional commit
- `/deploy` — Deploy lên Vercel
- `/log-work` — Ghi nhật ký công việc hoàn thành

---

## 6. Tiêu chí nghiệm thu

- [ ] Tất cả 7 trang công khai hiển thị đúng ở VI/EN/ZH
- [ ] Admin panel hoạt động đầy đủ với 4 roles
- [ ] Lighthouse Performance ≥ 85
- [ ] Lighthouse SEO ≥ 90
- [ ] Lighthouse Accessibility ≥ 80
- [ ] Không có lỗi TypeScript
- [ ] Form liên hệ gửi email thành công
- [ ] File upload lên R2 hoạt động
- [ ] Mobile responsive ổn định (375px – 1440px)
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge

---

*Tài liệu này được cập nhật tự động qua skill `/log-work`*
