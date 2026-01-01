# SuperMatch3 Design Document

## Project Overview

SuperMatch3 is an educational game platform for young children (ages 3-7) featuring multiple activity templates, personalized avatars, and fully responsive design across devices.

**Primary User**: Leon (age ~5)  
**Additional Users**: Andre, JR, Kaila, Alanna

**Development Approach**: Initial release with Leon and Andre, expand to include JR, Kaila, and Alanna in subsequent updates.

### Target Platforms

**Primary Target**: iPad
- Optimized for iPad screen sizes and touch interactions
- Primary testing and development focus
- Touch-first design with large, child-friendly interactive elements

**Secondary Targets**: 
- iPhone (smaller screen adaptations)
- Desktop browsers (Mac/PC) for development and testing

**Future Goal**: Release as a native iOS app on the Apple App Store (iPad and iPhone versions)

**Current Approach**: Build with web technologies (HTML5/CSS/JavaScript) for rapid development and cross-platform compatibility, with the ability to package as a native app later using tools like Capacitor or similar frameworks.

---

## Template Architecture

### Core Concept

SuperMatch3 is built around **reusable game templates** - modular activity types that can be populated with different educational content (assets) to create varied learning experiences. This approach allows us to:

- Create new learning activities quickly by swapping asset sets
- Maintain consistent interaction patterns children can learn
- Scale content without rebuilding game mechanics
- Mix and match templates for comprehensive learning

### Current Templates

**1. Multi-Choice Template** (from SuperMatch2)
- Display 4-6 options in a grid
- User selects correct answer
- Used for: color recognition, shape identification, object matching
- **Asset Requirements**: Individual item images (colors, shapes, objects)

**2. Drag-and-Drop Puzzle Template** (NEW - Primary Focus)
- User drags object to matching context/background
- Visual "puzzle piece" metaphor with transparent holes
- Used for: contextual understanding, spatial reasoning, object-environment relationships
- **Asset Requirements**: Three-part image sets (full, foreground, background)

### Template Extensibility

The architecture supports future templates such as:
- **Sequencing Template**: Arrange items in correct order (numbers, alphabet, story steps)
- **Sorting Template**: Categorize items into groups (animals vs vehicles, colors, sizes)
- **Tracing Template**: Follow paths or trace shapes for motor skill development
- **Memory Match Template**: Classic memory card game with pairs
- **Counting Template**: Interactive counting activities

Each template follows the same structure:
```javascript
class GameTemplate {
  constructor(category, assets, difficulty) {
    // Template-specific initialization
  }
  
  render() {
    // Display the game UI
  }
  
  handleInteraction(userAction) {
    // Process user input
  }
  
  checkAnswer(userAnswer) {
    // Validate and provide feedback
  }
  
  nextRound() {
    // Load next question/puzzle
  }
}
```

This structure ensures consistency while allowing each template to implement unique mechanics.

---

## General Screen Layout

All game screens (except Splash) share this common structure:

### Header Area (Top ~10vh)
- **Left Side**: Back/Home button (when applicable)
- **Center**: Current activity title or player name
- **Right Side**: Settings icon, score display (when applicable)
- **Background**: Glass morphism effect with subtle gradient

### Game Area (Remaining viewport)
- Main content area for all game activities
- Dynamically sized based on remaining screen space after header
- All content scales proportionally to fit available space
- Maintains touch-friendly sizing (minimum 80x80px touch targets)

### Optional Footer (Bottom ~5vh, context-dependent)
- Progress indicators (e.g., "3 of 10 completed")
- Hint button
- Audio replay button

---

## Screen Definitions

### 1. Splash Screen
**Purpose**: Brief loading screen with game logo  
**Duration**: 2-3 seconds or until assets loaded  
**Content**: 
- SuperMatch3 logo with playful animation
- "Loading..." indicator
- No header/footer

### 2. Avatar Selection Screen
**Purpose**: Each grandchild selects their personal avatar  
**Layout**:
- Title: "Who's Playing?"
- 5 avatar cards arranged in a responsive grid (2x3 or 3x2 depending on orientation)
- Each card shows:
  - Animated avatar image
  - Child's name below
  - Subtle hover/touch animation (scale + glow)
- Avatars pop in sequentially with spring animation

**Data Structure**:
```javascript
const players = [
  { id: 1, name: "Leon", avatar: "leon-avatar.png" },
  { id: 2, name: "Andre", avatar: "andre-avatar.png" },
  { id: 3, name: "JR", avatar: "jr-avatar.png" },
  { id: 4, name: "Kaila", avatar: "kaila-avatar.png" },
  { id: 5, name: "Alanna", avatar: "alanna-avatar.png" }
];
```

