export interface ChatbotResponse {
  text: string;
  suggestions?: string[];
  action?: {
    type: 'navigate' | 'show_info';
    data: any;
  };
}

export class ChatbotKnowledge {
  private static responses: { [key: string]: ChatbotResponse } = {
    // Greetings
    'greeting': {
      text: 'Bonjour ! Je suis votre assistant virtuel pour le système d\'intervention. Je peux vous aider avec :\n\n• Création et gestion d\'interventions\n• Compréhension des statuts et priorités\n• Navigation dans l\'interface\n• Export de données\n• Notifications\n\nQue souhaitez-vous savoir ?',
      suggestions: [
        'Comment créer une intervention ?',
        'Quels sont les statuts disponibles ?',
        'Comment rechercher une intervention ?',
        'Aide avec les notifications'
      ]
    },

    // Intervention creation
    'create_intervention': {
      text: '📝 **Créer une nouvelle intervention**\n\nVoici les étapes :\n\n1. **Accédez au formulaire** : Cliquez sur "Créer une intervention"\n2. **Remplissez les champs obligatoires** :\n   • Titre (descriptif et clair)\n   • Description (détails du problème)\n3. **Choisissez la priorité** :\n   • 🔴 Critique : Urgence maximale\n   • 🟠 Haute : Important\n   • 🔵 Normale : Standard\n   • ⚪ Basse : Non urgent\n4. **Optionnel** : Ajoutez l\'équipement concerné\n5. **Validez** : Cliquez sur "Créer l\'intervention"\n\n💡 **Conseil** : Plus votre description est précise, plus le technicien pourra intervenir efficacement !',
      suggestions: [
        'Quels sont les statuts d\'intervention ?',
        'Comment suivre mes interventions ?',
        'Que faire si j\'ai fait une erreur ?'
      ]
    },

    // Status explanation
    'intervention_status': {
      text: '📊 **Statuts d\'intervention**\n\nVoici les différents statuts :\n\n🟡 **En attente** : Votre demande est enregistrée et attend d\'être assignée à un technicien\n\n🔵 **En cours** : Un technicien a été assigné et travaille sur votre intervention\n\n🟢 **Terminée** : L\'intervention est clôturée et le problème résolu\n\n🔴 **Annulée** : L\'intervention a été annulée (par vous ou un admin)\n\n💡 **Suivi** : Vous recevrez des notifications à chaque changement de statut !',
      suggestions: [
        'Comment changer le statut ?',
        'Qui peut modifier les statuts ?',
        'Que faire si mon intervention reste en attente ?'
      ]
    },

    // Priority explanation
    'intervention_priority': {
      text: '⚡ **Priorités d\'intervention**\n\n🔴 **Critique** :\n• Problème bloquant la production\n• Sécurité compromise\n• Impact sur de nombreux utilisateurs\n\n🟠 **Haute** :\n• Problème important mais non bloquant\n• Impact sur quelques utilisateurs\n• Besoin de résolution rapide\n\n🔵 **Normale** :\n• Problème standard\n• Impact limité\n• Résolution dans les délais normaux\n\n⚪ **Basse** :\n• Amélioration ou demande mineure\n• Pas d\'urgence\n• Peut attendre\n\n💡 **Conseil** : Choisissez la priorité qui correspond vraiment à l\'impact du problème !',
      suggestions: [
        'Comment changer la priorité ?',
        'Qui assigne les techniciens ?',
        'Temps de réponse par priorité ?'
      ]
    },

    // Search help
    'search_help': {
      text: '🔍 **Recherche d\'interventions**\n\n**Barre de recherche** (en haut à gauche) :\n• Tapez au moins 2 caractères\n• Recherche dans : titre, description, équipement\n• Résultats en temps réel\n• Navigation au clavier (flèches + Entrée)\n\n**Filtres disponibles** :\n• Par statut (En attente, En cours, etc.)\n• Par priorité\n• Par technicien assigné\n• Par date de création\n\n**Navigation** :\n• Cliquez sur un résultat pour voir les détails\n• Page complète avec toutes les informations\n• Bouton retour pour revenir à la liste',
      suggestions: [
        'Comment filtrer les résultats ?',
        'Recherche avancée disponible ?',
        'Comment sauvegarder une recherche ?'
      ]
    },

    // Notifications help
    'notifications_help': {
      text: '🔔 **Système de notifications**\n\n**Types de notifications** :\n\n🆕 **Nouvelle intervention** : Quand vous créez une demande\n👤 **Intervention assignée** : Quand un technicien vous est assigné\n✅ **Intervention terminée** : Quand votre demande est clôturée\n✔️ **Intervention validée** : Quand l\'admin valide votre demande\n\n**Comment les consulter** :\n• Cliquez sur l\'icône cloche (🔔) en haut à droite\n• Badge rouge = notifications non lues\n• Marquez comme lu individuellement ou toutes d\'un coup\n\n**Paramètres** : Les notifications sont automatiques et ne peuvent pas être désactivées.',
      suggestions: [
        'Comment marquer comme lu ?',
        'Notifications par email ?',
        'Historique des notifications ?'
      ]
    },

    // Export help
    'export_help': {
      text: '📄 **Export de données**\n\n**Formats disponibles** :\n\n📋 **PDF** :\n• Tableau formaté pour impression\n• En-tête avec date et filtres\n• Optimisé pour l\'impression\n\n📊 **Excel** :\n• Données complètes exportables\n• Toutes les colonnes disponibles\n• Format .xlsx compatible\n\n🖨️ **Impression** :\n• Page HTML optimisée\n• Mise en page automatique\n• Compatible avec tous les navigateurs\n\n**Utilisation** :\n• Allez dans "Interventions"\n• Appliquez vos filtres si nécessaire\n• Cliquez sur PDF, Excel ou Imprimer\n• Les exports respectent vos filtres actuels',
      suggestions: [
        'Comment filtrer avant export ?',
        'Export de toutes les données ?',
        'Format des dates dans l\'export ?'
      ]
    },

    // Roles and permissions
    'roles_permissions': {
      text: '👥 **Rôles et permissions**\n\n**🔧 Administrateur** :\n• Gestion complète du système\n• Validation des interventions\n• Assignation des techniciens\n• Gestion des utilisateurs\n• Accès aux statistiques\n• Export de toutes les données\n\n**🛠️ Technicien** :\n• Voir les interventions assignées\n• Mettre à jour les statuts\n• Marquer comme terminé\n• Accès aux statistiques personnelles\n\n**👤 Utilisateur** :\n• Créer des interventions\n• Suivre ses propres demandes\n• Voir l\'historique personnel\n• Export de ses données\n\n💡 **Sécurité** : Chaque utilisateur ne voit que ce qui le concerne !',
      suggestions: [
        'Comment changer de rôle ?',
        'Permissions spéciales ?',
        'Accès aux statistiques ?'
      ]
    },

    // Technical support
    'technical_support': {
      text: '🛠️ **Support technique**\n\n**Problèmes courants** :\n\n❌ **Page ne se charge pas** :\n• Vérifiez votre connexion internet\n• Actualisez la page (F5)\n• Videz le cache du navigateur\n\n❌ **Erreur de connexion** :\n• Déconnectez-vous et reconnectez-vous\n• Vérifiez vos identifiants\n• Contactez votre administrateur\n\n❌ **Fonctionnalité non accessible** :\n• Vérifiez vos permissions\n• Votre rôle peut ne pas avoir accès\n• Contactez l\'administrateur\n\n❌ **Données manquantes** :\n• Actualisez la page\n• Vérifiez vos filtres\n• Contactez le support\n\n📞 **Contact** : En cas de problème persistant, contactez votre administrateur système.',
      suggestions: [
        'Comment contacter l\'admin ?',
        'Problème de performance ?',
        'Erreur de sauvegarde ?'
      ]
    }
  };

