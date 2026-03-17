import { SectionTitle } from '@/features/landing/components/SectionTitle'
import { CommunityCard } from '@/features/landing/components/CommunityCard'
import { COMMUNITY_CARDS } from '@/features/landing/config'

export const Community = () => (
  <section id="community" className="scroll-mt-20 bg-white py-24">
    <div className="mx-auto max-w-7xl px-6">
      <SectionTitle
        title="Mô hình Hoạt động"
        subtitle="Dự án hướng tới cộng đồng, hỗ trợ nghiên cứu và phát triển mã nguồn mở."
        center
      />

      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {COMMUNITY_CARDS.map((card) => (
          <CommunityCard key={card.id} data={card} />
        ))}
      </div>
    </div>
  </section>
)
