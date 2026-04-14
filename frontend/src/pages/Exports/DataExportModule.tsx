// src/pages/Exports/DataExportModule.tsx
import React, { useState } from "react";
import { apiService } from "../../services/apiService";
import { toast } from "react-hot-toast";
import { Database, Download, FileJson, FileSpreadsheet, ShieldAlert, FileText } from "lucide-react";

const DataExportModule: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("birth_records");
  const [format, setFormat] = useState("CSV");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // FONCTION : Conversion d'un tableau d'objets en chaîne CSV
  const convertToCSV = (objArray: any[]) => {
    if (!objArray.length) return "";
    let str = '';
    const headers = Object.keys(objArray[0]).join(',') + '\r\n';
    str += headers;

    for (let i = 0; i < objArray.length; i++) {
      let line = '';
      for (const index in objArray[i]) {
        if (line !== '') line += ',';
        const val = objArray[i][index];
        line += `"${String(val ?? '').replace(/"/g, '""')}"`;
      }
      str += line + '\r\n';
    }
    return str;
  };

  // FONCTION : Déclenchement du téléchargement
  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExport = async () => {
    if (!dateRange.start || !dateRange.end) {
      toast.error("Veuillez sélectionner une période (Date de début et Date de fin).");
      return;
    }

    setLoading(true);
    try {
      const fileName = `INS_${category}_${dateRange.start}_au_${dateRange.end}`;

      if (format === "CSV") {
        // For CSV, request CSV format directly and trigger download
        const endpoint = `/exports/data?table=${encodeURIComponent(category)}&format=csv&startDate=${dateRange.start}&endDate=${dateRange.end}`;
        const csvData = await apiService.get<string>(endpoint);
        const content = typeof csvData === 'string' ? csvData : convertToCSV(Array.isArray(csvData) ? csvData : []);
        if (!content) {
          toast.error("Aucune donnée disponible pour cette période spécifique.");
          return;
        }
        downloadFile(content, `${fileName}.csv`, "text/csv;charset=utf-8;");
      } else {
        const endpoint = `/exports/data?table=${encodeURIComponent(category)}&format=json&startDate=${dateRange.start}&endDate=${dateRange.end}`;
        const data = await apiService.get<any>(endpoint);
        const arr = Array.isArray(data) ? data : (data?.data ?? []);
        if (!arr.length) {
          toast.error("Aucune donnée disponible pour cette période spécifique.");
          return;
        }
        downloadFile(JSON.stringify(arr, null, 2), `${fileName}.json`, "application/json");
      }

      toast.success("Dataset chiffré et exporté avec succès !");
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur de connexion lors de l'extraction des données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
      
      {/* HEADER PREMIUM */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Extraction & Data Export</h2>
          <p className="text-indigo-600 font-black text-[10px] tracking-[0.3em] uppercase mt-2">Interface Partenaires : INS / Gouvernement / Institutions</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2 shadow-sm">
          <Database size={16} /> Accès Habilité
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONFIGURATION EXPORT */}
        <div className="lg:col-span-2">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full -z-0"></div>
            
            <h3 className="text-sm font-black text-slate-800 mb-8 uppercase tracking-widest flex items-center gap-3 relative z-10">
              <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                 <Download size={20} />
              </span>
              Paramètres du Dataset
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Base de données cible</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:shadow-md transition-all outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="birth_records">Naissances (État Civil)</option>
                  <option value="death_records">Décès (État Civil)</option>
                  <option value="marriages">Mariages (État Civil)</option>
                  <option value="divorces">Divorces (État Civil)</option>
                  <option value="census_records">Recensement RGPH</option>
                  <option value="accidents">Accidents Routiers</option>
                  <option value="homicides">Homicides & Crimes</option>
                  <option value="maternal_health">Mortalité Maternelle</option>
                  <option value="international_flows">Flux Frontaliers</option>
                  <option value="internal_migrations">Migrations Internes</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Format d'exportation</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-2 border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormat("CSV")}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${format === "CSV" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-500 hover:bg-white"}`}
                  >
                    <FileSpreadsheet size={16} /> CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("JSON")}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${format === "JSON" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "text-slate-500 hover:bg-white"}`}
                  >
                    <FileJson size={16} /> JSON
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Date de début (Du)</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:shadow-md transition-all outline-none" 
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Date de fin (Au)</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl font-bold text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:shadow-md transition-all outline-none" 
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 relative z-10">
              <button 
                onClick={handleExport}
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-indigo-700 to-indigo-500 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-900/30 uppercase tracking-[0.2em] text-sm hover:from-indigo-800 hover:to-indigo-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-3"
              >
                {loading ? "GÉNÉRATION DU DATASET..." : "EXTRAIRE LES DONNÉES"}
              </button>
            </div>
          </div>
        </div>

        {/* LOGS SIDEBAR */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl h-fit relative overflow-hidden">
            <div className="absolute -right-5 -bottom-5 opacity-5 pointer-events-none">
               <Database size={200} />
            </div>

            <h3 className="text-xs font-black text-indigo-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <FileText size={16} /> Guide Expert INS
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-8 font-medium">
              Le format <strong>CSV</strong> est optimisé pour les tableurs (Excel, SPSS), tandis que le <strong>JSON</strong> est destiné à l'intégration via API gouvernementales.
            </p>

            <div className="p-6 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 backdrop-blur-sm">
               <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <ShieldAlert size={14} /> Rappel Légal (ARTCI)
               </span>
               <p className="text-[10px] text-indigo-200/70 font-medium leading-relaxed">
                 L'extraction massive de données personnelles est strictement encadrée. Toute fuite de données expose l'agent responsable à des sanctions pénales.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportModule;