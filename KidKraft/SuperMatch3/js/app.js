/* ===================================
   SuperMatch3 - Main Application
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
            
            // Initialize screen-specific logic
            if (toScreenId === 'avatar-selection-screen') {
                initAvatarSelectionScreen();
            }
        }, 500);
    }
}

/* ===================================
   Splash Screen Logic
   =================================== */

async function initSplashScreen() {
    const splashImage = document.getElementById('splash-image');
    const tapPrompt = document.getElementById('tap-prompt');
    const loadingIndicator = document.getElementById('loading-indicator');
    const splashScreen = document.getElementById('splash-screen');
    
    // Set correct splash image based on orientation
    const orientation = getOrientation();
    splashImage.src = ASSETS.splash[orientation];
    
    // Update splash image if orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            const newOrientation = getOrientation();
            splashImage.src = ASSETS.splash[newOrientation];
        }, 100);
    });
    
    // No preloading needed for video-based avatars
    // Videos will load when avatar selection screen appears
    console.log('Ready to start!');
    
    // Show tap prompt immediately
    loadingIndicator.classList.add('hidden');
    tapPrompt.classList.add('visible');
    gameState.assetsLoaded = true;
    
    // Handle tap/click to start
    const handleStart = () => {
        // Initialize audio on user interaction (iOS requirement)
        initAudioContext();
        
        // Remove event listeners
        splashScreen.removeEventListener('click', handleStart);
        splashScreen.removeEventListener('touchend', handleStart);
        
        // Transition to avatar selection screen
        switchScreen('splash-screen', 'avatar-selection-screen');
    };
    
    // Add both click and touch events for compatibility
    splashScreen.addEventListener('click', handleStart);
    splashScreen.addEventListener('touchend', handleStart, { passive: true });
}

/* ===================================
   Avatar Selection Screen Logic (Video-Based)
   =================================== */

/**
 * Initialize Avatar Selection Screen
 */
function initAvatarSelectionScreen() {
    console.log('Initializing Avatar Selection Screen (Video)');
    
    // Set correct background image based on orientation
    const bgImage = document.getElementById('avatar-selection-bg');
    const orientation = getOrientation();
    bgImage.src = ASSETS.avatarSelection[orientation];
    
    // Update background if orientation changes
    const handleOrientationChange = () => {
        setTimeout(() => {
            const newOrientation = getOrientation();
            bgImage.src = ASSETS.avatarSelection[newOrientation];
        }, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    // Get video elements
    const leonVideo = document.querySelector('.leon-video');
    const andreVideo = document.querySelector('.andre-video');
    
    // Ensure videos are muted (volume = 0)
    if (leonVideo) {
        leonVideo.muted = true;
        leonVideo.volume = 0;
        leonVideo.play().catch(e => console.log('Leon video autoplay prevented:', e));
    }
    if (andreVideo) {
        andreVideo.muted = true;
        andreVideo.volume = 0;
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
            }, 200);
            
            // Clean up orientation listeners
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
            
            // Transition to main menu after brief delay
            setTimeout(() => {
                switchScreen('avatar-selection-screen', 'main-menu-screen');
            }, 500);
        };
        
        // Add both click and touch events
        zone.addEventListener('click', handleSelection);
        zone.addEventListener('touchend', handleSelection, { passive: false });
    });
}

/* ===================================
   Application Initialization
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('SuperMatch3 starting...');
    initSplashScreen();
});

// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent double-tap zoom on iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Log orientation changes for debugging
window.addEventListener('orientationchange', () => {
    console.log(`Orientation changed to: ${getOrientation()}`);
});
