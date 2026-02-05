import { Heart, ShieldCheck, Stethoscope } from 'lucide-react'

interface HeroPanelProps {
  title: string
  subtitle: string
}

export const HeroPanel = ({ title, subtitle }: HeroPanelProps) => {
  return (
    <div className="relative hidden h-full flex-col items-center justify-center overflow-hidden bg-linear-to-br from-teal-500 to-emerald-700 p-12 text-white md:flex">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] h-40 w-40 rounded-full bg-teal-300/10 blur-2xl"></div>

      <div className="relative z-10 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="MedCare Logo" className="size-20" />
        </div>
        <h2 className="mb-4 text-3xl font-bold">{title}</h2>
        <p className="text-lg leading-relaxed text-teal-50 opacity-90">
          {subtitle}
        </p>

        {/* Feature List Mini */}
        <div className="mt-8 flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Heart size={20} />
            </div>
            <span className="text-xs font-medium">Theo dõi</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Stethoscope size={20} />
            </div>
            <span className="text-xs font-medium">Tư vấn</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-medium">Bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  )
}
