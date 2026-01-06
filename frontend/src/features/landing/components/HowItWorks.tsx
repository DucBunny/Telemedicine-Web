import { PROCESS_STEPS } from '../config'
import { SectionTitle } from './SectionTitle'

export const HowItWorks = () => (
  <section
    id="how-it-works"
    className="relative scroll-mt-20 overflow-hidden bg-white py-24">
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-40"></div>
    <div className="relative z-10 mx-auto max-w-7xl px-6">
      <SectionTitle
        title="Quy trình Hoạt động"
        subtitle="Hệ thống khép kín từ thiết bị đeo tay đến chẩn đoán của bác sĩ, đảm bảo dữ liệu luôn chính xác và kịp thời."
        center
      />

      <div className="relative">
        <div className="absolute top-1/2 left-0 z-0 hidden h-1 w-full -translate-y-1/2 bg-gray-100 lg:block" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2">
              <div
                className={`h-16 w-16 ${item.bg} ${item.color} relative z-10 mx-auto mb-6 flex items-center justify-center rounded-2xl text-2xl font-bold`}>
                {item.step}
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)
