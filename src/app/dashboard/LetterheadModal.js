import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const LetterheadModal = ({ isOpen, onClose, pegawaiData }) => {
  const contentRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const content = contentRef.current;
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Data_Pegawai_${pegawaiData?.nip || 'document'}.pdf`);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl relative">

        <div className="p-8" ref={contentRef}>
          <div className="text-center mb-6 border-b-2 border-gray-800 pb-6">
            <div className="flex justify-center items-center gap-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Seal_of_Tasikmalaya_Regency.svg"
                alt="Logo"
                className="w-20 h-20"
                crossOrigin="anonymous"
              />
              <div>
                <h1 className="text-xl font-bold">PEMERINTAH KABUPATEN TASIKMALAYA</h1>
                <h2 className="text-lg font-semibold">DINAS KOMUNIKASI DAN INFORMATIKA</h2>
                <p className="text-sm">Jl. Pemuda No. 1 Tasikmalaya</p>
                <p className="text-sm">Telp. (0265) 123456</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-6">DATA PEGAWAI</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">NIP:</p>
                <p>{pegawaiData?.nip || '-'}</p>
              </div>
              <div>
                <p className="font-semibold">Nama Lengkap:</p>
                <p>{pegawaiData?.nama_lengkap || '-'}</p>
              </div>
              <div>
                <p className="font-semibold">Jabatan:</p>
                <p>{pegawaiData?.jabatan || '-'}</p>
              </div>
              <div>
                <p className="font-semibold">Unit Kerja:</p>
                <p>{pegawaiData?.unit_kerja || '-'}</p>
              </div>
              <div>
                <p className="font-semibold">Golongan:</p>
                <p>{pegawaiData?.nama_golongan || '-'}</p>
              </div>
            </div>

            <div className="mt-12 text-right">
              <p>Tasikmalaya, {new Date().toLocaleDateString('id-ID')}</p>
              <p className="mt-20">( {pegawaiData?.nama_lengkap || '........................'} )</p>
              <p>NIP. {pegawaiData?.nip || '........................'}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>

    </div>
  );
};

export default LetterheadModal;