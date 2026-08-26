import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollSmoother);

export class Index {

    static soundModal() {
        this.soundBtn = document.querySelector('.sound__btn');
    
        this.soundBtn.addEventListener('click', () => {
            this.landingInit();
        });
    }



    static landingInit() {
        this.startLandingTl = gsap.timeline();
        
        this.startLandingTl.to([".message-container", ".sound__btn"], {
            opacity: 0,
            duration: 1.2,
            ease: "power4.in",
            onComplete: () => document.querySelector('.sound')?.remove()
        });
        
        this.startLandingTl.to(['.landing__content', '.landing__gallery', '.landing__anim'], {
            opacity: 1,
            duration: 2.4,
            delay: .3,
            visibility: "visible",
            ease: "power3.out"
        });
        
        this.startLandingTl.to('body', {
            backgroundColor: '#FEFAF7',
            duration: 2.4,
            ease: "power3.out"
        }, "<");
        
        this.startLandingTl.to('.header', {
            opacity: 1,
            visibility: "visible",
            duration: 2.4,
            ease: "power3.out",
            onComplete : () => document.querySelector('.header').style.backgroundColor = "#FEFAF7"
        }, "<");
        
        this.startLandingTl.to('.landing__span--big', {
            opacity: 1,
            duration: 2.4,
            delay: .3,
            ease: "power3.out"
        }, "<");

        document.querySelector('body').style.overflow = "visible";
    }



    static ScrollSmootherInit() {
        if(ScrollTrigger.isTouch !== 1){
            this.smoother = ScrollSmoother.create({
                smooth: 1.3,
                normalizeScroll: true
            });
        }
    }



    static landingAnimInit() {
        this.sunAnimation = gsap.to(".landing__sun", {
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
    }



    static resizeHandler() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {

            document.body.classList.add('is-resizing');
        
            gsap.set(".landing__sun", { autoAlpha: 0 });
            
            this.animationProgress = this.sunAnimation.totalProgress();
            this.sunAnimation.kill();
            
            clearTimeout(resizeTimer);
            
            resizeTimer =setTimeout(()=> {
            
                this.landingAnimInit();
            
                this.sunAnimation.totalProgress(this.animationProgress);
            
                gsap.set(".landing__sun", { clearProps: "transform" });
            
                this.sunAnimation.play();
            
                gsap.to(".landing__sun", { autoAlpha: 1, duration: 0.2 });

                document.body.classList.remove('is-resizing');
            
            }, 150);
        });
    }



    static menuInit() {
        this.menuBtn = document.querySelector('.menu__btn');
        this.menuBtn.addEventListener('click', () => { 
            this.isOpen = document.body.classList.toggle('menu--open');
        
            gsap.killTweensOf('.menu__el');
        
            if (this.isOpen) {
                gsap.fromTo('.menu__el', 
                    {
                        x: 24,
                        opacity: 0
                    }, 
                    {
                        x: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.2,
                        delay: 0.2,
                        ease: "power2.inOut"
                    }
                );
            } else {
                gsap.to('.menu__el', {
                    x: 24,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.inOut"
                });
            }
        });
    }
}