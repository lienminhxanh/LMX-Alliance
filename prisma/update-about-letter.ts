import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ⚠️ ONE-TIME UPDATE — executed 2026-07-09, do NOT re-run. ⚠️
//
// Purpose: replaces the placeholder aboutLetter* text seeded by
// backfill-about-content.ts with the customer-supplied, authoritative
// "Thư ngỏ" (Open Letter) content for the About page Section 2. VI text is
// the customer's own wording (reordered from a jumbled paste into
// greeting → founding context → business lines → closing commitment, no
// paraphrasing); EN/ZH are translations of that VI text.
//
// Re-running this script will OVERWRITE any About-page letter content
// edited since via the admin form (Settings → Company → "About Page
// Content"). Kept in the repo only as a record of this update — do not
// wire it into `npm run` scripts or CI.
async function main() {
  const letterData = {
    aboutLetterVI:
      'Kính gửi Quý Khách hàng và Quý Đối tác, CÔNG TY CỔ PHẦN LIÊN MINH XANH LMX xin trân trọng gửi tới Quý Khách hàng và Quý Đối tác lời chào trân trọng, lời chúc sức khỏe.\n\nTrong bối cảnh yêu cầu về quản lý môi trường, an toàn chất thải và phát triển kinh tế xanh ngày càng được chú trọng, Công ty Cổ phần Liên Minh Xanh (LMX) được thành lập với định hướng trở thành doanh nghiệp đa lĩnh vực, cung cấp giải pháp toàn diện – hiệu quả – minh bạch, tuân thủ nghiêm ngặt các quy định pháp luật, góp phần bảo vệ môi trường và tạo giá trị bền vững cho cộng đồng.\n\nLiên Minh Xanh (LMX) hiện đang hoạt động trong các lĩnh vực chính:\n- Xuất nhập khẩu, giao nhận – vận tải hàng hóa.\n- Thi công xây lắp công trình dân dụng và công nghiệp\n- Thu mua và kinh doanh phế liệu\n- Liên kết với Công ty TNHH MTV Môi Trường Xanh Huê Phương VN trong xử lý chất thải nguy hại\n\nVới định hướng phát triển bền vững, LMX cam kết mang đến giải pháp dịch vụ đồng bộ, an toàn và hiệu quả, đáp ứng tối đa nhu cầu của khách hàng và đối tác, đồng thời đóng góp tích cực vào mục tiêu phát triển kinh tế xanh và bảo vệ môi trường.',
    aboutLetterEN:
      'Dear Valued Clients and Partners, LMX Green Alliance Joint Stock Company would like to extend our sincere greetings and best wishes for your good health.\n\nIn the context of increasing demands for environmental management, waste safety, and green economic development, LMX Green Alliance Joint Stock Company (LMX) was established with the orientation of becoming a multi-sector enterprise, providing comprehensive – efficient – transparent solutions, strictly complying with legal regulations, contributing to environmental protection and creating sustainable value for the community.\n\nLMX Green Alliance is currently operating in the following main business lines:\n- Import-export, freight forwarding and cargo transportation.\n- Construction of civil and industrial works\n- Purchase and trading of scrap materials\n- Partnership with Hue Phuong VN Green Environment Co., Ltd. in hazardous waste treatment\n\nWith a sustainable development orientation, LMX is committed to delivering synchronized, safe and effective service solutions, maximally meeting the needs of clients and partners, while actively contributing to the goals of green economic development and environmental protection.',
    aboutLetterZH:
      '尊敬的客户与合作伙伴：绿色联盟股份公司（LMX）谨向贵客户与合作伙伴致以诚挚的问候与健康祝愿。\n\n在环境管理、废物安全和绿色经济发展要求日益受到重视的背景下，绿色联盟股份公司（LMX）应运而生，致力于成为多元化企业，提供全面、高效、透明的解决方案，严格遵守法律法规，为环境保护和社区可持续发展做出贡献。\n\n绿色联盟（LMX）目前主要经营以下业务领域：\n- 进出口、货运代理与货物运输\n- 民用与工业工程施工\n- 废料收购与经营\n- 与惠芳绿色环境有限公司（Huê Phương VN）合作处理危险废物\n\n秉持可持续发展方向，LMX致力于提供同步、安全、高效的服务解决方案，最大程度满足客户和合作伙伴的需求，同时积极为绿色经济发展和环境保护目标做出贡献。',
  };

  const existing = await prisma.companySettings.findUnique({ where: { id: 'singleton' } });

  if (!existing) {
    console.log('No CompanySettings singleton row found — skipping update.');
    return;
  }

  await prisma.companySettings.update({
    where: { id: 'singleton' },
    data: letterData,
  });

  console.log('Updated aboutLetterVI/EN/ZH on CompanySettings singleton.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
