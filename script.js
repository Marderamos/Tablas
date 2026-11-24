document.addEventListener('DOMContentLoaded', () => {

  console.log('IVO: página cargada correctamente');

  const menu = document.getElementById('menu');
  const menuPanel = document.getElementById('menuPanel');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const openBtn = document.getElementById('openMenu');
  const closeBtn = document.getElementById('closeMenu');
  const menuLinks = document.querySelectorAll('.menu-link');
  const video = document.getElementById('heroVideo');
  const hero = document.getElementById('hero');
  const playBtn = document.getElementById('playBtn');
  const iconPlay = document.getElementById('iconPlay');
  const iconPause = document.getElementById('iconPause');
  const API_URL = 'https://www.unedl.edu.mx/test/login.php';

  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const generatedPassword = document.getElementById('generatedPassword');
  const loginMessage = document.getElementById('loginMessage');
  const loginSubmit = document.getElementById('loginSubmit');

  const profileCard = document.getElementById('profileCard');
  const profilePhoto = document.getElementById('profilePhoto');
  const profileName = document.getElementById('profileName');
  const profileRole = document.getElementById('profileRole');
  const profileEmail = document.getElementById('profileEmail');
  const logoutBtn = document.getElementById('logoutBtn');

  let currentUser = null;


  let menuOpen = false;

  function openMenu() {

  if (menuOpen || !loginModal.classList.contains('is-hidden')) return;

  menuOpen = true;

    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeMenu() {

    if (!menuOpen) return;

    menuOpen = false;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openMenu();

  });

  document.addEventListener('click', (e) => {
  if (menuOpen) return;
  if (!loginModal.classList.contains('is-hidden')) return;
  if (menuPanel.contains(e.target)) return;
  if (loginModal.contains(e.target)) return;
  openMenu();
});

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  menuBackdrop.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  function updatePlayIcon() {

    const playing = !video.paused;

    iconPlay.classList.toggle('hidden', playing);
    iconPause.classList.toggle('hidden', !playing);
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute(
      'aria-label',
      playing ? 'Pausar video' : 'Reproducir video'
    );

  }

video.muted = true;
video.loop = true;
video.autoplay = true;
video.playsInline = true;

function startVideo() {

  video.play().catch((error) => {
    console.warn('No se pudo iniciar el video automáticamente:', error);
  });
}

startVideo();

video.addEventListener('canplay', startVideo, { once: true });
video.addEventListener('play', updatePlayIcon);
video.addEventListener('pause', updatePlayIcon);

  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();

    }

  });

  video.addEventListener('play', updatePlayIcon);
  video.addEventListener('pause', updatePlayIcon);

  video.addEventListener('error', () => {
    console.error('No se encontró assets/video.mp4');
    hero.classList.add('no-video');
  });

  function showLogin() {

    if (currentUser) return;

    if (menuOpen) closeMenu();

    loginModal.classList.remove('is-hidden');
    loginModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => usernameInput.focus(), 150);

  }
  function hideLogin() {

    loginModal.classList.add('is-hidden');
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

  }
  function updateGeneratedPassword() {

    const username = usernameInput.value.trim().toLowerCase();

    generatedPassword.value = username ? `${username}123` : '';

  }
  usernameInput.addEventListener('input', updateGeneratedPassword);

  function showProfile(user) {

    profileName.textContent = user.nombre || user.usuario || 'Usuario';
    profileRole.textContent = user.rol || 'Usuario';
    profileEmail.textContent = user.correo || '';

    if (user.foto) {
      profilePhoto.src = user.foto;
      profilePhoto.classList.remove('hidden');
    } else {
      profilePhoto.classList.add('hidden');
    }

    profileCard.classList.remove('hidden');
    profileCard.classList.add('flex');

  }
  loginForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const usuario = usernameInput.value.trim().toLowerCase();
    const correo = emailInput.value.trim();
    const contrasena = `${usuario}123`;

    loginMessage.textContent = 'Conectando con el servidor...';
    loginSubmit.disabled = true;

    try {

      const response = await fetch(API_URL, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },

        body: JSON.stringify({
          usuario: usuario,
          contrasena: contrasena,
          correo: correo
        })

      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.mensaje || 'No fue posible iniciar sesión.'
        );
      }

      const user = result.data?.usuario;

      if (!user) {
        throw new Error('El servidor no devolvió los datos esperados del usuario.');
      }

      currentUser = user;

      showProfile(currentUser);
      hideLogin();

      loginMessage.textContent = '';

    } catch (error) {

      console.error('Error de inicio de sesión:', error);

      loginMessage.textContent =
        error.message || 'Ocurrió un error al conectar con el servidor.';

    } finally {

      loginSubmit.disabled = false;

    }

  });
  logoutBtn.addEventListener('click', (e) => {

    e.stopPropagation();

    currentUser = null;

    profileCard.classList.add('hidden');
    profileCard.classList.remove('flex');

    loginForm.reset();
    generatedPassword.value = '';
    loginMessage.textContent = '';

    showLogin();

  });
  setTimeout(showLogin, 5000);

  updatePlayIcon();

});
