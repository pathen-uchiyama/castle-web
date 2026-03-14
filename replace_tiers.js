const fs = require('fs');
const path = '/Users/patchenuchiyama/Documents/castle-web/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/ticketClass:\s*'E-Ticket'/g, "ticketClass: 'LL Single Pass'");
content = content.replace(/ticketClass:\s*'D-Ticket'/g, "ticketClass: 'LL Multi Pass Tier 1'");
content = content.replace(/ticketClass:\s*'C-Ticket'/g, "ticketClass: 'LL Multi Pass Tier 2'");
content = content.replace(/ticketClass:\s*'B-Ticket'/g, "ticketClass: 'Standby Only'");
content = content.replace(/ticketClass:\s*'A-Ticket'/g, "ticketClass: 'Standby Only'");

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced ticketClass values successfully.');
