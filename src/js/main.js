import "../scss/main.scss";
import { Loader } from "./Loader.js";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollSmoother);



Loader.init().then(async ()=> {
  const page = document.body.getAttribute('data-page');
  
  if(page === 'index') {

    const { Index } = await import("./Index.js");

    Index.ScrollSmootherInit();
    Index.soundModal();
    Index.menuInit();
    Index.landingAnimInit();
    Index.resizeHandler();
  }

  if (page === 'experience'){

    const { Experience } = await import("./Experience.js");

    new Experience();
  }

});


