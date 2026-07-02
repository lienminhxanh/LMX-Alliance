# Ảnh cần tạo mới sau khi migrate nội dung từ site cũ

Nội dung/data đã migrate xong từ `lmxalliance.com` (cũ) vào `prisma/seed.ts` và `app/(public)/[locale]/about/page.tsx`.
Ảnh cũ (~19 ảnh, `wp-content/uploads/`) hầu hết không phù hợp bộ nhận diện mới (xanh lá #015231/#8ec63f, Roboto, bo góc ≤4px, không gradient/shadow nặng) nên **không** dùng trực tiếp, trừ 5 ảnh thực tế (xe/thiết bị) đã tạm dùng — xem cuối file.

## Danh sách vị trí còn thiếu ảnh (cần khách hàng tạo/chụp mới)

### 1. HomePage.heroImage
- Vị trí: banner hero trang chủ.
- Site cũ không có ảnh phù hợp phong cách mới — cần ảnh mới hoàn toàn (thiết kế đồ họa hoặc ảnh thực tế công ty/công trình).
- Không có kích thước cố định trong code (dùng `fill`), khuyến nghị ảnh ngang rộng, tỉ lệ ~16:9 đến 21:9.

### 2. BusinessSector.banner + .gallery — còn thiếu 2/3 sector
- `xay-lap-cong-trinh` (Xây lắp công trình dân dụng & công nghiệp): chưa có banner/thumbnail/gallery nào.
- `phe-lieu-xu-ly-chat-thai` (Phế liệu & Xử lý chất thải): chưa có banner/thumbnail/gallery nào.
- Sector `logistics-xuat-nhap-khau` đã có thumbnail + gallery tạm (xem mục cuối).
- Ảnh cũ liên quan để tham khảo nội dung (không dùng trực tiếp vì không đúng phong cách):
  - `wp-content/uploads/2023/08/1625556477_image_service_3.jpg` — minh họa dịch vụ chung.
  - `wp-content/uploads/2023/08/0111.1.jpg`, `0111.1-1.jpg` — ảnh minh họa khác.

### 3. Leader.photo — cả 4 lãnh đạo đều chưa có ảnh
- Site cũ không có ảnh lãnh đạo/đội ngũ nào (WordPress crawl không lưu ảnh nhân sự).
- Cần chụp/thiết kế ảnh chân dung mới hoàn toàn.
- Kích thước theo code hiện tại: tỉ lệ dọc **3:4** (card `aspect-[3/4]`, dùng `fill` + `object-cover`).

### 4. Partner.logo
- Chưa có partner nào được seed trong DB — cần thêm data + logo đối tác (vd Huê Phương VN) nếu muốn hiển thị mục "Đối tác".
- Không có ràng buộc kích thước cụ thể trong code đã khảo sát — nên dùng PNG nền trong suốt, tỉ lệ vuông hoặc ngang vừa phải.

### 5. Project.images
- Chưa có Project nào được seed — nếu cần hiển thị mục "Dự án", cần bổ sung data + ảnh gallery (Json array URL).

## Ảnh cũ đã tạm dùng (real photos, không phụ thuộc thiết kế)

Copy từ `D:\lmx-media\lmx-old\lmxalliance.com\wp-content\uploads\2026\05\` vào `public/migration-tmp/`, gán tạm cho:
- Sector `logistics-xuat-nhap-khau`: `thumbnail` = `xe-dau-keo.jpg`; `gallery` = [`xe-dau-keo.jpg`, `may-nang.jpg`, `xe-7.jpg`, `xe-8.jpg`].
- NewsArticle "Hệ thống phương tiện & Năng lực vận hành": `thumbnail` = `xe-dau-keo.jpg`.

Đây là ảnh thật (xe đầu kéo, cẩu/thiết bị nâng), độ phân giải trung bình, **chỉ nên dùng tạm** — khuyến nghị thay bằng ảnh chụp mới, độ phân giải cao hơn, đúng bố cục web (crop theo tỉ lệ card) khi có điều kiện.

Ảnh bị bỏ qua hoàn toàn (không dùng): logo cũ (`1-1.png`, `2026-05-04-1.png`), `favicon.png` — site mới đã có logo/favicon riêng.
