import "../scss/main.scss";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

const progressBar = document.querySelector("#progressBar");
const progressText = document.querySelector(".loader__progress");

const timeline = gsap.timeline({
  defaults: { ease: "power1.out" },
  onUpdate: function() {
    const currentX2 = parseFloat(progressBar.getAttribute("x2")) || 0;
    
    const percentage = Math.round((currentX2 / 220) * 100);
    
    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }
  },
  onComplete: () => {
    gsap.to([".header", ".main"], { opacity: 1, visibility: "visible", duration: 0.6 });

    gsap.to(".loader", {
      opacity: 0,
      duration: .6,
      onComplete: () => document.querySelector(".loader")?.remove()
    });
  }
});

timeline.to("#sun", {
  motionPath: {
    path: "#sunPath",
    align: "#sunPath",
    alignOrigin: [0.5, 0.5]
  },
  duration: 2.4
}, 0);

timeline.to("#progressBar", {
  attr: { x2: 220 },
  duration: 2.4
}, 0);