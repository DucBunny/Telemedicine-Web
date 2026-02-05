import { useGetDoctorProfile } from '../../hooks/useDoctorQueries'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const Profile = () => {
  const { data } = useGetDoctorProfile()

  return (
    <div className="rounded-xl border border-b border-gray-100 bg-white p-6 shadow-sm">
      <div className="text-base font-semibold text-gray-800 md:text-lg">
        Thông tin cá nhân
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 border-4 border-gray-50 md:h-20 md:w-20">
            <AvatarImage src={data?.user.avatar} />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="ml-4 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            Thay đổi ảnh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 md:text-sm">
              Họ và tên
            </Label>
            <Input
              defaultValue={data?.user.fullName}
              className="border-gray-300 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 md:text-sm">
              Chuyên khoa
            </Label>
            <Input
              defaultValue={data?.specialization}
              className="border-gray-300 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 md:text-sm">
              Học vị
            </Label>
            <Input
              defaultValue={data?.degree}
              className="border-gray-300 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700 md:text-sm">
              Số điện thoại
            </Label>
            <Input
              defaultValue={data?.user.phoneNumber}
              className="border-gray-300 focus-visible:ring-teal-500 focus-visible:ring-offset-0"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-medium text-gray-700 md:text-sm">
              Giới thiệu (Bio)
            </Label>
            <Textarea
              defaultValue={data?.bio}
              rows={3}
              placeholder="Viết vài dòng giới thiệu về kinh nghiệm của bạn..."
              className="resize-none border-gray-300 focus-visible:ring-teal-500"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="teal_primary">Lưu thay đổi</Button>
      </div>
    </div>
  )
}