  static getResponse(userMessage: string): ChatbotResponse {
    const message = userMessage.toLowerCase().trim();

    // Greetings
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello') || message.includes('coucou')) {
      return this.responses.greeting;
    }

    // Create intervention
    if (message.includes('créer') || message.includes('nouvelle intervention') || message.includes('demande') || message.includes('ajouter')) {
      return this.responses.create_intervention;
    }

    // Status
    if (message.includes('statut') || message.includes('état') || message.includes('status')) {
      return this.responses.intervention_status;
    }

    // Priority
    if (message.includes('priorité') || message.includes('urgent') || message.includes('critique') || message.includes('haute') || message.includes('normale') || message.includes('basse')) {
      return this.responses.intervention_priority;
    }

    // Search
    if (message.includes('rechercher') || message.includes('trouver') || message.includes('chercher') || message.includes('search')) {
      return this.responses.search_help;
    }

    // Notifications
    if (message.includes('notification') || message.includes('alerte') || message.includes('cloche')) {
      return this.responses.notifications_help;
    }

    // Export
    if (message.includes('export') || message.includes('pdf') || message.includes('excel') || message.includes('imprimer') || message.includes('télécharger')) {
      return this.responses.export_help;
    }

    // Roles
    if (message.includes('rôle') || message.includes('permission') || message.includes('accès') || message.includes('admin') || message.includes('technicien') || message.includes('utilisateur')) {
      return this.responses.roles_permissions;
    }

    // Technical support
    if (message.includes('problème') || message.includes('erreur') || message.includes('bug') || message.includes('aide') || message.includes('support') || message.includes('marche pas')) {
      return this.responses.technical_support;
    }

    // Help
    if (message.includes('aide') || message.includes('help') || message.includes('comment') || message.includes('que puis-je')) {
      return this.responses.greeting;
    }

    // Default response
    return {
      text: 'Je ne suis pas sûr de comprendre votre question. 🤔\n\nJe peux vous aider avec :\n• Création d\'interventions\n• Gestion des statuts et priorités\n• Recherche et navigation\n• Export de données\n• Notifications\n• Support technique\n\nPouvez-vous reformuler votre question ou choisir un sujet ci-dessus ?',
      suggestions: [
        'Comment créer une intervention ?',
        'Quels sont les statuts ?',
        'Aide avec la recherche',
        'Support technique'
      ]
    };
  }
}
