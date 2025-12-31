import { createFileRoute } from '@tanstack/react-router'
import { MessagesPage } from '@/features/doctor/pages/MessagesPage'

export const Route = createFileRoute('/doctor/messages')({ component: MessagesPage })
