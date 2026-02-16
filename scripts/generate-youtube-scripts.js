#!/usr/bin/env node

/**
 * CredX YouTube Script Generator
 * Generates daily video scripts based on templates
 * 
 * Usage: node generate-youtube-scripts.js [topic]
 */

const TEMPLATES = {
  mythBuster: {
    name: "Credit Myth Busted",
    structure: [
      { section: "Hook", duration: "0-3s", prompt: "Start with the myth as a statement" },
      { section: "Agitate", duration: "3-10s", prompt: "Why people believe this" },
      { section: "Truth", duration: "10-45s", prompt: "The actual truth with data" },
      { section: "Proof", duration: "45-55s", prompt: "Example or study" },
      { section: "CTA", duration: "55-60s", prompt: "Lead to masterclass" }
    ],
    examples: [
      "Checking your credit hurts your score",
      "You need to carry a balance",
      "Credit repair is illegal",
      "Paying collections removes them"
    ]
  },
  
  tutorial: {
    name: "Quick Tutorial",
    structure: [
      { section: "Hook", duration: "0-5s", prompt: "Promise the outcome" },
      { section: "Prerequisites", duration: "5-15s", prompt: "What they need" },
      { section: "Step 1", duration: "15-30s", prompt: "First action" },
      { section: "Step 2", duration: "30-45s", prompt: "Second action" },
      { section: "Step 3", duration: "45-55s", prompt: "Third action" },
      { section: "CTA", duration: "55-60s", prompt: "Next step" }
    ],
    examples: [
      "How to pull your credit report",
      "Writing your first dispute letter",
      "Setting up a secured card"
    ]
  },
  
  successStory: {
    name: "Success Story",
    structure: [
      { section: "Hook", duration: "0-5s", prompt: "The before state" },
      { section: "Struggle", duration: "5-20s", prompt: "The pain point" },
      { section: "Turning Point", duration: "20-35s", prompt: "What changed" },
      { section: "Results", duration: "35-50s", prompt: "The after state" },
      { section: "CTA", duration: "50-60s", prompt: "They can do it too" }
    ],
    examples: [
      "From 520 to 720 in 6 months",
      "Denied for house to approved",
      "Collection deleted in 30 days"
    ]
  },
  
  quickWin: {
    name: "Quick Win",
    structure: [
      { section: "Hook", duration: "0-3s", prompt: "The promise" },
      { section: "Problem", duration: "3-10s", prompt: "What's hurting them" },
      { section: "Solution", duration: "10-40s", prompt: "The fix" },
      { section: "Results", duration: "40-50s", prompt: "What to expect" },
      { section: "CTA", duration: "50-60s", prompt: "Learn more" }
    ],
    examples: [
      "Lower utilization instantly",
      "Remove old addresses",
      "Add rent to credit report"
    ]
  }
};

const HOOKS = {
  mythBuster: [
    "Stop believing this lie about credit...",
    "Credit companies don't want you to know this...",
    "I fell for this credit myth for years...",
    "Your credit score is suffering because of this myth...",
    "This is the biggest lie in credit repair..."
  ],
  
  tutorial: [
    "Let me show you exactly how to {action}...",
    "Here's the fastest way to {action}...",
    "I wish I knew this when I started...",
    "Stop doing this wrong. Here's how to {action}...",
    "This one trick changed everything..."
  ],
  
  successStory: [
    "I went from {before} to {after} in {time}...",
    "This changed my credit score overnight...",
    "I was denied for {thing}, then I did this...",
    "My credit was {bad}, now it's {good}...",
    "This is how I fixed {number} years of bad credit..."
  ],
  
  quickWin: [
    "Do this today and watch your score jump...",
    "This 5-minute fix added {points} points...",
    "Most people miss this easy win...",
    "Credit bureaus hate when you do this...",
    "Stop ignoring this credit hack..."
  ]
};

