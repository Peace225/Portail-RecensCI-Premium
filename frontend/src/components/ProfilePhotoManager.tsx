import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../supabaseClient";
import { updateProfile } from "../store/userSlice";
import { RootState } from "../store";
import { 
  Camera, Cpu, CheckCircle, RefreshCw, ShieldCheck 
} from "lucide-react";
import { toast } from "react-hot-toast";
import DocumentUploadHUD from "./DocumentUploadHUD"; 

const ProfilePhotoManager: React.FC = () => {
  const dispatch = useDispatch();
  const { id, photoUrl, name, email, nni } = useSelector((state: RootState) => state.user);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUploadSuccess = async (url: string) => {
    console.log("🚀 URL reçue de Cloudinary :", url);
    setIsUpdating(true);
    const loadingToast = toast.loading("Chiffrement et synchronisation...");

    try {
      // 1. On tente la mise à jour dans Supabase
      // NOTE : Si ça bloque ici, vérifie que 'pob' et 'dob' ne sont pas NOT NULL dans ta base !
      const { error } = await supabase
        .from('citizens')
        .upsert({ 
          id: id, 
          photo_url: url,
          email: email, 
          nom: name.split(' ')[1] || "",
          prenoms: name.split(' ')[0] || "",
          nni: nni
          // Si dob et pob sont obligatoires, il faudrait les rajouter ici aussi
        }, { onConflict: 'id' });

      if (error) {
        console.error("❌ Erreur Supabase détaillée :", error);
        throw error;
      }

      // 2. Mise à jour immédiate du Store Redux
      dispatch(updateProfile({ photoUrl: url }));
      toast.success("Signature Biométrique synchronisée !", { id: loadingToast });

    } catch (error: any) {
      console.error("❌ Échec de l'opération :", error);
      toast.error(`Erreur : ${error.message || "Liaison perdue"}`, { id: loadingToast });
    } finally {
      // ON FORCE L'ARRÊT DU SPINNER
      setIsUpdating(false);
      console.log("✅ Chargement terminé.");
    }
  };

  return (
    <div className="glass-hud p-8 rounded-[3rem] border border-white/5 flex flex-col items-center gap-6 max-w-sm mx-auto shadow-2xl relative">
      <div className="relative group">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-900 rounded-[2.5rem] border-2 border-orange-500/20 overflow-hidden relative shadow-2xl">
          {photoUrl ? (
            <img 
                src={photoUrl} 
                alt="Profil" 
                key={photoUrl} // Force le re-rendu quand l'URL change
                className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-950">
              <Camera size={40} className="opacity-20" />
            </div>
          )}
          
          {/* Ligne de scan laser */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-500 shadow-[0_0_15px_#f97316] animate-scan-v pointer-events-none z-20" />
        </div>
        
        {/* Spinner de chargement overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center z-30">
            <RefreshCw className="text-orange-500 animate-spin mb-2" size={32} />
            <span className="text-[8px] font-black text-white uppercase tracking-widest">Upload...</span>
          </div>
        )}
      </div>

      <div className="w-full text-center space-y-4">
        <h4 className="text-white font-black italic uppercase tracking-tighter text-lg truncate">
          {name || 'Citoyen'}
        </h4>

        <DocumentUploadHUD 
          label="Mettre à jour ma photo" 
          onUploadSuccess={handleUploadSuccess} 
        />
      </div>

      <div className="flex items-center gap-2 text-emerald-500/80 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
        <ShieldCheck size={14} />
        <span className="text-[8px] font-black uppercase tracking-widest text-white">
          Souveraineté Numérique Active
        </span>
      </div>
    </div>
  );
};

export default ProfilePhotoManager;