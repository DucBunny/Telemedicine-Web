import { useGetPatientRecords } from '../hooks/useRecordQueries'

export const RecordsPage = () => {
  const { data } = useGetPatientRecords({
    page: 1,
    limit: 5,
  })

  return (
    <div className="space-y-6 px-0 pt-6 pb-20 md:px-0 md:pt-0 md:pb-0">
      <h1 className="px-1 pt-2 text-2xl font-bold text-gray-900 md:pt-0">
        Hồ sơ bệnh án
      </h1>

      <div className="relative mt-4 ml-3 space-y-8 border-l-2 border-dashed border-gray-200">
        {data?.data.map((rec) => (
          <div key={rec.id} className="relative pl-8">
            <div className="absolute top-0 -left-2.25 h-4 w-4 rounded-full border-4 border-white bg-teal-500 shadow-sm"></div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {rec.diagnosis}
                </h3>
                <span className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">
                  {new Date(rec.visitDate).toLocaleDateString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-24 shrink-0 text-gray-500">Bác sĩ:</span>
                  <span className="font-medium text-gray-800">
                    {rec.doctor?.user.fullName || 'N/A'}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-24 shrink-0 text-gray-500">
                    Đơn thuốc:
                  </span>
                  <span className="text-gray-800">{rec.prescription}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-3 border-t border-gray-100 pt-4">
                <button className="flex-1 rounded-lg bg-teal-50 py-2 text-sm font-medium text-teal-600 hover:bg-teal-100">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
