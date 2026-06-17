# Nhật ký Phát triển — LMX Alliance Website

> File này được cập nhật tự động sau mỗi phiên làm việc qua skill `/log-work`.

---

## 17/06/2026 (Thứ Tư)

**Người thực hiện:** Hoang Son  
**Thời gian:** Buổi chiều

### Hoàn thành

- **[feat] Đổi tên Quan hệ nhà đầu tư → Quan hệ cổ đông**
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

<!-- ENTRIES MỚI ĐƯỢC THÊM VÀO ĐÂY BỞI /log-work -->
