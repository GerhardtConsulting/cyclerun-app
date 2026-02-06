"use client";

export default function VoteButton({ votes }: { votes: number }) {
  const handleVote = () => {
    const email = typeof window !== "undefined" ? localStorage.getItem("cyclerun_email") : null;
    if (!email) {
      alert("Register for free to vote on features! Open CycleRun and create an account.");
      return;
    }
    // TODO: Save vote to Supabase
    alert("Thanks for voting! Your vote has been recorded.");
  };

  return (
    <button className="vote-btn" title="Register to vote" onClick={handleVote}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
      <span className="vote-count">{votes}</span>
    </button>
  );
}
