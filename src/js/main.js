import "../scss/main.scss";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollSmoother);

setTimeout(() => {
  const loader = document.querySelector('.loader');
  loader.style.opacity = 1;
  loader.style.visibility = "visible";
}, 1);

const page = document.body.getAttribute('data-page');

if(page === 'index') {
  
  // Scroll Smoother
  
  if(ScrollTrigger.isTouch !== 1){
    let smoother = ScrollSmoother.create({
      smooth: 1.3,
      normalizeScroll: true
    });
  }
  
  
  
// Loader

const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector(".loader__progress");

let progressObj = { value: 0 };

const loading = gsap.to(progressObj, {
  value: 99,
  duration: 6,
  ease: 'power1.out',
  onUpdate: updateLoader
});

window.addEventListener('load', () => {
  loading.kill();
  
  gsap.to(progressObj, {
    value: 100,
    duration: 0.3,
    onUpdate: updateLoader,
    onComplete: () => {
      gsap.to(['.sound', '.header', '.menu'], {
        opacity: 1,
        visibility: 'visible'
      });

      startSunAnimation();
    }
  });
});


function updateLoader() {
  const percentage = Math.round(progressObj.value);
  progressBar.setAttribute("x2", (percentage / 100) * 220);
  
  if (progressText) {
    progressText.textContent = `${percentage}%`;
  }
}


function startSunAnimation() {
  const loaderTl = gsap.timeline({
    defaults: { ease: "power1.out" },
    onComplete: () => {
      gsap.to(".main", { opacity: 1, visibility: "visible", duration: 0.4 });
  
      gsap.to(".loader", {
        opacity: 0,
        duration: 1.2,
        ease: "power4.in",
        onComplete: () => document.querySelector(".loader")?.remove()
      });
  
      gsap.to([".message-container", ".sound__btn"], {
        opacity: 1,
        duration: 1.2,
        delay: .3,
        ease: "power3.out"
      }, "+=.3");
    }
  });
  
  loaderTl.to("#sun", {
    motionPath: {
      path: "#sunPath",
      align: "#sunPath",
      alignOrigin: [0.5, 0.5]
    },
    duration: 2.4
  }, 0);
  
  loaderTl.to("#progressBar", {
    attr: { x2: 220 },
    duration: 0.2
  }, 0);
  
  loaderTl.to('.loader', {
    backgroundColor: '#020026',
    duration: 1.2,
    delay: 1.2
  }, 0);
  
  loaderTl.to('.loader__progress', {
    color: '#FEFAF7',
    duration: 1.2,
    delay: 1.2
  }, 0);
}
  
  
  
  // Menu
  
  const menuBtn = document.querySelector('.menu__btn');
  menuBtn.addEventListener('click', () => { 
    document.body.classList.toggle('menu--open'); 
  });
  
  
  
  // Anim website entry (sound modal closed)
  
  const soundBtn = document.querySelector('.sound__btn');
  
  soundBtn.addEventListener('click', () => {
    const startLandingTl = gsap.timeline();
  
    startLandingTl.to([".message-container", ".sound__btn"], {
      opacity: 0,
      duration: 1.2,
      ease: "power4.in",
      onComplete: () => document.querySelector('.sound')?.remove()
    });
  
    startLandingTl.to(['.landing__content', '.landing__gallery', '.landing__anim'], {
      opacity: 1,
      duration: 2.4,
      delay: .3,
      visibility: "visible",
      ease: "power3.out"
    });
  
    startLandingTl.to('body', {
      backgroundColor: '#FEFAF7',
      duration: 2.4,
      ease: "power3.out"
    }, "<");
  
    startLandingTl.to('.header', {
      opacity: 1,
      visibility: "visible",
      duration: 2.4,
      ease: "power3.out",
      onComplete : () => document.querySelector('.header').style.backgroundColor = "#FEFAF7"
    }, "<");
  
    startLandingTl.to('.landing__span--big', {
      opacity: 1,
      duration: 2.4,
      delay: .3,
      ease: "power3.out"
    }, "<");
  
    document.querySelector('body').style.overflow = "visible";
  });
  
  
  
  // Landing__anim
  
  let sunAnimation = gsap.to(".landing__sun", {
    motionPath: {
      path: "#landingPath",
      align: "#landingPath",
      alignOrigin: [0.5, 0.5],
      autoRotate: false
    },
    duration: 24,
    repeat: -1,
    repeatDelay: 1.2,
    ease: "none"
  });
  
  
  let resizeTimer;
  
  window.addEventListener('resize', () => {
  
    gsap.set(".landing__sun", { autoAlpha: 0 });
  
    const animationProgress = sunAnimation.totalProgress();
    sunAnimation.kill();
  
    clearTimeout(resizeTimer);
  
    resizeTimer =setTimeout(()=> {
  
      sunAnimation = gsap.to(".landing__sun", {
        motionPath: {
          path: "#landingPath",
          align: "#landingPath",
          alignOrigin: [0.5, 0.5],
          autoRotate: false
        },
        duration: 24,
        repeat: -1,
        repeatDelay: 1.2,
        ease: "none"
      });
  
      sunAnimation.totalProgress(animationProgress);
  
      gsap.set(".landing__sun", { clearProps: "transform" });
  
      sunAnimation.play();
  
      gsap.to(".landing__sun", { autoAlpha: 1, duration: 0.2 });
  
    }, 150);
  });
}
