import {
  Atom,
  Code2,
  Container,
  Cpu,
  Database,
  MessageCircle,
  Server,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type TechItem = {
  name: string
  icon: LucideIcon
  color: string
}

const TECH_ITEMS: Array<TechItem> = [
  { name: 'React', icon: Atom, color: 'text-blue-500' },
  { name: 'Node.js', icon: Server, color: 'text-green-600' },
  { name: 'MySQL', icon: Database, color: 'text-blue-600' },
  { name: 'MongoDB', icon: Database, color: 'text-green-500' },
  { name: 'RabbitMQ', icon: MessageCircle, color: 'text-orange-500' },
  { name: 'ESP32', icon: Cpu, color: 'text-red-500' },
  { name: 'Python', icon: Code2, color: 'text-yellow-500' },
  { name: 'Docker', icon: Container, color: 'text-blue-400' },
]

export const TechStack = () => (
  <section className="border-y border-gray-100 bg-gray-50/50 py-10">
    <div className="mx-auto max-w-7xl px-6">
      <p className="mb-8 text-center text-sm font-bold tracking-widest text-gray-400 uppercase">
        Được xây dựng trên nền tảng công nghệ
      </p>

      <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale transition duration-500 hover:opacity-100 hover:grayscale-0 md:gap-12">
        {TECH_ITEMS.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-2 text-xl font-bold text-gray-600">
            <tech.icon className={tech.color} />
            {tech.name}
          </div>
        ))}
      </div>
    </div>
  </section>
)
