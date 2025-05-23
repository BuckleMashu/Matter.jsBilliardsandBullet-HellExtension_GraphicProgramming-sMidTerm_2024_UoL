# Matter.jsBilliardsandBullet-HellExtension_GraphicProgramming-sMidTerm_2024_UoL

This repository hosts a 2D physics-based game project developed using p5.js and the Matter.js physics engine. The primary component is a billiards/snooker-style game, with an additional creative extension that transforms the theme into a frantic bullet-hell shooter.

The project is structured across several JavaScript files: sketch.js (main logic), balls.js (ball creation and management), table.js (pool table and border setup), cuestick.js (cue stick mechanics), gamemechanic.js (game modes and potting logic), and creative.js (the bullet-hell extension).

Core Billiards Game Features:

    Physics-Based Gameplay: Utilizes Matter.js for realistic ball collisions, friction, and restitution.

    Table Setup (table.js):

        Generates a standard pool table with borders and six pockets (holes).

        Includes visual details like the green play area and white marking lines.

    Ball Setup & Management (balls.js):

        Initial Ball Placement: Sets up the initial configuration of red balls and colored balls. Offers different game modes:

            Default: Standard snooker-like setup.

            Red Randomized: Red balls placed randomly.

            All Randomized: All balls (red and colored) placed randomly.

        Cue Ball Placement: Allows the player to place the cue ball within the starting "D" area, or anywhere on the table if it was previously potted.

    Cue Stick Mechanics (cuestick.js):

        Players aim and shoot by clicking and dragging the mouse away from the cue ball.

        The power and direction of the shot are determined by the drag distance and angle.

        Visual feedback includes a line indicating the shot path and an animated cue stick during the shot.

    Potting Logic (gamemechanic.js, balls.js):

        Detects when balls enter the pockets.

        Handles basic snooker rules for potted balls (e.g., cue ball potted, colored balls re-spotted under certain conditions).

        Tracks which ball was potted last to enforce some potting order rules.

    Game Modes (gamemechanic.js): Users can select different starting configurations for the balls.

Extension: "Cue vs. The Reds" - A Billiard-Themed Bullet-Hell (creative.js)

    Alternate Gameplay: Accessed via a secret game mode or by potting all red balls in the main game.

    Story/Theme: A humorous lore where "Sir Knight Redious the 12th" (the player, a red ball) fights against "The Cue" (the antagonist, a white cue ball with a tiger image) and its colored ball minions.

    Player Mechanics:

        Control a red ball character that can move left/right (A/D keys) and jump (W key).

        Shoot projectiles (Spacebar).

    Boss Battle:

        The "Cue" acts as a boss with multiple attack patterns:

            Laser Shots: Fires projectiles towards the player.

            Swipe Attacks: Creates rotating bars that damage the player.

            Wall Spikes: Summons spikes from the sides of the arena.

        The boss has a health bar, and the player wins by depleting it.

    Player Health: The player character also has health points and loses upon taking too much damage.

    Dynamic Music: Features epic battle music during the extension.

    Visuals: Custom graphics for the player, boss (tiger image), and arena.

Technologies Used:

    JavaScript (p5.js library for drawing, UI, and game loop)

    Matter.js (2D rigid body physics engine)

    HTML (for canvas)

    Audio and image assets.
