const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateSingleVideo } = require('./src/generate-video');
const { manualPost, processPostingQueue } = require('./src/post-content');
const { generateResponse } = require('./src/comment-responder');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CredX Automation Dashboard</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .btn { background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #1d4ed8; }
        .status { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; }
        .status.active { background: #10b981; color: white; }
        .status.pending { background: #f59e0b; color: white; }
        .status.error { background: #ef4444; color: white; }
        .log { background: #f3f4f6; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; max-height: 200px; overflow-y: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
        th { font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎬 CredX Social Automation</h1>
        <p>Automated content creation, posting, and engagement</p>
      </div>

      <div class="grid">
        <div class="card">
          <h2>📊 System Status</h2>
          <table>
            <tr><th>Service</th><th>Status</th><th>Last Run</th></tr>
            <tr><td>Video Generation</td><td><span class="status active">Active</span></td><td>Daily at 6:00 AM</td></tr>
            <tr><td>Content Posting</td><td><span class="status active">Active</span></td><td>Hourly check</td></tr>
            <tr><td>Comment Monitor</td><td><span class="status active">Active</span></td><td>Every 5 minutes</td></tr>
          </table>
        </div>

        <div class="card">
          <h2>🚀 Quick Actions</h2>
          <button class="btn" onclick="generateVideo()">Generate Video Now</button>
          <button class="btn" onclick="processQueue()">Process Posting Queue</button>
          <button class="btn" onclick="testResponse()">Test Comment Response</button>
        </div>

        <div class="card">
          <h2>📈 Today's Stats</h2>
          <table>
            <tr><td>Videos Generated</td><td>1</td></tr>
            <tr><td>Posts Published</td><td>3</td></tr>
            <tr><td>Comments Responded</td><td>12</td></tr>
            <tr><td>Leads Generated</td><td>5</td></tr>
          </table>
        </div>

        <div class="card">
          <h2>🎬 Posting Queue</h2>
          <div id="queue">Loading...</div>
        </div>

        <div class="card">
          <h2>💬 Recent Comments</h2>
          <div id="comments">Loading...</div>
        </div>

        <div class="card">
          <h2>📝 System Log</h2>
          <div class="log" id="logs">
            System initialized...<br>
            Comment monitoring active...<br>
            Posting queue empty...
          </div>
        </div>
      </div>

      <script>
        async function generateVideo() {
          const response = await fetch('/api/generate', { method: 'POST' });
          const result = await response.json();
          alert(result.message || 'Video generation started');
          location.reload();
        }

        async function processQueue() {
          const response = await fetch('/api/process-queue', { method: 'POST' });
          const result = await response.json();
          alert(result.message || 'Queue processed');
          location.reload();
        }

        async function testResponse() {
          const testComment = prompt('Enter a test comment:');
          if (testComment) {
            const response = await fetch('/api/test-response', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ comment: testComment })
            });
            const result = await response.json();
            alert('AI Response: ' + result.response);
          }
        }

        // Auto-refresh every 30 seconds
        setInterval(() => location.reload(), 30000);
      </script>
    </body>
    </html>
  `);
});

// API Routes
app.post('/api/generate', async (req, res) => {
  try {
    const result = await generateSingleVideo('credit_karma_myth');
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/process-queue', async (req, res) => {
  try {
    await processPostingQueue();
    res.json({ success: true, message: 'Queue processed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/test-response', async (req, res) => {
  try {
    const { comment } = req.body;
    const result = await generateResponse(comment, 'TestUser');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/queue', (req, res) => {
  const queuePath = path.join(__dirname, 'queue', 'posting-queue.json');
  if (fs.existsSync(queuePath)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    res.json(queue);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CredX Automation Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
