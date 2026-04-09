const fs = require('fs');
const qs = JSON.parse(fs.readFileSync('questions.json'));

qs[0].question = 'ما هي الطرق الممكنة لإنشاء كائنات (Objects) في جافا سكريبت؟';
qs[0].answer = `هناك العديد من الطرق لإنشاء كائنات (Objects) في جافا سكريبت كما هو موضح أدناه:

1. **طريقة Object literal:**
هذه أسهل طريقة لإنشاء كائن بسيط.
\`\`\`javascript
var object = {
  name: "Sudheer",
  age: 34
};
\`\`\`

2. **طريقة Object constructor:**
المنشئ \`Object()\` هو منشئ مدمج لذلك لا يشترط استخدام كلمة \`new\`.
\`\`\`javascript
var object = new Object();
\`\`\`

3. **طريقة Object.create()**
دالة تنشئ كائناً جديداً، استناداً إلى نموذج (Prototype) كائن موجود.
`;

qs[1].question = 'ما هي سلسلة النماذج (Prototype Chain)؟';
qs[1].answer = `سلسلة النماذج هي المفهوم الأساسي وراء الوراثة (Inheritance) في جافا سكريبت. عندما تحاول الوصول إلى خاصية أو دالة، يبحث المحرك عنها في الكائن نفسه أولاً، وإذا لم يجدها يبحث في \`[[Prototype]]\` الخاص بالكائن، ويستمر الصعود حتى يصل إلى \`null\`.`;

fs.mkdirSync('frontend/src/data', { recursive: true });
fs.writeFileSync('frontend/src/data/questions_ar.json', JSON.stringify(qs, null, 2));
fs.copyFileSync('questions.json', 'frontend/src/data/questions_en.json');
