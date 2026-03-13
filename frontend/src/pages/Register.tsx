// src/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { Card, CardContent } from "../components/Card";

const Register: React.FC = () => {
  // États du formulaire
  const [nni, setNni] = useState("");
  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // États de l'interface
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const navigate = useNavigate(); // À décommenter avec react-router

  const validateForm = () => {
    if (nni.length !== 10) return "Le NNI doit contenir exactement 10 chiffres.";
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    // Simulation d'un appel API (ex: vérification du NNI avec l'ONECI puis création Firebase Auth)
    setTimeout(() => {
      setIsLoading(false);
      alert("Compte citoyen créé avec succès ! Veuillez vérifier votre email pour activer votre compte.");
      // navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* En-tête / Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="w-2 h-10 bg-green-600 rounded-sm"></div>
          <h2 className="text-4xl font-extrabold tracking-tight text-orange-600">
            Recens<span className="text-gray-900">CI</span>
          </h2>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Créer mon Espace Citoyen
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Simplifiez vos démarches d'état civil en ligne
        </p>
      </div>

      {/* Conteneur du formulaire */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Card className="shadow-xl border-t-4 border-t-green-600">
          <CardContent className="py-8 px-4 sm:px-10">
            
            {/* Affichage des erreurs de validation */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Le NNI est le pivot de l'identité en CI */}
              <Input
                label="Numéro National d'Identification (NNI)"
                placeholder="Ex: 0123456789"
                maxLength={10}
                value={nni}
                onChange={(e) => setNni(e.target.value.replace(/\D/g, ''))} // N'accepte que les chiffres
                required
                leftIcon={<IdCardIcon className="w-5 h-5" />}
                helperText="Votre NNI à 10 chiffres se trouve sur votre carte d'identité ou récépissé ONECI."
              />

              {/* Grille pour Nom et Prénoms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Nom de famille"
                  placeholder="Ex: KOUASSI"
                  value={nom}
                  onChange={(e) => setNom(e.target.value.toUpperCase())} // Force les majuscules
                  required
                />
                <Input
                  label="Prénoms"
                  placeholder="Ex: Koffi Jean"
                  value={prenoms}
                  onChange={(e) => setPrenoms(e.target.value)}
                  required
                />
              </div>

              {/* Grille pour Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Adresse Email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<MailIcon className="w-5 h-5" />}
                />
                <Input
                  label="Téléphone"
                  type="tel"
                  placeholder="0102030405"
                  maxLength={10}
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value.replace(/\D/g, ''))}
                  required
                  leftIcon={<PhoneIcon className="w-5 h-5" />}
                />
              </div>

              <div className="border-t border-gray-200 pt-5 mt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    leftIcon={<LockIcon className="w-5 h-5" />}
                  />
                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    leftIcon={<LockCheckIcon className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Case à cocher pour les CGU */}
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    J'accepte les <a href="#" className="text-orange-600 hover:underline">conditions d'utilisation</a> et la politique de protection des données de l'ONECI.
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                isLoading={isLoading}
              >
                Créer mon espace
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 hover:underline">
                  Connectez-vous ici
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

/* --- Icônes (Heroicons) --- */
const MailIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
const LockIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const LockCheckIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IdCardIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>;
const PhoneIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const ExclamationCircleIcon = (props: any) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;