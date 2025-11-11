const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

let gradientOffset = 0;

function animateBackground() {
  gradientOffset += 0.001;

  const gradient = bgCtx.createLinearGradient(
    Math.cos(gradientOffset) * bgCanvas.width,
    Math.sin(gradientOffset) * bgCanvas.height,
    Math.cos(gradientOffset + Math.PI) * bgCanvas.width,
    Math.sin(gradientOffset + Math.PI) * bgCanvas.height
  );

  gradient.addColorStop(0, "#ff6b6b");
  gradient.addColorStop(0.5, "#feca57");
  gradient.addColorStop(1, "#48dbfb");

  bgCtx.fillStyle = gradient;
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  requestAnimationFrame(animateBackground);
}

animateBackground();

// Food items array
const foodEmojis = [
  "🍕",
  "🍔",
  "🍟",
  "🌭",
  "🍿",
  "🥓",
  "🥚",
  "🧀",
  "🍗",
  "🍖",
  "🌮",
  "🌯",
  "🥙",
  "🥗",
  "🍝",
  "🍜",
  "🍲",
  "🍛",
  "🍣",
  "🍱",
  "🥟",
  "🍤",
  "🍙",
  "🍚",
  "🍘",
  "🍥",
  "🥠",
  "🥮",
  "🍢",
  "🍡",
  "🍧",
  "🍨",
  "🍦",
  "🥧",
  "🧁",
  "🍰",
  "🎂",
  "🍮",
  "🍭",
  "🍬",
  "🍫",
  "🍿",
  "🍩",
  "🍪",
  "🌰",
  "🥜",
  "🍯",
  "🥛",
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍉",
  "🍇",
  "🍓",
  "🫐",
  "🍒",
  "🍑",
  "🥭",
  "🍍",
  "🥥",
  "🥝",
  "🍅",
  "🍆",
  "🥑",
  "🥦",
  "🥬",
  "🥒",
  "🌶️",
  "🫑",
  "🌽",
  "🥕",
  "🧄",
  "🧅",
  "🥔",
  "🍠",
  "🥐",
  "🥯",
  "🍞",
  "🥖",
  "🥨",
  "🧇",
  "🥞",
  "🧈",
  "🥩",
  "🍗",
];

// Food particle class
class FoodParticle {
  constructor(container) {
    this.container = container;
    this.element = document.createElement("div");
    this.element.className = "food-item";
    this.reset();
    this.container.appendChild(this.element);
    this.setupEvents();
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = window.innerHeight + 100;
    this.speed = Math.random() * 2 + 1;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 2 - 1;
    this.size = Math.random() * 2 + 2;
    this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];

    this.element.textContent = this.emoji;
    this.element.style.fontSize = this.size + "rem";
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }

  update() {
    this.y -= this.speed;
    this.rotation += this.rotationSpeed;

    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
    this.element.style.transform = `rotate(${this.rotation}deg)`;

    if (this.y < -100) {
      this.reset();
    }
  }

  setupEvents() {
    this.element.addEventListener("click", () => {
      this.speed = 10;
      setTimeout(() => {
        this.speed = Math.random() * 2 + 1;
      }, 500);
    });
  }
}

// Create food particles
const container = document.getElementById("foodContainer");
const foodCount = 25;
const foodParticles = [];

for (let i = 0; i < foodCount; i++) {
  foodParticles.push(new FoodParticle(container));
}

// Animation loop
function animate() {
  foodParticles.forEach((particle) => particle.update());
  requestAnimationFrame(animate);
}

animate();

// Button interaction
document.querySelector(".cta-button").addEventListener("click", () => {
  alert("Time to order some delicious food! 🍕🍔🍣");
});

// Resize handler
window.addEventListener("resize", () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});
