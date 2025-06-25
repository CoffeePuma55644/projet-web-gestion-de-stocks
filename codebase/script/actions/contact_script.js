// Afficher l'année courante dans le footer
document.getElementById('currentYear').textContent = new Date().getFullYear().toString();

// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Merci pour votre message ! Nous vous contacterons bientôt.');
    this.reset();
});