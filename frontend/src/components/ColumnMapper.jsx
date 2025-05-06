import { useEffect, useState } from "react";

const SYSTEM_FIELDS = [
  "ShipmentID",
  "OriginCountry",
  "DestinationCountry",
  "ShipperName",
  "AgentName",
  "Proof of Delivery",
  "20'GP",
  "40'GP",
  "Date-time",
];

export default function ColumnMapper({ headers, sampleRows, onMappingChange }) {
  const [mapping, setMapping] = useState({});

  const handleChange = (column, value) => {
    const newMapping = { ...mapping, [column]: value };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  return (
    <div className="mt-6 relative overflow-x-auto rounded border m-4">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {headers.map((column, idx) => (
              <th key={idx} className="px-3 py-2 border whitespace-nowrap min-w-[150px]">
                <select
                  value={mapping[column] || column}
                  onChange={(e) => handleChange(column, e.target.value)}
                  className="text-sm rounded px-1 py-0.5 w-full cursor-pointer"
                >
                  <option value={column}>{column}</option>
                  <option disabled>────────────</option>
                  <option value="">Unmapped</option>
                  {SYSTEM_FIELDS.map((field) => (
                    <option
                      key={field}
                      value={field}
                      disabled={
                        Object.values(mapping).includes(field) &&
                        mapping[column] !== field
                      }
                    >
                      {field}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {sampleRows.slice(0, 7).map((row, rowIdx) => (
            <tr key={rowIdx} className="border-t">
              {headers.map((column, idx) => (
                <td key={idx} className="px-3 py-2 border whitespace-nowrap min-w-[150px]">
                  {row[column] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
