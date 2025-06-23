const JoinForm = ({ name, setName, handleJoin }) => (
  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
    <h2>Entrez votre nom pour rejoindre</h2>
    <form onSubmit={handleJoin}>
      <input
        type="text"
        placeholder="Votre nom…"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem' }}
      />
      <button type="submit" style={{ marginLeft: '0.5rem' }}>
        Rejoindre
      </button>
    </form>
  </div>
);

export default JoinForm;