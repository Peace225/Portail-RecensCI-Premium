// src/components/DocumentUploadHUD.tsx
import React, { useState } from "react";
import { UploadCloud, CheckCircle, Loader2, FileImage } from "lucide-react";
import { toast } from "react-hot-toast";

interface DocumentUploadHUDProps {
  label?: string;
  onUploadSuccess: (url: string) => void; // Fonction pour remonter l'URL au composant parent
}

const DocumentUploadHUD: React.FC<DocumentUploadHUDProps> = ({ 
  label = "Transfert de Document Sécurisé", 
  onUploadSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    // Configuration spécifique à ton compte Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "recensci_docs"); // Ton preset Unsigned
    formData.append("cloud_name", "dpje4d7xa"); // Ton Cloud Name

    try {
      // Appel API direct vers Cloudinary
      const response = await fetch("https://api.cloudinary.com/v1_1/dpje4d7xa/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        onUploadSuccess(data.secure_url); // On transmet l'URL finale au formulaire
        toast.success("Document crypté et stocké avec succès", {
          style: { background: '#0f172a', color: '#10b981', border: '1px solid #10b981' }
        });
      } else {
        throw new Error("Erreur lors de la récupération de l'URL");
      }
    } catch (error) {
      console.error("Erreur Cloudinary :", error);
      toast.error("Échec du transfert sécurisé");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-2">
        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      </div>

      {!imageUrl ? (
        <label className="flex flex-col items-center justify-center w-full h-32 bg-black/40 border-2 border-dashed border-white/10 hover:border-orange-500 hover:bg-orange-500/5 transition-all rounded-2xl cursor-pointer group">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-orange-500" size={24} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-500 animate-pulse">
                Cryptage & Transfert...
              </span>
            </div>
          ) : (
            <>
              <UploadCloud className="text-slate-600 group-hover:text-orange-500 mb-2 transition-colors duration-300" size={28} />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">
                Scanner un fichier
              </span>
              <span className="text-[8px] font-bold text-slate-600 uppercase italic mt-1">PNG, JPG, PDF (Max 5MB)</span>
            </>
          )}
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={loading} />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <FileImage className="text-emerald-500" size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Document Validé</span>
              <span className="text-[8px] font-mono text-slate-400">Stockage: Cloudinary (CI-NODE-1)</span>
            </div>
          </div>
          <CheckCircle className="text-emerald-500" size={20} />
        </div>
      )}
    </div>
  );
};

export default DocumentUploadHUD;