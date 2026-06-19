# Nhật ký Phát triển — LMX Alliance Website

> File này được cập nhật tự động sau mỗi phiên làm việc qua skill `/log-work`.

---

## 17/06/2026 (Thứ Tư)

**Người thực hiện:** Hoang Son  
**Thời gian:** Buổi chiều

### Hoàn thành

- **[feat] Kiểm tra và cập nhật nội dung**
  - Đổi tên route: `investor-relations` → `shareholder-relations` (public + admin)
  - Cập nhật i18n 3 ngôn ngữ (vi.json, en.json, zh.json): nav label, page title, category label, document labels
  - Thêm subtitle mô tả trong hero section
  - Cập nhật label admin sidebar, dashboard KPI, page titles
  - Cập nhật revalidatePath trong Server Actions
  - Cập nhật Module type trong permissions.ts
  - Kết quả: Không còn tham chiếu nào đến `investor-relations` trong codebase

### Commit

- `feat: rename investor-relations to shareholder-relations across codebase`

### Ghi chú

- Route URL đã thay đổi: `/vi/investor-relations` → `/vi/shareholder-relations`
- Nếu có external links cũ cần thêm redirect 301 trong `next.config.ts`

---

## 18/06/2026 (Thứ Tư)

**Người thực hiện:** Hoang Son  
**Thời gian:** Buổi sáng

### Hoàn thành

- **[fix] CV upload bug — form ứng tuyển**
  - Bug: `careers/[id]/page.tsx` chỉ lưu `file.name` vào `cvUrl` thay vì URL thực từ R2
  - Root cause: `/api/upload` yêu cầu auth, applicant là public user → không dùng được
  - Fix: Tạo `/api/cv-upload/route.ts` — endpoint public, giới hạn PDF/DOC/DOCX, max 5MB
  - Fix: Cập nhật form để upload file ngay khi chọn → nhận URL R2 → lưu vào `cvUrl`
  - Thêm loading state + disable submit button khi đang upload
  - Thêm upload error message cho user

- **[feat] Seed data — thêm Projects**
  - Thêm 3 dự án vào `prisma/seed.ts`:
    - Khu công nghiệp Bình Dương GĐ1 (ONGOING)
    - Trung tâm Logistics Cát Lái (COMPLETED)
    - Nhà máy xử lý chất thải Long Phước (ONGOING)
  - Tất cả 3 ngôn ngữ VI/EN/ZH

- **[check] i18n — kiểm tra tất cả translation keys**
  - Duyệt toàn bộ namespace: nav, home, about, sectors, investor, news, careers, contact, footer, common
  - Tất cả keys được dùng trong code đều tồn tại đầy đủ trong vi.json / en.json / zh.json
  - Category `INVESTOR_RELATIONS` đã được cập nhật sang "Quan hệ cổ đông" ở 3 ngôn ngữ

- **[fix] TypeScript cache**
  - Xóa `.next/` để clear validator cache còn tham chiếu `investor-relations` path cũ
  - `npx tsc --noEmit` → 0 errors

### Vấn đề phát sinh

- Form ứng tuyển lưu filename thay vì URL → fixed bằng CV upload endpoint riêng
- `.next` cache giữ path cũ sau rename folder → fixed bằng `rm -rf .next`

### Ghi chú

- Task 1.5 (responsive mobile) cần test thủ công hoặc Playwright — chưa thực hiện
- Cần chạy `npx prisma db seed` trên production sau khi deploy để có nội dung thực

---

## 18/06/2026 — Phiên 2 (Chiều)

**Người thực hiện:** Hoang Son

### Hoàn thành

- **[feat] Trang tuyển dụng — viết lại hoàn toàn**
  - Bỏ job listings, thay bằng company intro + culture + recruitment process + mailto CTA
  - Cấu trúc: Hero → Benefits (4 cards) → Company Culture + stats → Quy trình tuyển dụng (6 bước) → CTA mailto
  - Thêm `recruitmentEmail` vào CompanySettings (schema + validation + seed + admin form)
  - Nút "Gửi hồ sơ ứng tuyển" → `mailto:{recruitmentEmail}` với subject pre-filled
  - `careers/[id]/page.tsx` redirect về `/careers` (backward compat)
  - `prisma db push` → database sync + Prisma client regenerated

- **[feat] News article — image in content**
  - RichTextEditor: nâng cấp image button từ URL prompt → file upload lên R2 (`/api/upload`)
  - Loading state (spinner) trong toolbar khi đang upload ảnh
  - News detail page: layout mới với sidebar (article info + related articles), category badge, lead quote
  - Thêm `.article-body img`, `figure`, `figcaption`, `blockquote` styles vào globals.css

- **[fix] TypeScript**
  - `tsc --noEmit` → 0 errors sau migration

### Ghi chú

- Để test recruitment email: vào Admin → Settings → Company → nhập "Recruitment Email"
- Ảnh trong bài viết: admin vào News → Edit → click icon ảnh → chọn file → tự upload R2

---

## 18/06/2026 — Phiên 3 (Chiều)

**Người thực hiện:** Hoang Son

### Hoàn thành

- **[fix] Nút email tuyển dụng không hiện**
  - Root cause 1: `recruitmentEmail = ""` (DB default sau migration) → falsy → button không render
  - Root cause 2: `onMouseEnter`/`onMouseLeave` event handlers không được phép trong Server Component → 500 error
  - Fix 1: Fallback `settings?.recruitmentEmail || settings?.email || ''` để dùng email công ty
  - Fix 2: Thay inline event handlers bằng class `btn-primary` (CSS hover)
  - Kết quả: `mailto:Ops@lmxalliance.com?subject=Hồ sơ ứng tuyển - LMX Alliance`

