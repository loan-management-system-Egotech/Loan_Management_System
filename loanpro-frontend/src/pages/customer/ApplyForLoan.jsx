import { useState } from 'react';
import { loanTypes } from '../../data/mockData';
import Button from '../../components/Button';
import Input from '../../components/Input'; // MUST IMPORT YOUR INPUT COMPONENT!
import './ApplyForLoan.css';

const steps = ["Loan Type", "Personal Info", "Financial Info", "Document", "Review & Submit"];

const ApplyForLoan = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // 1. Expanded State to hold all form data
  const [applicationData, setApplicationData] = useState({
    loanType: '',
    // Step 2 Data
    fullName: '', dob: '', address: '', city: '', email: '',
    nic: '', gender: '', maritalStatus: '', postalCode: '', phone: '',
    // Step 3 Data
    empStatus: '', jobTitle: '', workAddress: '', grossSalary: '', existingEmis: '',
    empName: '', yearsEmp: '', workPhone: '', netSalary: '', creditCard: ''
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // 2. Generic handler for all text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({ ...prev, [name]: value }));
  };

  // --- UI for Step 1: Loan Type ---
  const renderStep1 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 1 of 5 : Select Loan Type</h3>
      <div className="loan-type-grid">
        {loanTypes.map(type => (
          <div 
            key={type.id} 
            className={`loan-type-card ${applicationData.loanType === type.id ? 'selected' : ''}`}
            onClick={() => setApplicationData({...applicationData, loanType: type.id})}
          >
            <h4>{type.title}</h4>
            <p className="limit">{type.limit}</p>
            <p className="desc">{type.desc}</p>
          </div>
        ))}
      </div>
      <div className="form-actions right">
        <Button variant="primary" onClick={handleNext} disabled={!applicationData.loanType}>
          Continue to personal details
        </Button>
      </div>
    </div>
  );

  // --- UI for Step 2: Personal Details ---
  const renderStep2 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 2 of 5 : Personal Details</h3>
      <div className="form-grid">
        {/* Left Column */}
        <div className="form-col">
          <Input label="Full Name" name="fullName" value={applicationData.fullName} onChange={handleInputChange} />
          <Input label="Date of Birth" name="dob" type="date" value={applicationData.dob} onChange={handleInputChange} />
          <Input label="Address" name="address" value={applicationData.address} onChange={handleInputChange} />
          <Input label="City" name="city" value={applicationData.city} onChange={handleInputChange} />
          <Input label="Email Address" name="email" type="email" value={applicationData.email} onChange={handleInputChange} />
        </div>
        {/* Right Column */}
        <div className="form-col">
          <Input label="National ID/Passport" name="nic" value={applicationData.nic} onChange={handleInputChange} />
          <Input label="Gender" name="gender" value={applicationData.gender} onChange={handleInputChange} />
          <Input label="Marital Status" name="maritalStatus" value={applicationData.maritalStatus} onChange={handleInputChange} />
          <Input label="Postal Code" name="postalCode" value={applicationData.postalCode} onChange={handleInputChange} />
          <Input label="Phone Number" name="phone" value={applicationData.phone} onChange={handleInputChange} />
        </div>
      </div>
      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button variant="primary" onClick={handleNext}>Continue to Financial Info</Button>
      </div>
    </div>
  );

  // --- UI for Step 3: Financial Info ---
  const renderStep3 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 3 of 5 : Financial Information</h3>
      
      <h4 className="section-subtitle">Employment Details</h4>
      <div className="form-grid">
        <div className="form-col">
          <Input label="Employment Status" name="empStatus" value={applicationData.empStatus} onChange={handleInputChange} />
          <Input label="Job Title" name="jobTitle" value={applicationData.jobTitle} onChange={handleInputChange} />
          <Input label="Work Address" name="workAddress" value={applicationData.workAddress} onChange={handleInputChange} />
        </div>
        <div className="form-col">
          <Input label="Employer Name" name="empName" value={applicationData.empName} onChange={handleInputChange} />
          <Input label="Years Employed" name="yearsEmp" value={applicationData.yearsEmp} onChange={handleInputChange} />
          <Input label="Phone Number" name="workPhone" value={applicationData.workPhone} onChange={handleInputChange} />
        </div>
      </div>

      <h4 className="section-subtitle">Income & Liabilities (LKR)</h4>
      <div className="form-grid">
        <div className="form-col">
          <Input label="Gross Month Salary" name="grossSalary" type="number" value={applicationData.grossSalary} onChange={handleInputChange} />
          <Input label="Existing EMIs" name="existingEmis" type="number" value={applicationData.existingEmis} onChange={handleInputChange} />
        </div>
        <div className="form-col">
          <Input label="Net Take Home" name="netSalary" type="number" value={applicationData.netSalary} onChange={handleInputChange} />
          <Input label="Credit Card Payments" name="creditCard" type="number" value={applicationData.creditCard} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button variant="primary" onClick={handleNext}>Continue to Documents</Button>
      </div>
    </div>
  );

  // --- UI for Step 4: Documents ---
  const renderStep4 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 4 of 5 : Document</h3>
      
      <div className="form-grid">
        <div className="upload-card required">
          <div className="upload-info">
            <span className="badge">Required</span>
            <h4>National ID / Passport</h4>
            <p>Front & back copy of your NIC or Passport</p>
          </div>
          <Button variant="outline">Upload</Button>
        </div>

        <div className="upload-card required">
          <div className="upload-info">
            <span className="badge">Required</span>
            <h4>Proof Income</h4>
            <p>Last 3 Month salary slip</p>
          </div>
          <Button variant="outline">Upload</Button>
        </div>

        <div className="upload-card required">
          <div className="upload-info">
            <span className="badge">Required</span>
            <h4>Bank Statements</h4>
            <p>3 month bank statements (All Accounts)</p>
          </div>
          <Button variant="outline">Upload</Button>
        </div>

        <div className="upload-card optional">
          <div className="upload-info">
            <span className="badge gray">Optional</span>
            <h4>Tax Return</h4>
          </div>
          <Button variant="secondary">Upload</Button>
        </div>
      </div>

      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button variant="primary" onClick={handleNext}>Continue to Review</Button>
      </div>
    </div>
  );

  // --- UI for Step 5: Review & Submit ---
  const renderStep5 = () => (
    <div className="step-content">
      <h3 className="step-title">Application Summary</h3>
      
      <div className="review-section">
        <h4>Loan Details</h4>
        <div className="review-grid">
          <div>
            <span className="review-label">Loan Type</span>
            <p className="review-value">{applicationData.loanType || 'Not Selected'}</p>
          </div>
          <div>
             <span className="review-label">Amount Requested</span>
             <p className="review-value">LKR {applicationData.loanAmount || '100,000'}</p>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h4>Personal Details</h4>
        <div className="review-grid">
          <div>
            <span className="review-label">Full Name</span>
            <p className="review-value">{applicationData.fullName || 'Not Provided'}</p>
          </div>
          <div>
             <span className="review-label">NIC/Passport</span>
             <p className="review-value">{applicationData.nic || 'Not Provided'}</p>
          </div>
        </div>
      </div>

      <div className="terms-box">
        <p>✓ All Information provided is accurate and true.</p>
        <p>✓ I authorize LoanPro to verify my documents.</p>
        <p>✓ I agree to the Loan Terms & Conditions.</p>
      </div>

      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        {/* In a real app, this would trigger an API call to your database */}
        <Button variant="primary" onClick={() => alert("Application Submitted Successfully!")}>
          Submit Application
        </Button>
      </div>
    </div>
  );

  return (
    <div className="apply-loan-container">
      <div className="page-header">
        <h2>Apply For Loan</h2>
        <p>Complete all 5 steps to submit your loan application</p>
      </div>

      {/* The Stepper (Remains exactly the same!) */}
      <div className="stepper-container">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          let stepClass = "step-circle";
          if (currentStep === stepNum) stepClass += " active";
          if (currentStep > stepNum) stepClass += " completed";

          return (
            <div key={stepNum} className="step-wrapper">
              <div className={stepClass}>{stepNum}</div>
              <span className={`step-label ${currentStep === stepNum ? 'active' : ''}`}>{step}</span>
              {stepNum !== steps.length && <div className={`step-line ${currentStep > stepNum ? 'completed' : ''}`}></div>}
            </div>
          );
        })}
      </div>

      {/* Main Card Area - Now routing to our new steps! */}
      <div className="application-card">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>
  );
};

export default ApplyForLoan;