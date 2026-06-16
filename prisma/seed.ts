import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Super admin user
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@lmxalliance.com' },
    update: {},
    create: {
      email: 'admin@lmxalliance.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // Company settings
  await prisma.companySettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      name: 'CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX',
      tagline: 'Phát triển bền vững - Tạo giá trị lâu dài',
      description: 'Công ty Cổ phần Liên Minh Xanh LMX là tập đoàn đa ngành hàng đầu, hoạt động trong các lĩnh vực xây lắp công trình, logistics & xuất nhập khẩu, và xử lý phế liệu & chất thải.',
      address: 'Số 104 Đường Lò Lu, Phường Long Phước, Thành phố Hồ Chí Minh',
      phone: '0931.824.025 / 0937.798.377',
      email: 'Ops@lmxalliance.com',
      website: 'https://lmxalliance.com',
      googleMapEmbed: '',
      seoMetaTitle: 'LMX Alliance - Công ty Cổ phần Liên Minh Xanh',
      seoMetaDesc: 'LMX Alliance - Tập đoàn đa ngành hàng đầu Việt Nam trong lĩnh vực xây lắp, logistics và xử lý chất thải.',
      seoOgImage: '',
      seoKeywords: 'LMX Alliance, Liên Minh Xanh, xây lắp, logistics, phế liệu',
      facebookUrl: null,
      linkedinUrl: null,
      youtubeUrl: null,
      tiktokUrl: null,
    },
  });

  // Homepage
  await prisma.homePage.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      heroTitleVI: 'Xây dựng tương lai\nbền vững cùng LMX Alliance',
      heroTitleEN: 'Building a Sustainable\nFuture with LMX Alliance',
      heroTitleZH: '与LMX联盟共建\n可持续未来',
      heroDescVI: 'Tập đoàn đa ngành hàng đầu với hơn 10 năm kinh nghiệm trong xây lắp công trình, logistics và xử lý chất thải.',
      heroDescEN: 'A leading diversified conglomerate with over 10 years of experience in construction, logistics, and waste management.',
      heroDescZH: '领先的多元化集团，在建筑、物流和废物管理领域拥有10多年经验。',
      heroCTA: 'Khám phá thêm',
      heroImage: '',
    },
  });

  // Statistics
  const stats = [
    { valueVI: '10+', valueEN: '10+', valueZH: '10+', labelVI: 'Năm kinh nghiệm', labelEN: 'Years Experience', labelZH: '年经验', orderIndex: 0 },
    { valueVI: '3', valueEN: '3', valueZH: '3', labelVI: 'Lĩnh vực kinh doanh', labelEN: 'Business Segments', labelZH: '业务板块', orderIndex: 1 },
    { valueVI: '50+', valueEN: '50+', valueZH: '50+', labelVI: 'Đối tác chiến lược', labelEN: 'Strategic Partners', labelZH: '战略合作伙伴', orderIndex: 2 },
    { valueVI: '100+', valueEN: '100+', valueZH: '100+', labelVI: 'Dự án hoàn thành', labelEN: 'Projects Completed', labelZH: '完成项目', orderIndex: 3 },
  ];
  for (const stat of stats) {
    await prisma.statistic.create({ data: stat });
  }

  // Business sectors
  const sectors = [
    {
      slug: 'xay-lap-cong-trinh',
      nameVI: 'Xây lắp công trình dân dụng và công nghiệp',
      nameEN: 'Construction & Infrastructure',
      nameZH: '民用及工业建筑施工',
      summaryVI: 'Chuyên thi công các công trình dân dụng, công nghiệp với tiêu chuẩn chất lượng cao.',
      summaryEN: 'Specializing in civil and industrial construction with high quality standards.',
      summaryZH: '专业从事民用和工业建筑施工，质量标准高。',
      contentVI: '<p>LMX Alliance có đội ngũ kỹ sư và công nhân lành nghề, trang thiết bị hiện đại, đảm bảo tiến độ và chất lượng công trình.</p>',
      contentEN: '<p>LMX Alliance has a team of skilled engineers and workers, modern equipment, ensuring project schedule and quality.</p>',
      contentZH: '<p>LMX联盟拥有熟练的工程师和工人团队、现代化设备，确保工程进度和质量。</p>',
      banner: '',
      thumbnail: '',
      gallery: [],
      seoTitleVI: 'Xây lắp công trình - LMX Alliance',
      seoDescVI: 'Dịch vụ xây lắp công trình dân dụng và công nghiệp chất lượng cao từ LMX Alliance.',
      status: 'PUBLISHED' as const,
      orderIndex: 0,
    },
    {
      slug: 'logistics-xuat-nhap-khau',
      nameVI: 'Logistics & Xuất nhập khẩu',
      nameEN: 'Logistics & Import-Export',
      nameZH: '物流及进出口',
      summaryVI: 'Cung cấp giải pháp logistics toàn diện và dịch vụ xuất nhập khẩu chuyên nghiệp.',
      summaryEN: 'Providing comprehensive logistics solutions and professional import-export services.',
      summaryZH: '提供全面的物流解决方案和专业的进出口服务。',
      contentVI: '<p>Với mạng lưới đối tác rộng lớn, LMX Alliance cung cấp dịch vụ logistics và xuất nhập khẩu hiệu quả, tối ưu chi phí cho doanh nghiệp.</p>',
      contentEN: '<p>With an extensive partner network, LMX Alliance provides efficient logistics and import-export services, optimizing costs for businesses.</p>',
      contentZH: '<p>凭借广泛的合作伙伴网络，LMX联盟为企业提供高效的物流和进出口服务，优化成本。</p>',
      banner: '',
      thumbnail: '',
      gallery: [],
      seoTitleVI: 'Logistics & Xuất nhập khẩu - LMX Alliance',
      seoDescVI: 'Dịch vụ logistics và xuất nhập khẩu chuyên nghiệp từ LMX Alliance.',
      status: 'PUBLISHED' as const,
      orderIndex: 1,
    },
    {
      slug: 'phe-lieu-xu-ly-chat-thai',
      nameVI: 'Phế liệu & Xử lý chất thải',
      nameEN: 'Waste Management & Trading',
      nameZH: '废料回收及废物处理',
      summaryVI: 'Thu mua phế liệu và xử lý chất thải công nghiệp theo tiêu chuẩn môi trường.',
      summaryEN: 'Scrap trading and industrial waste treatment according to environmental standards.',
      summaryZH: '按照环保标准进行废料收购和工业废物处理。',
      contentVI: '<p>LMX Alliance cam kết xử lý chất thải và phế liệu theo quy trình chuyên nghiệp, đảm bảo an toàn môi trường và tuân thủ quy định pháp luật.</p>',
      contentEN: '<p>LMX Alliance is committed to processing waste and scrap materials professionally, ensuring environmental safety and legal compliance.</p>',
      contentZH: '<p>LMX联盟致力于专业处理废物和废料，确保环境安全和法律合规。</p>',
      banner: '',
      thumbnail: '',
      gallery: [],
      seoTitleVI: 'Phế liệu & Xử lý chất thải - LMX Alliance',
      seoDescVI: 'Dịch vụ thu mua phế liệu và xử lý chất thải công nghiệp từ LMX Alliance.',
      status: 'PUBLISHED' as const,
      orderIndex: 2,
    },
  ];
  for (const sector of sectors) {
    await prisma.businessSector.create({ data: sector });
  }

  // Investor messages
  await prisma.investorMessage.upsert({
    where: { type: 'CEO_MESSAGE' },
    update: {},
    create: {
      type: 'CEO_MESSAGE',
      titleVI: 'Thông điệp từ Tổng Giám đốc',
      titleEN: 'Message from CEO',
      titleZH: '总裁致辞',
      contentVI: '<p>Kính gửi Quý cổ đông và đối tác, LMX Alliance cam kết phát triển bền vững, tạo ra giá trị lâu dài cho tất cả các bên liên quan.</p>',
      contentEN: '<p>Dear shareholders and partners, LMX Alliance is committed to sustainable development, creating long-term value for all stakeholders.</p>',
      contentZH: '<p>尊敬的股东和合作伙伴，LMX联盟致力于可持续发展，为所有利益相关者创造长期价值。</p>',
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
      contentVI: '<p>LMX Alliance đang trên hành trình trở thành tập đoàn đa ngành hàng đầu, với sứ mệnh đóng góp vào sự phát triển kinh tế và bảo vệ môi trường.</p>',
      contentEN: '<p>LMX Alliance is on a journey to become a leading diversified conglomerate, with a mission to contribute to economic development and environmental protection.</p>',
      contentZH: '<p>LMX联盟正在成为领先多元化集团的征程上，使命是为经济发展和环境保护做出贡献。</p>',
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
