const ProgressBar = ({ percentage = 0, size = 'md', showLabel = true, className = '' }) => {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const height = heights[size] || heights.md;
  const clampedPct = Math.min(100, Math.max(0, percentage));

  const getColor = () => {
    if (clampedPct === 100) return 'from-emerald-400 to-emerald-500';
    if (clampedPct >= 60) return 'from-brand-400 to-purple-500';
    if (clampedPct >= 30) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-400">Progress</span>
          <span className={`text-xs font-bold ${clampedPct === 100 ? 'text-emerald-400' : 'text-gray-300'}`}>
            {clampedPct}%
          </span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-800 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-gradient-to-r ${getColor()} rounded-full transition-all duration-1000 ease-out relative`}
          style={{ width: `${clampedPct}%` }}
        >
          {size === 'lg' && clampedPct > 0 && (
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
