# Prompt tạo ảnh mới cho LMX Alliance (AI image generation)

**Style guide chung** (chèn vào cuối mỗi prompt):
> Professional corporate photography style, clean and modern, dark forest green (#015231) and lime green (#8ec63f) color grading, soft natural lighting, no heavy gradients, no dramatic shadows, sharp minimal composition, subtle green accent tones, Vietnamese logistics/industrial company context, high resolution, realistic (not illustration/cartoon).

Ảnh cũ ở `public/migration-tmp/` (xe-dau-keo.jpg, may-nang.jpg, xe-7.jpg, xe-8.jpg, duong-thuy.jpg) dùng làm **ảnh tham khảo bố cục/nội dung** (loại xe, thiết bị thật của công ty) — không dùng làm tham khảo màu sắc/ánh sáng.

---

## PHẦN 1 — Ảnh hero cho 8 trang chính (theo thứ tự nav)

Kích thước khuyến nghị mỗi ảnh: **1920×1080 (16:9)** hoặc rộng hơn, đủ tối để chữ trắng đè lên vẫn đọc được (hoặc để phần bên trái/trên trống cho text overlay).

### 1. Trang chủ (`/`)
> Wide establishing shot of a modern logistics and industrial operation in Vietnam — container trucks or cargo yard with green industrial facility in the background, golden-hour or soft overcast light, dark forest green (#015231) color grading with lime green (#8ec63f) accent highlights, spacious composition with empty space on the left third for text overlay, professional corporate photography, realistic, high resolution.

### 2. Giới thiệu (`/about`)
> Vietnamese business team or company headquarters exterior, professional and welcoming atmosphere, modern office building or meeting scene, dark forest green and lime green accent tones, daylight, corporate photography, realistic, high resolution.

### 3. Lĩnh vực hoạt động (`/business-segments`)
> Split-composition or wide shot combining construction, logistics trucks, and industrial recycling elements to represent a multi-sector enterprise, cohesive dark forest green and lime green color grading, professional photography, realistic, high resolution.

### 4. Quan hệ cổ đông (`/shareholder-relations`)
> Modern corporate boardroom or financial district skyline in Vietnam, clean professional atmosphere conveying trust and stability, dark forest green and lime green subtle accent lighting, realistic, high resolution.

### 5. Tin tức (`/news`)
> Vietnamese business newsroom or editorial desk with laptop and documents, or a montage-style wide shot of company activity (trucks, construction, office), dark forest green and lime green tones, professional photography, realistic, high resolution.

### 6. Tuyển dụng (`/careers`)
> Diverse group of Vietnamese professionals in safety gear and business attire together, positive collaborative team atmosphere, industrial/office hybrid setting, dark forest green and lime green accent tones, daylight, realistic, high resolution.

### 7. Hoạt động (`/activities`)
> Company event or field activity — team on-site at a construction or logistics operation, active and dynamic composition, dark forest green and lime green accent tones, professional photography, realistic, high resolution.

### 8. Liên hệ (`/contact`)
> Modern reception area or building entrance with clear signage, welcoming and professional, dark forest green and lime green accent tones, daylight, realistic, high resolution.

---

## PHẦN 2 — Ảnh nội dung còn thiếu

### BusinessSector `xay-lap-cong-trinh` (Xây lắp công trình dân dụng & công nghiệp)
**Kích thước**: banner 1600×900, gallery ~800×600 (3-4 ảnh).
**Banner**:
> Construction site in Vietnam, civil and industrial building under construction, workers in safety helmets and vests, crane or scaffolding visible, clean daylight, dark forest green and lime green color accents on safety gear or signage, professional corporate photography, realistic, high resolution.
**Gallery**:
> 1. Close-up of construction worker in hard hat reviewing blueprints on site, green accent branding on vest.
> 2. Industrial warehouse/factory building exterior, completed construction, clean modern architecture.
> 3. Construction equipment (excavator or crane) in action at a build site, daytime, green corporate color grading.

### BusinessSector `phe-lieu-xu-ly-chat-thai` (Phế liệu & Xử lý chất thải)
**Kích thước**: banner 1600×900, gallery ~800×600 (3-4 ảnh).
**Banner**:
> Industrial scrap metal recycling yard, organized stacks of sorted metal/scrap materials, workers handling recyclables safely, clean and orderly (not messy junkyard look), dark forest green and lime green accent tones, environmental/sustainability mood, professional photography, realistic, high resolution.
**Gallery**:
> 1. Sorted metal scrap piles (iron, aluminum) in an organized industrial yard.
> 2. Waste treatment facility exterior, clean industrial building, green signage accents.
> 3. Worker in protective gear handling hazardous waste containers safely, compliance-focused mood.

### NewsArticle thumbnails — 5 bài còn thiếu ảnh
Kích thước mỗi thumbnail: ~1200×675 (16:9).

**"Thu mua & Kinh doanh phế liệu"**
> Close-up of sorted scrap metal (iron rods, aluminum sheets) ready for trading, industrial yard background, dark forest green and lime green color grading, realistic, high resolution.

**"Dịch vụ Logistics & Xuất nhập khẩu"**
> Container ship or container yard at a Vietnamese port, cranes loading containers, logistics operations, wide shot, dark forest green and lime green accent tones, professional photography, realistic, high resolution.

**"Giới thiệu Công ty Liên Minh Xanh LMX"**
> Modern corporate office building exterior or company signage/entrance in Ho Chi Minh City, Vietnam, professional and welcoming, dark forest green and lime green branding accents, daylight, realistic, high resolution.

**"Thi công xây dựng dân dụng & Công nghiệp"**
> Construction site with workers and structural framework, safety gear, green accent tones, realistic, high resolution. (dùng chung phong cách với banner sector xây lắp ở trên)

**"Xử lý chất thải nguy hại"**
> Environmental technician in full protective suit (hazmat-style PPE) handling labeled hazardous waste containers in a controlled industrial facility, safety-compliance mood, dark forest green and lime green accent tones, realistic, high resolution.

---

## Cách dùng file này
1. Chọn công cụ tạo ảnh (Midjourney, DALL·E, Stable Diffusion, v.v.).
2. Copy prompt tương ứng; có thể đính kèm ảnh trong `public/migration-tmp/` làm ảnh tham khảo bố cục nếu công cụ hỗ trợ image-to-image.
3. Sau khi có ảnh, đặt vào `public/uploads/` hoặc upload qua Admin CMS (`lib/r2.ts` → Cloudflare R2), rồi cập nhật field tương ứng (`HomePage.heroImage`, `BusinessSector.banner/gallery`, `NewsArticle.thumbnail`) trong `prisma/seed.ts` hoặc qua Admin panel.
