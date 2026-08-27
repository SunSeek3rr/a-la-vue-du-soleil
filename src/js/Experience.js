import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export class Experience {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.prevBtn = document.querySelector('.btn--prev');
        this.nextBtn = document.querySelector('.btn--next');
        this.exitBtn = document.querySelector('.btn--exit');
        this.dropdownBtn = document.querySelector('.btn--dropdown');
        this.experienceInterface = document.querySelector('.interface__experience');

        this.interfaceTitle = document.querySelector('.interface__title');
        this.poem = document.querySelector('.interface__poem');
        this.poemVerse = document.querySelector('.interface__verse');

        this.phaseTexts = {
            dawn: {
                title: "L'aube",
                poem: "Un matin comme les autres,\nUn vide bien différent,\nJ’irai m’exiler à l’aube,\nDe cette vie vociférante."
            },
            zenith: {
                title: "Le zénith",
                poem: "Ô grand soleil,\nD'aussi dans le ciel,\nTu réveilles sans amoindrir,\nCe que j'ai vécu de pire."
            },
            dusk: {
                title: "Le crépuscule",
                poem: "Quand ta lumière s'apaise,\nDisparaissant sous l'horizon,\nJe sens s'ouvrir la plaie,\n Je me sens moribond."
            },
            night: {
                title: "La nuit",
                poem: "Ô grand soleil,\nToi qui expose sans pitié,\nCe qui brule en mon être,\nTe cacherais-tu peut-être,\nDans mon intériorité."
            }
        };

        this.phaseOrder = ['dawn', 'zenith', 'dusk', 'night'];

        this.dawnAudio = new Audio('./assets/sounds/birds.mp3');
        this.dawnAudio.loop = false;

        const urlParams = new URLSearchParams(window.location.search);
        const targetSection = urlParams.get('section');

        const targetIndex = this.phaseOrder.indexOf(targetSection);
        this.currentIndex = targetIndex !== -1 ? targetIndex : 0;

        this.currentSubIndex = 0;
        this.canInteractDusk = false;
        this.canInteractNight = false;

        this.init();
    }

    init() {
        this.setupDawnVideoEnd(); 
        this.dawnInteractionHandler(); 
        this.setupDuskVideoEnd();
        this.updateView();
        this.bindEvents();
    }

    setupDawnVideoEnd() {
        const dawnSection = document.querySelector('.dawn');
        const dawnVideo = dawnSection.querySelector('video');
        const dawnInteraction = dawnSection.querySelector('.dawn__interaction');

        gsap.set(dawnInteraction, {
            opacity: 0,
            visibility: "hidden"
        });

        dawnVideo.addEventListener('ended', () => {
            this.showDawnInteraction(dawnInteraction);
        });
    }

    showDawnInteraction(interactionEl) {
        gsap.killTweensOf(interactionEl);
        gsap.to(interactionEl, {
            opacity: 1,
            visibility: "visible",
            duration: 0.6
        });
    }

    dawnInteractionHandler() {
        const dawnSection = document.querySelector('.dawn');

        this.soundBtn = dawnSection.querySelector('.dawn__btn--sound');
        this.imageBtn = dawnSection.querySelector('.dawn__btn--image');
        this.bothBtn = dawnSection.querySelector('.dawn__btn--both');
        this.imageContainer = dawnSection.querySelector('.dawn__image-container');

        gsap.set(this.imageContainer, {
            opacity: 0,
            visibility: "hidden"
        });

        const showImage = () => {
            gsap.killTweensOf(this.imageContainer);
            gsap.to(this.imageContainer, {
                opacity: 1,
                visibility: "visible",
                duration: 0.4
            });
        };

        const hideImage = () => {
            gsap.killTweensOf(this.imageContainer);
            gsap.to(this.imageContainer, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => gsap.set(this.imageContainer, { visibility: "hidden" })
            });
        };

        const playSound = () => {
            this.dawnAudio.pause();
            this.dawnAudio.currentTime = 0;
            this.dawnAudio.play().catch(err => console.log("audio bloqué :", err));
        };

        const stopSound = () => {
            this.dawnAudio.pause();
            this.dawnAudio.currentTime = 0;
        };

        this.soundBtn.addEventListener('click', () => {
            playSound();
            hideImage();
        });

        this.imageBtn.addEventListener('click', () => {
            showImage();
            stopSound();
        });
        
        this.bothBtn.addEventListener('click', () => {
            showImage();
            playSound();
        });
    }

    hideDawnInteraction() {
        const dawnSection = document.querySelector('.dawn');
        const dawnInteraction = dawnSection.querySelector('.dawn__interaction');
        this.imageContainer = dawnSection.querySelector('.dawn__image-container');
        
        this.dawnAudio.pause();
        this.dawnAudio.currentTime = 0;
        
        gsap.set(this.imageContainer, {
            opacity: 0,
            visibility: "hidden"
        });

        gsap.killTweensOf(dawnInteraction);
        gsap.to(dawnInteraction, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => gsap.set(dawnInteraction, { visibility: "hidden" })
        });
    }

    zenithInteractionHandler() {
        const zenithSection = document.querySelector('.zenith');

        const sun = zenithSection.querySelector('.zenith__sun');
        const zenithInteraction = zenithSection.querySelector('.zenith__interaction');
        const zenithHorizon = zenithSection.querySelector('.zenith__horizon');

        let hasTriggered = false;
        const self = this;

        Draggable.create(sun, {
            type: "y",
            bounds: { minY: -160, maxY: 0 },
            onDrag: function() {
                let progress = Math.min(Math.abs(this.y) / 160, 1);

                gsap.to([zenithInteraction, zenithHorizon], {
                    backgroundColor: gsap.utils.interpolate("#020026", "#FEFAF7", progress),
                    duration: 0.1,
                    overwrite: "auto"
                });

                if (this.y <= -160 && !hasTriggered) {
                    hasTriggered = true;
                    
                    gsap.to([zenithInteraction, zenithHorizon], {
                        opacity: 0,
                        duration: 0.8,
                        onComplete: () => {
                            gsap.set([zenithInteraction, zenithHorizon], {
                                visibility: "hidden"
                            });

                            hasTriggered = false;
                            this.kill();
                            
                            setTimeout(() => {
                                const currentSec = document.querySelector('[data-section="zenith"]');
                                self.currentSubIndex++;
                                self.applySubStep(currentSec);
                            }, 1000);
                        }
                    });
                }
            },
            onDragEnd: function() {
                if (!hasTriggered && Math.abs(this.y) < 160) {
                    gsap.to(sun, {
                        y: 0,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                    gsap.to([zenithInteraction, zenithHorizon], {
                        backgroundColor: "#020026",
                        duration: 0.4
                    });
                }
            }
        });
    }

    showZenithInteraction() {
        const zenithSection = document.querySelector('.zenith');
        const zenithInteraction = zenithSection.querySelector('.zenith__interaction');
        const zenithHorizon = zenithSection.querySelector('.zenith__horizon');
        const sun = zenithSection.querySelector('.zenith__sun');

        gsap.set(sun, {
            y: 0
        });

        gsap.set([zenithInteraction, zenithHorizon], {
            backgroundColor: "#020026",
            visibility: "visible"
        });
        
        gsap.killTweensOf([zenithInteraction, zenithHorizon]);

        gsap.to([zenithInteraction, zenithHorizon], {
            opacity: 1, duration: 0.6
        });

        this.zenithInteractionHandler();
    }

    hideZenithInteraction() {
        const zenithSection = document.querySelector('.zenith');
        const zenithInteraction = zenithSection.querySelector('.zenith__interaction');

        gsap.killTweensOf(zenithInteraction);
        gsap.to(zenithInteraction, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => gsap.set(zenithInteraction, { visibility: "hidden" })
        });
    }

    setupDuskVideoEnd() {
        const duskSection = document.querySelector('.dusk');
        const firstVideo = duskSection.querySelector('video');
        
        firstVideo.addEventListener('ended', () => {
            this.enableDuskInteraction();
        });
    }

    initDuskCanvas(interactive = false) {
        const duskSection = document.querySelector('.dusk');
        const canvas = duskSection.querySelector('canvas');
        const video = duskSection.querySelector('video');

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'blur(12px)';
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        ctx.filter = 'none';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!interactive) return;

        this.duskInteractionHandler(canvas, ctx);
    }

    enableDuskInteraction() {
        const duskSection = document.querySelector('.dusk');
        const canvas = duskSection.querySelector('canvas');

        this.canInteractDusk = true;
        const ctx = canvas.getContext('2d');
        this.duskInteractionHandler(canvas, ctx);
    }

    duskInteractionHandler(canvas, ctx) {
        let isDrawing = false;
        let hasTriggered = false;
        const self = this;

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        const draw = (pos) => {
            if (!self.canInteractDusk || !isDrawing || hasTriggered) return;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            
            const isMobile = window.innerWidth < 768;
            const brushRadius = isMobile ? 60 : 80;

            ctx.arc(pos.x, pos.y, brushRadius, 0, Math.PI * 2, true);
            ctx.fill();

            checkCanvasProgress();
        };

        const checkCanvasProgress = () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            const totalPixels = pixels.length / 4;

            for (let i = 3; i < pixels.length; i += 4) {
                if (pixels[i] < 128) {
                    transparentPixels++;
                }
            }

            const progress = transparentPixels / totalPixels;

            if (progress >= 0.5 && !hasTriggered) {
                hasTriggered = true;
                self.canInteractDusk = false;
                
                gsap.to(canvas, {
                    opacity: 0,
                    duration: 0.8,
                    onComplete: () => {
                        gsap.set(canvas, { visibility: "hidden" });
                        
                        const duskSection = document.querySelector('.dusk');
                        const video = duskSection.querySelector('video');
                        
                        video.pause();
                        video.currentTime = 0;
                        gsap.set(video, { display: "none" });

                        const currentSec = document.querySelector('[data-section="dusk"]');
                        self.currentSubIndex++;
                        self.applySubStep(currentSec);
                    }
                });
            }
        };

        if (!canvas._listenersAttached) {
            canvas.addEventListener('mousedown', (e) => {
                if (!self.canInteractDusk) return;
                isDrawing = true;
                draw(getPos(e));
            });

            canvas.addEventListener('mousemove', (e) => {
                if (!isDrawing) return;
                draw(getPos(e));
            });

            window.addEventListener('mouseup', () => {
                isDrawing = false;
            });

            canvas.addEventListener('touchstart', (e) => {
                if (!self.canInteractDusk) return;
                isDrawing = true;
                e.preventDefault();
                const touch = e.touches[0];
                draw(getPos(touch));
            }, { passive: false });

            canvas.addEventListener('touchmove', (e) => {
                if (!isDrawing || !self.canInteractDusk) return;
                e.preventDefault();
                const touch = e.touches[0];
                draw(getPos(touch));
            }, { passive: false });

            window.addEventListener('touchend', () => {
                isDrawing = false;
            });

            canvas._listenersAttached = true;
        }
    }

    showDuskInteraction() {
        const duskSection = document.querySelector('.dusk');
        const canvas = duskSection.querySelector('canvas');
        const duskInteraction = duskSection.querySelector('.dusk__interaction');

        gsap.set(duskInteraction, {
            opacity: 1,
            visibility: "visible"
        });

        gsap.set(canvas, {
            opacity: 1,
            visibility: "visible"
        });

        this.initDuskCanvas(false);
    }

    hideDuskInteraction() {
        const duskSection = document.querySelector('.dusk');
        const canvas = duskSection.querySelector('canvas');
        const duskInteraction = duskSection.querySelector('.dusk__interaction');
        
        this.canInteractDusk = false;

        gsap.set(canvas, {
            opacity: 0,
            visibility: "hidden"
        });

        gsap.set(duskInteraction, {
            opacity: 0,
            visibility: "hidden"
        });
    }

    setupNightInteraction() {
        const nightSection = document.querySelector('.night');
        const interactionWrapper = nightSection.querySelector('.night__interaction');
        const doubts = nightSection.querySelectorAll('.night__doubt');

        gsap.set(interactionWrapper, { opacity: 1, visibility: "visible" });

        let clickedCount = 0;
        const self = this;

        doubts.forEach(doubt => {
            gsap.set(doubt, {
                opacity: 0,
                scale: 0.8,
                visibility: "hidden"
            });
            
            if (!doubt._listenerAttached) {
                doubt.addEventListener('click', () => {
                    if (!self.canInteractNight) return;

                    if (!doubt.classList.contains('is-clicked')) {
                        doubt.classList.add('is-clicked');
                        clickedCount++;

                        gsap.to(doubt, {
                            opacity: 0,
                            scale: 1.2,
                            duration: 0.4,
                            onComplete: () => {
                                gsap.set(doubt, { visibility: "hidden" });

                                if (clickedCount >= doubts.length) {
                                    self.onNightInteractionComplete();
                                }
                            }
                        });
                    }
                });
                doubt._listenerAttached = true;
            }
        });
    }

    showNightDoubts() {
        const nightSection = document.querySelector('.night');
        const doubts = nightSection.querySelectorAll('.night__doubt');
        
        doubts.forEach(doubt => {
            doubt.classList.remove('is-clicked');
            gsap.set(doubt, { opacity: 0, scale: 0.8, visibility: "hidden" });
        });

        const delays = [10500, 13000, 18000, 23000, 25500];
        
        doubts.forEach((doubt, index) => {
            const delay = delays[index] || (index * 1500);
            
            setTimeout(() => {
                if (this.phaseOrder[this.currentIndex] === 'night' && this.currentSubIndex === 1) {
                    gsap.set(doubt, { visibility: "visible" });
                    gsap.to(doubt, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "back.out(1.7)"
                    });
                }
            }, delay);
        });
    }

    onNightInteractionComplete() {
        const nightSection = document.querySelector('.night');
        const interactionWrapper = nightSection.querySelector('.night__interaction');
        const video = nightSection.querySelector('video');

        gsap.set(interactionWrapper, { opacity: 0, visibility: "hidden" });

        video.pause();
        video.currentTime = 0;
        gsap.set(video, { display: "none" });

        this.currentSubIndex++;
        this.applySubStep(nightSection);
    }

    hideNightInteraction() {
        const nightSection = document.querySelector('.night');
        const interactionWrapper = nightSection.querySelector('.night__interaction');
        const doubts = nightSection.querySelectorAll('.night__doubt');
        
        this.canInteractNight = false;

        gsap.set(interactionWrapper, {
            opacity: 0,
            visibility: "hidden"
        });

        doubts.forEach(doubt => {
            doubt.classList.remove('is-clicked');
            gsap.set(doubt, {
                opacity: 0,
                visibility: "hidden"
            });
        });
    }

    updateInterfaceTexts() {
        const activePhase = this.phaseOrder[this.currentIndex];
        const texts = this.phaseTexts[activePhase];

        this.interfaceTitle.textContent = texts.title;

        this.poemVerse.textContent = "";
        const parts = texts.poem.split('\n');

        parts.forEach((part, index) => {
            this.poemVerse.appendChild(document.createTextNode(part));
            if (index < parts.length - 1) {
                this.poemVerse.appendChild(document.createElement('br'));
            }
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => { this.handlePrev(); });
        this.nextBtn.addEventListener('click', () => { this.handleNext(); });
        this.exitBtn.addEventListener('click', () => { window.location.href = './'; });

        gsap.set(this.poem, { height: 0, opacity: 0, visibility: "hidden" });

        const poemTl = gsap.timeline({ paused: true, reversed: true });
        poemTl.to(this.poem, {
            height: "auto",
            opacity: 1,
            visibility: "visible",
            duration: 0.4,
            ease: "power2.inOut"
        });

        this.dropdownBtn.addEventListener('click', () => {
            if (poemTl.reversed()) {
                poemTl.play();
            } else {
                poemTl.reverse();
            }
        });
    }

    handlePrev() {
        const currentSection = this.getCurrentSection();
        this.hideDawnInteraction();
        this.hideZenithInteraction();
        this.hideDuskInteraction();
        this.hideNightInteraction();

        const sectionName = this.phaseOrder[this.currentIndex];
        if (sectionName === 'zenith' && this.currentSubIndex > 0) {
            this.currentSubIndex = 0;
            this.applySubStep(currentSection);
            return;
        }

        if (this.currentSubIndex > 0) {
            this.currentSubIndex--;
            this.applySubStep(currentSection);
        } else {
            this.stopSectionVideos(currentSection);
            this.currentIndex = (this.currentIndex - 1 + this.phaseOrder.length) % this.phaseOrder.length;
            const prevSection = this.getCurrentSection();
            const prevVideos = prevSection.querySelectorAll('video');
            
            if (this.phaseOrder[this.currentIndex] === 'zenith') {
                this.currentSubIndex = prevVideos.length + 1;
            } else {
                this.currentSubIndex = prevVideos.length;
            }

            this.changePhaseToSubStep(prevSection, true);
        }
    }

    handleNext() {
        const currentSection = this.getCurrentSection();
        const videos = currentSection.querySelectorAll('video');
        const sectionName = this.phaseOrder[this.currentIndex];
        
        const maxSubIndex = sectionName === 'zenith' ? videos.length + 1 : videos.length;

        this.hideDawnInteraction();
        this.hideZenithInteraction();
        this.hideDuskInteraction();
        this.hideNightInteraction();

        if (this.currentSubIndex < maxSubIndex) {
            this.currentSubIndex++;
            this.applySubStep(currentSection);
        } else {
            this.stopSectionVideos(currentSection);
            this.currentIndex = (this.currentIndex + 1) % this.phaseOrder.length;
            this.currentSubIndex = 0; 
            this.changePhaseToSubStep(this.getCurrentSection(), false);
        }
    }

    applySubStep(section) {
        const sectionName = this.phaseOrder[this.currentIndex];
        const content = section.querySelector(`.${sectionName}__content`);
        const videos = section.querySelectorAll('video');

        this.updateInterfaceTexts();

        if (sectionName !== 'dawn' || this.currentSubIndex !== 1) {
            this.hideDawnInteraction();
        }
        
        if (sectionName === 'zenith' && this.currentSubIndex === 1) {
            this.showZenithInteraction();
        } else {
            this.hideZenithInteraction();
        }

        if (sectionName === 'dusk' && this.currentSubIndex === 1) {
            this.showDuskInteraction();
        } else {
            this.hideDuskInteraction();
        }

        if (sectionName !== 'night' || this.currentSubIndex !== 1) {
            this.hideNightInteraction();
        }

        gsap.killTweensOf(content);

        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
            gsap.set(video, { display: "none" });
        });

        if (this.currentSubIndex === 0) {
            this.hideExperienceInterface();
            
            gsap.set(content, {
                visibility: "visible"
            });
            gsap.to(content, {
                opacity: 1,
                duration: 0.6
            });
        } 
        else if (sectionName === 'zenith' && this.currentSubIndex === 1) {
            gsap.set(content, {
                opacity: 0,
                visibility: "hidden"
            });

            this.hideExperienceInterface();
        }
        else if (sectionName === 'dusk' && this.currentSubIndex === 1) {
            gsap.set(content, {
                opacity: 0,
                visibility: "hidden"
            });

            this.showExperienceInterface();
            gsap.set(videos[0], { display: "block" });
            videos[0].play().catch(err => console.log("lecture bloquée :", err));
        }
        else if (sectionName === 'night' && this.currentSubIndex === 1) {
            gsap.set(content, {
                opacity: 0,
                visibility: "hidden"
            });

            this.showExperienceInterface();
            gsap.set(videos[0], { display: "block" });
            videos[0].play().catch(err => console.log("lecture bloquée :", err));

            this.canInteractNight = false;
            this.setupNightInteraction();
            this.showNightDoubts();

            videos[0].onended = () => {
                this.canInteractNight = true;
            };
        }
        else {
            gsap.set(content, {
                opacity: 0,
                visibility: "hidden"
            });

            this.showExperienceInterface();

            videos.forEach((video, index) => {
                let videoTargetIndex;
                if (sectionName === 'zenith') {
                    videoTargetIndex = this.currentSubIndex - 2;
                } else if (sectionName === 'dusk') {
                    videoTargetIndex = this.currentSubIndex - 1;
                } else if (sectionName === 'night') {
                    videoTargetIndex = this.currentSubIndex - 1;
                } else {
                    videoTargetIndex = this.currentSubIndex - 1;
                }
                
                if (index === videoTargetIndex) {
                    gsap.set(video, { display: "block" });
                    video.play().catch(err => console.log("lecture bloquée :", err));
                }
            });
        }
    }

    changePhaseToSubStep(targetSection, instantVideo = false) {
        this.hideExperienceInterface();
        this.hideDawnInteraction();
        this.hideZenithInteraction();
        this.hideDuskInteraction();
        this.hideNightInteraction();

        this.sections.forEach(section => {
            if (section === targetSection) {
                gsap.set(section, {
                    visibility: "visible"
                });

                gsap.to(section, {
                    opacity: 1,
                    duration: 0.6
                });

            } else {
                gsap.set(section, {
                    opacity: 0,
                    visibility: "hidden"
                });
            }
        });

        if (instantVideo) {
            const sectionName = this.phaseOrder[this.currentIndex];
            const content = targetSection.querySelector(`.${sectionName}__content`);
            
            gsap.killTweensOf(content);
            gsap.set(content, {
                opacity: 0,
                visibility: "hidden"
            });
        }

        this.applySubStep(targetSection);
    }

    updateView() {
        const activePhaseName = this.phaseOrder[this.currentIndex];

        this.sections.forEach(section => {
            const isCurrent = section.getAttribute('data-section') === activePhaseName;
            if (isCurrent) {
                gsap.set(section, {
                    visibility: "visible"
                });

                gsap.to(section, {
                    opacity: 1,
                    duration: 0.6
                });

                this.applySubStep(section);
            } else {
                gsap.set(section, {
                    opacity: 0,
                    visibility: "hidden"
                });
            }
        });
    }

    getCurrentSection() {
        const activePhaseName = this.phaseOrder[this.currentIndex];
        return document.querySelector(`[data-section="${activePhaseName}"]`);
    }

    stopSectionVideos(section) {
        const videos = section.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
            gsap.set(video, { display: "block" });
        });
    }

    showExperienceInterface() {
        gsap.killTweensOf(this.experienceInterface);
        
        gsap.to(this.experienceInterface, {
            opacity: 1,
            visibility: "visible",
            duration: 0.6
        });
    }

    hideExperienceInterface() {
        gsap.killTweensOf(this.experienceInterface);
        gsap.to(this.experienceInterface, {
            opacity: 0,
            duration: 0.6,
            onComplete: () => gsap.set(this.experienceInterface, { visibility: "hidden" })
        });
    }
}