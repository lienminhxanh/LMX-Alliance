import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Users ────────────────────────────────────────────
  const hashed = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@lmxalliance.com' },
    update: {},
    create: { email: 'admin@lmxalliance.com', password: hashed, name: 'Super Admin', role: 'SUPER_ADMIN', isActive: true },
  });

  // ── Company Settings ─────────────────────────────────
  const settingsData = {
    name: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX',
    tagline: 'Giải pháp toàn diện cho doanh nghiệp trong kỷ nguyên kinh tế xanh',
    description: 'Công ty Cổ phần Liên Minh Xanh LMX (LMX Alliance JSC) là doanh nghiệp đa ngành, cung cấp giải pháp toàn diện trong lĩnh vực logistics & xuất nhập khẩu, xây lắp công trình dân dụng và công nghiệp, thu mua phế liệu và xử lý chất thải nguy hại. Công ty được thành lập để đáp ứng nhu cầu ngày càng tăng về bảo vệ môi trường, quản lý chất thải và tuân thủ phát triển bền vững.',
    address: 'Số 104 Đường Lò Lu, Phường Long Phước, Thành phố Hồ Chí Minh',
    phone: '0931.824.025 / 0937.798.377',
    email: 'Ops@lmxalliance.com',
    website: 'https://lmxalliance.com',
    googleMapEmbed: '',
    seoMetaTitle: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
    seoMetaDesc: 'LMX Alliance - Giải pháp toàn diện logistics, xây lắp công trình, thu mua phế liệu và xử lý chất thải nguy hại tại TP. Hồ Chí Minh.',
    seoOgImage: '',
    seoKeywords: 'LMX Alliance, Liên Minh Xanh, xây lắp, logistics, phế liệu, chất thải, xuất nhập khẩu',
    facebookUrl: null, linkedinUrl: null, youtubeUrl: null, tiktokUrl: null,
    zaloUrl: 'https://zalo.me/0931824025', messengerUrl: null,
    recruitmentEmail: 'tuyendung@lmxalliance.com',
  };
  await prisma.companySettings.upsert({
    where: { id: 'singleton' },
    update: settingsData,
    create: { id: 'singleton', ...settingsData },
  });

  // ── Homepage ─────────────────────────────────────────
  const homeData = {
    heroTitleVI: 'Giải pháp toàn diện\ncho kỷ nguyên kinh tế xanh',
    heroTitleEN: 'Comprehensive Solutions\nfor the Green Economy Era',
    heroTitleZH: '绿色经济时代的\n全面解决方案',
    heroDescVI: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX — doanh nghiệp đa ngành cung cấp dịch vụ logistics & xuất nhập khẩu, xây lắp công trình, thu mua phế liệu và xử lý chất thải nguy hại. An toàn – Hiệu quả – Minh bạch.',
    heroDescEN: 'LMX GREEN ALLIANCE JSC — a multi-sector enterprise providing logistics & import-export, construction, scrap procurement and hazardous waste treatment services. Safe – Efficient – Transparent.',
    heroDescZH: 'LMX绿色联盟股份公司——提供物流与进出口、建筑施工、废料采购和危险废物处理的多元化企业。安全–高效–透明。',
    heroCTA: 'Khám phá dịch vụ',
    heroImage: '',
  };
  await prisma.homePage.upsert({
    where: { id: 'singleton' },
    update: homeData,
    create: { id: 'singleton', ...homeData },
  });

  // ── Statistics ───────────────────────────────────────
  await prisma.statistic.deleteMany();
  const stats = [
    { valueVI: '10+', valueEN: '10+', valueZH: '10+', labelVI: 'Năm kinh nghiệm', labelEN: 'Years of Experience', labelZH: '年经验', orderIndex: 0 },
    { valueVI: '200+', valueEN: '200+', valueZH: '200+', labelVI: 'Nhân sự chuyên nghiệp', labelEN: 'Professional Staff', labelZH: '专业员工', orderIndex: 1 },
    { valueVI: '100+', valueEN: '100+', valueZH: '100+', labelVI: 'Dự án hoàn thành', labelEN: 'Projects Completed', labelZH: '完成项目', orderIndex: 2 },
    { valueVI: '50+', valueEN: '50+', valueZH: '50+', labelVI: 'Đối tác chiến lược', labelEN: 'Strategic Partners', labelZH: '战略合作伙伴', orderIndex: 3 },
  ];
  for (const s of stats) await prisma.statistic.create({ data: s });

  // ── Business Sectors ─────────────────────────────────
  await prisma.businessSector.deleteMany();
  const sectors = [
    {
      slug: 'xay-lap-cong-trinh',
      nameVI: 'Xây lắp công trình dân dụng và công nghiệp',
      nameEN: 'Construction & Infrastructure',
      nameZH: '民用及工业建筑施工',
      summaryVI: 'Chuyên thi công các công trình dân dụng, công nghiệp với tiêu chuẩn chất lượng cao và tiến độ đảm bảo.',
      summaryEN: 'Specializing in civil and industrial construction with high quality standards and on-schedule delivery.',
      summaryZH: '专业从事民用和工业建筑施工，质量标准高，工期有保障。',
      contentVI: `<h2>Tổng quan dịch vụ</h2><p>LMX Alliance có đội ngũ kỹ sư và công nhân lành nghề, trang thiết bị hiện đại, cam kết đảm bảo tiến độ và chất lượng công trình theo đúng yêu cầu của khách hàng.</p><h2>Năng lực thi công</h2><ul><li>Công trình dân dụng: nhà ở, chung cư, văn phòng</li><li>Công trình công nghiệp: nhà xưởng, kho bãi, nhà máy</li><li>Hạ tầng kỹ thuật: đường nội bộ, hệ thống điện nước</li></ul><h2>Tiêu chuẩn chất lượng</h2><p>Tất cả công trình đều được kiểm soát chất lượng theo tiêu chuẩn ISO 9001:2015 và tuân thủ đầy đủ quy định pháp luật về xây dựng.</p>`,
      contentEN: `<h2>Service Overview</h2><p>LMX Alliance has skilled engineers and workers, modern equipment, ensuring project schedule and quality as required by clients.</p><h2>Construction Capabilities</h2><ul><li>Civil works: residential, apartment, office buildings</li><li>Industrial works: factories, warehouses, plants</li><li>Technical infrastructure: internal roads, electrical and water systems</li></ul><h2>Quality Standards</h2><p>All projects are quality-controlled according to ISO 9001:2015 standards.</p>`,
      contentZH: `<h2>服务概述</h2><p>LMX联盟拥有熟练的工程师和工人团队、现代化设备，确保工程进度和质量。</p>`,
      banner: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg', thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg', gallery: ['https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg'],
      seoTitleVI: 'Xây lắp công trình - LMX Alliance',
      seoDescVI: 'Dịch vụ xây lắp công trình dân dụng và công nghiệp chất lượng cao từ LMX Alliance.',
      status: 'PUBLISHED' as const, orderIndex: 0,
    },
    {
      slug: 'logistics-xuat-nhap-khau',
      nameVI: 'Logistics & Xuất nhập khẩu',
      nameEN: 'Logistics & Import-Export',
      nameZH: '物流及进出口',
      summaryVI: 'Cung cấp giải pháp logistics toàn diện và dịch vụ xuất nhập khẩu chuyên nghiệp, tối ưu chi phí vận chuyển.',
      summaryEN: 'Comprehensive logistics solutions and professional import-export services, optimizing transportation costs.',
      summaryZH: '提供全面的物流解决方案和专业的进出口服务，优化运输成本。',
      contentVI: `<h2>Dịch vụ Logistics</h2><p>Với mạng lưới đối tác rộng lớn trong và ngoài nước, LMX Alliance cung cấp dịch vụ logistics và xuất nhập khẩu hiệu quả, tối ưu chi phí cho doanh nghiệp.</p><h2>Dịch vụ cụ thể</h2><ul><li>Vận chuyển hàng hóa nội địa và quốc tế</li><li>Thủ tục hải quan xuất nhập khẩu</li><li>Kho bãi và phân phối</li><li>Tư vấn giải pháp chuỗi cung ứng</li></ul>`,
      contentEN: `<h2>Logistics Services</h2><p>With an extensive partner network, LMX Alliance provides efficient logistics and import-export services, optimizing costs for businesses.</p><h2>Specific Services</h2><ul><li>Domestic and international freight</li><li>Import-export customs procedures</li><li>Warehousing and distribution</li><li>Supply chain consulting</li></ul>`,
      contentZH: `<h2>物流服务</h2><p>凭借广泛的合作伙伴网络，LMX联盟为企业提供高效的物流和进出口服务，优化成本。</p>`,
      banner: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009400/lmx-migration/o6pyjagnadnhuirlswas.jpg', thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009400/lmx-migration/o6pyjagnadnhuirlswas.jpg', gallery: [
        'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009400/lmx-migration/o6pyjagnadnhuirlswas.jpg',
        'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009402/lmx-migration/klu2vw32c7voieozu4mf.jpg',
        'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009403/lmx-migration/ywjmf8mw4f97k8g4muj6.jpg',
        'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009404/lmx-migration/anjoz6o8vogqzb2zungy.jpg',
        'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      ],
      seoTitleVI: 'Logistics & Xuất nhập khẩu - LMX Alliance',
      seoDescVI: 'Dịch vụ logistics và xuất nhập khẩu chuyên nghiệp từ LMX Alliance.',
      status: 'PUBLISHED' as const, orderIndex: 1,
    },
    {
      slug: 'phe-lieu-xu-ly-chat-thai',
      nameVI: 'Phế liệu & Xử lý chất thải',
      nameEN: 'Waste Management & Recycling',
      nameZH: '废料回收及废物处理',
      summaryVI: 'Thu mua phế liệu và xử lý chất thải công nghiệp theo tiêu chuẩn môi trường, góp phần phát triển kinh tế tuần hoàn.',
      summaryEN: 'Scrap trading and industrial waste treatment to environmental standards, contributing to circular economy.',
      summaryZH: '按照环保标准进行废料收购和工业废物处理，推动循环经济发展。',
      contentVI: `<h2>Tổng quan</h2><p>LMX Alliance cam kết xử lý chất thải và phế liệu theo quy trình chuyên nghiệp, đảm bảo an toàn môi trường và tuân thủ quy định pháp luật.</p><h2>Dịch vụ</h2><ul><li>Thu mua phế liệu kim loại (sắt, đồng, nhôm, inox)</li><li>Xử lý chất thải công nghiệp nguy hại và không nguy hại</li><li>Tái chế và tái sử dụng vật liệu</li><li>Tư vấn quản lý chất thải cho doanh nghiệp</li></ul><h2>Cam kết môi trường</h2><p>Chúng tôi tuân thủ nghiêm ngặt ISO 14001:2015 và các quy định về bảo vệ môi trường của Nhà nước.</p>`,
      contentEN: `<h2>Overview</h2><p>LMX Alliance is committed to processing waste and scrap materials professionally, ensuring environmental safety and legal compliance.</p><h2>Services</h2><ul><li>Metal scrap purchasing (iron, copper, aluminum, stainless steel)</li><li>Hazardous and non-hazardous industrial waste treatment</li><li>Material recycling and reuse</li><li>Waste management consulting</li></ul>`,
      contentZH: `<h2>概述</h2><p>LMX联盟致力于专业处理废物和废料，确保环境安全和法律合规。</p>`,
      banner: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009401/lmx-migration/szhxen4de8gi2sl0tuky.jpg', thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009401/lmx-migration/szhxen4de8gi2sl0tuky.jpg', gallery: ['https://res.cloudinary.com/azsqg4uv/image/upload/v1783009401/lmx-migration/szhxen4de8gi2sl0tuky.jpg'],
      seoTitleVI: 'Phế liệu & Xử lý chất thải - LMX Alliance',
      seoDescVI: 'Dịch vụ thu mua phế liệu và xử lý chất thải công nghiệp từ LMX Alliance.',
      status: 'PUBLISHED' as const, orderIndex: 2,
    },
  ];
  for (const s of sectors) await prisma.businessSector.create({ data: s });

  // ── Leaders ──────────────────────────────────────────
  await prisma.leader.deleteMany();
  const leaders = [
    {
      nameVI: 'Nguyễn Văn Minh', nameEN: 'Nguyen Van Minh', nameZH: '阮文明',
      positionVI: 'Chủ tịch Hội đồng Quản trị', positionEN: 'Chairman of the Board', positionZH: '董事长',
      bioVI: 'Hơn 20 năm kinh nghiệm trong lĩnh vực xây dựng và quản lý doanh nghiệp. Người sáng lập và định hướng chiến lược phát triển bền vững của LMX Alliance.',
      bioEN: 'Over 20 years of experience in construction and corporate management. Founder and strategic leader of LMX Alliance\'s sustainable development.',
      bioZH: '在建筑和企业管理领域拥有超过20年的经验，是LMX联盟可持续发展战略的创始人和引领者。',
      photo: '', orderIndex: 0,
    },
    {
      nameVI: 'Trần Thị Lan Anh', nameEN: 'Tran Thi Lan Anh', nameZH: '陈兰英',
      positionVI: 'Tổng Giám đốc', positionEN: 'Chief Executive Officer', positionZH: '总裁',
      bioVI: 'Thạc sĩ Quản trị Kinh doanh tại Đại học Kinh tế TP.HCM. 15 năm kinh nghiệm điều hành doanh nghiệp đa ngành trong lĩnh vực logistics và thương mại quốc tế.',
      bioEN: 'MBA from University of Economics Ho Chi Minh City. 15 years of experience managing diversified enterprises in logistics and international trade.',
      bioZH: '胡志明市经济大学MBA。在物流和国际贸易领域管理多元化企业15年经验。',
      photo: '', orderIndex: 1,
    },
    {
      nameVI: 'Phạm Quang Hưng', nameEN: 'Pham Quang Hung', nameZH: '范光兴',
      positionVI: 'Giám đốc Tài chính (CFO)', positionEN: 'Chief Financial Officer', positionZH: '首席财务官',
      bioVI: 'Kỹ sư Tài chính, chứng chỉ CPA. 12 năm kinh nghiệm trong lĩnh vực tài chính doanh nghiệp và quản lý rủi ro.',
      bioEN: 'Financial Engineer, CPA certified. 12 years of experience in corporate finance and risk management.',
      bioZH: '金融工程师，持有CPA证书。在企业财务和风险管理领域拥有12年经验。',
      photo: '', orderIndex: 2,
    },
    {
      nameVI: 'Lê Thanh Tùng', nameEN: 'Le Thanh Tung', nameZH: '黎清松',
      positionVI: 'Giám đốc Vận hành (COO)', positionEN: 'Chief Operating Officer', positionZH: '首席运营官',
      bioVI: 'Kỹ sư Xây dựng tốt nghiệp Đại học Bách Khoa TP.HCM. 10 năm trực tiếp quản lý thi công các công trình dân dụng và công nghiệp lớn.',
      bioEN: 'Civil Engineering graduate from Ho Chi Minh City University of Technology. 10 years managing major civil and industrial construction projects.',
      bioZH: '胡志明市科技大学土木工程毕业。直接管理大型民用和工业建设项目10年。',
      photo: '', orderIndex: 3,
    },
  ];
  for (const l of leaders) await prisma.leader.create({ data: l });

  // ── News Articles (từ nội dung thực tế lmxalliance.com) ──
  await prisma.newsArticle.deleteMany();
  const articles = [
    {
      titleVI: 'Thu mua & Kinh doanh phế liệu',
      titleEN: 'Scrap Purchasing & Trading',
      titleZH: '废料收购与经营',
      slugVI: 'thu-mua-kinh-doanh-phe-lieu',
      slugEN: 'scrap-purchasing-and-trading',
      slugZH: 'fei-liao-shou-gou-yu-jing-ying',
      summaryVI: 'LMX cung cấp dịch vụ thu mua phế liệu giá tốt với quy trình chuyên nghiệp, đảm bảo an toàn môi trường. Tái chế và tái sử dụng vật liệu thải, mang lại lợi ích kinh tế đồng thời bảo vệ môi trường.',
      summaryEN: 'LMX provides competitive scrap purchasing services with professional processes, ensuring environmental safety. Recycling and reusing waste materials brings economic benefits while protecting the environment.',
      summaryZH: 'LMX提供具有竞争力的废料收购服务，流程专业，确保环境安全。废料的回收和再利用既带来经济效益，又保护环境。',
      contentVI: `<h2>Thu mua phế liệu giá tốt – Quy trình chuyên nghiệp – An toàn môi trường</h2>
<p>Trong bối cảnh tài nguyên ngày càng khan hiếm, việc tái chế và tái sử dụng phế liệu không chỉ mang lại lợi ích kinh tế mà còn góp phần bảo vệ môi trường. LMX cung cấp dịch vụ thu mua phế liệu toàn diện, giúp doanh nghiệp giải quyết vấn đề tích tụ phế thải một cách hiệu quả và hợp pháp.</p>

<h2>Các loại phế liệu thu mua</h2>
<ul>
  <li>Sắt, thép, kim loại các loại</li>
  <li>Nhựa công nghiệp</li>
  <li>Giấy, carton</li>
  <li>Các vật liệu tái chế khác</li>
</ul>

<h2>Quy trình thu mua 4 bước</h2>
<ol>
  <li><strong>Tiếp nhận thông tin khách hàng</strong> — Liên hệ tư vấn miễn phí</li>
  <li><strong>Khảo sát và báo giá</strong> — Định giá minh bạch, cạnh tranh</li>
  <li><strong>Thu gom – vận chuyển</strong> — Đội xe chuyên dụng, đúng hẹn</li>
  <li><strong>Phân loại và xử lý</strong> — Theo tiêu chuẩn môi trường</li>
</ol>

<h2>Lợi ích khi hợp tác với LMX</h2>
<ul>
  <li>Giá thu mua cạnh tranh, thanh toán nhanh chóng</li>
  <li>Quy trình minh bạch, rõ ràng</li>
  <li>Đảm bảo đầy đủ tiêu chuẩn môi trường</li>
  <li>Phối hợp với <strong>Công ty TNHH MTV Môi Trường Xanh Huê Phương VN</strong> trong xử lý chất thải nguy hại</li>
</ul>`,
      contentEN: `<h2>Competitive Scrap Pricing – Professional Process – Environmental Safety</h2>
<p>As resources become increasingly scarce, recycling and reusing scrap materials not only brings economic benefits but also contributes to environmental protection. LMX provides comprehensive scrap purchasing services.</p>
<h2>Types of Scrap Purchased</h2>
<ul><li>Iron, steel, metals</li><li>Industrial plastics</li><li>Paper, cardboard</li><li>Other recyclable materials</li></ul>
<h2>4-Step Purchase Process</h2>
<ol><li>Customer inquiry reception</li><li>Site survey and quotation</li><li>Collection and transport</li><li>Sorting and processing</li></ol>
<h2>Benefits of Working with LMX</h2>
<ul><li>Competitive prices, fast payment</li><li>Transparent and clear process</li><li>Full environmental compliance</li></ul>`,
      contentZH: `<h2>废料高价收购——专业流程——环保安全</h2>
<p>随着资源日益稀缺，废料的回收和再利用不仅带来经济效益，还有助于环境保护。LMX提供全面的废料收购服务。</p>
<h2>收购废料类型</h2>
<ul><li>钢铁、金属</li><li>工业塑料</li><li>纸张、纸板</li><li>其他可回收材料</li></ul>`,
      thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009401/lmx-migration/szhxen4de8gi2sl0tuky.jpg',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
    {
      titleVI: 'Dịch vụ Logistics & Xuất nhập khẩu',
      titleEN: 'Logistics & Import-Export Services',
      titleZH: '物流及进出口服务',
      slugVI: 'dich-vu-logistics-xuat-nhap-khau',
      slugEN: 'logistics-import-export-services',
      slugZH: 'wu-liu-ji-jin-chu-kou-fu-wu',
      summaryVI: 'LMX mang đến giải pháp logistics trọn gói, tối ưu chi phí và chuẩn hóa quy trình xuất nhập khẩu. Bao gồm vận chuyển, giao nhận, kho bãi và thủ tục hải quan.',
      summaryEN: 'LMX offers comprehensive logistics solutions, optimizing costs and standardizing import-export processes. Including transport, freight forwarding, warehousing and customs clearance.',
      summaryZH: 'LMX提供全面物流解决方案，优化成本，规范进出口流程，包括运输、货运代理、仓储和清关。',
      contentVI: `<h2>Dịch vụ Logistics trọn gói của LMX — Tối ưu chi phí, Chuẩn hóa quy trình</h2>
<p>Trong thời đại thương mại toàn cầu phát triển mạnh mẽ, logistics đóng vai trò quan trọng trong việc đảm bảo chuỗi cung ứng hoạt động trơn tru. Liên Minh Xanh LMX mang đến giải pháp logistics trọn gói, linh hoạt và hiệu quả.</p>

<h2>Dịch vụ chính</h2>
<ul>
  <li>Vận chuyển hàng hóa nội địa và quốc tế</li>
  <li>Giao nhận hàng hóa (freight forwarding)</li>
  <li>Dịch vụ kho bãi chuyên nghiệp</li>
  <li>Thủ tục thông quan xuất nhập khẩu</li>
</ul>

<h2>Lợi thế nổi bật</h2>
<ul>
  <li>Tối ưu chi phí vận chuyển, giảm chi phí logistics</li>
  <li>Rút ngắn thời gian giao hàng</li>
  <li>Giảm thiểu rủi ro trong quá trình vận hành</li>
  <li>Tuân thủ đầy đủ quy định pháp lý</li>
</ul>

<h2>Đối tượng khách hàng</h2>
<p>Doanh nghiệp sản xuất, công ty thương mại, tổ chức xuất nhập khẩu — với quy trình vận hành linh hoạt, thích ứng theo từng loại hàng hóa và yêu cầu đặc thù của từng khách hàng.</p>

<h2>Hệ thống phương tiện</h2>
<p>LMX sở hữu đội phương tiện đồng bộ gồm: xe tải chở hàng, đầu kéo container, xe bồn chuyên dụng, xe moóc bán tải, xe nâng (forklift), đảm bảo phục vụ đa dạng nhu cầu vận chuyển.</p>`,
      contentEN: `<h2>LMX Full-Package Logistics — Cost Optimization, Process Standardization</h2>
<p>LMX Green Alliance offers comprehensive, flexible and efficient logistics solutions for businesses.</p>
<h2>Main Services</h2>
<ul><li>Domestic and international freight</li><li>Freight forwarding</li><li>Professional warehousing</li><li>Import-export customs clearance</li></ul>
<h2>Key Advantages</h2>
<ul><li>Optimized transport costs</li><li>Shortened delivery times</li><li>Minimized operational risks</li><li>Full legal compliance</li></ul>`,
      contentZH: `<h2>LMX全套物流服务——成本优化，流程规范</h2>
<p>LMX绿色联盟为企业提供全面、灵活、高效的物流解决方案。</p>
<h2>主要服务</h2>
<ul><li>国内外货物运输</li><li>货运代理</li><li>专业仓储</li><li>进出口清关</li></ul>`,
      thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009406/lmx-migration/pb8j5ajv9nexb5emgn9g.jpg',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
    {
      titleVI: 'Giới thiệu Công ty Liên Minh Xanh LMX',
      titleEN: 'Introduction to LMX Green Alliance Company',
      titleZH: '绿色联盟LMX公司介绍',
      slugVI: 'gioi-thieu-cong-ty-lien-minh-xanh-lmx',
      slugEN: 'introduction-lmx-green-alliance-company',
      slugZH: 'jie-shao-lmx-lv-se-lian-meng-gong-si',
      summaryVI: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX — Giải pháp toàn diện cho doanh nghiệp trong kỷ nguyên kinh tế xanh. Doanh nghiệp đa ngành trong logistics, xây dựng và quản lý môi trường.',
      summaryEN: 'LMX GREEN ALLIANCE JSC — Comprehensive solutions for businesses in the green economy era. A multi-sector enterprise in logistics, construction and environmental management.',
      summaryZH: 'LMX绿色联盟股份公司——绿色经济时代为企业提供的全面解决方案。物流、建筑和环境管理领域的多元化企业。',
      contentVI: `<h2>Công ty Cổ phần Liên Minh Xanh LMX — Giải pháp toàn diện trong kỷ nguyên kinh tế xanh</h2>
<p>CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX (LMX Alliance JSC) là doanh nghiệp đa ngành, cung cấp giải pháp toàn diện trong lĩnh vực logistics, xây dựng và quản lý môi trường. Công ty được thành lập để đáp ứng nhu cầu ngày càng tăng về bảo vệ môi trường, quản lý chất thải và tuân thủ phát triển bền vững.</p>

<h2>Tầm nhìn & Sứ mệnh</h2>
<p>Công ty hướng đến trở thành đối tác chiến lược đáng tin cậy trong quản lý môi trường, vận hành logistics và phát triển cơ sở hạ tầng. Sứ mệnh là cung cấp dịch vụ <strong>an toàn – hiệu quả – minh bạch</strong>, tuân thủ pháp luật và thúc đẩy kinh tế xanh.</p>

<h2>Lĩnh vực kinh doanh cốt lõi</h2>
<ul>
  <li><strong>Xuất nhập khẩu và vận hành logistics</strong> — Giao nhận, vận chuyển, kho bãi và thủ tục hải quan</li>
  <li><strong>Thi công xây dựng dân dụng và công nghiệp</strong> — Nhà ở, nhà xưởng, hạ tầng kỹ thuật</li>
  <li><strong>Thu gom, tái chế và xử lý phế liệu</strong> — Phối hợp với Huê Phương VN xử lý chất thải nguy hại</li>
</ul>

<h2>Cam kết cốt lõi</h2>
<p>Minh bạch trong vận hành, đảm bảo an toàn, liên tục cải thiện chất lượng dịch vụ và hợp tác lâu dài với khách hàng và các bên liên quan.</p>

<h2>Thông tin liên hệ</h2>
<ul>
  <li><strong>Địa chỉ:</strong> Số 104 Đường Lò Lu, Phường Long Phước, Thành phố Hồ Chí Minh</li>
  <li><strong>Hotline:</strong> 0931.824.025 / 0937.798.377</li>
  <li><strong>Email:</strong> Ops@lmxalliance.com</li>
  <li><strong>Giờ làm việc:</strong> Thứ 2 – Thứ 7: 07:00 – 17:00</li>
</ul>`,
      contentEN: `<h2>LMX Green Alliance JSC — Comprehensive Solutions for the Green Economy Era</h2>
<p>LMX Green Alliance JSC is a multi-sector enterprise providing comprehensive solutions in logistics, construction and environmental management.</p>
<h2>Vision & Mission</h2>
<p>To become a trusted strategic partner in environmental management, logistics operations and infrastructure development. Mission: provide <strong>safe – efficient – transparent</strong> services.</p>
<h2>Core Business Areas</h2>
<ul><li>Import-export and logistics operations</li><li>Civil and industrial construction</li><li>Scrap collection, recycling and waste treatment</li></ul>`,
      contentZH: `<h2>LMX绿色联盟股份公司——绿色经济时代的全面解决方案</h2>
<p>LMX绿色联盟股份公司是一家多元化企业，提供物流、建筑和环境管理领域的全面解决方案。</p>
<h2>核心业务领域</h2>
<ul><li>进出口和物流运营</li><li>民用和工业建筑施工</li><li>废料收集、回收和废物处理</li></ul>`,
      thumbnail: '',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
    {
      titleVI: 'Hệ thống phương tiện & Năng lực vận hành',
      titleEN: 'Fleet System & Operational Capacity',
      titleZH: '车辆系统与运营能力',
      slugVI: 'he-thong-phuong-tien-nang-luc-van-hanh',
      slugEN: 'fleet-system-operational-capacity',
      slugZH: 'che-liang-xi-tong-yu-yun-ying-neng-li',
      summaryVI: 'LMX đầu tư hệ thống phương tiện vận hành đồng bộ và hiện đại với 7 loại xe chuyên dụng, đảm bảo chất lượng dịch vụ logistics và xây dựng toàn diện.',
      summaryEN: 'LMX invests in a synchronized and modern fleet of 7 types of specialized vehicles, ensuring comprehensive logistics and construction service quality.',
      summaryZH: 'LMX投资建立了7种专业车辆组成的同步现代化车队，确保物流和建筑服务质量。',
      contentVI: `<h2>Năng lực vận hành mạnh mẽ — Lợi thế cạnh tranh của LMX</h2>
<p>Để đảm bảo chất lượng dịch vụ, LMX đầu tư hệ thống phương tiện vận hành đồng bộ và hiện đại, chủ động kiểm soát toàn bộ chuỗi dịch vụ.</p>

<h2>Đội phương tiện</h2>
<ul>
  <li><strong>Xe tải chở hàng</strong> — Vận chuyển hàng hóa các loại nội địa</li>
  <li><strong>Đầu kéo container</strong> — Vận chuyển container đường bộ</li>
  <li><strong>Xe bồn chuyên dụng</strong> — Vận chuyển chất lỏng, hóa chất</li>
  <li><strong>Xe sơ mi rơ moóc</strong> — Hàng siêu trường, siêu trọng</li>
  <li><strong>Xe nâng (forklift)</strong> — Bốc xếp trong kho bãi</li>
  <li><strong>Xe ép rác</strong> — Thu gom chất thải đô thị và công nghiệp</li>
  <li><strong>Xe ben đào xúc</strong> — Phục vụ công trình xây dựng</li>
</ul>

<h2>Ưu điểm của hệ thống</h2>
<ul>
  <li>Phân bổ linh hoạt theo từng giai đoạn vận hành</li>
  <li>Nâng cao hiệu quả hoạt động tổng thể</li>
  <li>Đảm bảo an toàn kỹ thuật và tuân thủ pháp lý</li>
</ul>

<h2>Giá trị cốt lõi</h2>
<ul>
  <li>Chủ động kiểm soát vận hành, không phụ thuộc bên thứ ba</li>
  <li>Tối ưu chi phí dịch vụ cho khách hàng</li>
  <li>Năng lực triển khai nhanh theo nhu cầu dự án</li>
</ul>`,
      contentEN: `<h2>Powerful Operational Capacity — LMX's Competitive Advantage</h2>
<p>To ensure service quality, LMX invests in a synchronized and modern vehicle fleet, actively controlling the entire service chain.</p>
<h2>Fleet</h2>
<ul><li>Freight trucks</li><li>Container tractors</li><li>Specialized tankers</li><li>Semi-trailers</li><li>Forklifts</li><li>Garbage compactors</li><li>Excavators</li></ul>`,
      contentZH: `<h2>强大的运营能力——LMX的竞争优势</h2>
<p>为确保服务质量，LMX投资建立了同步现代化的车辆系统，主动控制整个服务链。</p>
<h2>车队</h2>
<ul><li>货运卡车</li><li>集装箱牵引车</li><li>专用罐车</li><li>半挂车</li><li>叉车</li><li>垃圾压缩车</li><li>挖掘机</li></ul>`,
      thumbnail: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009402/lmx-migration/klu2vw32c7voieozu4mf.jpg',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
    {
      titleVI: 'Thi công xây dựng dân dụng & Công nghiệp',
      titleEN: 'Civil & Industrial Construction',
      titleZH: '民用及工业建筑施工',
      slugVI: 'thi-cong-xay-dung-dan-dung-cong-nghiep',
      slugEN: 'civil-industrial-construction',
      slugZH: 'min-yong-ji-gong-ye-jian-zhu-shi-gong',
      summaryVI: 'LMX cung cấp dịch vụ thi công xây dựng uy tín, đảm bảo chất lượng và tiến độ. Từ nhà ở dân dụng đến nhà xưởng công nghiệp với đội ngũ kỹ thuật chuyên môn cao.',
      summaryEN: 'LMX provides reputable construction services ensuring quality and schedule. From residential buildings to industrial factories with highly professional technical staff.',
      summaryZH: 'LMX提供信誉良好的建筑服务，确保质量和工期。从住宅到工业厂房，拥有专业技术团队。',
      contentVI: `<h2>Dịch vụ thi công xây dựng uy tín — Đảm bảo chất lượng và tiến độ</h2>
<p>LMX cung cấp dịch vụ thi công xây dựng các công trình dân dụng và công nghiệp với tiêu chuẩn kỹ thuật cao, đội ngũ kỹ sư và công nhân lành nghề.</p>

<h2>Các hạng mục thi công</h2>
<ul>
  <li><strong>Nhà ở dân dụng</strong> — Nhà phố, biệt thự, căn hộ</li>
  <li><strong>Nhà xưởng sản xuất</strong> — Thiết kế và thi công theo yêu cầu</li>
  <li><strong>Công trình công nghiệp</strong> — Kho bãi, nhà máy, hạ tầng kỹ thuật</li>
  <li><strong>Cơ sở hạ tầng kỹ thuật</strong> — Đường nội bộ, hệ thống điện nước</li>
</ul>

<h2>Thế mạnh của công ty</h2>
<ul>
  <li>Đội ngũ kỹ thuật chuyên môn cao, giàu kinh nghiệm thực tế</li>
  <li>Quy trình quản lý chất lượng chặt chẽ</li>
  <li>Cam kết hoàn thành công trình đúng tiến độ</li>
  <li>Tuân thủ nghiêm ngặt an toàn lao động</li>
</ul>

<h2>Cam kết cốt lõi</h2>
<p>Chất lượng công trình bền vững, tối ưu chi phí, tuân thủ đúng tiêu chuẩn kỹ thuật. LMX định vị mình là đối tác tin cậy trong lĩnh vực xây dựng hiện đại.</p>`,
      contentEN: `<h2>Reputable Construction Services — Quality & Schedule Guaranteed</h2>
<p>LMX provides civil and industrial construction services to high technical standards.</p>
<h2>Construction Categories</h2>
<ul><li>Residential buildings</li><li>Industrial factories</li><li>Industrial works</li><li>Technical infrastructure</li></ul>
<h2>Company Strengths</h2>
<ul><li>Highly skilled technical staff</li><li>Strict quality management</li><li>On-time completion</li><li>Labor safety compliance</li></ul>`,
      contentZH: `<h2>信誉良好的建筑服务——质量与工期保证</h2>
<p>LMX提供高技术标准的民用和工业建筑施工服务。</p>
<h2>施工类别</h2>
<ul><li>住宅建筑</li><li>工业厂房</li><li>工业工程</li><li>技术基础设施</li></ul>`,
      thumbnail: '',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
    {
      titleVI: 'Xử lý chất thải nguy hại',
      titleEN: 'Hazardous Waste Treatment',
      titleZH: '危险废物处理',
      slugVI: 'xu-ly-chat-thai-nguy-hai',
      slugEN: 'hazardous-waste-treatment',
      slugZH: 'wei-xian-fei-wu-chu-li',
      summaryVI: 'LMX hợp tác với Công ty TNHH MTV Môi Trường Xanh Huê Phương VN cung cấp giải pháp xử lý chất thải nguy hại an toàn, tuân thủ pháp luật và tiêu chuẩn môi trường.',
      summaryEN: 'LMX partners with Huê Phương VN Green Environment to provide safe hazardous waste treatment solutions, compliant with legal and environmental standards.',
      summaryZH: 'LMX与华方越南绿色环境公司合作，提供符合法律和环境标准的安全危险废物处理解决方案。',
      contentVI: `<h2>Giải pháp xử lý chất thải nguy hại an toàn — Tuân thủ pháp luật</h2>
<p>Chất thải nguy hại là một trong những vấn đề quan trọng mà doanh nghiệp cần đặc biệt lưu ý trong quá trình sản xuất. LMX hợp tác với <strong>Công ty TNHH MTV Môi Trường Xanh Huê Phương VN</strong> để cung cấp giải pháp thu gom, vận chuyển và xử lý chất thải nguy hại theo đúng quy định pháp luật.</p>

<h2>Các loại chất thải được xử lý</h2>
<ul>
  <li>Chất thải công nghiệp nguy hại</li>
  <li>Hóa chất độc hại, dung môi thải</li>
  <li>Vật liệu thải đặc thù từ sản xuất</li>
</ul>

<h2>Tiêu chuẩn xử lý</h2>
<ul>
  <li>Tuân thủ đầy đủ quy định pháp luật Việt Nam</li>
  <li>Đảm bảo an toàn môi trường trong toàn bộ quy trình</li>
  <li>Giảm thiểu rủi ro pháp lý cho doanh nghiệp</li>
  <li>Có giấy phép xử lý của Bộ Nông nghiệp và Môi trường</li>
</ul>

<h2>Lợi ích mang lại</h2>
<ul>
  <li>Phòng tránh vi phạm pháp luật về môi trường</li>
  <li>Bảo vệ môi trường và sức khỏe cộng đồng</li>
  <li>Nâng cao uy tín doanh nghiệp với đối tác và khách hàng</li>
</ul>

<p>LMX mang đến giải pháp xử lý chất thải toàn diện, giúp doanh nghiệp yên tâm vận hành, tập trung vào hoạt động sản xuất kinh doanh cốt lõi.</p>`,
      contentEN: `<h2>Safe Hazardous Waste Treatment Solutions — Legal Compliance</h2>
<p>Hazardous waste is a critical issue businesses must address during production. LMX partners with <strong>Huê Phương VN Green Environment Co., Ltd.</strong> to provide waste collection, transport and treatment.</p>
<h2>Types of Waste Treated</h2>
<ul><li>Hazardous industrial waste</li><li>Toxic chemicals, waste solvents</li><li>Specialized production waste</li></ul>
<h2>Treatment Standards</h2>
<ul><li>Full legal compliance</li><li>Environmental safety throughout</li><li>Reduce legal risks for businesses</li></ul>`,
      contentZH: `<h2>安全危险废物处理解决方案——法律合规</h2>
<p>危险废物是企业在生产过程中必须特别关注的重要问题。LMX与华方越南绿色环境公司合作提供废物收集、运输和处理服务。</p>
<h2>处理废物类型</h2>
<ul><li>危险工业废物</li><li>有毒化学品、废溶剂</li><li>专业生产废物</li></ul>`,
      thumbnail: '',
      category: 'COMPANY_NEWS' as const,
      author: 'LMX Alliance',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-05-04'),
    },
  ];
  for (const a of articles) await prisma.newsArticle.create({ data: a });

  // ── Job Postings ─────────────────────────────────────
  await prisma.jobPosting.deleteMany();
  const jobs = [
    {
      titleVI: 'Kỹ sư Xây dựng (Giám sát công trình)',
      titleEN: 'Civil Engineer (Site Supervisor)',
      titleZH: '土木工程师（工地监督）',
      descVI: '<p>LMX Alliance cần tuyển Kỹ sư Xây dựng có kinh nghiệm để giám sát thi công các công trình dân dụng và công nghiệp tại TP. Hồ Chí Minh và các tỉnh lân cận.</p>',
      descEN: '<p>LMX Alliance needs experienced Civil Engineers to supervise the construction of civil and industrial projects in Ho Chi Minh City and neighboring provinces.</p>',
      descZH: '<p>LMX联盟需要有经验的土木工程师监督胡志明市及周边省份的民用和工业工程施工。</p>',
      requirements: '<ul><li>Tốt nghiệp Đại học chuyên ngành Xây dựng hoặc Kỹ thuật Dân dụng</li><li>Tối thiểu 3 năm kinh nghiệm giám sát công trình</li><li>Có chứng chỉ hành nghề xây dựng</li><li>Kỹ năng đọc bản vẽ kỹ thuật tốt</li><li>Có thể đi công tác tỉnh</li></ul>',
      benefits: '<ul><li>Mức lương cạnh tranh: 15-25 triệu/tháng</li><li>BHYT, BHXH, BHTN đầy đủ</li><li>Thưởng hoàn thành dự án</li><li>Xe đưa đón công trình</li><li>Khám sức khỏe định kỳ hàng năm</li></ul>',
      location: 'TP. Hồ Chí Minh & Bình Dương',
      salaryRange: '15 - 25 triệu/tháng',
      status: 'OPEN' as const,
    },
    {
      titleVI: 'Chuyên viên Logistics & Xuất nhập khẩu',
      titleEN: 'Logistics & Import-Export Specialist',
      titleZH: '物流及进出口专员',
      descVI: '<p>Chúng tôi tìm kiếm Chuyên viên Logistics có kinh nghiệm trong lĩnh vực xuất nhập khẩu hàng hóa, thông thạo thủ tục hải quan và vận chuyển quốc tế.</p>',
      descEN: '<p>We are looking for Logistics Specialists with experience in import-export, proficient in customs procedures and international shipping.</p>',
      descZH: '<p>我们寻找在进出口领域有经验的物流专员，熟悉海关手续和国际运输。</p>',
      requirements: '<ul><li>Tốt nghiệp Đại học chuyên ngành Logistics, Thương mại Quốc tế hoặc tương đương</li><li>Tối thiểu 2 năm kinh nghiệm tại vị trí tương đương</li><li>Thông thạo thủ tục hải quan và Incoterms</li><li>Tiếng Anh giao tiếp tốt (ưu tiên có thêm tiếng Trung)</li><li>Kỹ năng đàm phán với nhà cung cấp, đối tác</li></ul>',
      benefits: '<ul><li>Lương: 12-18 triệu/tháng + hoa hồng theo doanh số</li><li>BHYT, BHXH đầy đủ</li><li>Laptop, điện thoại công ty</li><li>Đào tạo nâng cao nghiệp vụ định kỳ</li><li>Môi trường làm việc quốc tế, năng động</li></ul>',
      location: 'TP. Hồ Chí Minh (Quận 7)',
      salaryRange: '12 - 18 triệu/tháng + hoa hồng',
      status: 'OPEN' as const,
    },
    {
      titleVI: 'Kỹ thuật viên Môi trường (Xử lý chất thải)',
      titleEN: 'Environmental Technician (Waste Treatment)',
      titleZH: '环境技术员（废物处理）',
      descVI: '<p>LMX Alliance tuyển dụng Kỹ thuật viên Môi trường để vận hành và giám sát các quy trình xử lý chất thải công nghiệp tại cơ sở xử lý của công ty.</p>',
      descEN: '<p>LMX Alliance recruits Environmental Technicians to operate and monitor industrial waste treatment processes at the company\'s facility.</p>',
      descZH: '<p>LMX联盟招募环境技术员，在公司设施运营和监督工业废物处理流程。</p>',
      requirements: '<ul><li>Tốt nghiệp Cao đẳng/Đại học chuyên ngành Môi trường, Hóa học hoặc tương đương</li><li>Có kinh nghiệm vận hành hệ thống xử lý nước thải hoặc chất thải rắn</li><li>Hiểu biết về quy định môi trường Việt Nam</li><li>Có chứng chỉ an toàn lao động (lợi thế)</li><li>Chịu được áp lực công việc, có thể làm ca</li></ul>',
      benefits: '<ul><li>Lương: 8-13 triệu/tháng</li><li>Phụ cấp độc hại, phụ cấp ca</li><li>BHYT, BHXH, BHTN đầy đủ</li><li>Trang bị bảo hộ lao động đầy đủ</li><li>Đào tạo chuyên môn và cấp chứng chỉ</li></ul>',
      location: 'Khu xử lý Long Phước, TP. HCM',
      salaryRange: '8 - 13 triệu/tháng + phụ cấp',
      status: 'OPEN' as const,
    },
  ];
  for (const j of jobs) await prisma.jobPosting.create({ data: j });

  // ── Investor Messages ────────────────────────────────
  await prisma.investorMessage.upsert({
    where: { type: 'CEO_MESSAGE' },
    update: {},
    create: {
      type: 'CEO_MESSAGE',
      titleVI: 'Thông điệp từ Tổng Giám đốc',
      titleEN: 'Message from the CEO',
      titleZH: '总裁致辞',
      contentVI: '<p>Kính gửi Quý cổ đông và đối tác,</p><p>Năm 2024 đánh dấu bước ngoặt quan trọng trong hành trình phát triển của LMX Alliance. Với doanh thu tăng trưởng 25% trong quý đầu năm và nhiều hợp đồng lớn được ký kết, chúng tôi tự tin vào khả năng hoàn thành và vượt mục tiêu năm.</p><p>LMX Alliance cam kết tiếp tục đầu tư vào công nghệ, con người và quy trình để không ngừng nâng cao chất lượng dịch vụ và tạo ra giá trị bền vững cho tất cả các bên liên quan.</p><p>Trân trọng,<br/>Trần Thị Lan Anh<br/>Tổng Giám đốc LMX Alliance</p>',
      contentEN: '<p>Dear Shareholders and Partners,</p><p>2024 marks an important milestone in LMX Alliance\'s development journey. With 25% revenue growth in Q1 and major contracts signed, we are confident in achieving and exceeding annual targets.</p><p>LMX Alliance remains committed to investing in technology, people, and processes to continuously improve service quality and create sustainable value for all stakeholders.</p><p>Sincerely,<br/>Tran Thi Lan Anh<br/>CEO, LMX Alliance</p>',
      contentZH: '<p>尊敬的股东和合作伙伴，</p><p>2024年是LMX联盟发展历程中的重要里程碑。第一季度营收增长25%，多个大型合同签署，我们对完成和超越年度目标充满信心。</p><p>陈兰英<br/>LMX联盟总裁</p>',
    },
  });

  await prisma.investorMessage.upsert({
    where: { type: 'CHAIRMAN_MESSAGE' },
    update: {},
    create: {
      type: 'CHAIRMAN_MESSAGE',
      titleVI: 'Thông điệp từ Chủ tịch HĐQT',
      titleEN: "Chairman's Message",
      titleZH: '董事长致辞',
      contentVI: '<p>Kính gửi Quý cổ đông,</p><p>LMX Alliance đang trên hành trình trở thành tập đoàn đa ngành hàng đầu khu vực, với sứ mệnh cốt lõi là đóng góp vào sự phát triển kinh tế xanh và bảo vệ môi trường cho thế hệ mai sau.</p><p>Chúng tôi không chỉ xây dựng công trình hay vận chuyển hàng hóa — chúng tôi đang xây dựng một tương lai bền vững hơn cho Việt Nam và khu vực Đông Nam Á.</p><p>Trân trọng,<br/>Nguyễn Văn Minh<br/>Chủ tịch HĐQT LMX Alliance</p>',
      contentEN: '<p>Dear Shareholders,</p><p>LMX Alliance is on a journey to become the region\'s leading diversified conglomerate, with a core mission of contributing to green economic development and environmental protection for future generations.</p><p>Nguyễn Văn Minh<br/>Chairman, LMX Alliance</p>',
      contentZH: '<p>尊敬的股东，</p><p>LMX联盟正在成为地区领先多元化集团的征程上，核心使命是为绿色经济发展和环境保护做出贡献。</p><p>阮文明<br/>LMX联盟董事长</p>',
    },
  });

  // ── Partners ─────────────────────────────────────────
  // Đối tác chiến lược duy nhất được nêu tên trên site cũ (lmxalliance.com).
  // Quản lý qua Admin > Partners; các đối tác khác thêm trực tiếp trong CMS.
  await prisma.partner.upsert({
    where: { id: 'hue-phuong-vn' },
    update: {},
    create: {
      id: 'hue-phuong-vn',
      nameVI: 'Công ty TNHH MTV Môi Trường Xanh Huê Phương VN',
      nameEN: 'Huê Phương VN Green Environment Co., Ltd.',
      nameZH: 'Huê Phương VN绿色环境有限公司',
      logo: '',
      website: '',
      descVI: 'Sự liên kết giữa LIÊN MINH XANH LMX và CÔNG TY TNHH MTV MÔI TRƯỜNG XANH HUÊ PHƯƠNG VN được xây dựng nhằm cung cấp giải pháp thu gom, vận chuyển và xử lý chất thải, đặc biệt là chất thải nguy hại, theo đúng quy định pháp luật và tiêu chuẩn môi trường. Thông qua sự phối hợp về nguồn lực và chuyên môn của hai đơn vị, quá trình quản lý và xử lý chất thải được thực hiện an toàn, hiệu quả và bền vững.',
      descEN: 'The partnership between LMX GREEN ALLIANCE and HUÊ PHƯƠNG VN GREEN ENVIRONMENT CO., LTD. was established to provide waste collection, transportation, and treatment solutions — especially hazardous waste — in full compliance with legal regulations and environmental standards. Through the coordination of resources and expertise between the two entities, waste management and treatment processes are carried out safely, efficiently, and sustainably.',
      descZH: 'LMX绿色联盟与Huê Phương VN绿色环境有限公司之间的合作关系旨在提供废物收集、运输和处理解决方案，特别是危险废物，完全符合法律法规和环境标准。通过两个单位资源和专业知识的协调配合，废物管理和处理过程安全、高效、可持续。',
      orderIndex: 0,
    },
  });

  // ── Projects ─────────────────────────────────────────
  await prisma.project.deleteMany();
  const projects = [
    {
      nameVI: 'Khu công nghiệp Bình Dương — Giai đoạn 1',
      nameEN: 'Binh Duong Industrial Park — Phase 1',
      nameZH: '平阳工业园区——第一期',
      descVI: 'Thi công hạ tầng kỹ thuật cho khu công nghiệp quy mô 50 hecta tại tỉnh Bình Dương, bao gồm đường nội bộ, hệ thống điện chiếu sáng, cấp thoát nước và các công trình phụ trợ. Tổng giá trị hợp đồng 500 tỷ đồng, dự kiến hoàn thành Q4/2026.',
      descEN: 'Technical infrastructure construction for a 50-hectare industrial park in Binh Duong province, including internal roads, lighting systems, water supply/drainage and supporting facilities. Contract value VND 500 billion, expected completion Q4/2026.',
      descZH: '平阳省50公顷工业园区技术基础设施建设，包括内部道路、照明系统、供排水及辅助设施。合同金额5000亿越南盾，预计2026年第四季度竣工。',
      images: [],
      status: 'ONGOING' as const,
    },
    {
      nameVI: 'Trung tâm Logistics Cát Lái, TP. HCM',
      nameEN: 'Cat Lai Logistics Center, Ho Chi Minh City',
      nameZH: '胡志明市猫莱物流中心',
      descVI: 'Xây dựng và vận hành trung tâm logistics hiện đại tại khu vực Cát Lái với diện tích kho bãi 15.000 m², năng lực xử lý 500 container/tháng. Dự án đã đi vào hoạt động từ Q1/2024 và phục vụ hơn 30 doanh nghiệp xuất nhập khẩu.',
      descEN: 'Construction and operation of a modern logistics center in Cat Lai area with 15,000 m² warehouse space, capacity to handle 500 containers/month. The project has been operational since Q1/2024, serving over 30 import-export businesses.',
      descZH: '在猫莱地区建设和运营现代化物流中心，仓储面积15,000平方米，处理能力500个集装箱/月。该项目自2024年第一季度投入运营，服务30余家进出口企业。',
      images: [],
      status: 'COMPLETED' as const,
    },
    {
      nameVI: 'Nhà máy xử lý chất thải công nghiệp Long Phước',
      nameEN: 'Long Phuoc Industrial Waste Treatment Plant',
      nameZH: '龙福工业废物处理厂',
      descVI: 'Đầu tư và vận hành nhà máy xử lý chất thải công nghiệp với công suất 200 tấn/ngày tại khu Long Phước, TP. HCM. Ứng dụng công nghệ xử lý hiện đại, đạt tiêu chuẩn ISO 14001:2015 và QCVN về bảo vệ môi trường.',
      descEN: 'Investment and operation of an industrial waste treatment plant with a capacity of 200 tons/day at Long Phuoc, Ho Chi Minh City. Applying modern treatment technology, certified ISO 14001:2015 and Vietnamese environmental standards.',
      descZH: '投资并运营胡志明市龙福工业废物处理厂，处理能力200吨/天。采用现代处理技术，通过ISO 14001:2015认证及越南环保标准。',
      images: [],
      status: 'ONGOING' as const,
    },
  ];
  for (const p of projects) await prisma.project.create({ data: p });

  console.log('✅ Seed completed — admin@lmxalliance.com / Admin@123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
