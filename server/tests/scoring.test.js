const { evaluateQuiz, arraysEqualUnordered } = require('../utils/scoring');

describe('scoring utilities', () => {
  test('arraysEqualUnordered matches same elements different order', () => {
    expect(arraysEqualUnordered([1,2], [2,1])).toBe(true);
    expect(arraysEqualUnordered(['a','b'], ['b','a'])).toBe(true);
    expect(arraysEqualUnordered([1], [1,2])).toBe(false);
  });

  test('MCQ_SINGLE correct detection', () => {
    const quiz = { questions: [ { _id: 'q1', type: 'MCQ_SINGLE', options: [ { _id: 'o1', text: '3', isCorrect: false }, { _id: 'o2', text: '4', isCorrect: true } ] } ] };
    const res = evaluateQuiz(quiz, [{ questionId: 'q1', value: 'o2' }]);
    expect(res.score).toBe(1);
    expect(res.total).toBe(1);
  });

  test('MCQ_MULTIPLE correct detection unordered', () => {
    const quiz = { questions: [ { _id: 'q1', type: 'MCQ_MULTIPLE', options: [ { _id: 'o1', text: 'a', isCorrect: true }, { _id: 'o2', text: 'b', isCorrect: true }, { _id: 'o3', text: 'c', isCorrect: false } ] } ] };
    const res = evaluateQuiz(quiz, [{ questionId: 'q1', value: ['o2','o1'] }]);
    expect(res.score).toBe(1);
  });

  test('TRUE_FALSE correct detection', () => {
    const quiz = { questions: [ { _id: 'q1', type: 'TRUE_FALSE', options: [ { text: 'true', isCorrect: true }, { text: 'false', isCorrect: false } ] } ] };
    const res = evaluateQuiz(quiz, [{ questionId: 'q1', value: 'true' }]);
    expect(res.score).toBe(1);
  });

  test('TEXT exact match case-insensitive', () => {
    const quiz = { questions: [ { _id: 'q1', type: 'TEXT', options: [ { text: 'Node', isCorrect: true } ] } ] };
    const res = evaluateQuiz(quiz, [{ questionId: 'q1', value: 'node' }]);
    expect(res.score).toBe(1);
  });

  test('missing answer counts as incorrect', () => {
    const quiz = { questions: [ { _id: 'q1', type: 'MCQ_SINGLE', options: [ { _id: 'o1', text: 'x', isCorrect: true } ] } ] };
    const res = evaluateQuiz(quiz, []);
    expect(res.score).toBe(0);
  });
});
