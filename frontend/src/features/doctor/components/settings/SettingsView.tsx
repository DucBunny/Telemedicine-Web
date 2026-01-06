import React from 'react'
import { LogOut } from 'lucide-react'
import { MOCK_USER_DOCTOR } from '../../data/mockData'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const SettingsView: React.FC = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile Section */}
      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <CardTitle className="text-base font-semibold text-gray-800 md:text-lg">
            Thông tin cá nhân
          </CardTitle>
          <CardDescription className="text-xs text-gray-500 md:text-sm">
            Quản lý thông tin hiển thị với bệnh nhân
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 border-4 border-gray-50 md:h-20 md:w-20">
              <AvatarImage src={MOCK_USER_DOCTOR.avatar} />
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
                defaultValue={MOCK_USER_DOCTOR.full_name}
                className="border-gray-300 focus-visible:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700 md:text-sm">
                Chuyên khoa
              </Label>
              <Input
                defaultValue={MOCK_USER_DOCTOR.specialization}
                className="border-gray-300 focus-visible:ring-teal-500"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-medium text-gray-700 md:text-sm">
                Giới thiệu (Bio)
              </Label>
              <Textarea
                rows={3}
                placeholder="Viết vài dòng giới thiệu về kinh nghiệm của bạn..."
                className="resize-none border-gray-300 focus-visible:ring-teal-500"
              />
            </div>
          </div>
        </CardContent>
        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4">
          <Button className="bg-teal-600 text-white shadow-sm hover:bg-teal-700">
            Lưu thay đổi
          </Button>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="overflow-hidden border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-white p-6">
          <CardTitle className="text-base font-semibold text-gray-800 md:text-lg">
            Tùy chọn khác
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-medium text-gray-900 md:text-sm">
                Thông báo từ thiết bị IoT
              </h4>
              <p className="text-[10px] text-gray-500 md:text-xs">
                Nhận cảnh báo khi chỉ số bệnh nhân bất thường
              </p>
            </div>

            {/* Custom Toggle Switch using Tailwind/HTML only to mimic design perfectly without Switch dependency */}
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-teal-600 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white md:h-6 md:w-11 md:after:h-5 md:after:w-5"></div>
            </label>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <Button
              variant="ghost"
              className="flex h-auto items-center p-0 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 md:text-sm">
              <LogOut className="mr-2 h-4 w-4" /> Đăng xuất khỏi hệ thống
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
