import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, ShieldAlert, Sparkles, BookOpen, Clock, Send } from 'lucide-react';
import api from '../services/api';
import { IngestedDocument } from '../types';

export const UploadPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<IngestedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Isolated Q&A
  const [queryText, setQueryText] = useState('');
  const [answer, setAnswer] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await api.getUploadedDocuments();
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      await api.uploadPDF(file);
      setUploadSuccess(true);
      setFile(null);
      fetchDocuments();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to process PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleAskPDF = async () => {
    if (!queryText.trim()) return;
    setLoadingAnswer(true);
    setAnswer('');
    try {
      // Set documentOnly = true to restrict RAG to PDF chunks
      const response = await api.sendChatMessage(queryText, undefined, true);
      setAnswer(response.answer);
    } catch (e) {
      setAnswer("⚠️ Error querying document vector collections.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border-white/5 shadow-glass">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <Upload size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Upload Cricket Documents</h1>
            <p className="text-[10px] text-slate-400 font-semibold font-sans">Process PDFs, extract match statistics, and chunk into vector indexes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: File Uploader Area */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">
              Ingest Document File
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border border-dashed border-slate-700/60 rounded-xl p-8 text-center bg-slate-950/20 hover:border-sky-500/40 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <FileText className="text-slate-500" size={32} />
                  <span className="text-xs font-bold text-slate-400">
                    {file ? file.name : "Select or drag cricket PDF"}
                  </span>
                  <span className="text-[10px] text-slate-600 font-semibold">Only PDF format supported</span>
                </div>
              </div>

              {file && (
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  {uploading ? (
                    <>
                      <RefreshCwIcon /> Ingesting Vector Indexes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} /> Upload & Index Document
                    </>
                  )}
                </button>
              )}

              {uploadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> File successfully tokenized and indexed in ChromaDB!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Columns 2-3: Isolated PDF Q&A & Document Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Isolated Document Q&A Section */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider border-b border-slate-800 pb-2">
              <BookOpen size={14} className="text-sky-400" />
              Isolated Document Query Assistant
            </h3>
            
            <div className="relative">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ask specific questions (e.g. 'Who was the match referee according to this scorecard?')"
                className="w-full pl-4 pr-12 py-3 rounded-xl glass-input text-xs text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleAskPDF()}
              />
              <button
                onClick={handleAskPDF}
                disabled={loadingAnswer}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-all border border-slate-700/60"
              >
                <Send size={12} />
              </button>
            </div>

            {loadingAnswer && (
              <div className="flex gap-2 items-center text-[10px] text-slate-500 font-bold pt-2 animate-pulse">
                <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" />
                Context retrieval search in ChromaDB...
              </div>
            )}

            {answer && (
              <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/10 text-xs text-slate-300 leading-relaxed font-semibold">
                <p className="font-bold text-white mb-2 flex items-center gap-1">
                  <Sparkles size={12} className="text-sky-400" /> Answer from Document Collection:
                </p>
                {answer}
              </div>
            )}
          </div>

          {/* Uploaded Documents Logs */}
          <div className="p-6 rounded-2xl glass-panel border-white/5 space-y-4 shadow-glass">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">
              Ingested Document Indexes ({documents.length})
            </h3>

            {documents.length === 0 ? (
              <p className="text-[10px] text-slate-500 font-bold">No custom PDF documents have been uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950/20 border border-slate-800/80 shadow-sm">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-300">{doc.filename}</p>
                        <p className="text-[9px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock size={10} />
                          Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                      {doc.chunk_count} Vector Chunks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

const RefreshCwIcon = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default UploadPDF;
