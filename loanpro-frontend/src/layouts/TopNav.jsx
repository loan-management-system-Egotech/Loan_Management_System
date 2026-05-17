import './TopNav.css';

const TopNav = () => {
  return (
    <header className="loanpro-topnav">
      <div className="topnav-titles">
        <h2>My Wallet</h2>
        <p>Balance, Transfers & Top-up</p>
      </div>

      <div className="topnav-search">
        <input type="text" placeholder="Search..." />
      </div>
    </header>
  );
};

export default TopNav;