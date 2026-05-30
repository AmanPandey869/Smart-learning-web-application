import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzesAPI } from '../services/api';
import QuizQuestion from '../components/QuizQuestion';
import {
  HiChevronLeft, HiLightningBolt, HiCheck, HiRefresh,
  HiEmojiHappy, HiEmojiSad
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const { id: courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [time, setTime] = useState(60);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
  if (!result && time > 0) {
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }

  if (time === 0 && !result) {
    handleSubmit(); // auto submit
  }
}, [time, result]);

  const fetchQuiz = async () => {
    try {
      const { data } = await quizzesAPI.getByCourse(courseId);
      const found = data.find((q) => q._id === quizId);
      if (found) {
        setQuiz(found);
      } else {
        toast.error('Quiz not found');
        navigate(`/courses/${courseId}`);
      }
    } catch (err) {
      toast.error('Failed to load quiz');
      navigate(`/courses/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionIdx, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmit = async () => {
  // check all answered
  if (Object.keys(answers).length < quiz.questions.length) {
    toast.error('Please answer all questions before submitting');
    return;
  }

  setSubmitting(true);

  try {
    // convert answers object to array
    const answersArray = quiz.questions.map((_, idx) => answers[idx]);

    // API call
    const { data } = await quizzesAPI.submit(quizId, answersArray);

    // set result
    setResult(data);

    // 🔥 save in localStorage (important)
    localStorage.setItem("lastScore", data.score);
    localStorage.setItem("lastPercentage", data.percentage);

    // success message
    toast.success(`Quiz completed! Score: ${data.score}/${data.total}`);

  } catch (err) {
    toast.error('Failed to submit quiz');
  } finally {
    setSubmitting(false);
  }
};

   
  const handleRetry = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quiz) return null;

  const passed = result && result.percentage >= 70;

  return (
    <div className="page-container max-w-3xl mx-auto animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(`/courses/${courseId}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <HiChevronLeft className="w-5 h-5" />
        Back to Course
      </button>

      {/*Quiz Header */}
      <p className="text-sm text-red-400 mt-2">
        Time Left: {time}s
      </p>
      <div className="glass-card mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
            <HiLightningBolt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <p className="text-sm text-gray-400">{quiz.questions.length} questions</p>
          </div>
        </div>

        {!result && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <p className="text-xs text-amber-300">
              Select the best answer for each question. You need 70% to pass.
            </p>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className={`glass-card mb-6 border ${passed ? 'border-emerald-500/30' : 'border-red-500/30'} animate-scale-in`}>
          <div className="text-center">
            {passed ? (
              <HiEmojiHappy className="w-16 h-16 text-emerald-400 mx-auto mb-3" />
            ) : (
              <HiEmojiSad className="w-16 h-16 text-red-400 mx-auto mb-3" />
            )}
            <h2 className="text-2xl font-bold text-white mb-1">
              {passed ? '🎉 Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-400 mb-4">
              {passed ? 'You passed the quiz!' : 'You can try again anytime.'}
            </p>

            <div className="flex items-center justify-center gap-8 mb-4">
              <div>
                <p className="text-3xl font-bold gradient-text">{result.score}/{result.total}</p>
                <p className="text-xs text-gray-500">Score</p>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <p className={`text-3xl font-bold ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.percentage}%
                </p>
                <p className="text-xs text-gray-500">Percentage</p>
              </div>
            </div>

            <button onClick={handleRetry} className="btn-secondary flex items-center gap-2 mx-auto">
              <HiRefresh className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((question, idx) => (
          <QuizQuestion
            key={idx}
            question={question}
            index={idx}
            selectedAnswer={answers[idx]}
            onSelect={(optIdx) => handleSelect(idx, optIdx)}
            showResult={!!result}
            disabled={!!result}
          />
        ))}
      </div>

      {/* Submit */}
      {!result && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {Object.keys(answers).length}/{quiz.questions.length} answered
          </p>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary flex items-center gap-2"
            id="submit-quiz"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiCheck className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
