import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

type Logo = {
  src: string
  alt: string
  width?: number
  height?: number
}

type LogoCloudProps = React.ComponentProps<'div'> & {
  logos: Array<Logo>
}

export const LogoCloud = ({ logos }: LogoCloudProps) => {
  return (
    <div className="relative mx-auto w-full bg-linear-to-r via-transparent py-10">
      <div className="pointer-events-none absolute -top-px left-1/2 w-screen -translate-x-1/2" />

      <InfiniteSlider gap={80} duration={50} durationOnHover={80}>
        {logos.map((logo) => (
          <img
            alt={logo.alt}
            className="pointer-events-none h-6 select-none md:h-8 dark:brightness-0 dark:invert"
            height="auto"
            key={`logo-${logo.alt}`}
            loading="lazy"
            src={logo.src}
            width="auto"
          />
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 left-0 h-full w-40"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1}
        className="pointer-events-none absolute top-0 right-0 h-full w-40"
        direction="right"
      />

      <div className="pointer-events-none absolute -bottom-px left-1/2 w-screen -translate-x-1/2" />
    </div>
  )
}
