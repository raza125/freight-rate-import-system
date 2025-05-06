import { useEffect, useState } from 'react'
import UploadModal from '../components/UploadModal'

export default function FreightRateMapper() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [freightData, setFreightData] = useState([]);
  const headers = [
    'ShipmentID', 'OriginCountry', 'DestinationCountry', 'ShipperName',
    'AgentName', 'Proof of Delivery', '20GP', '40GP', 'Date-time'
  ]
  useEffect(() => {
    fetchFreightData();
  }, []);

  const fetchFreightData  = async () => {
    const res = await fetch('http://localhost:3001/api/freight');
    const result = await res.json();
    if (result.success) {
      setFreightData(result.data);
    }
  }

  return (
    <div className="bg-[#DFDFD7] min-h-screen px-8 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg">Hello, John!</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-white px-4 py-1 rounded shadow-sm">John</button>
          <button 
            className="bg-white px-4 py-1 rounded shadow-sm border" 
            onClick={() => setShowUploadModal(true)}
          >
            Import file
          </button>
        </div>
      </div>

      <h2 className="text-3xl mb-5">Quotes</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 font-bold border-r border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {freightData.length > 0 ? (
              freightData.map((row, idx) => (
                <tr key={idx} className="bg-amber-50">
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.shipment_id}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.origin_country}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.destination_country}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.shipper_name}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.agent_name}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.proof_of_delivery}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.container_20gp}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{row.container_40gp}</td>
                  <td className="px-4 py-2 border-r border-[#D9D9D9]">{new Date(row.shipment_datetime).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center text-gray-500 py-4">
                  No data has been added!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <UploadModal onClose={() => setShowUploadModal(false)} onSuccess={fetchFreightData} />
      )}
    </div>
  )
}
