import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from "../../../store"; 
import { 
  ClipboardList, CheckCircle, Zap, ArrowRight,
  ShieldCheck, MousePointer2, Activity, Users, 
  Calendar, X, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from "../../../supabaseClient";

// --- CONSTANTES DE FLUX (Simulation) ---
const INCOMING_TASKS = [
  { id: 'DOC-2026-X1', type: 'Acte de Naissance', usager: 'Kouassi Kouamé', urgence: 'Haute', arrivee: '10 min' },
  { id: 'DOC-2026-X2', type: 'Certificat de Résidence', usager: 'Awa Diop', urgence: 'Standard', arrivee: '25 min' },
  { id: 'DOC-2026-X3', type: 'Extrait de Mariage', usager: 'Jean-Pierre Koffi', urgence: 'Basse', arrivee: '45 min' },
];

const AGENTS_LOAD = [
  { id: 'agent-001', name: 'Agent Bamba', status: 'online', tasks: 2, performance: '92%' },
  { id: 'agent-002', name: 'Agent Yao', status: 'online', tasks: 5, performance: '85%' },
  { id: 'agent-003', name: 'Agent Koné', status: 'offline', tasks: 0, performance: '70%' },
];

export default function ChefServiceDashboard() {
  const { name, commune, id: chefId } = useSelector((state: RootState) => state.user);
  const [tasks, setTasks] = useState(INCOMING_TASKS);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const communeName = (commune && commune !== "Inconnue") 
    ? commune 
    : (localStorage.getItem('commune_secours') || "Abidjan");

  const openAssignment = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // 👉 LOGIQUE RÉELLE DE TRANSMISSION SUPABASE
  const confirmAssignment = async (agent: any) => {
    if (!selectedTask || !agent.id) return;

    setIsAssigning(true);
    try {
      const { error } = await supabase
        .from('assignments')
        .insert([{
          task_id: selectedTask.id,
          task_type: selectedTask.type,
          usager_name: selectedTask.usager,
          agent_id: agent.id,
          chef_id: chefId,
          status: 'PENDING'
        }]);

      if (error) throw error;

      toast.success(`Dossier ${selectedTask.id} transmis à ${agent.name}`, {
        icon: '📡',
        style: { 
          background: '#050914', 
          color: '#fbbf24', 
          border: '1px solid rgba(251, 191, 36, 0.3)',
          fontWeight: 'black',
          borderRadius: '15px'
        }
      });
      
      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (err: any) {
      toast.error("Échec de la liaison avec le serveur souverain.");
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 w-full text-slate-300 font-sans overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* --- HEADER DE SERVICE --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={10} /> Niveau 3 : Chef de Service
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">État Civil</span>
          </h1>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">
            Gestion des Flux • {communeName} • Responsable : {name || "Chef de Service"}
          </p>
        </div>
        
        <div className="flex gap-3">
           <div className="px-4 py-2.5 bg-[#050914] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-lg">
              <Activity size={16} className="text-emerald-500" />
              <div className="flex flex-col text-[10px] font-black text-white uppercase">Capacité Optimale</div>
           </div>
           <div className="px-4 py-2.5 bg-[#050914] border border-white/10 rounded-xl flex items-center gap-2.5 shadow-lg">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase text-white">Avril 2026</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* --- SECTION GAUCHE : DOSSIERS ENTRANTS --- */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-500" /> Files d&apos;attente prioritaires
            </h3>
            <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {tasks.length} Nouveaux Dossiers
            </span>
          </div>

          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div 
                key={task.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 bg-[#050914]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] flex items-center justify-between group hover:border-amber-500/30 transition-all shadow-xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                    <Zap size={20} className={task.urgence === 'Haute' ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{task.type}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>Réf: {task.id}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="text-amber-500/80">Usager: {task.usager}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Attente</span>
                    <span className="text-[10px] font-black text-slate-400">{task.arrivee}</span>
                  </div>
                  <button 
                    onClick={() => openAssignment(task)}
                    className="px-6 py-3.5 bg-white text-slate-950 text-[10px] font-black uppercase rounded-2xl hover:bg-amber-500 transition-all flex items-center gap-2 shadow-lg group-hover:shadow-amber-500/20"
                  >
                    Dispatcher <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <CheckCircle size={48} className="mx-auto text-emerald-500 opacity-20 mb-4" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocole de flux terminé</p>
            </motion.div>
          )}
        </div>

        {/* --- SECTION DROITE : DISPONIBILITÉ ÉQUIPE --- */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#050914]/80 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2 text-blue-400">
              <Users size={16} /> Équipe en Service
            </h3>
            
            <div className="space-y-4">
              {AGENTS_LOAD.map((agent, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                      <p className="text-xs font-black text-white uppercase tracking-tight">{agent.name}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-500">{agent.performance} perf.</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-[8px] font-bold text-slate-500 uppercase">Charge : {agent.tasks} dossiers</p>
                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${agent.tasks > 4 ? 'bg-rose-500' : 'bg-blue-500'} transition-all`} 
                        style={{ width: `${(agent.tasks / 6) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALE D'AFFECTATION --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isAssigning && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#050914] border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white pointer-events-none">
                <ShieldCheck size={180} />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-1">Confirmation d&apos;affectation</p>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Dossier {selectedTask?.id}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 rounded-2xl text-slate-500 transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-10 relative z-10">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-4">Sélectionner l&apos;agent traitant :</p>
                {AGENTS_LOAD.filter(a => a.status === 'online').map((agent, i) => (
                  <button
                    key={i}
                    disabled={isAssigning}
                    onClick={() => confirmAssignment(agent)}
                    className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-amber-500">
                        {agent.name.substring(6, 8)}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-black text-white uppercase">{agent.name}</span>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{agent.tasks} Dossiers</p>
                      </div>
                    </div>
                    {isAssigning ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <MousePointer2 size={16} className="text-amber-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
              >
                Annuler l&apos;opération
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}