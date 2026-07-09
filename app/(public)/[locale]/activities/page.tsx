import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildMeta } from '@/lib/seo';
import { AnimateIn } from '@/components/ui/AnimateIn';
import { LeafDecor } from '@/components/ui/LeafDecor';
import Image from 'next/image';
import ActivitiesClient from './ActivitiesClient';

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    vi: 'Hoạt động doanh nghiệp',
    en: 'Business Activities',
    zh: '企业活动',
  };
  const descs: Record<string, string> = {
    vi: 'Tổng quan các hoạt động kinh doanh của LMX Alliance — logistics, xây dựng, phế liệu và phát triển bền vững.',
    en: 'Overview of LMX Alliance business activities — logistics, construction, scrap and sustainable development.',
    zh: 'LMX Alliance业务活动概览 — 物流、建筑、废料 and 可持续 phát triển.',
  };
  return buildMeta({
    locale,
    title: titles[locale] ?? titles.vi,
    description: descs[locale] ?? descs.vi,
    path: `/${locale}/activities`,
    alternates: {
      vi: '/vi/activities',
      en: '/en/activities',
      zh: '/zh/activities',
    },
  });
}

const internalActivities = {
  VI: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: 'BLĐ cùng CBNV LMX Alliance tại miền Nam dự lễ cầu an cuối năm',
      desc: 'Sáng ngày 16/1, Ban lãnh đạo và toàn thể cán bộ nhân viên LMX Alliance đã tề tựu đông đủ thực hiện nghi lễ cầu an, cầu chúc một năm mới vạn sự hanh thông và cát tường.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: 'Đại hội cổ đông thường niên LMX Alliance định hướng kinh tế xanh',
      desc: 'Đại hội thông qua các chỉ tiêu kế hoạch kinh doanh, định hướng phát triển chuỗi logistics xanh và các mục tiêu phát triển bền vững trong giai đoạn mới.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'Phát động chương trình thi đua nội bộ: Sáng kiến xanh LMX',
      desc: 'Chương trình nhằm khuyến khích toàn thể cán bộ nhân viên đề xuất các giải pháp sáng tạo nhằm tiết kiệm tài nguyên, tối ưu hóa quy trình vận hành xanh.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: 'Lễ vinh danh cá nhân và tập thể xuất sắc quý 4 năm 2025',
      desc: 'Ban lãnh đạo đã tổ chức trao thưởng cho các cá nhân và tập thể có đóng góp vượt bậc vào kết quả kinh doanh và các phong trào thi đua của liên minh.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009403/lmx-migration/ywjmf8mw4f97k8g4muj6.jpg',
      title: 'Chương trình đào tạo an toàn lao động nâng cao tại LMX',
      desc: 'Khóa học định kỳ nhằm cập nhật các kiến thức an toàn lao động và bảo vệ môi trường tại công trường thi công dành cho đội ngũ kỹ sư và công nhân.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009404/lmx-migration/anjoz6o8vogqzb2zungy.jpg',
      title: 'Hội thao nội bộ LMX Alliance – Gắn kết sức mạnh tập thể',
      desc: 'Sự kiện thường niên thu hút hơn 150 CBNV tham gia tranh tài ở nhiều môn thể thao, góp phần xây dựng văn hóa doanh nghiệp gắn kết và lành mạnh.',
    },
  ],
  EN: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: 'LMX Alliance Board & Staff in the South attend year-end blessing ceremony',
      desc: 'On Jan 16, LMX Alliance Board of Directors and all staff gathered to perform the year-end blessing ceremony, praying for a successful and auspicious new year.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: 'LMX Alliance Annual General Meeting focusing on green economy',
      desc: 'The AGM approved business plan targets, directions for developing green logistics chains, and sustainable development goals in the new era.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'Launching internal competition: LMX Green Initiative',
      desc: 'The program aims to encourage all employees to propose innovative solutions for resource saving and green process optimization.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: 'Honoring excellent individuals and teams in Q4 2025',
      desc: 'The board of directors awarded individuals and teams with outstanding contributions to the business results and internal activities of the alliance.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009403/ywjmf8mw4f97k8g4muj6.jpg',
      title: 'Advanced occupational safety training program at LMX',
      desc: 'Periodic training course to update knowledge of occupational safety and environment protection at site for engineers and construction staff.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009404/lmx-migration/anjoz6o8vogqzb2zungy.jpg',
      title: 'LMX Alliance internal sports event – Strengthening team cohesion',
      desc: 'Annual sports event attracting over 150 employees to compete, building a strong, healthy and cohesive corporate culture.',
    },
  ],
  ZH: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: 'LMX联盟南部董事会及员工参加年终祈福仪式',
      desc: '1月16日上午，LMX联盟董事会及全体员工齐聚一堂，举行年终祈福仪式，祈求新的一年顺利吉祥。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: 'LMX联盟年度股东大会聚焦绿色经济',
      desc: '大会批准了业务计划目标、绿色物流链发展方向以及新时期的可持续发展目标。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: '启动内部竞赛：LMX绿色倡议',
      desc: '该计划旨在鼓励全体员工提出资源节约和绿色流程优化的创新解决方案。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: '表彰2025年第四季度优秀个人和团队',
      desc: '董事会表彰了对联盟业绩和内部竞赛活动做出杰出贡献的个人和团队。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009403/ywjmf8mw4f97k8g4muj6.jpg',
      title: 'LMX先进职业安全培训项目',
      desc: '定期培训课程，为工程师和施工人员更新施工现场职业安全和环境保护知识。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009404/anjoz6o8vogqzb2zungy.jpg',
      title: 'LMX联盟内部体育活动——增强团队凝聚力',
      desc: '年度体育赛事吸引了150多名员工参与竞争，构建了强大、健康、有凝聚力的企业文化。',
    },
  ],
};

const socialActivities = {
  VI: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'LMX Alliance mang Tết ấm áp đến 100 gia dịch khó khăn tại Long An',
      desc: 'Chương trình thiện nguyện thường niên trao tặng các phần quà nhu yếu phẩm và hỗ trợ tài chính cho các hộ gia đình nghèo nhân dịp Xuân về.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009402/lmx-migration/klu2vw32c7voieozu4mf.jpg',
      title: 'Chiến dịch trồng cây bảo vệ môi trường "Vì một Việt Nam xanh"',
      desc: 'LMX Alliance phối hợp cùng chính quyền địa phương trồng hơn 2.000 cây xanh tại khu vực rừng phòng hộ ven biển nhằm chung tay bảo vệ hệ sinh thái.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: 'Tài trợ trang thiết bị học tập cho học sinh vùng sâu vùng xa',
      desc: 'LMX Alliance đồng hành trao tặng xe đạp, sách vở và học bổng cho các em học sinh có hoàn cảnh khó khăn nỗ lực vươn lên đạt thành tích học tập tốt.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: 'Tặng bồn nước sạch và hệ thống lọc cho người dân bị hạn mặn',
      desc: 'Chương trình mang nguồn nước sạch sinh hoạt ổn định đến cho bà con tại vùng bị ảnh hưởng nghiêm trọng bởi xâm nhập mặn ở đồng bằng sông Cửu Long.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'Hiến máu nhân đạo thường niên: Giọt hồng LMX Alliance',
      desc: 'Hơn 100 cán bộ nhân viên cùng ban lãnh đạo LMX Alliance đã tham gia hiến máu cứu người, lan tỏa thông điệp nhân văn sẻ chia vì cộng đồng.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: 'Tài trợ xây dựng Nhà tình nghĩa cho hộ nghèo tại Hóc Môn',
      desc: 'LMX Alliance đã tài trợ xây dựng và bàn giao ngôi nhà khang trang, kiên cố giúp gia đình vượt khó ổn định cuộc sống lâu dài.',
    },
  ],
  EN: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'LMX Alliance brings warm Tet to 100 disadvantaged families in Long An',
      desc: 'Annual charity program presenting essential gift packages and financial support to poor households on the occasion of Lunar New Year.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009402/lmx-migration/klu2vw32c7voieozu4mf.jpg',
      title: 'Tree planting campaign for environmental protection "For a Green Vietnam"',
      desc: 'LMX Alliance cooperated with local authorities to plant over 2,000 trees in coastal protection forests to protect the ecosystem.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: 'Sponsoring school supplies for students in remote areas',
      desc: 'LMX Alliance donated bicycles, textbooks, and scholarships to underprivileged students who strive for academic achievements.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: 'Donating clean water tanks and filtration systems for saltwater intrusion areas',
      desc: 'Providing stable safe drinking water source to people in saline-intruded areas in the Mekong Delta.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'Annual humanitarian blood donation: LMX Alliance Red Drops',
      desc: 'Over 100 staff and LMX Alliance board members joined blood donation, spreading the message of humanitarian sharing for the community.',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: 'Sponsoring charity house construction for poor households in Hoc Mon',
      desc: 'LMX Alliance sponsored construction and handed over a solid house to help a needy family stabilize their life.',
    },
  ],
  ZH: [
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: 'LMX联盟为隆安省100户困难家庭送去温暖春节',
      desc: '年度慈善项目，在农历新年期间向贫困家庭赠送生活必需品并提供资金支持。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009402/lmx-migration/klu2vw32c7voieozu4mf.jpg',
      title: '植树护绿环保行动"为了绿色的越南"',
      desc: 'LMX联盟与地方政府合作，在沿海防护林种植了2000多棵树木，共同保护生态系统。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009405/lmx-migration/srk5npo12lzepuvdxys1.jpg',
      title: '为偏远地区学生赞助学习用品',
      desc: 'LMX联盟为努力学习的贫困学生赠送了自行车、课本和奖学金。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783009399/lmx-migration/ts0zqvp3bfv3ygbeam9w.jpg',
      title: '为遭受盐渍化灾害的地区捐赠净水箱及过滤系统',
      desc: '为湄公河三角洲受盐渍化严重影响地区的居民提供稳定的安全饮用水源。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/amlwrqfvdiq8osgpoerq.jpg',
      title: '年度人道主义献血：LMX联盟红色水滴',
      desc: 'LMX联盟100多名员工及董事会成员参与献血，传递人道主义关爱与社区分享信息。',
    },
    {
      image: 'https://res.cloudinary.com/azsqg4uv/image/upload/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg',
      title: '赞助霍门县贫困户建设慈善爱心房',
      desc: 'LMX联盟赞助并交付了一套结实的房屋，帮助有困难的家庭稳定生活。',
    },
  ],
};

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale.toUpperCase() as 'VI' | 'EN' | 'ZH';

  const title = { vi: 'Hoạt động doanh nghiệp', en: 'Business Activities', zh: '企业活动' };
  const subtitle = {
    vi: 'Các hoạt động nổi bật gắn kết nội bộ và đóng góp phát triển xã hội bền vững.',
    en: 'Key highlights of internal cohesion and contribution to sustainable social development.',
    zh: '内部凝聚力及对可持续社会发展贡献的主要亮点。',
  };

  const internalTitle = { vi: 'Hoạt động nội bộ', en: 'Internal Activities', zh: '内部活动' };
  const socialTitle = { vi: 'Hoạt động xã hội', en: 'Social Activities', zh: '社会活动' };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 flex items-center" style={{ background: 'var(--color-primary-dark)', minHeight: '380px' }}>
        <Image
          src="https://res.cloudinary.com/azsqg4uv/image/upload/f_auto,q_auto/v1783157488/lmx-migration/kro4tpb4ppebpuf8j5d7.jpg"
          alt=""
          fill
          priority
          className="object-cover hero-zoom opacity-30"
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%)' }}
          aria-hidden
        />
        <LeafDecor variant="eco" count={8} color="#78d750" />
        <div className="container-max relative z-10 w-full">
          <AnimateIn>
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: '#78d750' }}>
              LMX Alliance
            </p>
            <h1 className="mb-4 text-white" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 700 }}>
              {title[locale as keyof typeof title] ?? title.vi}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-emerald-100">
              {subtitle[locale as keyof typeof subtitle] ?? subtitle.vi}
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Main Activities Section containing sliders */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <ActivitiesClient
            locale={locale}
            internalTitle={internalTitle[locale as keyof typeof internalTitle] ?? internalTitle.vi}
            socialTitle={socialTitle[locale as keyof typeof socialTitle] ?? socialTitle.vi}
            internalItems={internalActivities[L as keyof typeof internalActivities] ?? internalActivities.VI}
            socialItems={socialActivities[L as keyof typeof socialActivities] ?? socialActivities.VI}
          />
        </div>
      </section>
    </>
  );
}
