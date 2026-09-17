function Box({ color, isRevealed, isWrong, onClick, disabled }) {
  const className = ['box', isRevealed && 'box--revealed', isWrong && 'box--wrong'].filter(Boolean).join(' ')
  return (
    <button
      className={className}
      aria-label={isRevealed || isWrong ? 'Selected hidden color box' : 'Hidden color box'}
      style={isRevealed ? { backgroundColor: color } : undefined}
      onClick={onClick}
      type="button"
      disabled={disabled || isRevealed}
    />
  )
}

export default Box
