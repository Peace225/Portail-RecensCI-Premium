import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

const SUGGESTIONS = ['Recenser mon enfant', 'Dossier bloqué', 'Ma carte est en retard'];

const getAIResponse = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes('enregistrer') || t.includes('recensement')) {
    return 'PROTOCOLE D\'ENRÔLEMENT : Présentez un extrait d\'acte de naissance, un certificat de nationalité ou une pièce d\'identité valide dans un centre agréé.';
  }
  if (t.includes('nni') || t.includes('numero national')) {
    return 'INFO NNI : Le Numéro National d\'Identification (NNI) est un numéro unique à 11 chiffres attribué à vie dès votre premier enrôlement biométrique.';
  }
  if (t.includes('famille') || t.includes('enfant') || t.includes('fils') || t.includes('fille')) {
    return 'ENRÔLEMENT FAMILIAL : Présentez les extraits d\'acte de naissance des enfants, votre pièce d\'identité et le livret de famille. La présence physique des enfants de plus de 5 ans est obligatoire.';
  }
  if (t.includes('bloqué') || t.includes('erreur') || t.includes('rejet') || t.includes('doublon')) {
    return 'ASSISTANCE BLOCAGE : Rendez-vous à l\'agence ONECI principale de votre commune avec vos justificatifs originaux pour une mise à jour ou un forçage biométrique.';
  }
  if (t.includes('modifier') || t.includes('mariage') || t.includes('adresse') || t.includes('déménagement')) {
    return 'MISE À JOUR : Pour déclarer un mariage ou un changement d\'adresse, connectez-vous et allez dans la section correspondante de votre espace citoyen.';
  }
  if (t.includes('retard') || t.includes('attente') || t.includes('statut')) {
    return 'SUIVI DE DOSSIER : Si votre carte est en attente depuis plus de 45 jours, vérifiez le statut dans votre tableau de bord ou appelez le numéro vert 1336.';
  }
  if (t.includes('perdu') || t.includes('perte') || t.includes('vol')) {
    return 'PROCÉDURE DE PERTE : 1. Déclaration de perte au commissariat. 2. Timbre d\'enrôlement (5000 FCFA). 3. Rendez-vous dans un centre avec votre NNI et la déclaration.';
  }
  if (t.includes('population') || t.includes('habitants')) {
    return 'DONNÉES DÉMOGRAPHIQUES : La population de la Côte d\'Ivoire avoisine les 29,3 millions d\'habitants selon les projections du RGPH 2021.';
  }
  if (t.includes('sécurité') || t.includes('données')) {
    return 'SÉCURITÉ : Vos données biométriques sont cryptées en norme AES-512 et stockées sur les serveurs souverains sécurisés à Abidjan.';
  }
  if (t.includes('vérifier') || t.includes('identité') || t.includes('certificat')) {
    return 'VÉRIFICATION : Pour vérifier une identité, scannez le QR Code au dos de la carte biométrique ou saisissez le NNI à 11 chiffres.';
  }
  return 'COMMANDE NON RECONNUE. Je peux vous aider pour : le NNI, la perte de carte, l\'enrôlement de vos enfants, le suivi de votre dossier, ou la résolution de blocages.';
};

interface AIChatbotProps {
  visible: boolean;
  onClose: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, sender: 'ai',
      text: 'SYSTÈME INITIALISÉ. Je suis l\'assistant RecensCI. Posez-moi vos questions sur le recensement, l\'enrôlement ou le suivi de vos requêtes.',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = {
      id: Date.now(), sender: 'user', text: msg,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1, sender: 'ai', text: getAIResponse(msg),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botIcon}>
            <Ionicons name="hardware-chip-outline" size={18} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistant Holo-Core</Text>
            <Text style={styles.headerStatus}>STATUS: SYNC_READY</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messagesContent}>
        {messages.map(m => (
          <View key={m.id} style={[styles.msgRow, m.sender === 'user' ? styles.msgRowUser : styles.msgRowAI]}>
            <View style={[styles.bubble, m.sender === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
              <Text style={[styles.bubbleText, m.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextAI]}>
                {m.text}
              </Text>
            </View>
            <Text style={styles.msgTime}>{m.time}</Text>
          </View>
        ))}
        {isTyping && (
          <View style={styles.typingRow}>
            <Ionicons name="terminal-outline" size={12} color={Colors.ciOrange} />
            <Text style={styles.typingText}>Recherche dans la base RNPP...</Text>
          </View>
        )}
      </ScrollView>

      {/* Suggestions */}
      <View style={styles.suggestions}>
        {SUGGESTIONS.map((s, i) => (
          <TouchableOpacity key={i} style={styles.suggestionBtn} onPress={() => sendMessage(s)}>
            <Text style={styles.suggestionText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Posez votre question..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', bottom: 80, right: 16, left: 16,
    backgroundColor: 'rgba(5,9,20,0.97)', borderRadius: 24,
    borderWidth: 1, borderColor: `${Colors.ciOrange}30`,
    maxHeight: 480, overflow: 'hidden',
    shadowColor: Colors.ciOrange, shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  header: {
    backgroundColor: Colors.ciOrange, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botIcon: { padding: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8 },
  headerTitle: { fontSize: 11, fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: 1 },
  headerStatus: { fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' },
  messages: { maxHeight: 240 },
  messagesContent: { padding: 12, gap: 10 },
  msgRow: { gap: 4 },
  msgRowUser: { alignItems: 'flex-end' },
  msgRowAI: { alignItems: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 10, borderRadius: 14 },
  bubbleUser: { backgroundColor: Colors.ciOrange, borderTopRightRadius: 4 },
  bubbleAI: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: Colors.border, borderTopLeftRadius: 4 },
  bubbleText: { fontSize: 11, lineHeight: 16, fontFamily: 'monospace' },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAI: { color: Colors.ciOrange },
  msgTime: { fontSize: 8, color: Colors.textMuted, textTransform: 'uppercase' },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typingText: { fontSize: 10, color: Colors.ciOrange, fontFamily: 'monospace' },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  suggestionBtn: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, borderWidth: 1, borderColor: Colors.border },
  suggestionText: { fontSize: 9, color: Colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  inputRow: { flexDirection: 'row', padding: 10, gap: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  input: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, color: '#fff', fontSize: 11, fontFamily: 'monospace' },
  sendBtn: { width: 40, height: 40, backgroundColor: Colors.ciOrange, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});


