// scoring.js
// Extract scoring logic so it can be unit-tested independent of controllers
const arraysEqualUnordered = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].map(String).sort();
  const sb = [...b].map(String).sort();
  return sa.every((v, i) => v === sb[i]);
};

function evaluateQuiz(quiz, userAnswers = []) {
  // quiz: quiz document or plain object with questions array
  // userAnswers: [{ questionId, value }]
  const processedAnswers = [];
  let correctCount = 0;
  const total = (quiz.questions || []).length;

  for (const question of quiz.questions || []) {
    const userAnswer = (userAnswers || []).find(a => String(a.questionId) === String(question._id));
    let isCorrect = false;

    const correctAnswer = (() => {
      if (question.type === 'TEXT') return null;
      if (question.type === 'TRUE_FALSE' && question.options && question.options.length) {
        const opt = question.options.find(o => o.isCorrect);
        return opt ? opt.text : null;
      }
      if (question.type === 'MCQ_SINGLE' && question.options) {
        const opt = question.options.find(o => o.isCorrect);
        return opt ? (opt._id || opt.text) : null;
      }
      if (question.type === 'MCQ_MULTIPLE' && question.options) {
        return question.options.filter(o => o.isCorrect).map(o => String(o._id || o.text));
      }
      return null;
    })();

    if (!userAnswer) {
      isCorrect = false;
    } else {
      if (question.type === 'MCQ_SINGLE' || question.type === 'TRUE_FALSE') {
        isCorrect = String(userAnswer.value) === String(correctAnswer);
      } else if (question.type === 'MCQ_MULTIPLE') {
        isCorrect = arraysEqualUnordered(userAnswer.value || [], correctAnswer || []);
      } else if (question.type === 'TEXT') {
        const correctText = (question.options && question.options.find(o => o.isCorrect)) ? question.options.find(o => o.isCorrect).text : null;
        if (correctText) {
          isCorrect = String(userAnswer.value || '').trim().toLowerCase() === String(correctText).trim().toLowerCase();
        } else {
          isCorrect = false;
        }
      }
    }

    if (isCorrect) correctCount++;
    processedAnswers.push({ questionId: question._id, value: userAnswer ? userAnswer.value : null, isCorrect });
  }

  return { score: correctCount, total, answers: processedAnswers };
}

module.exports = { evaluateQuiz, arraysEqualUnordered };