const CTAS = [
  "Get my free dispute templates - link in bio",
  "Join my free 5-day masterclass - link below",
  "Download my credit checklist - it's free",
  "Follow for daily credit tips",
  "Comment 'GUIDE' and I'll send you my free playbook"
];

function generateScript(template, topic) {
  const t = TEMPLATES[template];
  if (!t) {
    console.error(`Template '${template}' not found`);
    console.log('Available:', Object.keys(TEMPLATES).join(', '));
    return;
  }

  const hook = HOOKS[template][Math.floor(Math.random() * HOOKS[template].length)]
    .replace('{action}', topic.toLowerCase())
    .replace('{before}', '520')
    .replace('{after}', '720')
    .replace('{time}', '6 months');
  
  const cta = CTAS[Math.floor(Math.random() * CTAS.length)];

  console.log(`\n========================================`);
  console.log(`📹 ${t.name.toUpperCase()}: ${topic}`);
  console.log(`========================================\n`);
  
  console.log(`🎯 HOOK (0-3s): ${hook}\n`);
  
  t.structure.forEach((section, index) => {
    if (section.section === 'CTA') {
      console.log(`${index + 1}. ${section.section.toUpperCase()} (${section.duration})`);
      console.log(`   ${cta}`);
    } else if (section.section === 'Hook') {
      console.log(`${index + 1}. ${section.section.toUpperCase()} (${section.duration})`);
      console.log(`   [VISUAL: ${section.prompt}]`);
      console.log(`   [TEXT OVERLAY: ${hook}]`);
    } else {
      console.log(`${index + 1}. ${section.section.toUpperCase()} (${section.duration})`);
      console.log(`   [${section.prompt}]`);
    }
    console.log('');
  });
  
  console.log(`📝 TITLE IDEAS:`);
  console.log(`   • "${hook}"`);
  console.log(`   • "The truth about ${topic}"`);
  console.log(`   • "How I fixed my ${topic} in 30 days"`);
  console.log(`   • "Stop ${topic} immediately"`);
  console.log('');
  
  console.log(`📊 WORD COUNT: ~150-200 words`);
  console.log(`⏱️  ESTIMATED LENGTH: 60 seconds`);
  console.log(`========================================\n`);
}

// Generate 7 days of content
function generateWeeklyCalendar() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const templates = ['mythBuster', 'successStory', 'tutorial', 'quickWin', 'mythBuster', 'tutorial', 'successStory'];
  
  const topics = {
    mythBuster: ['Credit karma scores are fake', 'Closing old cards helps', 'You need to carry a balance'],
    tutorial: ['How to read your credit report', 'Writing dispute letters', 'Setting up credit monitoring'],
    quickWin: ['Lower your utilization', 'Remove old addresses', 'Add authorized user'],
    successStory: ['From 500 to 700', 'Collections deleted', 'Approved for mortgage']
  };

  console.log('\n📅 7-DAY CONTENT CALENDAR\n');
  
  days.forEach((day, index) => {
    const template = templates[index];
    const topicList = topics[template];
    const topic = topicList[index % topicList.length];
    
    console.log(`${day}: ${TEMPLATES[template].name}`);
    console.log(`   Topic: ${topic}`);
    console.log('');
  });
}

// Main
const args = process.argv.slice(2);

if (args[0] === 'calendar') {
  generateWeeklyCalendar();
} else if (args[0] && args[1]) {
  generateScript(args[0], args[1]);
} else {
  console.log('\n🎬 CredX YouTube Script Generator\n');
  console.log('Usage:');
  console.log('  node generate-youtube-scripts.js calendar');
  console.log('  node generate-youtube-scripts.js mythBuster "credit karma"');
  console.log('  node generate-youtube-scripts.js tutorial "dispute letters"');
  console.log('  node generate-youtube-scripts.js successStory "520 to 720"');
  console.log('  node generate-youtube-scripts.js quickWin "lower utilization"\n');
  
  console.log('Templates:', Object.keys(TEMPLATES).join(', '));
  console.log('');
}
