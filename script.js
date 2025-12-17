const contactForm = document.getElementById('contactForm');
const contactsContainer = document.getElementById('contactsContainer');
const contactCount = document.getElementById('contactCount');
const searchInput = document.getElementById('search');
const toast = document.getElementById('toast');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const deleteAllPopup = document.getElementById('deleteAllPopup');
const confirmDeleteAll = document.getElementById('confirmDeleteAll');
const cancelDeleteAll = document.getElementById('cancelDeleteAll');
const deleteOnePopup = document.getElementById('deleteOnePopup');
const confirmDeleteOne = document.getElementById('confirmDeleteOne');
const cancelDeleteOne = document.getElementById('cancelDeleteOne');

let contactToDelete = null;
let contacts = [];

// Ladda sparade kontakter
if(localStorage.getItem('contacts')) {
  contacts = JSON.parse(localStorage.getItem('contacts'));
  sortContacts();
  renderContacts();
}

// Spara kontakter i localStorage
function saveContacts() {
  localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Färg för avatar
function getColorFromLetter(letter) {
  const colors = [
    '#FFCDD2','#F8BBD0','#E1BEE7','#D1C4E9','#C5CAE9','#BBDEFB','#B3E5FC','#B2EBF2',
    '#B2DFDB','#C8E6C9','#DCEDC8','#F0F4C3','#FFF9C4','#FFECB3','#FFE0B2','#FFCCBC',
    '#D7CCC8','#CFD8DC'
  ];
  const index = (letter.toUpperCase().charCodeAt(0) - 65) % colors.length;
  return colors[index];
}

// Toast meddelande
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// Validering
function validateInput(firstName, lastName, phone, email) {
  const nameRegex = /^[A-Za-zÅÄÖåäö\s-]+$/;
  const phoneRegex = /^[0-9+\s-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!nameRegex.test(firstName) || !nameRegex.test(lastName)) { showToast("Felaktigt namnformat!"); return false; }
  if(!phoneRegex.test(phone)) { showToast("Felaktigt telefonnummer!"); return false; }
  if(!emailRegex.test(email)) { showToast("Felaktig e-postadress!"); return false; }
  return true;
}

// Sortera kontakter efter förnamn
function sortContacts() {
  contacts.sort((a,b) => a.firstName.localeCompare(b.firstName));
}

// Rendera kontaktkort
function renderContacts() {
  contactsContainer.innerHTML = '';
  contacts.forEach(c => createContactCard(c));
  updateContactCount();
}

// Lägg till/redigera kontakt
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  if(!validateInput(firstName,lastName,phone,email)) return;

  const editingIndex = contactForm.dataset.editing;
  if(editingIndex != null) {
    contacts[editingIndex] = {firstName,lastName,phone,email};
    delete contactForm.dataset.editing;
    showToast("Kontakt uppdaterad!");
  } else {
    contacts.push({firstName,lastName,phone,email});
    showToast("Kontakt tillagd!");
  }

  sortContacts();
  saveContacts();
  renderContacts();
  contactForm.reset();
});

// Skapa kontaktkort
function createContactCard(contact) {
  const contactCard = document.createElement('div');
  contactCard.classList.add('contactCard');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  avatar.textContent = contact.firstName.charAt(0).toUpperCase();
  avatar.style.background = getColorFromLetter(contact.firstName.charAt(0));

  const info = document.createElement('div');
  info.innerHTML = `<strong>${contact.firstName} ${contact.lastName}</strong><br>Telefon: ${contact.phone}<br>E-post: ${contact.email}`;

  const buttons = document.createElement('div');
  buttons.classList.add('card-buttons');

  const editBtn = document.createElement('button');
  editBtn.innerHTML = "✏️ Redigera"; editBtn.classList.add('edit-btn');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = "🗑️ Radera"; deleteBtn.classList.add('delete-btn');

  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  contactCard.appendChild(avatar);
  contactCard.appendChild(info);
  contactCard.appendChild(buttons);
  contactsContainer.appendChild(contactCard);
  setTimeout(() => contactCard.classList.add('show'), 50);

  // Redigera
  editBtn.addEventListener('click', () => {
    document.getElementById('firstName').value = contact.firstName;
    document.getElementById('lastName').value = contact.lastName;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    contactForm.dataset.editing = contacts.indexOf(contact);
    showToast("Fyll i formuläret och klicka på lägg till kontakt för att uppdatera kontakten.");
  });

  // Radera
 deleteBtn.addEventListener('click', () => {
  contactToDelete = contact;
  deleteOnePopup.style.display = 'flex';
});
}

// Uppdatera räknare
function updateContactCount() {
  contactCount.textContent = contacts.length;
}

// Sök
searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase();
  const cards = contactsContainer.getElementsByClassName('contactCard');
  Array.from(cards).forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(filter) ? 'flex' : 'none';
  });
});

// Radera alla kontakter
deleteAllBtn.addEventListener('click', () => {
  deleteAllPopup.style.display = 'flex';
});

cancelDeleteAll.addEventListener('click', () => {
  deleteAllPopup.style.display = 'none';
});

confirmDeleteAll.addEventListener('click', () => {
  contacts = [];
  saveContacts();
  renderContacts();
  deleteAllPopup.style.display = 'none';
  showToast("Alla kontakter raderade!");
});

// Bekräftelse för radering av enskild kontakt
cancelDeleteOne.addEventListener('click', () => {
  contactToDelete = null;               // Nollställer vald kontakt
  deleteOnePopup.style.display = 'none'; // Stänger popup rutan
});

confirmDeleteOne.addEventListener('click', () => {
  if (contactToDelete) {
    contacts = contacts.filter(c => c !== contactToDelete); // Tar bort kontakten
    saveContacts();                                         // Sparar ändringen
    renderContacts();                                      // Uppdaterar listan
    showToast("Kontakt raderad!");
  }
  contactToDelete = null;               // Rensar temporär variabel
  deleteOnePopup.style.display = 'none'; // Stänger popuprutan
});

const darkModeBtn = document.getElementById('darkModeBtn');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
