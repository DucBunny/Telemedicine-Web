import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SquarePen } from 'lucide-react'
import {
  ChatItem,
  EmptyChat,
  RecentDoctorsList,
} from '@/features/patient/components/chat'
import { MainPageHeader, SearchBar } from '@/features/patient/components/common'
import { Button } from '@/components/ui/button'

export interface DoctorContact {
  id: string
  name: string
  avatarUrl: string
  isOnline: boolean
}

export interface ChatMessage {
  id: string
  doctorName: string
  avatarUrl: string
  isOnline: boolean
  lastMessage: string
  time: string
  hasUnread: boolean
}

const MOCK_RECENT_DOCTORS: Array<DoctorContact> = [
  {
    id: '1',
    name: 'BS. Sarah',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkslFJZzfEQ2iJ3vT7IpRvTFT9Mg8hXFB-OFusKdXUgfKEBmG60vRoAwEC3pWulaYL9iLNqQjdhF8Ns_StpXLDlLYOSC5PESPnS_J8JAkmuferrNo8TLBt08jYQUNa-DUBXNmLdqteoiIIf8qqm5YxmVT0doc9Zb5KXHYH3Uao_C2aXpw7MlJh0UE44Whv_0uH0DtOA_OfWO8iVp9RF3ouVzsY0krRuUelIFWWoOx4l5DHZ7AVhJx2DfUkcIyam9-9EdW7fHs62Isj',
    isOnline: true,
  },
  {
    id: '2',
    name: 'BS. John',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAK-Ca2iaMzs8Rh0nBTZLsHscV1sZjJyICzZ3IBtd3_Q-HHT9SR0FPKOtrf8Bd7Od9VwhdDBmB12nvFirE3BYGOD39DyuQPY-cCpVvLXW5CEo-BxpA5qiXOKikc3BJIwB5haeyAzRpbXQQSWFeRBc7KYlKyibpOrjxZa66Ehmnkixp7z3N9p9yYITSvvhOMUQrrxYS3w4Ur2F9puDlCxMpicIH93IfWYtRshE6_QooosDQGpNvRLAsHsJQaDVRSaPADU7cAbJ_6Y-Wd',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
  {
    id: '3',
    name: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
  },
]

const MOCK_CHATS: Array<ChatMessage> = [
  {
    id: 'chat1',
    doctorName: 'BS. Sarah',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkslFJZzfEQ2iJ3vT7IpRvTFT9Mg8hXFB-OFusKdXUgfKEBmG60vRoAwEC3pWulaYL9iLNqQjdhF8Ns_StpXLDlLYOSC5PESPnS_J8JAkmuferrNo8TLBt08jYQUNa-DUBXNmLdqteoiIIf8qqm5YxmVT0doc9Zb5KXHYH3Uao_C2aXpw7MlJh0UE44Whv_0uH0DtOA_OfWO8iVp9RF3ouVzsY0krRuUelIFWWoOx4l5DHZ7AVhJx2DfUkcIyam9-9EdW7fHs62Isj',
    isOnline: true,
    lastMessage: 'Chào bạn, tôi có thể giúp gì cho bạn hôm nay?',
    time: '10:30',
    hasUnread: true,
  },
  {
    id: 'chat2',
    doctorName: 'BS. John',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAK-Ca2iaMzs8Rh0nBTZLsHscV1sZjJyICzZ3IBtd3_Q-HHT9SR0FPKOtrf8Bd7Od9VwhdDBmB12nvFirE3BYGOD39DyuQPY-cCpVvLXW5CEo-BxpA5qiXOKikc3BJIwB5haeyAzRpbXQQSWFeRBc7KYlKyibpOrjxZa66Ehmnkixp7z3N9p9yYITSvvhOMUQrrxYS3w4Ur2F9puDlCxMpicIH93IfWYtRshE6_QooosDQGpNvRLAsHsJQaDVRSaPADU7cAbJ_6Y-Wd',
    isOnline: true,
    lastMessage: 'Bạn có cần tư vấn về kết quả xét nghiệm không?',
    time: 'Hôm qua',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
  {
    id: 'chat3',
    doctorName: 'BS. Emily',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDD3t3H3L7hVIs6gtd_S-RxHx_npQS5r1a3jonviQ5xukRaDvWC5-TyK7EEc54SOSM-a1C39_VRm88TzvGGDKcxXiiQBVyfK0UvNmT2ZlAg9pbyl7ULknLpTXMQhu6gfJwax3Suj4CjSQb0cRqKVQLSoN_6jcKd3OIs_XRrfCx1N84_N9pLN22mhiSLRqKHd1TvnLhtTC5U2CghyVnU_uWy7w_X1HJDEBJQPYRjn2x2TVzGOLF1I4KpDM-oAyTWbgwuDPdjQohO0oxV',
    isOnline: true,
    lastMessage: 'Hẹn gặp lại bạn vào tuần sau nhé!',
    time: '2 ngày trước',
    hasUnread: false,
  },
]

// const MOCK_CHATS: Array<ChatMessage> = []

export const ChatPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpenChat = (chatId: string) => {
    navigate({ to: '/patient/chat/$doctorId', params: { doctorId: chatId } })
  }

  // Logic lọc tin nhắn theo Search Query (Chỉ demo)
  const filteredChats = MOCK_CHATS.filter(
    (chat) =>
      chat.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col">
      <div className="px-4">
        {/* Header */}
        <MainPageHeader
          title="Trò chuyện"
          rightAction={
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full active:scale-95">
              <SquarePen className="size-5" strokeWidth="2.5" />
            </Button>
          }
        />

        {/* Search Bar */}
        <SearchBar
          placeholder="Tìm kiếm bác sĩ, tin nhắn..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>

      <div className="mt-3 flex-1 space-y-3">
        {MOCK_CHATS.length > 0 ? (
          <>
            {/* Chỉ hiển thị Recent Doctors nếu không đang tìm kiếm */}
            {!searchQuery && (
              <RecentDoctorsList doctors={MOCK_RECENT_DOCTORS} />
            )}

            {/* Danh sách tin nhắn */}
            <div className="flex flex-col gap-1 px-4 pb-2">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    onClick={handleOpenChat}
                  />
                ))
              ) : (
                <div className="py-6 text-center text-gray-500">
                  Không tìm thấy kết quả nào cho "{searchQuery}"
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyChat
            onBookAction={() => navigate({ to: '/patient/appointments' })}
          />
        )}
      </div>
    </div>
  )
}
