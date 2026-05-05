import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t-4 border-orange-600 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Grille principale des liens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Colonne 1 : Identité et Mission */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="text-lg font-extrabold tracking-tight text-white mb-3 block">
              Recens<span className="text-orange-500">CI</span>
            </Link>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Infrastructure Publique Numérique pour l'État Civil et la Gouvernance Démographique de la Côte d'Ivoire.
            </p>
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              République de Côte d'Ivoire
            </p>
          </div>

          {/* Colonne 2 : Services Publics */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Services</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/demarches" className="hover:text-orange-400 transition-colors">Démarches en ligne</Link>
              </li>
              <li>
                <Link to="/suivi" className="hover:text-orange-400 transition-colors">Suivi de dossier</Link>
              </li>
              <li>
                <Link to="/statistiques" className="hover:text-orange-400 transition-colors">Observatoire Démographique</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Assistance et Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Assistance</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/faq" className="hover:text-orange-400 transition-colors">Foire Aux Questions (FAQ)</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-orange-400 transition-colors">Support technique</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition-colors">Nous contacter</Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Cadre Légal */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Cadre Légal</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/mentions-legales" className="hover:text-orange-400 transition-colors">Mentions légales</Link>
              </li>
              <li>
                <Link to="/confidentialite" className="hover:text-orange-400 transition-colors">Politique de confidentialité</Link>
              </li>
              <li>
                <Link to="/accessibilite" className="hover:text-orange-400 transition-colors">Accessibilité</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre inférieure : Copyright et Réseaux */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] sm:text-xs text-gray-500 text-center md:text-left font-mono">
            &copy; {currentYear} RECENSCI - OFFICE NATIONAL DE L'ÉTAT CIVIL ET DE L'IDENTIFICATION (ONECI). TOUS DROITS RÉSERVÉS.
          </p>
          
          {/* Réseaux sociaux */}
          <div className="flex space-x-6 text-xs font-semibold uppercase tracking-widest">
            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
              Facebook
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;