**Phase 1 Implementation**: Show only Leon and Andre initially, easy to add others by updating array.

### 3. Main Menu Screen
**Purpose**: Select which activity to play  
**Layout**:
- Player's avatar in top-left corner (animated breathing/floating)
- Welcome message: "Hi [Name]! What do you want to play?"
- Activity icons arranged in circular or grid layout
- Each activity icon:
  - Representative image/icon
  - Activity name label
  - Continuous floating animation (different speeds/amplitudes)
  - Touch scales and glows

**Initial Activities**:
- "Match It!" (Multi-Choice Template)
- "Put It Together!" (Drag-and-Drop Template)
- (Future activities can be added easily)

### 4. Category Selection Screen
**Purpose**: Choose a learning category (Colors, Shapes, Fruits, Animals, etc.)  
**Layout**:
- Same structure as Main Menu but with category cards
- Each category shows representative imagery
- Player avatar still visible in corner

### 5. Difficulty Selection Screen (Optional)
**Purpose**: Choose grade level (Baby Bear, Explorer Bunny, Champion)  
**Layout**:
- Character-based selection similar to previous game
- Player avatar watches from corner

---

## Game Templates

### Template 1: Multi-Choice Template
**Original matching game from SuperMatch2**

**Layout**:
- Audio/Text prompt at top: "Find the [color/shape/item]"
- 4-6 option boxes arranged in grid (2x2, 2x3, or 3x2 based on screen size)
- Each box contains an image/shape
- Player avatar on side providing encouragement

**Interaction**:
- User taps/clicks correct option
- **Success**: 
  - Correct box scales and glows
  - Celebration animation (confetti, stars, sparkles)
  - Success sound effect
  - Avatar celebrates
  - Brief pause, then next question
- **Failure**:
  - Selected box shakes/wobbles
  - Buzzer sound
  - Prompt: "Try again!"
  - Box returns to normal state

**Responsive Considerations**:
- Boxes scale to fill available space
- Minimum touch target: 80x80px
- Padding adjusts based on screen size
- Images scale within boxes maintaining aspect ratio

---

### Template 2: Drag-and-Drop Puzzle Template
**NEW - The primary focus for initial development**

#### Image Asset Structure

Each puzzle item requires 3 images with naming convention: `{item}-{type}.png`

- **`{item}-full.png`**: Complete scene (1024x1024)
  - Object in natural context
  - Example: Apple hanging on tree branch
  
- **`{item}-fg.png`**: Foreground object (1024x1024)
  - The object isolated from the scene
  - All non-object pixels are transparent
  - This is what the child drags
  - Example: Just the apple with transparent background
  
- **`{item}-bg.png`**: Background scene (1024x1024)
  - The scene with object "removed" (transparent hole)
  - Inverse of fg image
  - Creates the visual "puzzle hole"
  - Example: Tree branch with apple-shaped transparent hole

#### Asset Directory Structure

