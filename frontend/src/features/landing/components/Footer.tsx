import { Facebook, Linkedin, Twitter } from 'lucide-react'

export const Footer = () => (
  <footer className="border-t border-gray-200 bg-gray-50 pt-20 pb-10">
    <div className="mx-auto mb-16 grid max-w-7xl gap-12 px-6 md:grid-cols-4">
      <div className="col-span-1 md:col-span-2">
        <div className="mb-4 flex items-center gap-2 text-xl font-bold text-teal-700">
          <img src="/logo.png" alt="Logo" className="h-8 w-8" />
          MedCare
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-gray-500">
          Nền tảng công nghệ y tế tiên phong trong việc ứng dụng IoT và AI để
          bảo vệ sức khỏe cộng đồng.
        </p>
      </div>
      <div>
        <h4 className="mb-4 font-bold text-gray-900">Sản phẩm</h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li>
            <a href="#how-it-works" className="hover:text-teal-600">
              Thiết bị IoT
            </a>
          </li>
          <li>
            <a href="#app-showcase" className="hover:text-teal-600">
              Ứng dụng Mobile
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-teal-600">
              Dành cho Bác sĩ
            </a>
          </li>
          <li>
            <a href="#community" className="hover:text-teal-600">
              API Developers
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-bold text-gray-900">Công ty</h4>
        <ul className="space-y-3 text-sm text-gray-500">
          <li>
            <a href="#" className="hover:text-teal-600">
              Về chúng tôi
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-teal-600">
              Tuyển dụng
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-teal-600">
              Blog Y tế
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-teal-600">
              Liên hệ
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-200 px-6 pt-8 text-sm text-gray-400 md:flex-row">
      <p>© 2025 MedCare Inc. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-gray-600">
          Điều khoản
        </a>
        <a href="#" className="hover:text-gray-600">
          Bảo mật
        </a>
        <div className="ml-4 flex gap-4">
          <Facebook className="w-5 cursor-pointer hover:text-blue-600" />
          <Twitter className="w-5 cursor-pointer hover:text-blue-400" />
          <Linkedin className="w-5 cursor-pointer hover:text-blue-700" />
        </div>
      </div>
    </div>
  </footer>
)
