In App.tsx Build a LEGO character builder in React (or Next.js) where users can create a personalized LEGO minifigure by selecting a head, torso, and legs from image options.

🖼️ UI Description (based on provided image)
At the top center of the screen is a preview of the LEGO character.

It consists of three stacked images: head (on top), torso (middle), legs (bottom).

The parts are aligned vertically and centered.

The top right corner has a “Next” button (for navigation).

The top left corner has a close “X” icon.

Below the character preview are three labeled selection rows:

Head — shows multiple LEGO heads (yellow faces with various expressions)

Torso — shows torsos with various outfits (e.g. superhero suits, floral dress, jacket)

Legs — shows different colored leg pieces (e.g. black, blue, light blue)

Each section has horizontally scrollable options. Selected items are highlighted (e.g., with a purple outline in the original image).

🗂️ Image Assets
Use the following folder structure (inside the public folder):

public/faces/ — contains all face images (face1.png, face2.png, etc.)

public/torso/ — contains all torso images

public/legs/ — contains all leg images

⚙️ Functionality
Users can tap on a head, torso, or legs to instantly update the main preview character.

Only one image per category can be active/selected at any time.

Selected items should be visually highlighted (e.g., border or outline).

Use useState to track the selected head, torso, and legs.

Load images dynamically from /faces/, /torso/, and /legs/.

🧱 Stacking Logic
LEGO character should be rendered using 3 stacked images:

Use a container with position: relative

Each part (head, torso, legs) is an absolutely-positioned img

Use z-index and margins to align them vertically to simulate a real figure
