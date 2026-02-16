#!/usr/bin/env node

/**
 * CredX Krea AI Video Generator
 * Creates cartoon avatar videos for YouTube content
 * 
 * Usage: node generate-krea-video.js [script-number]
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Krea API Configuration
const KREA_API_KEY = 'c42fdb33-d227-4c01-ab86-6bcd62c4bbf3';
const KREA_API_SECRET = 'EY0MJw9DFN8Eiee2XVhGQm6Z8GsmqGR1';

// Video Scripts
const SCRIPTS = [
  {
    id: 1,
    title: "Credit Karma Is Lying to You",
    type: "myth_buster",
    duration: 60,
    hook: "Credit Karma is lying to you.",
    scenes: [
      {
        timestamp: "0-3s",
        prompt: "Cartoon elephant character with glasses, looking shocked, pointing at phone showing credit score app, surprised expression, blue background, professional lighting",
        text: "Credit Karma is lying to you."
      },
      {
        timestamp: "3-10s",
        prompt: "Cartoon elephant scratching head confused, showing phone with different credit scores, question marks floating around, concerned expression",
        text: "They say 720, but bank says 680?"
      },
      {
        timestamp: "10-30s",
        prompt: "Cartoon elephant teacher with pointer, showing two credit score cards side by side, educational setting, one labeled VantageScore one labeled FICO",
        text: "Credit Karma uses VantageScore. Banks use FICO."
      },
      {
        timestamp: "30-45s",
        prompt: "Cartoon elephant showing calculator, math equations floating, credit report papers, explaining with gestures",
        text: "20-50 point difference is normal."
      },
      {
        timestamp: "45-55s",
        prompt: "Cartoon elephant looking serious, holding warning sign, red caution lights, important announcement pose",
        text: "Don't trust Credit Karma for mortgages!"
      },
      {
        timestamp: "55-60s",
        prompt: "Cartoon elephant pointing down with smile, call to action pose, arrow pointing down, friendly encouraging expression",
        text: "Get my free guide - link in bio!"
      }
    ]
  },
  {
    id: 2,
    title: "520 to 720 Credit Score Journey",
    type: "success_story",
    duration: 60,
    hook: "I went from 520 to 720 in 6 months...",
    scenes: [
      {
        timestamp: "0-5s",
        prompt: "Cartoon elephant holding phone showing credit score 520, sad face, raining clouds, rejected stamp, gloomy atmosphere",
        text: "Six months ago: 520 score."
      },
      {
        timestamp: "5-15s",
        prompt: "Cartoon elephant being denied at bank counter, apartment door slammed, car dealership rejection, multiple rejection scenarios",
        text: "Denied everywhere. Felt stuck."
      },
      {
        timestamp: "15-30s",
        prompt: "Cartoon elephant reading book about credit repair, lightbulb moment, sudden realization, papers flying with dispute letters",
        text: "Then I learned to dispute."
      },
      {
        timestamp: "30-45s",
        prompt: "Cartoon elephant celebrating, showing phone with score climbing 520→580→650→720, confetti, happy dance, success celebration",
        text: "Month 6: 720 score!"
      },
      {
        timestamp: "45-55s",
        prompt: "Cartoon elephant holding house keys, car keys, credit cards, approved stamps, victory pose, rainbow background",
        text: "Now approved for everything!"
      },
      {
        timestamp: "55-60s",
        prompt: "Cartoon elephant waving inviting gesture, pointing to masterclass, friendly smile, graduation cap",
        text: "Learn how - link in bio!"
      }
    ]
  },
  {
    id: 3,
    title: "How to Write Dispute Letters",
    type: "tutorial",
    duration: 60,
    hook: "Let me show you how to write dispute letters...",
    scenes: [
      {
        timestamp: "0-5s",
        prompt: "Cartoon elephant at desk with paper and pen, writing letter, determined expression, office setting, educational atmosphere",
        text: "I'll show you the exact letter."
      },
      {
        timestamp: "5-15s",
        prompt: "Cartoon elephant with checklist, credit report in hand, magnifying glass, finding errors, detective mode",
        text: "First: Get your credit report."
      },
      {
        timestamp: "15-30s",
        prompt: "Cartoon elephant writing on paper, text appearing on letter format, showing address block, date, proper format",
        text: "Address it to the credit bureau."
      },
      {
        timestamp: "30-45s",
        prompt: "Cartoon elephant highlighting key phrases on letter, pointing to important sections, red marker emphasis",
        text: "State facts. Demand deletion."
      },
      {
        timestamp: "45-55s",
        prompt: "Cartoon elephant holding envelope, certified mail stamp, tracking number, mailing letter at post office",
        text: "Send certified mail. 30-day deadline."
      },
      {
        timestamp: "55-60s",
        prompt: "Cartoon elephant holding up template document, pointing down, encouraging gesture",
        text: "Get my free template - link!"
      }
    ]
  }
];

// Krea API Integration
async function generateVideoWithKrea(scriptId, options = {}) {
  const script = SCRIPTS.find(s => s.id === scriptId);
  if (!script) {
    console.error(`Script ${scriptId} not found`);
    console.log('Available scripts:', SCRIPTS.map(s => `${s.id}: ${s.title}`).join('\n'));
    return;
  }

  console.log(`\n🎬 Generating Video: ${script.title}`);
  console.log(`⏱️  Duration: ${script.duration} seconds`);
  console.log(`🎨 Style: Creative cartoon elephant character`);
  console.log('');

  // For each scene, we would typically:
  // 1. Generate the image with Krea
  // 2. Animate it
  // 3. Add text overlays
  // 4. Combine into final video

  // Note: Krea API implementation would go here
  // Since Krea's API structure may vary, this is a template
  
  console.log('📋 Scene Breakdown:');
  script.scenes.forEach((scene, index) => {
    console.log(`\n🎬 Scene ${index + 1} (${scene.timestamp}):`);
    console.log(`   Prompt: ${scene.prompt}`);
    console.log(`   Text: "${scene.text}"`);
  });

  console.log('\n⚠️  NOTE: Full Krea API integration requires:');
  console.log('   1. Video generation API endpoint');
  console.log('   2. Image-to-video or text-to-video capabilities');
  console.log('   3. Audio/VO integration');
  console.log('');
  console.log('💡 RECOMMENDED WORKFLOW:');
  console.log('   1. Use Krea to generate character images for each scene');
  console.log('   2. Use CapCut/Canva to animate and add text');
  console.log('   3. Add voiceover using ElevenLabs');
  console.log('   4. Export and upload to YouTube');

  // Save scene prompts for manual creation
  const outputDir = path.join(__dirname, '..', 'videos', `script-${scriptId}`);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const scenePromptsFile = path.join(outputDir, 'scene-prompts.txt');
  let promptsContent = `CREDX VIDEO: ${script.title}\n`;
  promptsContent += `Character: Cartoon Elephant (friendly, professional, wearing glasses)\n`;
  promptsContent += `Style: Creative cartoon, vibrant colors, educational\n\n`;
  promptsContent += `SCENE PROMPTS FOR KREA:\n\n`;

  script.scenes.forEach((scene, index) => {
    promptsContent += `Scene ${index + 1} (${scene.timestamp}):\n`;
    promptsContent += `KREA PROMPT: ${scene.prompt}\n`;
    promptsContent += `ON-SCREEN TEXT: "${scene.text}"\n\n`;
  });

  fs.writeFileSync(scenePromptsFile, promptsContent);
  console.log(`\n✅ Scene prompts saved to: ${scenePromptsFile}`);

  return {
    script,
    outputDir,
    scenePromptsFile
  };
}

// Alternative: Generate using Krea's image generation for frames
async function generateKreaImages(scriptId) {
  const result = await generateVideoWithKrea(scriptId);
  if (!result) return;

  console.log('\n🖼️  To generate images with Krea:');
  console.log('   1. Go to krea.ai');
  console.log('   2. Use "Image" mode');
  console.log('   3. Copy/paste each scene prompt below');
  console.log('   4. Download each generated image');
  console.log('   5. Use in your video editor\n');

  result.script.scenes.forEach((scene, index) => {
    console.log(`\n📸 SCENE ${index + 1}:`);
    console.log(scene.prompt);
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const scriptId = parseInt(args[0]) || 1;
  const mode = args[1] || 'video'; // 'video' or 'images'

  console.log('🎨 CredX Krea AI Video Generator');
  console.log('================================\n');

  if (mode === 'images') {
    await generateKreaImages(scriptId);
  } else {
    await generateVideoWithKrea(scriptId);
  }

  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Go to https://krea.ai');
  console.log('   2. Log in with your API credentials');
  console.log('   3. Generate images using the prompts above');
  console.log('   4. Download and import to CapCut/Canva');
  console.log('   5. Add text overlays and voiceover');
  console.log('   6. Export and upload to YouTube!');
}

main().catch(console.error);
