const fs = require('fs');

const extractQuestions = () => {
  const content = fs.readFileSync('README.md', 'utf-8');
  
  // Find where questions start
  const startMarker = '<!-- QUESTIONS_START -->';
  const startIndex = content.indexOf(startMarker);
  
  if (startIndex === -1) {
    console.error("Could not find QUESTIONS_START");
    return;
  }
  
  const questionsContent = content.substring(startIndex + startMarker.length);
  
  // Regex to match "1. ### Question Header"
  const questionRegex = /^(\d+)\.\s+###\s+(.*)$/gm;
  
  const questions = [];
  let match;
  let matches = [];
  
  while ((match = questionRegex.exec(questionsContent)) !== null) {
    matches.push({
      itemNumber: parseInt(match[1]),
      questionTitle: match[2].trim(),
      startIndex: match.index,
      endIndex: -1 // Will determine later
    });
  }
  
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    
    // The content starts after the question heading itself
    const contentStart = current.startIndex + `${current.itemNumber}. ### ${current.questionTitle}`.length;
    
    // The content ends where the next question starts, or at the end of the string
    let contentEnd = next ? next.startIndex : questionsContent.length;
    
    let answerText = questionsContent.substring(contentStart, contentEnd).trim();
    
    // Remove "⬆ Back to Top" links
    answerText = answerText.replace(/\*\*\[⬆ Back to Top.*$/gm, '').trim();
    
    questions.push({
      id: current.itemNumber,
      question: current.questionTitle,
      answer: answerText
    });
  }
  
  fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
  console.log(`Extracted ${questions.length} questions to questions.json`);
};

extractQuestions();
