function hexToHsl(hex) {
   let r = parseInt(hex.slice(1, 3), 16) / 255;
   let g = parseInt(hex.slice(3, 5), 16) / 255;
   let b = parseInt(hex.slice(5, 7), 16) / 255;
   let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
   let h,
      s,
      l = (max + min) / 2;
   if (max === min) {
      h = s = 0;
   } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
         case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
         case g:
            h = (b - r) / d + 2;
            break;
         case b:
            h = (r - g) / d + 4;
            break;
      }
      h /= 6;
   }
   return { h: h * 360, s: s * 100, l: l * 100 };
}

function getSimilarColor(color) {
   const hsl = hexToHsl(color);
   const hueVariation = 10;
   const newHue =
      (hsl.h + Math.random() * hueVariation - hueVariation / 2) % 360;
   return `hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`;
}

document.addEventListener("DOMContentLoaded", function () {
   const userNameInputContainer = document.getElementById(
      "name-input-container"
   );
   const userNameInput = document.getElementById("user-name-input");
   const submitNameBtn = document.getElementById("submit-name-btn");
   const inputContainer = document.getElementById("input-container");
   const userDisplayName = document.getElementById("user-display-name");

   const textInput = document.getElementById("text-input");
   const generateBtn = document.getElementById("generate-btn");
   const pixelContainer = document.getElementById("pixel-container");
   const waveAnimation = document.getElementById("wave-animation");
   const randomizeBtn = document.getElementById("randomize-btn");
   const controls = document.getElementById("controls");
   const toggleAnimationBtn = document.getElementById("toggle-animation-btn");

   let animationEnabled = true;
   let pixels = [];
   let textMap = [];
   let currentText = ""; // Store current text for randomization

   const colors = [
      "#FF3D00",
      "#FF9100",
      "#FFEA00",
      "#64DD17",
      "#00B0FF",
      "#7C4DFF",
      "#F50057",
   ];

   // Simple 5x3 pixel font (1 = pixel on, 0 = pixel off)
   const font = {
      A: [
         [0, 1, 0],
         [1, 0, 1],
         [1, 1, 1],
         [1, 0, 1],
         [1, 0, 1],
      ],
      B: [
         [1, 1, 0],
         [1, 0, 1],
         [1, 1, 0],
         [1, 0, 1],
         [1, 1, 0],
      ],
      C: [
         [0, 1, 1],
         [1, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
         [0, 1, 1],
      ],
      D: [
         [1, 1, 0],
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [1, 1, 0],
      ],
      E: [
         [1, 1, 1],
         [1, 0, 0],
         [1, 1, 0],
         [1, 0, 0],
         [1, 1, 1],
      ],
      F: [
         [1, 1, 1],
         [1, 0, 0],
         [1, 1, 0],
         [1, 0, 0],
         [1, 0, 0],
      ],
      G: [
         [0, 1, 1],
         [1, 0, 0],
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 1],
      ],
      H: [
         [1, 0, 1],
         [1, 0, 1],
         [1, 1, 1],
         [1, 0, 1],
         [1, 0, 1],
      ],
      I: [
         [1, 1, 1],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [1, 1, 1],
      ],
      J: [
         [0, 0, 1],
         [0, 0, 1],
         [0, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
      ],
      K: [
         [1, 0, 1],
         [1, 1, 0],
         [1, 0, 0],
         [1, 1, 0],
         [1, 0, 1],
      ],
      L: [
         [1, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
         [1, 1, 1],
      ],
      M: [
         [1, 0, 1],
         [1, 1, 1],
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
      ],
      N: [
         [1, 0, 1],
         [1, 1, 1],
         [1, 1, 1],
         [1, 0, 1],
         [1, 0, 1],
      ],
      O: [
         [0, 1, 0],
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
      ],
      P: [
         [1, 1, 0],
         [1, 0, 1],
         [1, 1, 0],
         [1, 0, 0],
         [1, 0, 0],
      ],
      Q: [
         [0, 1, 0],
         [1, 0, 1],
         [1, 0, 1],
         [1, 1, 1],
         [0, 1, 1],
      ],
      R: [
         [1, 1, 0],
         [1, 0, 1],
         [1, 1, 0],
         [1, 1, 0],
         [1, 0, 1],
      ],
      S: [
         [0, 1, 1],
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 1],
         [1, 1, 0],
      ],
      T: [
         [1, 1, 1],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
      ],
      U: [
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
      ],
      V: [
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
         [0, 1, 0],
      ],
      W: [
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [1, 1, 1],
         [1, 0, 1],
      ],
      X: [
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
         [1, 0, 1],
         [1, 0, 1],
      ],
      Y: [
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
      ],
      Z: [
         [1, 1, 1],
         [0, 0, 1],
         [0, 1, 0],
         [1, 0, 0],
         [1, 1, 1],
      ],
      " ": [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
      ",": [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 1, 0],
         [1, 0, 0],
      ],
      "'": [
         [0, 1, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
      ".": [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 1, 0],
      ],
      "!": [
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 1, 0],
      ],
      "?": [
         [1, 1, 1],
         [0, 0, 1],
         [0, 1, 1],
         [0, 0, 0],
         [0, 1, 0],
      ],
      0: [
         [0, 1, 0],
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1],
         [0, 1, 0],
      ],
      1: [
         [0, 1, 0],
         [1, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [1, 1, 1],
      ],
      2: [
         [1, 1, 0],
         [0, 0, 1],
         [0, 1, 0],
         [1, 0, 0],
         [1, 1, 1],
      ],
      3: [
         [1, 1, 1],
         [0, 0, 1],
         [0, 1, 1],
         [0, 0, 1],
         [1, 1, 1],
      ],
      4: [
         [1, 0, 1],
         [1, 0, 1],
         [1, 1, 1],
         [0, 0, 1],
         [0, 0, 1],
      ],
      5: [
         [1, 1, 1],
         [1, 0, 0],
         [1, 1, 1],
         [0, 0, 1],
         [1, 1, 0],
      ],
      6: [
         [0, 1, 1],
         [1, 0, 0],
         [1, 1, 1],
         [1, 0, 1],
         [0, 1, 0],
      ],
      7: [
         [1, 1, 1],
         [0, 0, 1],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
      ],
      8: [
         [0, 1, 0],
         [1, 0, 1],
         [0, 1, 0],
         [1, 0, 1],
         [0, 1, 0],
      ],
      9: [
         [0, 1, 0],
         [1, 0, 1],
         [0, 1, 1],
         [0, 0, 1],
         [1, 1, 0],
      ],
      "-": [
         [0, 0, 0],
         [0, 0, 0],
         [1, 1, 1],
         [0, 0, 0],
         [0, 0, 0],
      ],
      "+": [
         [0, 1, 0],
         [0, 1, 0],
         [1, 1, 1],
         [0, 1, 0],
         [0, 1, 0],
      ],
      "=": [
         [0, 0, 0],
         [1, 1, 1],
         [0, 0, 0],
         [1, 1, 1],
         [0, 0, 0],
      ],
      "/": [
         [0, 0, 1],
         [0, 1, 0],
         [0, 1, 0],
         [1, 0, 0],
         [1, 0, 0],
      ],
      ":": [
         [0, 0, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 1, 0],
         [0, 0, 0],
      ],
      ";": [
         [0, 0, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 1, 0],
         [1, 0, 0],
      ],
      "<": [
         [0, 0, 1],
         [0, 1, 0],
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 1],
      ],
      ">": [
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 1],
         [0, 1, 0],
         [1, 0, 0],
      ],
      "[": [
         [1, 1, 0],
         [1, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
         [1, 1, 0],
      ],
      "]": [
         [0, 1, 1],
         [0, 0, 1],
         [0, 0, 1],
         [0, 0, 1],
         [0, 1, 1],
      ],
      "(": [
         [0, 1, 0],
         [1, 0, 0],
         [1, 0, 0],
         [1, 0, 0],
         [0, 1, 0],
      ],
      ")": [
         [0, 1, 0],
         [0, 0, 1],
         [0, 0, 1],
         [0, 0, 1],
         [0, 1, 0],
      ],
      "{": [
         [0, 1, 1],
         [1, 0, 0],
         [1, 1, 0],
         [1, 0, 0],
         [0, 1, 1],
      ],
      "}": [
         [1, 1, 0],
         [0, 0, 1],
         [0, 1, 1],
         [0, 0, 1],
         [1, 1, 0],
      ],
      "|": [
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
         [0, 1, 0],
      ],
      "\\": [
         [1, 0, 0],
         [0, 1, 0],
         [0, 1, 0],
         [0, 0, 1],
         [0, 0, 1],
      ],
      '"': [
         [1, 0, 1],
         [1, 0, 1],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
      "#": [
         [0, 1, 0],
         [1, 1, 1],
         [0, 1, 0],
         [1, 1, 1],
         [0, 1, 0],
      ],
      $: [
         [0, 1, 1],
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 1],
         [1, 1, 0],
      ],
      "%": [
         [1, 0, 1],
         [0, 0, 1],
         [0, 1, 0],
         [1, 0, 0],
         [1, 0, 1],
      ],
      "&": [
         [0, 1, 0],
         [1, 0, 1],
         [0, 1, 0],
         [1, 0, 1],
         [0, 1, 1],
      ],
      "*": [
         [1, 0, 1],
         [0, 1, 0],
         [1, 1, 1],
         [0, 1, 0],
         [1, 0, 1],
      ],
      "@": [
         [0, 1, 1],
         [1, 0, 1],
         [1, 1, 1],
         [1, 1, 0],
         [0, 1, 1],
      ],
      "^": [
         [0, 1, 0],
         [1, 0, 1],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
      _: [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
         [1, 1, 1],
      ],
      "~": [
         [0, 0, 0],
         [0, 1, 0],
         [1, 0, 1],
         [0, 0, 0],
         [0, 0, 0],
      ],
      "`": [
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
      "'": [
         [0, 1, 0],
         [0, 1, 0],
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0],
      ],
   };

   function getRandomColor() {
      return colors[Math.floor(Math.random() * colors.length)];
   }

   function generatePattern(text) {
      currentText = text; // Update current text
      pixelContainer.innerHTML = "";
      pixels = [];
      textMap = [];

      const containerWidth = pixelContainer.clientWidth;
      const pixelSize =
         window.innerWidth <= 480 ? 12 : window.innerWidth <= 768 ? 18 : 24;
      const gap =
         window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 3 : 4;
      const columns = Math.floor(containerWidth / (pixelSize + gap));
      const rows = Math.max(15, 7);

      const charWidth = 3;
      const charHeight = 5;
      const spacing = 1;
      const totalWidth = text.length * (charWidth + spacing) - spacing;
      const startX = Math.floor((columns - totalWidth) / 2);
      const startY = Math.floor((rows - charHeight) / 2);

      for (let i = 0; i < rows; i++) {
         textMap[i] = [];
         for (let j = 0; j < columns; j++) {
            textMap[i][j] = false;
         }
      }

      text.split("").forEach((char, index) => {
         const charMatrix = font[char] || font[" "];
         const offsetX = startX + index * (charWidth + spacing);
         for (let y = 0; y < charHeight; y++) {
            for (let x = 0; x < charWidth; x++) {
               if (charMatrix[y][x]) {
                  const gridX = offsetX + x;
                  const gridY = startY + y;
                  if (
                     gridX >= 0 &&
                     gridX < columns &&
                     gridY >= 0 &&
                     gridY < rows
                  ) {
                     textMap[gridY][gridX] = true;
                  }
               }
            }
         }
      });
      for (let i = 0; i < rows; i++) {
         for (let j = 0; j < columns; j++) {
            const pixel = document.createElement("div");
            pixel.className = "pixel";
            pixel.dataset.row = i;
            pixel.dataset.col = j;

            let bgColor;
            if (textMap[i][j]) {
               bgColor = "#000000";
               pixel.style.backgroundColor = bgColor;
            } else {
               bgColor = getRandomColor();
               pixel.style.backgroundColor = bgColor;
            }

            // Set tooltip colors
            pixel.style.setProperty("--color1", getSimilarColor(bgColor));
            pixel.style.setProperty("--color2", getSimilarColor(bgColor));

            pixelContainer.appendChild(pixel);
            pixels.push(pixel);

            pixel.addEventListener("click", function () {
               if (!textMap[i][j]) {
                  const newColor = getRandomColor();
                  pixel.style.backgroundColor = newColor;
                  pixel.style.setProperty(
                     "--color1",
                     getSimilarColor(newColor)
                  );
                  pixel.style.setProperty(
                     "--color2",
                     getSimilarColor(newColor)
                  );
               }
            });
         }
      }
      pixelContainer.classList.add("visible");
      waveAnimation.classList.add("visible");
   }

   const randomizationDirections = [
      [0, -1], // Top
      [1, -1], // Diagonal upper right
      [1, 0], // Right
      [1, 1], // Diagonal lower right
      [0, 1], // Bottom
      [-1, 1], // Diagonal lower left
      [-1, 0], // Left
      [-1, -1], // Diagonal upper left
   ];
   let currentDirectionIndex = 0;
   let waveAnimationInProgress = false; // Flag to prevent overlapping animations

   function startWaveAnimation(directionIndex) {
      if (waveAnimationInProgress) return;
      waveAnimationInProgress = true;

      const direction = randomizationDirections[directionIndex];
      let startRow, startCol, rowIncrement, colIncrement, rowLimit, colLimit;
      let isRowWave = false; // Flag to determine if it's a row-wise or column-wise wave

      if (direction[1] === -1) {
         // Top directions (row-wise)
         startRow = 0;
         rowLimit = pixelContainer.children.length / getColumns();
         rowIncrement = 1;
         isRowWave = true;
      } else if (direction[1] === 1) {
         // Bottom directions (row-wise)
         startRow = pixelContainer.children.length / getColumns() - 1;
         rowLimit = -1;
         rowIncrement = -1;
         isRowWave = true;
      } else if (direction[0] === 1) {
         // Right direction (column-wise)
         startCol = getColumns() - 1;
         colLimit = -1;
         colIncrement = -1;
         startRow = 0;
         rowLimit = pixelContainer.children.length / getColumns();
         rowIncrement = 1; // Iterate through rows
         isRowWave = false;
      } else if (direction[0] === -1) {
         // Left direction (column-wise)
         startCol = 0;
         colLimit = getColumns();
         colIncrement = 1;
         startRow = 0;
         rowLimit = pixelContainer.children.length / getColumns();
         rowIncrement = 1; // Iterate through rows
         isRowWave = false;
      } else {
         // Vertical directions (column-wise, e.g., [0, 0] - not used in directions, but for completeness)
         startCol = 0;
         colLimit = getColumns();
         colIncrement = 1;
         startRow = 0;
         rowLimit = pixelContainer.children.length / getColumns();
         rowIncrement = 1; // Iterate through rows
         isRowWave = false;
      }

      let delay = 0;

      if (isRowWave) {
         // Row-wise wave
         for (
            let i = startRow;
            rowIncrement > 0 ? i < rowLimit : i > rowLimit;
            i += rowIncrement
         ) {
            setTimeout(() => {
               for (let j = 0; j < getColumns(); j++) {
                  // Iterate through columns in each row
                  const pixelIndex = i * getColumns() + j;
                  if (
                     pixelIndex >= 0 &&
                     pixelIndex < pixelContainer.children.length
                  ) {
                     const pixel = pixelContainer.children[pixelIndex];
                     const row = parseInt(pixel.dataset.row);
                     const col = parseInt(pixel.dataset.col);
                     if (!textMap[row][col]) {
                        const newColor = getRandomColor();
                        pixel.style.backgroundColor = newColor;
                        pixel.style.setProperty(
                           "--color1",
                           getSimilarColor(newColor)
                        );
                        pixel.style.setProperty(
                           "--color2",
                           getSimilarColor(newColor)
                        );
                     }
                     pixel.style.animation = "pulse-animation 1ms ease-in-out";
                     pixel.addEventListener(
                        "animationend",
                        function () {
                           pixel.style.animation = "none";
                        },
                        { once: true }
                     );
                  }
               }
               if (i === (direction[1] === -1 ? rowLimit - 1 : -1 + 1)) {
                  // Check for last row in wave
                  setTimeout(() => {
                     waveAnimationInProgress = false;
                  }, 10);
               }
            }, delay);
            delay += 100; // Delay between rows
         }
      } else {
         // Column-wise wave
         for (
            let j = startCol;
            colIncrement > 0 ? j < colLimit : j > colIncrement;
            j += colIncrement
         ) {
            setTimeout(() => {
               for (
                  let i = 0;
                  i < pixelContainer.children.length / getColumns();
                  i++
               ) {
                  // Iterate through rows in each column
                  const pixelIndex = i * getColumns() + j;
                  if (
                     pixelIndex >= 0 &&
                     pixelIndex < pixelContainer.children.length
                  ) {
                     const pixel = pixelContainer.children[pixelIndex];
                     const row = parseInt(pixel.dataset.row);
                     const col = parseInt(pixel.dataset.col);
                     if (!textMap[row][col]) {
                        const newColor = getRandomColor();
                        pixel.style.backgroundColor = newColor;
                        pixel.style.setProperty(
                           "--color1",
                           getSimilarColor(newColor)
                        );
                        pixel.style.setProperty(
                           "--color2",
                           getSimilarColor(newColor)
                        );
                     }
                     pixel.style.animation = "pulse-animation 1ms ease-in-out";
                     pixel.addEventListener(
                        "animationend",
                        function () {
                           pixel.style.animation = "none";
                        },
                        { once: true }
                     );
                  }
               }
               if (j === (direction[0] === 1 ? -1 + 1 : colLimit - 1)) {
                  // Check for last column in wave
                  setTimeout(() => {
                     waveAnimationInProgress = false;
                  }, 100);
               }
            }, delay);
            delay += 20; // Delay between columns
         }
      }

      currentDirectionIndex =
         (currentDirectionIndex + 1) % randomizationDirections.length;
   }

   function randomizeColorsFromDirections() {
      startWaveAnimation(currentDirectionIndex);
   }

   function startHeartbeatAnimation() {
      const heartbeatPixelsCount = Math.floor(pixels.length * 0.1); // 10% of pixels pulsating
      const randomIndices = [];
      while (randomIndices.length < heartbeatPixelsCount) {
         const randomIndex = Math.floor(Math.random() * pixels.length);
         if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
         }
      }

      randomIndices.forEach((index) => {
         const pixel = pixels[index];
         pixel.style.animation =
            "heartbeat-pulse 1.5s ease-in-out infinite alternate"; // Apply heartbeat pulse
      });
   }

   function getColumns() {
      const containerWidth = pixelContainer.clientWidth;
      const pixelSize =
         window.innerWidth <= 480 ? 12 : window.innerWidth <= 768 ? 18 : 24;
      const gap =
         window.innerWidth <= 480 ? 2 : window.innerWidth <= 768 ? 3 : 4;
      return Math.floor(containerWidth / (pixelSize + gap));
   }

   function toggleAnimation() {
      animationEnabled = !animationEnabled;
      // No toggle animation needed now, keeping function if needed later
   }

   // Initial pattern generation with default text
   function initialSetup() {
      const defaultText = "WELCOME"; // Or any default text
      generatePattern(defaultText);
      startHeartbeatAnimation(); // Start heartbeat animation immediately on load
   }

   submitNameBtn.addEventListener("click", function () {
      const userName = userNameInput.value.trim();
      if (userName) {
         userNameInputContainer.style.display = "none";
         inputContainer.classList.add("visible");
         controls.classList.add("visible");
         userDisplayName.textContent = userName;
         generatePattern("HI " + userName.toUpperCase() + "!"); // Append HI and !
      } else {
         alert("Please enter your name.");
      }
   });

   randomizeBtn.addEventListener("click", randomizeColorsFromDirections);
   toggleAnimationBtn.addEventListener("click", toggleAnimation);

   // Set interval for automatic color randomization
   setInterval(randomizeColorsFromDirections, 30000); // 30 seconds
   setInterval(startHeartbeatAnimation, 3000); // Heartbeat every 3 seconds

   window.addEventListener("resize", function () {
      if (currentText) generatePattern(currentText); // Regenerate pattern on resize
   });

   // Initial setup: show name input only
   inputContainer.classList.remove("visible"); // Hide initially
   controls.classList.remove("visible"); // Hide initially
   pixelContainer.classList.add("visible"); // Show pixel container to show initial pattern
   waveAnimation.classList.add("visible"); // Show wave animation initially
   initialSetup(); // Generate initial pattern
});


