```
/assets/
  
  /images/
    /puzzles/                          # Drag-and-Drop Puzzle Template assets
      /fruits/
        apple-full.png                 # Complete scene (1024x1024)
        apple-fg.png                   # Foreground object only
        apple-bg.png                   # Background with transparent hole
        orange-full.png
        orange-fg.png
        orange-bg.png
        banana-full.png
        banana-fg.png
        banana-bg.png
      /animals/
        dog-full.png
        dog-fg.png
        dog-bg.png
        cat-full.png
        cat-fg.png
        cat-bg.png
      /vehicles/
        car-full.png
        car-fg.png
        car-bg.png
      /nature/
        flower-full.png
        flower-fg.png
        flower-bg.png
        
    /multichoice/                      # Multi-Choice Template assets
      /colors/
        red.png                        # Simple color swatches
        blue.png
        green.png
        yellow.png
      /shapes/
        circle.png                     # Basic shapes
        square.png
        triangle.png
        rectangle.png
      /objects/
        ball.png                       # Individual objects
        book.png
        car.png
        
    /avatars/                          # Player avatars
      leon-avatar.png                  # Generated with Sora 2
      andre-avatar.png
      jr-avatar.png
      kaila-avatar.png
      alanna-avatar.png
      
    /ui/                               # User interface elements
      /icons/
        home-icon.png
        settings-icon.png
        back-icon.png
        sound-on-icon.png
        sound-off-icon.png
        hint-icon.png
      /backgrounds/
        main-menu-bg.png               # Themed backgrounds
        game-bg.png
        selection-bg.png
      /decorations/
        confetti.png                   # Animation assets
        stars.png
        sparkles.png
        
  /audio/
    /voice/                            # AI-generated voice prompts
      /leon/                           # Personalized per child
        welcome-leon.mp3               # "Hi Leon! What do you want to play?"
        great-job-leon.mp3             # "Great job, Leon!"
        try-again-leon.mp3             # "Try again, Leon!"
      /andre/
        welcome-andre.mp3
        great-job-andre.mp3
        try-again-andre.mp3
      /jr/
        welcome-jr.mp3
        great-job-jr.mp3
        try-again-jr.mp3
      /kaila/
        welcome-kaila.mp3
        great-job-kaila.mp3
        try-again-kaila.mp3
      /alanna/
        welcome-alanna.mp3
        great-job-alanna.mp3
        try-again-alanna.mp3
      /generic/                        # Non-personalized prompts
        find-the-apple.mp3             # "Can you find where the apple goes?"
        find-the-color-red.mp3
        tap-the-circle.mp3
        
    /sfx/                              # Sound effects
      success-chime.mp3                # Correct answer celebration
      success-fanfare.mp3              # Major achievement
      buzzer.mp3                       # Wrong answer
      whoosh.mp3                       # Object returns to position
      pop.mp3                          # UI interactions
      click.mp3                        # Button clicks
      
    /music/                            # Background music
      main-menu-loop.mp3               # Subtle, non-intrusive
      gameplay-loop.mp3
      
  /video/                              # Future: animated tutorials or celebrations
    /tutorials/
      how-to-drag.mp4                  # Quick tutorial animations
      how-to-select.mp4
    /celebrations/
      level-complete.mp4               # Special celebration animations
      
  /fonts/                              # Custom fonts for consistency
    kid-friendly-regular.woff2
    kid-friendly-bold.woff2
    
  /data/                               # Game configuration and content
    /categories/
      fruits.json                      # Defines items in each category
      animals.json
      vehicles.json
      colors.json
      shapes.json
    players.json                       # Player/avatar configuration
    templates.json                     # Template definitions
```

#### Asset Naming Conventions

**Images**:
- **Puzzle assets**: `{item}-{type}.png` where type is `full`, `fg`, or `bg`
- **Multi-choice**: `{item}.png` (simple, descriptive names)
- **Avatars**: `{name}-avatar.png` (lowercase names)
- **UI elements**: `{purpose}-{descriptor}.png` (e.g., `home-icon.png`)

**Audio**:
- **Voice prompts**: `{purpose}-{name}.mp3` (e.g., `welcome-leon.mp3`)
- **Generic prompts**: `{action}-{target}.mp3` (e.g., `find-the-apple.mp3`)
- **Sound effects**: `{event}.mp3` (e.g., `success-chime.mp3`)

**Data Files**:
- **Category definitions**: `{category}.json`
- **Configuration**: `{purpose}.json`

#### Asset Specifications

**Images**:
- **Puzzle images**: 1024x1024 PNG with transparency support
- **Avatar images**: 512x512 PNG with transparency
- **UI icons**: 128x128 or 256x256 PNG
- **Format**: PNG for transparency support
- **Optimization**: Use TinyPNG or similar to reduce file sizes

**Audio**:
- **Format**: MP3 (broad compatibility) or M4A for iOS optimization
- **Bitrate**: 128kbps for voice, 192kbps for music
- **Sample Rate**: 44.1kHz
- **Mono vs Stereo**: Mono for voice prompts, stereo for music/sfx

**Video** (future):
- **Format**: MP4 (H.264)
- **Resolution**: 1080p max (scale down for devices)
- **Compression**: Optimized for mobile playback

#### Category Configuration Example

```json
// fruits.json
{
  "category": "fruits",
  "displayName": "Fruits",
  "icon": "assets/images/puzzles/fruits/apple-fg.png",
  "items": [
    {
      "id": "apple",
      "name": "Apple",
      "templates": {
        "puzzle": {
          "full": "assets/images/puzzles/fruits/apple-full.png",
          "fg": "assets/images/puzzles/fruits/apple-fg.png",
          "bg": "assets/images/puzzles/fruits/apple-bg.png"
        },
        "multichoice": {
          "image": "assets/images/multichoice/fruits/apple.png"
        }
      },
      "audio": {
        "prompt": "assets/audio/voice/generic/find-the-apple.mp3",
        "name": "assets/audio/voice/generic/apple.mp3"
      }
    },
    {
      "id": "orange",
      "name": "Orange",
      "templates": { /* ... */ }
    }
  ]
}
```

