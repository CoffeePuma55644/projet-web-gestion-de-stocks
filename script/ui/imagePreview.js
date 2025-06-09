import * as DOM from '../domElements.js';

export const updateImagePreview = () => {
    const url = DOM.itemImageInput.value.trim();
    if (url) {
        DOM.imagePreview.src = url;
        DOM.imagePreview.style.display = 'block';
        DOM.imagePreview.onerror = () => {
            DOM.imagePreview.src = 'https://via.placeholder.com/60/FF0000/FFFFFF?text=Erreur';
            // DOM.imagePreview.style.display = 'none'; // Alternative: cacher si erreur
        };
    } else {
        DOM.imagePreview.style.display = 'none';
        DOM.imagePreview.src = '#'; // Clear src
    }
};