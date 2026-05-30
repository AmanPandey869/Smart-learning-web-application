import { HiCheck, HiX } from 'react-icons/hi';

const QuizQuestion = ({ question, index, selectedAnswer, onSelect, showResult = false, disabled = false }) => {
  const { question: text, options, correctAnswer } = question;

  return (
    <div className="glass-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-brand-500/20 text-brand-300 rounded-lg flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold text-white pt-0.5">{text}</h3>
      </div>

      <div className="space-y-2 ml-11">
        {options.map((option, optIdx) => {
          let classes = 'w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ';

          if (showResult) {
            if (optIdx === correctAnswer) {
              classes += 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
            } else if (optIdx === selectedAnswer && optIdx !== correctAnswer) {
              classes += 'border-red-500/50 bg-red-500/10 text-red-300';
            } else {
              classes += 'border-white/5 bg-white/5 text-gray-500';
            }
          } else if (optIdx === selectedAnswer) {
            classes += 'border-brand-500 bg-brand-500/10 text-brand-300 shadow-lg shadow-brand-500/10';
          } else {
            classes += 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20 hover:bg-white/10';
          }

          if (disabled) {
            classes += ' cursor-not-allowed';
          } else {
            classes += ' cursor-pointer';
          }

          return (
            <button
              key={optIdx}
              className={classes}
              onClick={() => !disabled && onSelect(optIdx)}
              disabled={disabled}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                showResult && optIdx === correctAnswer
                  ? 'bg-emerald-500 text-white'
                  : showResult && optIdx === selectedAnswer && optIdx !== correctAnswer
                  ? 'bg-red-500 text-white'
                  : optIdx === selectedAnswer
                  ? 'bg-brand-500 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {showResult && optIdx === correctAnswer ? (
                  <HiCheck className="w-4 h-4" />
                ) : showResult && optIdx === selectedAnswer && optIdx !== correctAnswer ? (
                  <HiX className="w-4 h-4" />
                ) : (
                  String.fromCharCode(65 + optIdx)
                )}
              </span>
              <span className="text-sm">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;
