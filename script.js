
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



  let menuOpen = false;

  function openMenu() {

    if (menuOpen) return;

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

    if (menuPanel.contains(e.target)) return;

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


  updatePlayIcon();


});
