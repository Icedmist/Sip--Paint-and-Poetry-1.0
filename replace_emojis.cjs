const fs = require('fs');

const map = {
  '🎟': '<i class="ri-ticket-2-fill"></i>',
  '📅': '<i class="ri-calendar-event-fill"></i>',
  '📍': '<i class="ri-map-pin-fill"></i>',
  '🎤': '<i class="ri-mic-fill"></i>',
  '🎨': '<i class="ri-palette-fill"></i>',
  '🎵': '<i class="ri-music-2-fill"></i>',
  '🥂': '<i class="ri-goblet-fill"></i>',
  '🏆': '<i class="ri-trophy-fill"></i>',
  '📌': '<i class="ri-pushpin-fill"></i>',
  '🏔': '<i class="ri-landscape-fill"></i>',
  '📝': '<i class="ri-edit-2-fill"></i>',
  '🌿': '<i class="ri-leaf-fill"></i>',
  '⚡': '<i class="ri-flashlight-fill"></i>',
  '💻': '<i class="ri-macbook-fill"></i>',
  '📞': '<i class="ri-phone-fill"></i>',
  '🎉': '<i class="ri-sparkling-fill"></i>',
  '✨': '<i class="ri-sparkling-fill"></i>',
  '🎊': '<i class="ri-gift-fill"></i>',
  '🎙️': '<i class="ri-mic-2-fill"></i>',
  '🎭': '<i class="ri-emotion-laugh-fill"></i>',
  '🍷': '<i class="ri-goblet-fill"></i>',
  '❤️': '<i class="ri-heart-3-fill"></i>',
  '✓': '<i class="ri-check-line"></i>',
  '💚': '<i class="ri-heart-3-fill"></i>',
  '✅': '<i class="ri-checkbox-circle-fill"></i>',
  '🔥': '<i class="ri-fire-fill"></i>',
  '💔': '<i class="ri-heart-3-line"></i>',
  '🌐': '<i class="ri-global-fill"></i>',
  '📱': '<i class="ri-smartphone-fill"></i>',
  '📊': '<i class="ri-bar-chart-fill"></i>',
  '🚀': '<i class="ri-rocket-fill"></i>',
  '👑': '<i class="ri-vip-crown-fill"></i>',
  '✍️': '<i class="ri-pen-nib-fill"></i>',
  '🇳🇬': '<i class="ri-flag-fill"></i>',
  '🧩': '<i class="ri-puzzle-fill"></i>',
  '🥁': '<i class="ri-rhythm-fill"></i>',
  '❌': '<i class="ri-close-fill"></i>',
  '⚠️': '<i class="ri-error-warning-fill"></i>'
};

const files = ['index.html', 'game.html', 'admin/src/App.jsx'];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  for (let [emoji, icon] of Object.entries(map)) {
    // using split join to replace all occurrences
    text = text.split(emoji).join(icon);
  }
  
  // also add remix icon cdn to HTML files if not present
  if (f.endsWith('.html') && !text.includes('remixicon')) {
    text = text.replace('</head>', `  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />\n</head>`);
  }
  
  fs.writeFileSync(f, text);
});

console.log("Done");
