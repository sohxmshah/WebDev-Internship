const pill = document.querySelector('.pill-loader');
const colors = ['#3498db', '#2980b9', '#1abc9c'];
          
// Add random particles
for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
                    
      // Random position inside pill
      const angle = Math.random() * Math.PI * 2;
      const radius = 15;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
                    
      particle.style.left = `calc(50% + ${x}px)`;
      particle.style.top = `calc(50% + ${y}px)`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 40}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 40}px`);
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    
      pill.appendChild(particle);
}
