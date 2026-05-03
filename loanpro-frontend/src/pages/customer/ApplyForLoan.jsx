import { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import { loanTypes } from '../../data/mockData';
import './ApplyForLoan.css';

function ApplyForLoan() {
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Loan application:', { selectedType, amount, term });
  };

  return (
    <div className="apply-page">
      <h2 className="apply-page__title">Apply for a Loan</h2>
      <p className="apply-page__subtitle">Choose a loan type and fill in the details</p>

      {/* Loan type cards */}
      <div className="apply-page__types">
        {loanTypes.map((lt) => (
          <div
            key={lt.id}
            className={`loan-type-card ${selectedType === lt.id ? 'loan-type-card--selected' : ''}`}
            onClick={() => setSelectedType(lt.id)}
          >
            <h4 className="loan-type-card__label">{lt.label}</h4>
            <p className="loan-type-card__detail">Up to ${lt.maxAmount.toLocaleString()}</p>
            <p className="loan-type-card__detail">From {lt.minRate}% APR</p>
          </div>
        ))}
      </div>

      {/* Application form */}
      <Card title="Loan Details" subtitle="Enter the amount and term" icon="📝">
        <form className="apply-page__form" onSubmit={handleSubmit}>
          <Input id="loan-amount" label="Loan Amount ($)" type="number" placeholder="e.g. 10000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Input id="loan-term" label="Term (months)" type="number" placeholder="e.g. 24" value={term} onChange={(e) => setTerm(e.target.value)} required />
          <Button type="submit" variant="primary" fullWidth disabled={!selectedType}>Submit Application</Button>
        </form>
      </Card>
    </div>
  );
}

export default ApplyForLoan;
