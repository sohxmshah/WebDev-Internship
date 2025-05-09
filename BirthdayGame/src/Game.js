let currentQuestion = 1;
let score = 0;
          
function startGame() {
              document.getElementById('start-screen').classList.remove('active');
              document.getElementById('question1').classList.add('active');
}
          
function checkAnswer(questionNum, element, isCorrect) {
              // Disable all options
              const options = element.parentElement.querySelectorAll('.option');
              options.forEach(opt => {
                  opt.style.pointerEvents = 'none';
                  if (opt === element && isCorrect) {
                      opt.classList.add('correct');
                  } else if (opt === element && !isCorrect) {
                      opt.classList.add('incorrect');
                  }
              });
              
              // Show result
              const result = element.parentElement.nextElementSibling;
              if (isCorrect) {
                  result.textContent = "Correct! That's right!";
                  score++;
              } else {
                  result.textContent = "Not quite! But that's okay!";
              }
              
              // Move to next question after delay
              setTimeout(() => {
                  if (questionNum < 4) {
                      document.getElementById(`question${questionNum}`).classList.remove('active');
                      document.getElementById(`question${questionNum+1}`).classList.add('active');
                  } else {
                      showFinalScreen();
                  }
              }, 1500);
}
          
function showFinalScreen() {
              document.getElementById('question4').classList.remove('active');
              document.getElementById('final-screen').classList.add('active');
}
          
function celebrate() {
            // Create celebration elements
            const celebration = document.getElementById('celebration');
              
            // Create confetti
            for (let i = 0; i < 100; i++) {
                  const confetti = document.createElement('div');
                  confetti.style.position = 'absolute';
                  confetti.style.width = '15px';
                  confetti.style.height = '15px';
                  confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                  confetti.style.left = `${Math.random() * 100}vw`;
                  confetti.style.top = '-20px';
                  confetti.style.borderRadius = '50%';
                  confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
                  celebration.appendChild(confetti);
                  
                  // Create keyframes for falling animation
                  const keyframes = `
                      @keyframes fall {
                          to {
                              transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                              opacity: 0;
                          }
                      }
                  `;
                  
                  // Add style if not already added
                  if (!document.getElementById('celebration-style')) {
                      const style = document.createElement('style');
                      style.id = 'celebration-style';
                      style.innerHTML = keyframes;
                      document.head.appendChild(style);
                  }
                  
                  // Remove confetti after animation
                  setTimeout(() => {
                      confetti.remove();
                  }, 5000);

            }              
            // Play birthday audio
            const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Replace with actual birthday song
            audio.loop = true;
            audio.play().catch(e => console.log("Auto-play prevented: ", e));
}
