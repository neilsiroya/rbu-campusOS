// Task Observer helper script
// This script checks the current task status

const fs = require('fs');
const path = require('path');

function checkTasks() {
  const tasksDir = path.join(process.cwd(), '.claude', 'tasks');
  if (fs.existsSync(tasksDir)) {
    console.log('Task Observer: Active session tasks detected');
  } else {
    console.log('Task Observer: No active tasks');
  }
}

checkTasks();