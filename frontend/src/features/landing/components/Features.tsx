import { FEATURES_LIST } from '../constants'
import featuresImg from '../assets/features-img.png'

export const Features = () => (
  <section id="features" className="scroll-mt-20 bg-gray-50 py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <h2 className="text-3xl font-extrabold text-gray-900 lg:text-4xl">
            Công nghệ đột phá <br /> cho Y tế tương lai
          </h2>
          <div className="space-y-6">
            {FEATURES_LIST.map((feat, idx) => (
              <div key={idx} className="flex gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${feat.color}`}>
                  <feat.icon />
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-bold">{feat.title}</h4>
                  <p className="text-sm text-gray-500">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-linear-to-tr from-teal-400 to-blue-500 opacity-20 blur-lg" />
          <img
            src={featuresImg}
            alt="Features"
            className="relative rounded-3xl border-4 border-white shadow-2xl"
          />
        </div>
      </div>
    </div>
  </section>
)
