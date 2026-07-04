const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The issue is that the card header still hardcodes "MEET THE POETS" and "Verified Poet".
// Let's make it dynamic based on the person's category or nickname.

const startBuild = html.indexOf('function buildPresCards(){');
const endBuild = html.indexOf('buildPresCards();');

const newBuildFn = `function buildPresCards(){
  const grid=document.getElementById('pres-grid');
  grid.innerHTML=presenters.map((p,i)=>{
    
    let headerTop = "MEET THE";
    let headerBig = "POETS";
    let verifiedText = "Verified Poet";
    let micIcon = '<i class="ri-mic-2-fill"></i>';

    if(p.nickname.includes("Host") || p.nickname.includes("Chairman")) {
      headerTop = "OFFICIAL";
      headerBig = "HOSTS";
      verifiedText = "Official Host";
    } else if(p.nickname.includes("Royal") || p.nickname.includes("Mother")) {
      headerTop = "ESTEEMED";
      headerBig = "PATRONS";
      verifiedText = "Royal Patron";
      micIcon = '<i class="ri-vip-crown-fill"></i>';
    } else if(p.nickname.includes("Guest")) {
      headerTop = "SPECIAL";
      headerBig = "GUESTS";
      verifiedText = "Honored Guest";
      micIcon = '<i class="ri-star-fill"></i>';
    } else if(p.nickname.includes("Award")) {
      headerTop = "HONORED";
      headerBig = "AWARDEES";
      verifiedText = "Award Recipient";
      micIcon = '<i class="ri-trophy-fill"></i>';
    } else if(p.nickname.includes("Keynote")) {
      headerTop = "KEYNOTE";
      headerBig = "SPEAKER";
      verifiedText = "Keynote Speaker";
    }

    return \`
  <div class="pres-card \${p.live?'on-stage':''} sr" style="transition-delay:\${i*0.08}s" id="pcard-\${i}">
    <!-- Header -->
    <div class="pc-header">
      <span class="pc-header-top">\${headerTop}</span>
      <div class="pc-header-big">\${headerBig}</div>
      <div class="pc-event-tag">Sip, Paint &amp; Poetry 1.0 2026</div>
      <div class="pc-verified">\${verifiedText} <div class="pc-verified-badge"><svg viewBox="0 0 14 14"><polyline points="2,7 5.5,10.5 12,3.5"/></svg></div></div>
    </div>

    <!-- Photo frame with orange border -->
    <div class="pc-photo-wrap">
      \${p.photo
        ? \`<img class="pc-photo" src="\${p.photo}" alt="\${p.name}" />\`
        : \`<div class="pc-photo-placeholder" style="background:\${p.gradient}">\${p.photoEmoji}</div>\`
      }
      <!-- Icon -->
      <div class="pc-mic">\${micIcon}</div>
      <!-- Blue verified check -->
      <div class="pc-check"><svg viewBox="0 0 24 24"><polyline points="4,12 9,17 20,7"/></svg></div>
      <!-- Live badge if presenting -->
      \${p.live?\`<div class="pc-live-badge"><div class="badge-live-dot"></div>ON STAGE</div>\`:\`\`}
    </div>

    <!-- Info -->
    <div class="pc-info">
      <div class="pc-name">\${p.name}</div>
      <div class="pc-nickname">\${p.nickname}</div>
      <div class="pc-role">\${p.role}</div>
      <div class="pc-bio">\${p.bio}</div>
    </div>
  </div>\`}).join('');
}
`;

html = html.substring(0, startBuild) + newBuildFn + html.substring(endBuild);
fs.writeFileSync('index.html', html);
console.log('done fixing dynamic text');
