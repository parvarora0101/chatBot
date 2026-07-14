function HeroSection({ onOpenChat }) {
  return (
    <section className="hero">
      <div className="hero-eyebrow"><span className="status-dot" /> CampusAI</div>
      <h1>Answers that keep your ideas moving.</h1>
      <p className="hero-subtitle">
        Your thoughtful AI companion for questions, brainstorming, and everyday problem-solving.
      </p>

      <button className="hero-chat-box" onClick={onOpenChat}>
        <span className="hero-chat-icon" aria-hidden="true">✦</span>
        <span className="hero-chat-content">
          <strong>Start a conversation</strong>
          <small>Ask anything — type or use your voice</small>
        </span>
        <span className="hero-arrow" aria-hidden="true">→</span>
      </button>
      <p className="hero-footnote">Private by design · Your key stays on the server</p>
    </section>
  );
}

export default HeroSection;