This structure allows easy content management and makes it simple to add new items to existing categories or create entirely new categories.

#### Screen Layout

**Source Area (Left ~30% of Game Area)**:
- Single fg image displayed (vertically centered)
- Object name label below (optional, for older kids)
- Gentle floating animation
- Player avatar providing encouragement above or below

**Target Area (Right ~70% of Game Area)**:
- 3-5 bg images arranged vertically or in grid
- Each bg image in a card with subtle border
- One bg matches the fg (same prefix)
- Others are random from same category
- Gentle floating animations (different phases)

**Visual Feedback Zones**:
- When fg object is dragged near correct bg: subtle glow/highlight on target
- Drop zones should be generous (bigger than visible bg image)

#### Interaction Flow

**1. Initial State**:
- fg image on left (draggable)
- Multiple bg images on right (drop targets)
- Audio prompt: "Can you find where the [apple] goes?"

**2. Drag Behavior**:
- fg image follows touch/mouse
- Scales slightly larger (110%) while dragging
- Original position shows faint outline/shadow
- Rotation follows drag direction subtly (optional enhancement)

**3. Drop on Correct bg**:
- fg snaps into position over bg
- Brief pause (200ms)
- **Merge animation**: 
  - Both images crossfade into the full image
  - Scale pulse (100% → 110% → 100%)
  - Sparkle/shine animation emanates from center
- **Celebration**:
  - Success sound (chime, "yay!", etc.)
  - Avatar celebrates (jumps, claps)
  - Full image glows with border
  - Confetti or stars burst
- **Progress**:
  - Score/progress updates
  - Brief pause (2-3 seconds)
  - Next puzzle loads (new fg on left, new set of bg on right)

**4. Drop on Incorrect bg**:
- fg image bounces off incorrect target
- Gentle shake animation on wrong bg
- Buzzer sound effect
- fg image snaps back to original position (with spring animation)
- Avatar reacts (head shake, encouraging gesture)
- Audio prompt: "Not quite! Try again!"
- No penalty, unlimited attempts

**5. Drop in Empty Space**:
- fg image returns to original position
- Soft "whoosh" sound
- No error feedback (just returns home)

#### Responsive Sizing Strategy

**Scale Factor Calculation**:
```javascript
// Calculate scale based on available game area
const gameAreaWidth = window.innerWidth;
const gameAreaHeight = window.innerHeight - headerHeight - footerHeight;

// Images are 1024x1024, scale to fit
const maxSourceWidth = gameAreaWidth * 0.25; // 25% for source
const maxTargetWidth = (gameAreaWidth * 0.70) / numTargets; // 70% divided by target count
const maxHeight = gameAreaHeight * 0.80; // 80% of available height

// Use smallest constraint
const scaleFactor = Math.min(
  maxSourceWidth / 1024,
  maxTargetWidth / 1024,
  maxHeight / 1024,
  1.0 // Never scale up beyond native resolution
);
```

**Adaptive Layout**:
- **Portrait Mode (iPad/iPhone)**: Stack source on top, targets below in 2x2 or 3x2 grid
- **Landscape Mode (Desktop)**: Source on left, targets on right in vertical column or 2x3 grid
- **Minimum sizes**: Never let images go below 200x200px at rendered size

#### Animation System

**Floating Animations**:
- Each bg uses `animation-delay` to offset timing
- Subtle vertical motion: ±10px
- Duration: 3-4 seconds
- Easing: ease-in-out

**Drag Animation**:
- `transform: scale(1.1)` during drag
- `cursor: grabbing` or touch equivalent
- Smooth transition using `transform` and `translate3d` for GPU acceleration

**Success Animation Sequence**:
```javascript
// Pseudocode timeline
0ms: Drop completes, fg snaps to bg position
200ms: Start crossfade (fg+bg → full)
600ms: Crossfade complete
650ms: Scale pulse starts (1.0 → 1.1)
850ms: Scale returns (1.1 → 1.0)
900ms: Sparkle effect triggers
1200ms: Avatar celebration starts
3000ms: Next puzzle loads
```

---

## Global Responsive Design Strategy

### Viewport Units
- Use `vw`, `vh`, `vmin`, `vmax` for all major layout
- Example: Header height = `10vh`, Game area = `85vh`, Footer = `5vh`

