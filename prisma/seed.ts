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
  await prisma.companySettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX',
      tagline: 'Giải pháp toàn diện cho doanh nghiệp trong kỷ nguyên kinh tế xanh',
      description: 'Công ty Cổ phần Liên Minh Xanh LMX là tập đoàn đa ngành hàng đầu, hoạt động trong các lĩnh vực xây lắp công trình, logistics & xuất nhập khẩu, và xử lý phế liệu & chất thải. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang lại giải pháp chất lượng, bền vững và thân thiện với môi trường.',
      address: 'Số 104 Đường Lò Lu, Phường Long Phước, Thành phố Hồ Chí Minh',
      phone: '0931.824.025 / 0937.798.377',
      email: 'Ops@lmxalliance.com',
      website: 'https://lmxalliance.com',
      googleMapEmbed: '',
      seoMetaTitle: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
      seoMetaDesc: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam trong lĩnh vực xây lắp, logistics và xử lý chất thải.',
      seoOgImage: '',
      seoKeywords: 'LMX Alliance, Liên Minh Xanh, xây lắp, logistics, phế liệu, chất thải',
      facebookUrl: null, linkedinUrl: null, youtubeUrl: null, tiktokUrl: null,
    },
  });

  // ── Homepage ─────────────────────────────────────────
  await prisma.homePage.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitleVI: 'Xây dựng tương lai\nbền vững cùng LMX Alliance',
      heroTitleEN: 'Building a Sustainable\nFuture with LMX Alliance',
      heroTitleZH: '与LMX联盟共建\n可持续未来',
      heroDescVI: 'Tập đoàn đa ngành hàng đầu với hơn 10 năm kinh nghiệm trong xây lắp công trình, logistics và xử lý chất thải. Giải pháp toàn diện cho kỷ nguyên kinh tế xanh.',
      heroDescEN: 'A leading diversified conglomerate with over 10 years of experience in construction, logistics, and waste management. Comprehensive solutions for the green economy era.',
      heroDescZH: '领先的多元化集团，在建筑、物流和废物管理领域拥有10多年经验。绿色经济时代的综合解决方案。',
      heroCTA: 'Khám phá thêm',
      heroImage: '',
    },
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
      banner: '', thumbnail: '', gallery: [],
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
      banner: '', thumbnail: '', gallery: [],
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
      banner: '', thumbnail: '', gallery: [],
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

  // ── News Articles ────────────────────────────────────
  await prisma.newsArticle.deleteMany();
  const articles = [
    {
      titleVI: 'LMX Alliance ký kết hợp đồng xây dựng khu công nghiệp 50ha tại Bình Dương',
      titleEN: 'LMX Alliance Signs 50-Hectare Industrial Park Construction Contract in Binh Duong',
      titleZH: 'LMX联盟与平阳省签署50公顷工业园区建设合同',
      slugVI: 'lmx-alliance-ky-ket-hop-dong-khu-cong-nghiep-binh-duong',
      slugEN: 'lmx-alliance-signs-industrial-park-contract-binh-duong',
      slugZH: 'lmx-lian-meng-qian-shu-gong-ye-yuan-qu-he-tong',
      summaryVI: 'LMX Alliance vừa chính thức ký kết hợp đồng thi công khu công nghiệp quy mô 50 hecta tại tỉnh Bình Dương, đánh dấu bước phát triển quan trọng trong lĩnh vực xây lắp công nghiệp.',
      summaryEN: 'LMX Alliance has officially signed a contract for the construction of a 50-hectare industrial park in Binh Duong province, marking a significant milestone in industrial construction.',
      summaryZH: 'LMX联盟正式签署了在平阳省建设50公顷工业园区的合同，标志着工业建设领域的重要里程碑。',
      contentVI: '<p>Ngày 15/05/2024, Công ty Cổ phần Liên Minh Xanh LMX đã ký kết thành công hợp đồng xây dựng khu công nghiệp Bình Dương với tổng diện tích 50 hecta.</p><p>Dự án sẽ được triển khai trong vòng 24 tháng với tổng vốn đầu tư lên đến 500 tỷ đồng, bao gồm hạ tầng kỹ thuật, đường nội bộ, hệ thống điện nước và các công trình phụ trợ.</p><p>Đây là hợp đồng lớn nhất trong lịch sử hoạt động của LMX Alliance, khẳng định vị thế và năng lực của công ty trong lĩnh vực xây lắp công nghiệp quy mô lớn.</p>',
      contentEN: '<p>On May 15, 2024, LMX Alliance successfully signed a construction contract for an industrial park in Binh Duong with a total area of 50 hectares.</p><p>The project will be implemented over 24 months with a total investment of VND 500 billion, including technical infrastructure, internal roads, and supporting facilities.</p>',
      contentZH: '<p>2024年5月15日，LMX联盟成功签署了平阳省50公顷工业园区建设合同。</p>',
      thumbnail: '',
      category: 'COMPANY_NEWS' as const,
      author: 'Ban Truyền thông LMX',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-05-16'),
    },
    {
      titleVI: 'Giải pháp logistics xanh: LMX Alliance tiên phong sử dụng xe điện trong vận chuyển',
      titleEN: 'Green Logistics: LMX Alliance Pioneers Electric Vehicle Freight Transport',
      titleZH: '绿色物流：LMX联盟率先使用电动车辆运输',
      slugVI: 'logistics-xanh-lmx-alliance-xe-dien-van-chuyen',
      slugEN: 'green-logistics-lmx-alliance-electric-vehicle-freight',
      slugZH: 'lv-se-wu-liu-lmx-dian-dong-che-liang',
      summaryVI: 'Nhằm giảm phát thải carbon và hướng đến mục tiêu Net Zero 2050, LMX Alliance đã đưa vào vận hành đội xe tải điện đầu tiên trong hoạt động logistics nội địa.',
      summaryEN: 'To reduce carbon emissions and achieve Net Zero 2050, LMX Alliance has put into operation its first fleet of electric trucks for domestic logistics.',
      summaryZH: '为了减少碳排放并实现2050年净零目标，LMX联盟已将首批电动卡车投入国内物流运营。',
      contentVI: '<p>LMX Alliance vừa ra mắt đội xe tải điện gồm 20 chiếc để phục vụ vận chuyển hàng hóa trong khu vực TP. Hồ Chí Minh và các tỉnh lân cận.</p><p>Bước đi này nằm trong chiến lược phát triển bền vững của công ty, với mục tiêu giảm 50% lượng phát thải CO2 vào năm 2027.</p>',
      contentEN: '<p>LMX Alliance has launched a fleet of 20 electric trucks for freight transport in Ho Chi Minh City and neighboring provinces.</p><p>This move is part of the company\'s sustainable development strategy, aiming to reduce CO2 emissions by 50% by 2027.</p>',
      contentZH: '<p>LMX联盟推出了20辆电动卡车用于胡志明市及周边省份的货物运输。</p>',
      thumbnail: '',
      category: 'SUSTAINABILITY' as const,
      author: 'Phòng Phát triển Bền vững',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-04-22'),
    },
    {
      titleVI: 'LMX Alliance đạt chứng nhận ISO 14001:2015 cho toàn bộ mảng xử lý chất thải',
      titleEN: 'LMX Alliance Achieves ISO 14001:2015 Certification for Entire Waste Management Division',
      titleZH: 'LMX联盟废物管理部门获得ISO 14001:2015认证',
      slugVI: 'lmx-alliance-dat-chung-nhan-iso-14001-xu-ly-chat-thai',
      slugEN: 'lmx-alliance-iso-14001-2015-waste-management-certification',
      slugZH: 'lmx-lian-meng-huo-de-iso-14001-ren-zheng',
      summaryVI: 'Sau quá trình đánh giá nghiêm ngặt, LMX Alliance đã nhận được chứng nhận ISO 14001:2015 cho toàn bộ hoạt động xử lý phế liệu và chất thải, khẳng định cam kết bảo vệ môi trường.',
      summaryEN: 'After a rigorous evaluation, LMX Alliance received ISO 14001:2015 certification for all scrap and waste management operations, affirming its environmental commitment.',
      summaryZH: '经过严格评估后，LMX联盟获得了ISO 14001:2015认证，适用于全部废料和废物管理业务。',
      contentVI: '<p>Vào tháng 3/2024, Tổ chức chứng nhận quốc tế Bureau Veritas đã cấp chứng chỉ ISO 14001:2015 cho LMX Alliance sau quá trình đánh giá kéo dài 6 tháng.</p><p>Chứng nhận này xác nhận hệ thống quản lý môi trường của LMX Alliance đáp ứng tiêu chuẩn quốc tế cao nhất trong lĩnh vực xử lý chất thải và bảo vệ môi trường.</p>',
      contentEN: '<p>In March 2024, Bureau Veritas awarded LMX Alliance the ISO 14001:2015 certification after a 6-month evaluation process.</p>',
      contentZH: '<p>2024年3月，必维国际检验集团经过6个月的评估后，向LMX联盟颁发了ISO 14001:2015认证。</p>',
      thumbnail: '',
      category: 'SUSTAINABILITY' as const,
      author: 'Phòng Quản lý Chất lượng',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-03-28'),
    },
    {
      titleVI: 'Thông báo tuyển dụng: LMX Alliance mở rộng đội ngũ với 30 vị trí mới trong Q3/2024',
      titleEN: 'Recruitment Notice: LMX Alliance Expands Team with 30 New Positions in Q3/2024',
      titleZH: '招聘通知：LMX联盟2024年第三季度新增30个职位',
      slugVI: 'tuyen-dung-lmx-alliance-30-vi-tri-q3-2024',
      slugEN: 'recruitment-lmx-alliance-30-positions-q3-2024',
      slugZH: 'zhao-pin-lmx-lian-meng-30-ge-zhi-wei-2024',
      summaryVI: 'LMX Alliance thông báo mở rộng đội ngũ với 30 vị trí tuyển dụng mới trong quý 3/2024, bao gồm các vị trí kỹ thuật, quản lý và kinh doanh.',
      summaryEN: 'LMX Alliance announces expansion with 30 new recruitment positions in Q3/2024, including technical, management, and business roles.',
      summaryZH: 'LMX联盟宣布在2024年第三季度新增30个招聘职位，包括技术、管理和业务岗位。',
      contentVI: '<p>Trong khuôn khổ kế hoạch mở rộng hoạt động kinh doanh năm 2024, LMX Alliance cần tuyển dụng 30 nhân sự mới cho các phòng ban:</p><ul><li>Kỹ sư xây dựng: 10 vị trí</li><li>Chuyên viên logistics: 8 vị trí</li><li>Kỹ thuật viên môi trường: 5 vị trí</li><li>Nhân viên kinh doanh: 7 vị trí</li></ul>',
      contentEN: '<p>As part of the 2024 business expansion plan, LMX Alliance needs to recruit 30 new staff across departments.</p>',
      contentZH: '<p>作为2024年业务扩张计划的一部分，LMX联盟需要在各部门招募30名新员工。</p>',
      thumbnail: '',
      category: 'RECRUITMENT' as const,
      author: 'Phòng Nhân sự',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-06-01'),
    },
    {
      titleVI: 'LMX Alliance tham dự Diễn đàn Kinh tế Xanh Việt Nam 2024',
      titleEN: 'LMX Alliance Participates in Vietnam Green Economy Forum 2024',
      titleZH: 'LMX联盟参加2024年越南绿色经济论坛',
      slugVI: 'lmx-alliance-tham-du-dien-dan-kinh-te-xanh-viet-nam-2024',
      slugEN: 'lmx-alliance-vietnam-green-economy-forum-2024',
      slugZH: 'lmx-lian-meng-can-jia-2024-nian-lv-se-jing-ji-lun-tan',
      summaryVI: 'LMX Alliance đã tham dự và trình bày tại Diễn đàn Kinh tế Xanh Việt Nam 2024, chia sẻ kinh nghiệm và mô hình phát triển bền vững trong ngành công nghiệp.',
      summaryEN: 'LMX Alliance attended and presented at the Vietnam Green Economy Forum 2024, sharing experience and sustainable development models in industry.',
      summaryZH: 'LMX联盟出席并在2024年越南绿色经济论坛上发表演讲，分享工业领域的经验和可持续发展模式。',
      contentVI: '<p>Diễn ra vào ngày 10-11/04/2024 tại TP. Hồ Chí Minh, Diễn đàn Kinh tế Xanh Việt Nam 2024 quy tụ hơn 500 doanh nghiệp và chuyên gia hàng đầu.</p><p>Đại diện LMX Alliance đã có bài trình bày về "Mô hình kinh tế tuần hoàn trong xử lý phế liệu và chất thải công nghiệp", nhận được sự quan tâm đặc biệt từ cộng đồng doanh nghiệp.</p>',
      contentEN: '<p>Held on April 10-11, 2024 in Ho Chi Minh City, the Vietnam Green Economy Forum 2024 gathered over 500 leading enterprises and experts.</p>',
      contentZH: '<p>2024年越南绿色经济论坛于4月10-11日在胡志明市举行，汇聚了500多家领先企业和专家。</p>',
      thumbnail: '',
      category: 'COMPANY_NEWS' as const,
      author: 'Ban Truyền thông LMX',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-04-12'),
    },
    {
      titleVI: 'Báo cáo tài chính Q1/2024: Doanh thu tăng trưởng 25% so với cùng kỳ',
      titleEN: 'Q1/2024 Financial Report: Revenue Growth of 25% Year-over-Year',
      titleZH: '2024年第一季度财务报告：营收同比增长25%',
      slugVI: 'bao-cao-tai-chinh-q1-2024-doanh-thu-tang-truong-25-phan-tram',
      slugEN: 'q1-2024-financial-report-25-percent-revenue-growth',
      slugZH: '2024-q1-cai-wu-bao-gao-ying-shou-zeng-zhang-25',
      summaryVI: 'LMX Alliance công bố kết quả kinh doanh quý 1/2024 với doanh thu đạt 180 tỷ đồng, tăng 25% so với cùng kỳ năm ngoái, vượt kế hoạch đề ra.',
      summaryEN: 'LMX Alliance announces Q1/2024 business results with revenue reaching VND 180 billion, up 25% year-over-year, exceeding the plan.',
      summaryZH: 'LMX联盟公布2024年第一季度业绩，营收达1800亿越南盾，同比增长25%，超额完成计划。',
      contentVI: '<p>Trong quý 1/2024, LMX Alliance đạt doanh thu 180 tỷ đồng, tăng trưởng 25% so với cùng kỳ năm 2023. Lợi nhuận sau thuế đạt 18 tỷ đồng, tăng 30%.</p><p>Mảng xây lắp công trình đóng góp 55% doanh thu, logistics 30% và xử lý chất thải 15%.</p><p>Ban lãnh đạo công ty kỳ vọng cả năm 2024 sẽ đạt doanh thu 750 tỷ đồng với mức tăng trưởng 20%.</p>',
      contentEN: '<p>In Q1/2024, LMX Alliance achieved revenue of VND 180 billion, 25% growth year-over-year. After-tax profit reached VND 18 billion, up 30%.</p>',
      contentZH: '<p>2024年第一季度，LMX联盟实现营收1800亿越南盾，同比增长25%。税后利润达180亿越南盾，增长30%。</p>',
      thumbnail: '',
      category: 'INVESTOR_RELATIONS' as const,
      author: 'Phòng Tài chính - Kế toán',
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2024-04-30'),
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
  await prisma.partner.deleteMany();
  const partnerData = [
    { nameVI: 'Tập đoàn Vingroup', nameEN: 'Vingroup Corporation', nameZH: 'Vingroup集团', logo: '', website: 'https://vingroup.net', descVI: 'Tập đoàn đa ngành lớn nhất Việt Nam', descEN: 'Vietnam largest diversified corporation', descZH: '越南最大多元化集团', orderIndex: 1 },
    { nameVI: 'CTCP Xây dựng Hòa Bình', nameEN: 'Hoa Binh Construction', nameZH: '和平建设股份公司', logo: '', website: 'https://hbc.vn', descVI: 'Công ty xây dựng hàng đầu Việt Nam', descEN: 'Leading construction company in Vietnam', descZH: '越南领先建筑公司', orderIndex: 2 },
    { nameVI: 'Tổng Công ty Tân Cảng Sài Gòn', nameEN: 'Saigon Newport Corporation', nameZH: '西贡新港总公司', logo: '', website: 'https://snp.com.vn', descVI: 'Cảng container lớn nhất Việt Nam', descEN: 'Largest container port in Vietnam', descZH: '越南最大集装箱港口', orderIndex: 3 },
    { nameVI: 'Gemadept Corporation', nameEN: 'Gemadept Corporation', nameZH: 'Gemadept公司', logo: '', website: 'https://gemadept.com.vn', descVI: 'Tập đoàn logistics và cảng biển', descEN: 'Logistics and seaport group', descZH: '物流和港口集团', orderIndex: 4 },
    { nameVI: 'CTCP Môi trường Đô thị Hà Nội', nameEN: 'Hanoi Urban Environment JSC', nameZH: '河内城市环境股份公司', logo: '', website: 'https://urenco.com.vn', descVI: 'Đối tác xử lý chất thải đô thị', descEN: 'Urban waste management partner', descZH: '城市废物管理合作伙伴', orderIndex: 5 },
    { nameVI: 'Công ty TNHH Samsung Vina', nameEN: 'Samsung Vina Electronics', nameZH: '三星越南电子有限公司', logo: '', website: 'https://samsung.com', descVI: 'Đối tác logistics chuỗi cung ứng', descEN: 'Supply chain logistics partner', descZH: '供应链物流合作伙伴', orderIndex: 6 },
    { nameVI: 'CTCP Đầu tư Hạ tầng Kỹ thuật TP.HCM', nameEN: 'HCMC Technical Infrastructure Investment', nameZH: '胡志明市技术基础设施投资股份公司', logo: '', website: 'https://cia.com.vn', descVI: 'Đối tác hạ tầng và xây lắp', descEN: 'Infrastructure and construction partner', descZH: '基础设施和建设合作伙伴', orderIndex: 7 },
    { nameVI: 'Schenker Vietnam', nameEN: 'Schenker Vietnam', nameZH: '申克越南', logo: '', website: 'https://dbschenker.com', descVI: 'Đối tác vận tải quốc tế', descEN: 'International freight partner', descZH: '国际货运合作伙伴', orderIndex: 8 },
  ];
  for (const p of partnerData) await prisma.partner.create({ data: p });

  console.log('✅ Seed completed — admin@lmxalliance.com / Admin@123456');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
