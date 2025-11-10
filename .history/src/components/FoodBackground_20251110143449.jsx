import { useEffect, useRef } from "react";

const FoodBackground = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

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
    "🍩",
    "🍪",
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
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let gradientOffset = 0;

    const animateBackground = () => {
      gradientOffset += 0.001;

      const gradient = ctx.createLinearGradient(
        Math.cos(gradientOffset) * canvas.width,
        Math.sin(gradientOffset) * canvas.height,
        Math.cos(gradientOffset + Math.PI) * canvas.width,
        Math.sin(gradientOffset + Math.PI) * canvas.height
      );

      gradient.addColorStop(0, "rgba(0, 180, 81, 0.8)");
      gradient.addColorStop(0.5, "rgba(102, 205, 90, 0.8)");
      gradient.addColorStop(1, "rgba(200, 255, 120, 0.8)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animateBackground);
    };

    animateBackground();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    class FoodParticle {
      constructor(containerElement) {
        this.container = containerElement;
        this.element = document.createElement("div");
        this.element.className = "food-particle";
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

      destroy() {
        this.element.remove();
      }
    }

    const foodCount = 25;
    const particles = [];

    for (let i = 0; i < foodCount; i++) {
      particles.push(new FoodParticle(container));
    }

    particlesRef.current = particles;

    let animationId;
    const animate = () => {
      particles.forEach((particle) => particle.update());
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      particles.forEach((particle) => particle.destroy());
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
      />
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />
      <style>{`
        .food-particle {
          position: absolute;
          opacity: 0.8;
          cursor: pointer;
          transition: transform 0.3s ease;
          user-select: none;
          pointer-events: auto;
        }
        .food-particle:hover {
          transform: scale(1.3) rotate(20deg) !important;
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default FoodBackground;