- **[feat] Trang giới thiệu — cập nhật nội dung khớp trang cũ lmxalliance.com/about/**
  - Thêm section **Thư ngỏ**: nội dung thực tế từ trang cũ (2 đoạn văn bản chính thức)
  - Thêm panel **Lĩnh vực hoạt động chính** (4 sectors: Logistics, Xây dựng, Phế liệu, Chất thải)
  - Cập nhật nội dung **Sứ mệnh & Tầm nhìn** sát thực tế công ty hơn
  - Thêm section **Pháp lý công ty**: Giấy ĐKDN với thông tin công ty
  - Thêm section **Liên kết LMX – Huê Phương VN**: mô tả partnership xử lý chất thải nguy hại
  - Xóa timeline lịch sử (2012–2024) vì không có dữ liệu thực tế
  - Giữ: Hero, Achievements strip, Core Values, Leadership, Company Info

### Ghi chú

- Giấy ĐKDN có placeholder — cần khách hàng cung cấp ảnh scan để cập nhật
- Nếu muốn email tuyển dụng riêng: Admin → Settings → Company → Recruitment Email

---

## 18/06/2026 — Phiên 4 (Chiều)

**Người thực hiện:** Hoang Son

### Hoàn thành

- **[data] Scrape toàn bộ nội dung thực tế từ lmxalliance.com**
  - Scraped 6 bài viết + trang liên hệ → lưu vào `docs/scraped-content.md`
  - Thông tin thực: Số 104 Đường Lò Lu, Long Phước, HCM | 0931.824.025 / 0937.798.377 | Ops@lmxalliance.com | T2-T7 7-17h

- **[data] Thay thế 6 bài tin tức hư cấu → 6 bài thực từ trang cũ**
  - Thu mua & Kinh doanh phế liệu (quy trình 4 bước, các loại phế liệu, lợi ích)
  - Dịch vụ Logistics & Xuất nhập khẩu (dịch vụ, lợi thế, hệ thống xe)
  - Giới thiệu Công ty Liên Minh Xanh LMX (tầm nhìn, 3 lĩnh vực, cam kết, thông tin liên hệ)
  - Hệ thống phương tiện & Năng lực vận hành (7 loại xe, ưu điểm)
  - Thi công xây dựng dân dụng & Công nghiệp (4 hạng mục, thế mạnh, cam kết)
  - Xử lý chất thải nguy hại (3 loại, tiêu chuẩn, lợi ích, phối hợp Huê Phương VN)

- **[data] Cập nhật CompanySettings và Homepage seed**
  - Sửa `update: {}` → `update: { ...data }` để seed thực sự update record cũ
  - Description sát thực tế hơn: đề cập đúng 3 lĩnh vực + Huê Phương VN
  - Hero homepage: "Giải pháp toàn diện cho kỷ nguyên kinh tế xanh"
  - recruitmentEmail: tuyendung@lmxalliance.com (đã hoạt động trên trang tuyển dụng)

- **[fix] Trang giới thiệu về nội dung (phiên trước)**
  - Thêm Thư ngỏ, Pháp lý công ty, Liên kết Huê Phương VN

### Ghi chú

- Lãnh đạo, đối tác, dự án vẫn là placeholder — cần khách hàng cung cấp thông tin thực
- Giấy ĐKDN trong trang About cần ảnh scan thực tế
- File `docs/scraped-content.md` lưu toàn bộ nội dung gốc từ lmxalliance.com

---

## 19/06/2026 (Thứ Sáu)

**Người thực hiện:** Hoang Son

### Hoàn thành

- **[test] Responsive mobile — kiểm tra tất cả breakpoints (Task 1.5)**
  - Công cụ: Playwright MCP, viewport 375px (iPhone) và 768px (iPad)
  - Trang đã kiểm tra: Homepage, About, News list, News detail, Careers, Contact
  - **375px — kết quả:**
    - Header: hamburger menu hiển thị đúng (desktop nav ẩn với `hidden lg:flex`)
    - Hamburger click: drawer mở với 7 links, active state highlight, nút X đóng
    - Hero sections: text wrap tốt, không tràn
    - Grids: stack sang single column (`grid-cols-1`) đúng ở tất cả sections
    - About achievements: 2×2 grid (`grid-cols-2 md:grid-cols-4`) ✅
    - Core values: 2 cột (`sm:grid-cols-2`) ✅
    - Pháp lý + certificate: stack dọc (info card → ảnh) ✅
    - News detail sidebar: collapse bên dưới content ✅
    - Contact form: full width, usable ✅
    - Footer: 3 columns stack sang 1 cột ✅
  - **768px — kết quả:**
    - Business segments: 3 cột (`md:grid-cols-3`) ✅
    - Stats strip: 4 cột (`md:grid-cols-4`) ✅
    - News cards: 2 cột ✅
    - Footer: multi-column ✅

### Vấn đề phát sinh

- `AnimateIn` (`whileInView`) làm blank khi Playwright chụp full-page (không scroll) → force `opacity: 1` bằng JS để xem layout thực
- `browser_resize` trong Playwright MCP không persist qua page navigation → cần resize lại sau mỗi lần navigate
- Stats homepage = "0" vì production DB chưa seed (không phải layout bug)

### Ghi chú

- Task 1.5 CONFIRMED PASS — layout responsive hoạt động đúng trên mobile và tablet
- Không có bug layout nào cần fix

<!-- ENTRIES MỚI ĐƯỢC THÊM VÀO ĐÂY BỞI /log-work -->
