import { gsap } from "gsap";

export class Loader {
    static init() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const loader = document.querySelector('.loader');
                if (loader) {
                    loader.style.opacity = 1;
                    loader.style.visibility = "visible";
                }
            }, 1);

            this.progressBar = document.querySelector("#progressBar");
            this.progressText = document.querySelector(".loader__progress");
            this.progressObj = { value: 0 };


            this.loading = gsap.to(this.progressObj, {
                value: 99,
                duration: 6,
                ease: 'power1.out',
                onUpdate: () => this.updateLoader()
            });


            window.addEventListener('load', () => {
                this.loading.kill();
                
                gsap.to(this.progressObj, {
                    value: 100,
                    duration: 0.3,
                    onUpdate: () => this.updateLoader(),
                    onComplete: () => {
                        const page = document.body.getAttribute('data-page');

                        if (page === 'index') {
                            gsap.to(['.sound', '.header'], {
                                opacity: 1,
                                visibility: 'visible'
                            });

                            document.querySelector('.menu').removeAttribute('style');
                        }


                        this.startSunAnimation(() => {
                            resolve();
                        });
                    }
                });
            });
        });
    }

    static updateLoader() {
        const percentage = Math.round(this.progressObj.value);
        if (this.progressBar) {
            this.progressBar.setAttribute("x2", (percentage / 100) * 220);
        }
        if (this.progressText) {
            this.progressText.textContent = `${percentage}%`;
        }
    }

    static startSunAnimation(callback) {
        const page = document.body.getAttribute('data-page');

        const loaderTl = gsap.timeline({
            defaults: { ease: "power1.out" },
            onComplete: () => {
                gsap.to(".main", { opacity: 1, visibility: "visible", duration: 0.4 });
                
                if(page === 'index') {
                    gsap.set(['.message-container', '.sound__btn'], {
                        opacity: 0
                    });
                }
            
                gsap.to(".loader", {
                    opacity: 0,
                    duration: 1.2,
                    ease: "power4.in",
                    onComplete: () => {
                        document.querySelector(".loader")?.remove();

                        if (page === 'index') {
                            gsap.to([".message-container", ".sound__btn"], {
                                opacity: 1,
                                duration: 1.2,
                                delay:.3,
                                ease: "power3.out"
                            });
                        }

                        if (callback) callback();
                    }
                });
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
}