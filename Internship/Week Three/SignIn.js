// Mouse movement 3D rotation effect on card
const card = document.getElementById('login-card');

card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Calculate rotation (-10 to 10 degrees)
      const rx = ((y - cy) / cy) * 10;
      const ry = ((x - cx) / cx) * 10;

      card.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;
});

card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
});

// Form validation example
const form = document.getElementById('login-form');
form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.email.value.trim();
      const password = form.password.value.trim();
      if (!email) {
        alert('Please enter your email address.');
        form.email.focus();
        return;
      }
      if (!password) {
        alert('Please enter your password.');
        form.password.focus();
        return;
      }
      if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        form.password.focus();
        return;
      }
      alert('Login successful (demo).');
      form.reset();
});
