import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// One-time backfill: seeds the new About-page CMS fields on CompanySettings
// with the text that was previously hardcoded in about/page.tsx, so Section 1
// (intro) and Section 2 (open letter) aren't empty right after migration.
// Uses upsert so it's safe whether or not the singleton row already exists.
async function main() {
  const aboutData = {
    aboutIntroVI:
      'Trong bối cảnh yêu cầu về quản lý môi trường, an toàn chất thải và phát triển kinh tế xanh ngày càng được chú trọng, Công ty Cổ phần Liên Minh Xanh (LMX) được thành lập với định hướng trở thành doanh nghiệp đa lĩnh vực, cung cấp giải pháp toàn diện – hiệu quả – minh bạch, tuân thủ nghiêm ngặt các quy định pháp luật, góp phần bảo vệ môi trường và tạo giá trị bền vững cho cộng đồng.\n\nVới định hướng phát triển bền vững, LMX cam kết mang đến giải pháp dịch vụ đồng bộ, an toàn và hiệu quả, đáp ứng tối đa nhu cầu của khách hàng và đối tác, đồng thời đóng góp tích cực vào mục tiêu phát triển kinh tế xanh và bảo vệ môi trường.',
    aboutIntroEN:
      'In the context of increasing demands for environmental management, waste safety, and green economic development, LMX Green Alliance Joint Stock Company was founded with the mission of becoming a multi-sector enterprise providing comprehensive, efficient, and transparent solutions — strictly complying with legal regulations, contributing to environmental protection and creating sustainable value for the community.\n\nWith a sustainable development orientation, LMX is committed to delivering synchronous, safe and effective service solutions, maximally meeting the needs of clients and partners, while positively contributing to the green economic development and environmental protection goals.',
    aboutIntroZH:
      '在环境管理、废物安全和绿色经济发展要求日益受到重视的背景下，LMX绿色联盟股份公司成立，旨在成为多元化企业，提供全面、高效、透明的解决方案，严格遵守法律法规，为环境保护和社区可持续发展做出贡献。\n\n秉持可持续发展方向，LMX致力于提供同步、安全、高效的服务解决方案，最大程度满足客户和合作伙伴的需求，同时积极为绿色经济发展和环境保护目标做出贡献。',

    aboutLetterTitleVI: 'Kính gửi Quý Khách hàng & Đối tác',
    aboutLetterTitleEN: 'Dear Clients & Partners',
    aboutLetterTitleZH: '尊敬的客户与合作伙伴',

    aboutLetterVI:
      'Trân trọng cảm ơn Quý Khách hàng và Quý Đối tác đã tin tưởng và đồng hành cùng Công ty. Sự hợp tác của Quý vị là nền tảng để LMX không ngừng nâng cao chất lượng dịch vụ và phát triển các giải pháp an toàn, hiệu quả và bền vững.',
    aboutLetterEN:
      'We sincerely thank our clients and partners for their trust and companionship. Your cooperation is the foundation for LMX to continuously improve service quality and develop safe, effective, and sustainable solutions.',
    aboutLetterZH:
      '衷心感谢贵客户和合作伙伴的信任与陪伴。您的合作是LMX不断提升服务质量、发展安全、高效、可持续解决方案的基础。',

    aboutLetterSignerVI: 'Ban Lãnh đạo Công ty Cổ phần Liên Minh Xanh LMX',
    aboutLetterSignerEN: 'Board of Management, LMX Green Alliance JSC',
    aboutLetterSignerZH: 'LMX绿色联盟股份公司董事会',
  };

  const existing = await prisma.companySettings.findUnique({ where: { id: 'singleton' } });

  if (!existing) {
    console.log('No CompanySettings singleton row found — skipping backfill (nothing to fill in yet; the admin form will create the row on first save).');
    return;
  }

  await prisma.companySettings.update({
    where: { id: 'singleton' },
    data: aboutData,
  });

  console.log('Backfilled About-page content onto CompanySettings singleton.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
