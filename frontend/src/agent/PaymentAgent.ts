export class PaymentAgent {
    constructor() {}

    processPayment(amount: number, userId: string) {
        // TODO: Ajouter la logique de paiement
        console.log(`Paiement de ${amount} pour l'utilisateur ${userId}`);
    }

    refund(paymentId: string) {
        // TODO: Ajouter la logique de remboursement
        console.log(`Remboursement pour le paiement ID: ${paymentId}`);
    }
}