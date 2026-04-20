// src/pages/Contact.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulation d'envoi du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation d'un appel API de 2 secondes
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Votre message a été envoyé avec succès à nos services.");
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête de la page */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Besoin d'assistance ?
          </h1>
          <p className="text-lg text-gray-600">
            Nos équipes sont à votre disposition pour vous accompagner dans vos démarches d'état civil ou répondre à vos questions techniques.
          </p>
        </div>

        {/* Grille Principale (Infos à gauche, Formulaire à droite) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne de gauche : Informations de contact institutionnelles */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b pb-2">
                  Nos Coordonnées
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <LocationIcon className="w-6 h-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Siège ONECI</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Plateau, Abidjan<br />
                        Côte d'Ivoire
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <PhoneIcon className="w-6 h-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Centre d'appel</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Numéro vert : <span className="font-semibold text-gray-900">1340</span><br />
                        <span className="text-xs">Lun-Ven, 08h00 - 16h30</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MailIcon className="w-6 h-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Support Technique</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        support@recensci.gouv.ci
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne de droite : Formulaire de contact */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input 
                      label="Nom complet" 
                      placeholder="Ex: Koffi" 
                      required 
                    />
                    <Input 
                      label="Adresse Email" 
                      type="email" 
                      placeholder="Ex: koffi@email.com" 
                      required 
                    />
                  </div>

                  <Input 
                    label="Numéro National d'Identification (Optionnel)" 
                    placeholder="Votre NNI à 10 chiffres" 
                    maxLength={10}
                    helperText="Facilite le traitement si votre demande concerne votre dossier."
                  />

                  {/* Liste déroulante pour le Sujet */}
                  <div className="flex flex-col mb-4">
                    <label className="mb-1.5 text-sm font-semibold text-gray-700">
                      Sujet de la demande <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select 
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="">Sélectionnez un sujet...</option>
                      <option value="suivi">Suivi de mon dossier d'état civil</option>
                      <option value="nni">Problème avec mon NNI</option>
                      <option value="tech">Problème technique sur le portail</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  {/* Zone de texte (Textarea stylisée comme nos Inputs) */}
                  <div className="flex flex-col mb-4">
                    <label className="mb-1.5 text-sm font-semibold text-gray-700">
                      Message <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Détaillez votre problème ou votre question ici..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors duration-200 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-y"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" isLoading={isSubmitting}>
                      Envoyer la demande
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;

/* --- Icônes (Heroicons) --- */
const LocationIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const PhoneIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const MailIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.53 4.389a2 2 0 001.94 0L20 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);