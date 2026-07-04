const fs = require('fs');
const file = 'admin/src/App.jsx';
let code = fs.readFileSync(file, 'utf8');

const startList = code.indexOf('const DEFAULTS = [');
const endList = code.indexOf('];', startList) + 2;

const newDefaults = `const DEFAULTS = [
  {name:'Prof. Sani Ahmad Yauta',nickname:'Chief Host',role:'Vice Chancellor, Gombe State University',bio:'Our Chief Host and the Vice Chancellor of Gombe State University.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  {name:'Prof. Danladi M. Umar',nickname:'Chairman',role:'Deputy Vice Chancellor, Gombe State University',bio:'The Chairman of the Occasion.',photoEmoji:'👨‍🏫',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Assoc. Prof. Buhari Magaji',nickname:'Host',role:'Event Host',bio:'Our dedicated Host for the evening.',photoEmoji:'🎤',gradient:'linear-gradient(135deg,var(--pink-d),var(--pink))'},
  {name:'Alh. Yaya Hammari',nickname:'Royal Father',role:'Royal Father of the Day',bio:'Our esteemed Royal Father of the Day.',photoEmoji:'👑',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Assoc. Prof. Aishatu Kumo',nickname:'Mother of the Day',role:'Mother of the Day',bio:'Our distinguished Mother of the Day.',photoEmoji:'🌺',gradient:'linear-gradient(135deg,var(--pink-d),var(--pink))'},
  {name:'Alh. Dr. Jamilu Ishayaku Gwamna',nickname:'Special Guest',role:'Special Guest of Honor',bio:'Our Special Guest of Honor for Sip, Paint & Poetry 1.0.',photoEmoji:'🌟',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  
  // Guests of Honor
  {name:'Prof. Aliyu Usman Bafeto',nickname:'Guest of Honor',role:'Registrar, Gombe State University',bio:'Guest of Honor.',photoEmoji:'🎓',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Prof. Dr. Yusuf Muhammad',nickname:'Guest of Honor',role:'Chief Medical Director, FTH Gombe',bio:'Guest of Honor.',photoEmoji:'🏥',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Mr. Amin Amos',nickname:'Guest of Honor',role:'Ma\\'ori',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Khalifa Sadiqu Shehu',nickname:'Guest of Honor',role:'Guest of Honor',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},
  {name:'Engr. Muhammad Y. Gorki',nickname:'Guest of Honor',role:'Guest of Honor',bio:'Guest of Honor.',photoEmoji:'✨',gradient:'linear-gradient(135deg,var(--green-d),var(--green))'},

  // Keynote & Special Guests
  {name:'Hon. Simon Elisha Karu',nickname:'Keynote',role:'Keynote Speaker',bio:'Delivering the keynote address on Voices in Color.',photoEmoji:'🎙️',gradient:'linear-gradient(135deg,var(--orange-d),var(--orange))'},
  {name:'Rt. Hon. Sadam Bello',nickname:'Special Guest',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Barr. Ibrahim Kalayi',nickname:'Special Guest',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},
  {name:'Hon. Ibrahim Ishaya',nickname:'Ibro Fish Abuja',role:'Special Guest',bio:'Special Guest.',photoEmoji:'⭐',gradient:'linear-gradient(135deg,var(--blue-d),var(--blue))'},

  // Institutional
  {name:'Dean',nickname:'Institutional Guest',role:'Faculty of Arts, Gombe State University',bio:'Institutional Guest.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Deputy Dean',nickname:'Institutional Guest',role:'Faculty of Arts, Gombe State University',bio:'Institutional Guest.',photoEmoji:'🏛️',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},

  // Award Recipients
  {name:'Engr. Aliyu Muhammad Kombat',nickname:'Award Recipient',role:'Chairman, Velocity Humanitarian Foundation',bio:'Recipient of the "True Son of the Soil Award".',photoEmoji:'🏆',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'},
  {name:'Dr. Abdulrahman Shuaibu',nickname:'Award Recipient',role:'Exec. Secretary, Primary Health Care Development Agency',bio:'Award Recipient.',photoEmoji:'🏆',gradient:'linear-gradient(135deg,var(--gold-d),var(--gold))'}
];`;

code = code.substring(0, startList) + newDefaults + code.substring(endList);
fs.writeFileSync(file, code);
console.log('done fixing admin');