### Container Strategy
```css
.game-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.game-area {
  width: 100%;
  height: calc(100vh - 15vh); /* Account for header + footer */
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Touch Targets
- Minimum size: 80x80px (Apple HIG recommendation)
- Padding between targets: 10-15px minimum
- All interactive elements scale proportionally

### Media Queries
```css
/* iPhone Portrait */
@media (max-width: 480px) and (orientation: portrait) { }

/* iPhone Landscape */
@media (max-height: 480px) and (orientation: landscape) { }

/* iPad Portrait */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) { }

/* iPad Landscape */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## Audio System

### Audio Triggers
- **Prompts**: "Find where the [item] goes!"
- **Success**: Chime + verbal praise ("Great job [Name]!")
- **Failure**: Gentle buzzer + encouragement ("Try again!")
- **Background**: Subtle, non-intrusive music (toggleable)

### Personalized Audio
- Use child's name in prompts: "Great job, Leon!"
- Plan to use AI-generated audio (later phase)

### Implementation Notes
- Use Web Audio API or Howler.js for better control
- Preload all audio assets
- Respect system mute settings
- Parent control to disable audio

---

## Avatar System

### Avatar Appearances
- Avatar appears in corner of all game screens after selection
- Animated reactions:
  - **Idle**: Gentle breathing/floating
  - **Correct answer**: Jump, clap, cheer
  - **Incorrect answer**: Head shake, encouraging gesture
  - **Waiting**: Occasional blink, head tilt

### Avatar Data Structure
```javascript
const currentPlayer = {
  id: 1,
  name: "Leon",
  avatar: "leon-avatar.png",
  score: 0,
  progress: { /* ... */ }
};
```

---

## State Management

### Game State Structure
```javascript
const gameState = {
  currentScreen: "avatar-selection", // or "main-menu", "playing", etc.
  currentPlayer: null,
  currentActivity: null,
  currentCategory: null,
  currentLevel: null,
  score: 0,
  itemsCompleted: 0,
  totalItems: 10,
  // Template-specific state
  templateState: { /* ... */ }
};
```

---

## Development Phases

### Phase 1 (Priority): Drag-and-Drop Template
- Implement responsive layout
- Build drag-and-drop mechanics
- Test on iPad, iPhone, desktop
- Polish animations and audio
- Create 2-3 puzzle categories with 5-10 items each
- **Initial Users**: Leon and Andre

### Phase 2: Integration
- Avatar selection screen (Leon & Andre initially)
- Main menu with activity selection
- Category selection
- Wire up drag-and-drop template

### Phase 3: Expand User Base
- Add avatars for JR, Kaila, Alanna
- Test with all users

### Phase 4: Multi-Choice Template
- Refactor/modernize from SuperMatch2
- Apply responsive design
- Integrate with new architecture

### Phase 5: Polish
- AI-generated audio with personalized names
- Additional animations
- Settings screen
- Save progress (localStorage)

---

## Technical Stack

**Core**:
- HTML5 / CSS3 / JavaScript (ES6+)
- No frameworks initially (pure vanilla JS)
- May add lightweight libraries as needed:
  - Howler.js (audio)
  - GreenSock (advanced animations, if needed)

**Development**:
- VS Code / Cursor
- Live Server for testing
- Remote device testing (BrowserStack or physical devices)

**Asset Pipeline**:
- Sora 2 / Nano Banana Pro for avatars
- 1024x1024 PNG images
- Optimize for web (TinyPNG or similar)

---

## Success Metrics

### Technical
- ✅ Works flawlessly on iPad (primary target)
- ✅ Works on iPhone (secondary target)
- ✅ Works on desktop browsers
- ✅ No layout breaking at any screen size
- ✅ 60fps animations
- ✅ Touch targets always accessible

### User Experience
- ✅ Leon (5 years old) can complete puzzle independently
- ✅ Engaging animations maintain interest
- ✅ Clear audio/visual feedback
- ✅ No frustration from incorrect drops
- ✅ Celebration feels rewarding

---

## Notes & Open Questions

1. **Score System**: Should we track score, or just completion? Scoring might add pressure for young kids.

2. **Difficulty Progression**: Should puzzles get harder (more options) as child progresses?

3. **Hints**: Should there be a hint system (highlight correct bg after X failed attempts)?

4. **Accessibility**: Consider color-blind modes, high-contrast option?

5. **Data Persistence**: Save progress in localStorage or keep sessions fresh each time?

6. **Multiple Sessions**: If two grandkids want to play at same time on different devices, that's fine - no server sync needed.

---

**End of Design Document v1.0**