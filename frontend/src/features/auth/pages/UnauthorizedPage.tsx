import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 shadow-lg shadow-gray-200">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Không có quyền truy cập
        </h1>
        <p className="mb-6 text-gray-600">
          Tài khoản của bạn không có quyền truy cập trang này. Vui lòng đăng
          nhập bằng tài khoản phù hợp hoặc quay lại trang chủ.
        </p>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="secondary">Về trang chủ</Button>
          </Link>
          <Link to="/login">
            <Button variant="teal_primary">Đăng nhập lại</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
