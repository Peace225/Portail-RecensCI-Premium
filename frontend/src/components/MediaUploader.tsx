// src/components/MediaUploader.tsx
import React, { useState, useRef } from "react";
import { Camera, Upload, X, CheckCircle2, Loader2, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

interface MediaUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onUploadSuccess, 
  folder = "documents_citoyens",
  label = "Scanner le Document"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👉 CONFIGURATION CLOUDINARY MISE À JOUR
  const CLOUD_NAME = "dpje4d7xa"; 
  const UPLOAD_PRESET = "recensci_docs"; 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Prévisualisation locale immédiate
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    // 2. Upload vers Cloudinary
    await uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folder);
    // Optionnel : Ajoute un tag pour filtrer plus facilement dans Cloudinary
    formData.append("tags", "recensci_app");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
        toast.success("Document numérisé et sécurisé", {
          icon: "🛡️",
          style: { 
            background: '#0f172a', 
            color: '#10b981', 
            border: '1px solid #10b981',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }
        });
      } else {
        throw new Error(data.error?.message || "Erreur inconnue");
      }
    } catch (error) {
      console.error("Erreur Upload Cloudinary:", error);
      toast.error("Échec de la liaison Cloud Souverain");
      setPreviewUrl(null); // Reset en cas d'échec
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative group">
        {!previewUrl ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-orange-500/20 rounded-[2rem] bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all flex flex-col items-center justify-center gap-4 group"
          >
            <div className="p-4 bg-orange-500/10 rounded-2xl group-hover:scale-110 transition-transform border border-orange-500/20 shadow-inner">
              <Camera className="text-orange-500" size={32} />
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-white uppercase tracking-widest">{label}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Liaison chiffrée Cloudinary</p>
            </div>
          </button>
        ) : (
          <div className="relative w-full h-72 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain opacity-70" />
            
            {/* Overlay de Scan Tactique */}
            {isUploading && (
              <div className="absolute inset-0 bg-orange-950/40 flex flex-col items-center justify-center backdrop-blur-[2px]">
                {/* Ligne de scan animée */}
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 shadow-[0_0_20px_#f97316] animate-scan-v z-10" />
                
                <div className="relative">
                  <Loader2 className="text-orange-500 animate-spin mb-3" size={40} />
                  <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse" />
                </div>
                
                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">
                  Transmission Sec-Protocol...
                </p>
              </div>
            )}

            {/* Indicateur de Succès */}
            {!isUploading && (
              <div className="absolute top-6 right-6 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50">
                <CheckCircle2 size={24} />
              </div>
            )}

            {/* Supprimer / Recommencer */}
            {!isUploading && (
              <button 
                onClick={() => setPreviewUrl(null)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-red-500/10 hover:bg-red-500 text-white border border-red-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md"
              >
                Annuler et Scanner à nouveau
              </button>
            )}
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default MediaUploader;