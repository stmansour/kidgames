/* ===================================
   SuperMatch3 - Main Application
   FIXED CANVAS APPROACH
   =================================== */

// Game State
const gameState = {
    currentScreen: 'splash',
    currentPlayer: null,
    assetsLoaded: false,
    audioContext: null
};

// Asset paths
const ASSETS = {
    splash: {
        portrait: 'assets/images/ui/splash1-2x3.png',
        landscape: 'assets/images/ui/splash1-3x2.png'
    },
    avatarSelection: {
        portrait: 'assets/images/ui/avatar-selection-bg-2x3.png',
        landscape: 'assets/images/ui/avatar-selection-bg-3x2.png'
    },
    videos: {
        leon: 'assets/videos/leon-rotation.mp4',
        andre: 'assets/videos/andre-rotation.mp4'
    }
};

/* ===================================
   FIXED CANVAS SCALING
   =================================== */

// Reference canvas sizes
const CANVAS_SIZE = {
    landscape: { width: 1024, height: 768 },
    portrait: { width: 768, height: 1024 }
};

/**
 * Scale the avatar selection container to fit the screen
 * This is the SIMPLE approach - no more vw/vh madness!
 */
function scaleAvatarCanvas() {
    const container = document.querySelector('.avatar-selection-container');
    if (!container) return;
    
    const orientation = getOrientation();
    const canvasSize = CANVAS_SIZE[orientation];
    
    // Add orientation class
    container.classList.remove('landscape', 'portrait');
    container.classList.add(orientation);
    
    // Calculate scale to fit screen
    const scaleX = window.innerWidth / canvasSize.width;
    const scaleY = window.innerHeight / canvasSize.height;
    const scale = Math.min(scaleX, scaleY);  // Maintain aspect ratio
    
    // Apply scale transformation
    container.style.transform = `scale(${scale})`;
    container.style.transformOrigin = 'top center';  // Never clip the top
    
    // Center vertically if there's extra space
    const scaledHeight = canvasSize.height * scale;
    if (scaledHeight < window.innerHeight) {
        const topOffset = (window.innerHeight - scaledHeight) / 2;
        container.style.top = `${topOffset}px`;
    } else {
        container.style.top = '0px';
    }
    
    console.log(`Canvas scaled: ${orientation} at ${scale.toFixed(3)}x (${canvasSize.width}x${canvasSize.height})`);
}

/* ===================================
   Utility Functions
   =================================== */

/**
 * Detect if device is in portrait or landscape orientation
 */
function getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Preload an image and return a Promise
 */
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load ${src}`));
        img.src = src;
    });
}

/**
 * Preload multiple images
 */
async function preloadImages(imagePaths) {
    try {
        const promises = imagePaths.map(path => preloadImage(path));
        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('Error preloading images:', error);
        return false;
    }
}

/**
 * Initialize Web Audio Context (required for iOS)
 */
function initAudioContext() {
    if (!gameState.audioContext) {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            gameState.audioContext = new AudioContext();
            console.log('Audio context initialized');
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }
}

/* ===================================
   Screen Management
   =================================== */

/**
 * Switch between screens with fade transition
 */
function switchScreen(fromScreenId, toScreenId) {
    const fromScreen = document.getElementById(fromScreenId);
    const toScreen = document.getElementById(toScreenId);
    
    if (fromScreen) {
        fromScreen.classList.add('fade-out');
        setTimeout(() => {
            fromScreen.classList.remove('active', 'fade-out');
        }, 500);
    }
    
    if (toScreen) {
        setTimeout(() => {
            toScreen.classList.add('active');
            gameState.currentScreen = toScreenId.replace('-screen', '');
        }, 100);
    }
}

/* ===================================
   Splash Screen
   =================================== */

/**
 * Initialize the splash screen
 */
function initSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const splashImage = document.getElementById('splash-image');
    const tapPrompt = document.getElementById('tap-prompt');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    // Set correct splash image based on orientation
    const orientation = getOrientation();
    splashImage.src = ASSETS.splash[orientation];
    
    // Update splash image if orientation changes
    const handleSplashOrientationChange = () => {
        if (gameState.currentScreen === 'splash') {
            setTimeout(() => {
                const newOrientation = getOrientation();
                splashImage.src = ASSETS.splash[newOrientation];
            }, 100);
        }
    };
    
    window.addEventListener('orientationchange', handleSplashOrientationChange);
    window.addEventListener('resize', handleSplashOrientationChange);
    
    // Preload assets
    const imagesToPreload = [
        ASSETS.splash.portrait,
        ASSETS.splash.landscape,
        ASSETS.avatarSelection.portrait,
        ASSETS.avatarSelection.landscape
    ];
    
    preloadImages(imagesToPreload).then(success => {
        if (success) {
            gameState.assetsLoaded = true;
            loadingIndicator.classList.add('hidden');
            tapPrompt.classList.add('visible');
        }
    });
    
    // Handle tap to start
    const handleTapToStart = (e) => {
        e.preventDefault();
        if (!gameState.assetsLoaded) return;
        
        // Initialize audio context on first user interaction (iOS requirement)
        initAudioContext();
        
        // Switch to avatar selection screen
        switchScreen('splash-screen', 'avatar-selection-screen');
        initAvatarSelectionScreen();
        
        // Remove event listeners
        splashScreen.removeEventListener('click', handleTapToStart);
        splashScreen.removeEventListener('touchstart', handleTapToStart);
    };
    
    splashScreen.addEventListener('click', handleTapToStart);
    splashScreen.addEventListener('touchstart', handleTapToStart);
}

/* ===================================
   Avatar Selection Screen
   =================================== */

/**
 * Initialize the avatar selection screen
 */
function initAvatarSelectionScreen() {
    console.log('Initializing Avatar Selection Screen (Video)');
    
    // Set correct background image based on orientation
    const bgImage = document.getElementById('avatar-selection-bg');
    const orientation = getOrientation();
    bgImage.src = ASSETS.avatarSelection[orientation];
    
    // SCALE THE CANVAS - This is the key!
    scaleAvatarCanvas();
    
    // Update background and rescale when orientation changes
    const handleOrientationChange = () => {
        setTimeout(() => {
            const newOrientation = getOrientation();
            bgImage.src = ASSETS.avatarSelection[newOrientation];
            scaleAvatarCanvas();  // Rescale on orientation change
        }, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Get video elements
    const leonVideo = document.querySelector('.leon-video');
    const andreVideo = document.querySelector('.andre-video');
    
    // Force video looping (fix for Leon's video stopping)
    const forceLoop = (video, name) => {
        video.addEventListener('ended', function() {
            console.log(`${name} video ended, restarting...`);
            this.currentTime = 0;
            this.play();
        });
    };
    
    // Ensure videos are muted and looping
    if (leonVideo) {
        leonVideo.muted = true;
        leonVideo.volume = 0;
        forceLoop(leonVideo, 'Leon');
        leonVideo.play().catch(e => console.log('Leon video autoplay prevented:', e));
    }
    if (andreVideo) {
        andreVideo.muted = true;
        andreVideo.volume = 0;
        forceLoop(andreVideo, 'Andre');
        andreVideo.play().catch(e => console.log('Andre video autoplay prevented:', e));
    }
    
    // Handle tap zone selection
    const tapZones = document.querySelectorAll('.tap-zone');
    
    tapZones.forEach(zone => {
        const handleSelection = (e) => {
            e.preventDefault();
            const playerId = zone.getAttribute('data-player');
            
            console.log(`${playerId} selected!`);
            
            // Set current player
            gameState.currentPlayer = {
                id: playerId,
                name: playerId.charAt(0).toUpperCase() + playerId.slice(1),
                video: ASSETS.videos[playerId]
            };
            
            // Pause both videos
            if (leonVideo) leonVideo.pause();
            if (andreVideo) andreVideo.pause();
            
            // Visual feedback - scale the zone briefly
            zone.style.transform = zone.style.transform.includes('scale') 
                ? zone.style.transform.replace(/scale\([^)]*\)/, 'scale(1.1)')
                : zone.style.transform + ' scale(1.1)';
            
            setTimeout(() => {
                zone.style.transform = zone.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');
                
                // TODO: Switch to main menu screen
                console.log('Moving to main menu...', gameState.currentPlayer);
                // switchScreen('avatar-selection-screen', 'main-menu-screen');
            }, 300);
        };
        
        // Add both click and touch handlers
        zone.addEventListener('click', handleSelection);
        zone.addEventListener('touchstart', handleSelection);
    });
}

/* ===================================
   Application Initialization
   =================================== */

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('SuperMatch3 starting...');
    initSplashScreen();
    
    // Set up global resize handler for canvas scaling
    window.addEventListener('resize', () => {
        if (gameState.currentScreen === 'avatar-selection') {
            scaleAvatarCanvas();
        }
    });
});

// Ready to start message
console.log('Ready to start!');
