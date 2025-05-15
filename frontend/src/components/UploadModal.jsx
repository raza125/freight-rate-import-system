import { useRef, useState } from "react";
// import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import Papa from "papaparse";
import ColumnMapper from "./ColumnMapper";
import * as XLSX from "xlsx";
import Toast from "./Toast";

export default function UploadModal({ onClose, onSuccess }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [sampleRows, setSampleRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleBrowse = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    setUploadedFiles(files);
    const file = files[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setFileHeaders(results.meta.fields);
          setSampleRows(results.data);
        },
      });
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, idx) => {
              obj[header] = row[idx];
            });
            return obj;
          });

          setFileHeaders(headers);
          setSampleRows(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setToast({
        message: "Unsupported file type. Please upload a CSV or XLSX file.",
        type: "error",
      });
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/freight/search?type=40gp`);
      const result =  await res.json();
      if(result.success) {
        setShowResults(result.data)
      } else {
        setToast({
        message: "No Results",
        type: "error",
      });
      }
    } catch (err) {
      setToast({
        message: err,
        type: "error",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 bg-neutral-300 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="px-5 py-3 bg-neutral-100 rounded-t-md">
          <h2 className="text-sm font-medium text-gray-700 mb-2">
            Upload Necessary Documents
          </h2>
        </div>
        <div
          className="border border-dashed border-gray-400 rounded-md m-4 p-6 text-center cursor-pointer bg-neutral-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-sm font-semibold mb-1">
            Click or drag file to this area to upload
          </p>
          <p className="text-xs text-gray-500">
            Please upload all necessary permits and certifications for this
            customer. Ensure files are in CSV or XLSX format for optimal
            compatibility.
          </p>
          <button
            className="mt-3 px-3 py-1 bg-black text-white text-sm rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current.click()
            }}
          >
            Browse File
          </button>
          <input
            type="file"
            multiple={false}
            hidden
            ref={fileInputRef}
            onChange={handleBrowse}
          />
        </div>

        <div className="mt-4 text-sm text-gray-700 bg-neutral-100 m-4 p-3 rounded-xl">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file, idx) => (
              <div key={idx} className="mt-1 text-gray-800">
                {file.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500 flex items-center text-sm m-1 p-1 bg-neutral-100 rounded-md">
              No File Uploaded yet
            </p>
          )}
        </div>

        {fileHeaders.length > 0 && sampleRows.length > 0 && (
          <>
          {showSearch && 
          <div className="mt-6 bg-white p-4 rounded shadow">
            {/* <h3 className="text-lg font-semibold mb-2">Search</h3> */}
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => handleSearch()}>Search</button>
            </div>
          </div>
          }
          {showResults.length > 0 && 
          <div className="mt-3 text-sm text-gray-700">
            {showResults.map((element, i) => {
              return (
              <li key={i}>
                {element.origin_country} - {element.destination_country} - ${element.rate}
              </li>
              )
            })}
          </div>}
              {/* Cheapest from 
              <b>{element.origin_country}</b> to <b>{element.destination_country}</b>: ${element.rate} */}
          <ColumnMapper
            headers={fileHeaders}
            sampleRows={sampleRows}
            onMappingChange={(latestMapping) => setColumnMapping(latestMapping)}
          />
          </>
        )}

        <div className="m-5 flex justify-end space-x-2">
          <button
            className="px-4 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 bg-black text-white rounded hover:opacity-90 text-sm cursor-pointer"
            onClick={async () => {
              // if (!columnMapping || Object.keys(columnMapping).length === 0) {
              //   setToast({
              //     message: "Please map at least one column before processing.",
              //     type: "error",
              //   });
              //   return;
              // }

              const filteredMapping = Object.fromEntries(
                Object.entries(columnMapping).filter(
                  ([column, mappedTo]) => mappedTo
                )
              );

              if (Object.keys(filteredMapping).length === 0) {
                setToast({
                  message:
                    "Please map at least one valid column before processing.",
                  type: "error",
                });
                return;
              }

              try {
                const response = await fetch(
                  "http://localhost:3001/api/freight/import",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      rows: sampleRows,
                      mapping: filteredMapping,
                    }),
                  }
                );

                const result = await response.json();

                if (result.success) {
                  setToast({
                    message: `Successfully imported ${result.data.length} row(s).`,
                    type: "success",
                  });
                  // onSuccess();
                  // onClose();
                  setShowSearch(true);
                } else {
                  setToast({
                    message: "Failed to import freight data.",
                    type: "error",
                  });
                }
              } catch (error) {
                console.error("Upload error:", error);
                setToast({
                  message: "Failed to import freight data.",
                  type: "error",
                });
              }
            }}
          >
            Process Shipments
          </button>
        </div>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
