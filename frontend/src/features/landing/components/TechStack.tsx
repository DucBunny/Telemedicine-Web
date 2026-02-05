import mongoDarkLogo from '../assets/MongoDB.svg'
import reactLogo from '../assets/React_Light.svg'
import mysqlLogo from '../assets/MySQL.svg'
import nodejsLogo from '../assets/Nodejs.svg'
import pythonLogo from '../assets/Python.svg'
import dockerLogo from '../assets/Docker.svg'
import rabbitmqLogo from '../assets/RabbitMQ.svg'
import redisLogo from '../assets/Redis.svg'
import espLogo from '../assets/Espressif.svg'
import { LogoCloud } from '@/components/ui/logo-cloud-4'
import { cn } from '@/lib/utils'

const LOGOS = [
  {
    src: reactLogo,
    alt: 'React Logo',
  },
  {
    src: nodejsLogo,
    alt: 'Node.js Logo',
  },
  {
    src: mongoDarkLogo,
    alt: 'MongoDB Logo',
  },
  {
    src: mysqlLogo,
    alt: 'MySQL Logo',
  },
  {
    src: dockerLogo,
    alt: 'Docker Logo',
  },
  {
    src: pythonLogo,
    alt: 'Python Logo',
  },
  {
    src: rabbitmqLogo,
    alt: 'RabbitMQ Logo',
  },
  {
    src: redisLogo,
    alt: 'Redis Logo',
  },
  {
    src: espLogo,
    alt: 'ESP32 Logo',
  },
]

export const TechStack = () => {
  return (
    <section className="relative w-full place-content-center border-y border-gray-100 bg-gray-50/50 pt-5 sm:pt-10">
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-b-full',
          'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
          'blur-[30px]',
        )}
      />
      <div className="w-full">
        <p className="text-center text-[10px] font-bold tracking-widest text-gray-400 uppercase sm:text-sm">
          Được xây dựng trên nền tảng công nghệ
        </p>

        <LogoCloud logos={LOGOS} />
      </div>
    </section>
  )
}
