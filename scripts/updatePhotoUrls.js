const fs = require('fs');
const path = require('path');

// Read the seedProperties.js file
const filePath = path.join(__dirname, 'seedProperties.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all photo URLs with placeholder images
let photoCounter = 9; // Start from 9 since we already used 1-8

// Replace all remaining photo URLs
content = content.replace(/photos: \[.*?\]/g, (match) => {
  // Count how many photos are in this array
  const photoCount = (match.match(/"/g) || []).length / 2;
  
  // Generate placeholder URLs
  const photoUrls = [];
  for (let i = 0; i < photoCount; i++) {
    photoUrls.push(`"https://picsum.photos/400/300?random=${photoCounter}"`);
    photoCounter++;
  }
  
  return `photos: [${photoUrls.join(', ')}]`;
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated all photo URLs to use placeholder images!');
console.log(`📸 Generated ${photoCounter - 9} placeholder image URLs`);
console.log('🎯 Properties now have beautiful placeholder photos for exhibition!');
