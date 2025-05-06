import { useEffect } from "react";
import { CircleCheck, CircleX } from "lucide-react";

export default function Toast({ message, type, onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
          onClose()
        }, duration)
        return () => clearTimeout(timer)
      }, [duration, onClose])
  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow text-sm text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } ${message ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="text-white">
        {type === 'success' ? (
            <div>
                <div>
                    <CircleCheck className="h-5 w-5 text-black-500 inline-block mr-2" />
                    Successful
                    </div>
                <span>{message}</span>
            </div>
          
        ) : (
            <div>
                <div>
                  <CircleX  className="h-5 w-5 text-black-500 inline-block mr-2" />
                  Failed
                </div>
          <span>{message}</span>
          </div>
        )}
      </div>
      <button
        className="absolute top-2 right-2 text-white"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
}