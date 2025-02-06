'use client'

import { useState, useEffect } from 'react'
import LetterheadModal from './LetterheadModal'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [pegawaiList, setPegawaiList] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPegawai, setSelectedPegawai] = useState(null);

  useEffect(() => {
    const fetchPegawai = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://seleksi-tenagait.tasikmalayakab.go.id/api/pegawai', {
          headers: {
            'Content-Type': 'application/json',
            'x-api-pegawai': 'TestSeleksiPegawai2025',
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setPegawaiList(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPegawai()
  }, [])


  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleNipClick = (pegawai) => {
    setSelectedPegawai(pegawai)
    setIsModalOpen(true)
  }
  
  const filteredPegawai = pegawaiList?.data?.filter(pegawai =>
    pegawai.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pegawai.nip?.includes(searchQuery) ||
    pegawai.jabatan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pegawai.unit_kerja?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Data Pegawai</h1>
          
          <div className="relative w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Cari berdasarkan nama, NIP, jabatan..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Lengkap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jabatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Kerja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Golongan
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPegawai.map((pegawai) => (
                  <tr key={pegawai.nip} className="hover:bg-gray-50">
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleNipClick(pegawai)}  
                    >
                      {pegawai.nip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pegawai.nama_lengkap}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pegawai.jabatan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pegawai.unit_kerja}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pegawai.nama_golongan}
                    </td>
                  </tr>
                ))}
                {filteredPegawai.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
              <LetterheadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pegawaiData={selectedPegawai}
      />
            </table>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Pegawai</h3>
            <p className="mt-2 text-3xl font-semibold">{filteredPegawai.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Unit Kerja</h3>
            <p className="mt-2 text-3xl font-semibold">
              {new Set(filteredPegawai.map(p => p.unit_kerja)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Golongan</h3>
            <p className="mt-2 text-3xl font-semibold">
              {new Set(filteredPegawai.map(p => p.nama_golongan)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}