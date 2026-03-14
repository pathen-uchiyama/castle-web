const fs = require('fs');
const path = '/Users/patchenuchiyama/Documents/castle-web/src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const changes = {
  "'E-Ticket'": "'LL Single Pass'",
  "'D-Ticket'": "'LL Multi Pass Tier 1'",
  "'C-Ticket'": "'LL Multi Pass Tier 2'",
  "'B-Ticket'": "'Standby Only'",
  "'A-Ticket'": "'Standby Only'"
};

for (const [oldValue, newValue] of Object.entries(changes)) {
  const regex = new RegExp(`ticketClass:\\s*${oldValue}`, 'g');
  console.log(`Searching for ${regex} ... matches found: ${(content.match(regex) || []).length}`);
  content = content.replace(regex, `ticketClass: ${newValue}`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing.');
