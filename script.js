document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('click');
    const landingPage = document.querySelector('.landing_page');
    const video = document.querySelector('video');
    const body = document.body;
    const typewriterText = document.querySelector('.typewriter');
    const moreButton = document.querySelector('.more-button');

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initially mute video for autoplay
    video.muted = true;

    // Animate more button on scroll
    gsap.from('.more-button', {
        scrollTrigger: {
            trigger: '.more-button',
            start: 'top bottom',
            end: 'top center',
            scrub: 1
        },
        opacity: 0,
        y: 50,
        duration: 1
    });

    // More button click handler
    moreButton.addEventListener('click', () => {
        window.scrollTo({
            top: document.querySelector('.scrollingText').offsetTop,
            behavior: 'smooth'
        });
    });

    // Text to be typed
    const text = "Bugatti Automobiles";
    let currentText = "";
    
    // Typewriter animation using GSAP
    const tl = gsap.timeline();
    
    // Split text into characters and animate each one
    text.split("").forEach((char, index) => {
        tl.to(typewriterText, {
            duration: 0.1,
            onStart: () => {
                currentText += char;
                typewriterText.textContent = currentText;
            }
        });
    });

    // Scrolling text animation
    gsap.to('.scrollingText h1', {
        x: '-100%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.scrollingText',
            start: 'top top',
            end: '+=300%',
            pin: true,
            scrub: 1,
            markers: false
        }
    });

    btn.addEventListener('click', () => {
        // Collapse landing page
        landingPage.classList.add('non-display');
        
        // Enable scrolling
        body.classList.add('scrollable');
        
        // Unmute and play video
        video.muted = false;
        video.play().catch(error => {
            console.log('Video play failed:', error);
        });
    });

    // Initialize VanillaTilt for the card
    VanillaTilt.init(document.querySelector(".card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });

    // Baffle text effect
    const baffleEffect = baffle(".text");
    baffleEffect.set({
        characters: '█▓█ ▒░/▒░ █░▒▓/ █▒▒ ▓▒▓/█ ░█▒/ ▒▓░░',
        speed: 120,
        exclude: [' ', '!', '.', ',', '?', ':', ';', '-', '_', '(', ')', '[', ']', '{', '}', '|', '\\', '/', '"', "'", '`', '~', '@', '#', '$', '%', '^', '&', '*', '+', '=', '<', '>']
    });
    baffleEffect.start();
    baffleEffect.reveal(4000);

    // Text reveal animation with scramble effect
    gsap.from(".text", {
        scrollTrigger: {
            trigger: ".MoreDiv",
            start: "top center",
            onEnter: () => {
                const baffleEffect = baffle(".text", {
                    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz',
                    speed: 50
                });
                
                // Show the text first
                gsap.to(".text", {
                    opacity: 1,
                    y: 0,
                    duration: 0.5
                });

                // Start scrambling
                baffleEffect.start();
                
                // After 4 seconds, reveal the actual text
                setTimeout(() => {
                    baffleEffect.reveal(500);
                }, 2000);
            }
        },
        opacity: 0,
        y: 50
    });

    // Video hover functionality for cards
    document.querySelectorAll('.cards video').forEach(video => {
        // Pause video initially
        video.pause();
        
        // Play on mouseenter
        video.parentElement.addEventListener('mouseenter', () => {
            video.play();
        });
        
        // Pause on mouseleave
        video.parentElement.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0; // Reset to start
        });
    });
});

var VanillaTilt = (function () {
  'use strict';

  class VanillaTilt {
    constructor(element, settings = {}) {
      if (!(element instanceof Node)) {
        throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
      }

      this.element = element;
      this.settings = this.extendSettings(settings);
      
      this.init();
    }

    init() {
      this.addEventListeners();
      if (this.settings.glare) {
        this.prepareGlare();
      }
    }

    addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);

      this.element.addEventListener("mouseenter", this.onMouseEnterBind);
      this.element.addEventListener("mouseleave", this.onMouseLeaveBind);
      this.element.addEventListener("mousemove", this.onMouseMoveBind);
    }

    onMouseEnter() {
      this.element.style.willChange = "transform";
      this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
    }

    onMouseMove(e) {
      const rect = this.element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const tiltX = ((this.settings.max / 2) - (x * this.settings.max)).toFixed(2);
      const tiltY = ((y * this.settings.max) - (this.settings.max / 2)).toFixed(2);

      this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(${this.settings.scale},${this.settings.scale},${this.settings.scale})`;
    }

    onMouseLeave() {
      this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    }

    prepareGlare() {
      const glare = document.createElement("div");
      glare.classList.add("js-tilt-glare");
      
      const glareInner = document.createElement("div"); 
      glareInner.classList.add("js-tilt-glare-inner");
      
      glare.appendChild(glareInner);
      this.element.appendChild(glare);
    }

    extendSettings(settings) {
      const defaults = {
        max: 15,
        perspective: 1000,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        scale: 1,
        speed: 300,
        glare: false
      };

      return {...defaults, ...settings};
    }

    static init(elements, settings) {
      if (elements instanceof Node) {
        elements = [elements];
      }
      elements.forEach(el => new VanillaTilt(el, settings));
    }
  }

  if (typeof document !== "undefined") {
    window.VanillaTilt = VanillaTilt;
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"));
  }

  return VanillaTilt;
}());







gsap.to(".Img-container .box1", {
  width: "100vw",
  height: "100vh",
  duration: 1,
  ease: "none",
  scrollTrigger: {
      trigger: ".Img-container",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      
      onUpdate: (self) => {
          
          gsap.to(".box2", {
              x: `${-100 * (self.progress)}%`, // Move left slightly
              opacity: 1 - self.progress,
              duration: 0.1
          });
          gsap.to(".box3", {
              y: `${-120 * (self.progress)}%`, // Move up slightly
              opacity: 1 - self.progress,
              duration: 0.1
          });
          gsap.to(".box4", {
              x: `${-100 * (0.9 - self.progress)}%`, // Gradually move right based on scroll progress
              opacity: 1 - self.progress,
              duration: 0.1
          });
          gsap.to(".box5", {
              y: `${100 * (self.progress)}%`, // Gradually move down based on scroll progress
              opacity: 1 - self.progress,
              duration: 0.1
          });
      }
  }
});

gsap.set([".box2", ".box3", ".box4", ".box5"], {
  x: 0,
  y: 0,
  opacity: 1
});





gsap.to("#textbox h1", {
    x: '-100%',
    ease: "true",
    scrollTrigger: {
        trigger: "#textbox",
        start: "top top",
        end: "+=300%",
        scrub: 1.5,
        pin: true,
        markers: false
    }
});

// Video zoom animation
gsap.to("#SomethingNew", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontalVideoZoom",
        start: "top top",
        end: "+=100%",
        scrub: 1,
        pin: true,
        markers: false
    }
});