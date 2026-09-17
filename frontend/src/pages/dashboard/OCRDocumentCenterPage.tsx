import React, { useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { FileSearch, UploadCloud, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

export const OCRDocumentCenterPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imported, setImported] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setResult(null);
    setImported(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/ocr/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      alert("Failed to process document");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!result?.document_id) return;
    try {
      await api.post(`/ocr/confirm-import/${result.document_id}`);
      setImported(true);
    } catch (err) {
      alert("Failed to import transactions");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-blue-400" />
          <span>OCR Bank Statement & Document Intelligence</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload PDF or image bank statements (SBI, HDFC, ICICI, Axis) for automated transaction line extraction.
        </p>
      </div>

      <GlassCard className="p-8">
        <form onSubmit={handleUpload} className="space-y-6 text-center">
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-blue-500/50 transition-colors bg-white/5">
            <UploadCloud className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">Upload Bank Statement / Salary Slip</p>
            <p className="text-xs text-slate-400 mb-4">Supports PDF, PNG, JPG files</p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-glow-blue disabled:opacity-50"
          >
            {uploading ? "Extracting Transactions..." : "Process OCR Extraction"}
          </button>
        </form>
      </GlassCard>

      {result && (
        <GlassCard className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Extracted Transactions ({result.total_extracted})</h3>
              <p className="text-xs text-slate-400">{result.filename} - Status: {result.status}</p>
            </div>

            {!imported ? (
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Commit to Expense Ledger
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Successfully Imported into Ledger!
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-white/5 text-slate-400 uppercase font-semibold border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Merchant</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {result.extracted_transactions.map((tx: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5">
                    <td className="py-2 px-3">{tx.date}</td>
                    <td className="py-2 px-3 font-semibold text-white">{tx.merchant}</td>
                    <td className="py-2 px-3"><span className="px-2 py-0.5 rounded bg-white/5">{tx.category}</span></td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold">{tx.type}</td>
                    <td className={`py-2 px-3 font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-white"}`}>
                      INR {Math.round(tx.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
