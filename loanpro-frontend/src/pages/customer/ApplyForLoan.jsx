import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { apiGet, apiPost, apiUpload } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './ApplyForLoan.css';

const steps = ['Loan Type', 'Personal Info', 'Financial Info', 'Document', 'Review & Submit'];

// Document slots — `type` is sent to the backend as the documentType.
const DOC_SLOTS = [
  { type: 'NIC', title: 'National ID / Passport', desc: 'Front & back copy of your NIC or Passport', required: true },
  { type: 'INCOME_PROOF', title: 'Proof of Income', desc: 'Last 3 month salary slips', required: true },
  { type: 'BANK_STATEMENT', title: 'Bank Statements', desc: '3 month bank statements (all accounts)', required: true },
  { type: 'TAX_RETURN', title: 'Tax Return', desc: 'Optional supporting document', required: false },
];

const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v));

const ApplyForLoan = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [loanTypes, setLoanTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const [applicationData, setApplicationData] = useState({
    loanType: '',
    amountRequested: '',
    purpose: '',
    tenureMonths: '',
    // Personal
    fullName: user?.name || '', dob: '', address: '', city: '', email: user?.email || '',
    nic: '', gender: '', maritalStatus: '', postalCode: '', phone: '',
    // Financial
    empStatus: '', jobTitle: '', workAddress: '', grossSalary: '', existingEmis: '',
    empName: '', yearsEmp: '', workPhone: '', netSalary: '', creditCard: '',
  });

  const [documents, setDocuments] = useState({}); // { [docType]: File }
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await apiGet('/loan-types');
        if (active) setLoanTypes(Array.isArray(data) ? data : []);
      } catch {
        if (active) setLoanTypes([]);
      } finally {
        if (active) setLoadingTypes(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (type, file) => {
    setDocuments((prev) => ({ ...prev, [type]: file || undefined }));
  };

  const validate = () => {
    const d = applicationData;
    if (!d.loanType) return 'Please select a loan type.';
    if (!num(d.amountRequested) || num(d.amountRequested) <= 0) return 'Enter a valid loan amount.';
    if (!d.purpose) return 'Please describe the loan purpose.';
    if (!num(d.tenureMonths) || num(d.tenureMonths) <= 0) return 'Enter a valid tenure (months).';
    if (!d.fullName) return 'Full name is required.';
    if (!d.dob) return 'Date of birth is required.';
    if (!num(d.grossSalary) || num(d.grossSalary) <= 0) return 'Gross monthly salary is required.';
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setSubmitError(validationError); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      const d = applicationData;
      const payload = {
        loanType: d.loanType,
        amountRequested: num(d.amountRequested),
        purpose: d.purpose,
        tenureMonths: num(d.tenureMonths),
        fullName: d.fullName,
        dob: d.dob,
        address: d.address || null,
        city: d.city || null,
        email: d.email || null,
        nic: d.nic || null,
        gender: d.gender || null,
        maritalStatus: d.maritalStatus || null,
        postalCode: d.postalCode || null,
        phone: d.phone || null,
        empStatus: d.empStatus || null,
        jobTitle: d.jobTitle || null,
        workAddress: d.workAddress || null,
        empName: d.empName || null,
        yearsEmp: num(d.yearsEmp),
        workPhone: d.workPhone || null,
        grossSalary: num(d.grossSalary),
        netSalary: num(d.netSalary),
        existingEmis: num(d.existingEmis),
        creditCard: num(d.creditCard),
      };

      const created = await apiPost('/applications', payload);

      // Upload any selected documents to the freshly created application.
      const appId = created.id;
      for (const slot of DOC_SLOTS) {
        const file = documents[slot.type];
        if (file && appId) {
          const fd = new FormData();
          fd.append('documentType', slot.type);
          fd.append('file', file);
          try { await apiUpload(`/applications/${appId}/documents`, fd); } catch { /* keep going */ }
        }
      }

      setSubmittedApp(created);
    } catch (e) {
      setSubmitError(errorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Success screen ----
  if (submittedApp) {
    return (
      <div className="apply-loan-container">
        <div className="page-header">
          <h2>Application Submitted</h2>
          <p>We&apos;ve received your loan application.</p>
        </div>
        <div className="application-card">
          <div className="step-content" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem' }}>✅</div>
            <h3 className="step-title">Thank you, {submittedApp.name || applicationData.fullName}!</h3>
            <p>Your application <strong>{submittedApp.id}</strong> has been submitted and is now <strong>{submittedApp.status}</strong>.</p>
            <div className="form-actions right mt-4" style={{ justifyContent: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="loanpro-btn loanpro-btn-outline">Go to Dashboard</Link>
              <Link to="/loans" className="loanpro-btn loanpro-btn-primary">View My Loans</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Step 1: Loan Type + amount/purpose/tenure ----
  const renderStep1 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 1 of 5 : Select Loan Type</h3>
      {loadingTypes ? (
        <div className="page-loading">Loading loan types…</div>
      ) : (
        <div className="loan-type-grid">
          {loanTypes.map((type) => (
            <div
              key={type.id}
              className={`loan-type-card ${applicationData.loanType === type.id ? 'selected' : ''}`}
              onClick={() => setApplicationData({ ...applicationData, loanType: type.id })}
            >
              <h4>{type.title}</h4>
              <p className="limit">{type.limit}</p>
              <p className="desc">{type.description}</p>
            </div>
          ))}
        </div>
      )}

      <div className="form-grid" style={{ marginTop: '1.5rem' }}>
        <div className="form-col">
          <Input label="Amount Requested (LKR)" name="amountRequested" type="number" value={applicationData.amountRequested} onChange={handleInputChange} />
          <Input label="Tenure (Months)" name="tenureMonths" type="number" value={applicationData.tenureMonths} onChange={handleInputChange} />
        </div>
        <div className="form-col">
          <Input label="Purpose" name="purpose" value={applicationData.purpose} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-actions right">
        <Button variant="primary" onClick={handleNext} disabled={!applicationData.loanType}>
          Continue to personal details
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 2 of 5 : Personal Details</h3>
      <div className="form-grid">
        <div className="form-col">
          <Input label="Full Name" name="fullName" value={applicationData.fullName} onChange={handleInputChange} />
          <Input label="Date of Birth" name="dob" type="date" value={applicationData.dob} onChange={handleInputChange} />
          <Input label="Address" name="address" value={applicationData.address} onChange={handleInputChange} />
          <Input label="City" name="city" value={applicationData.city} onChange={handleInputChange} />
          <Input label="Email Address" name="email" type="email" value={applicationData.email} onChange={handleInputChange} />
        </div>
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
          <Input label="Years Employed" name="yearsEmp" type="number" value={applicationData.yearsEmp} onChange={handleInputChange} />
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

  const renderStep4 = () => (
    <div className="step-content">
      <h3 className="step-title">Step 4 of 5 : Document</h3>

      <div className="form-grid">
        {DOC_SLOTS.map((slot) => (
          <div key={slot.type} className={`upload-card ${slot.required ? 'required' : 'optional'}`}>
            <div className="upload-info">
              <span className={`badge ${slot.required ? '' : 'gray'}`}>{slot.required ? 'Required' : 'Optional'}</span>
              <h4>{slot.title}</h4>
              <p>{documents[slot.type] ? documents[slot.type].name : slot.desc}</p>
            </div>
            <label className={`loanpro-btn ${slot.required ? 'loanpro-btn-outline' : 'loanpro-btn-secondary'}`} style={{ cursor: 'pointer' }}>
              {documents[slot.type] ? 'Selected ✓' : 'Upload'}
              <input
                type="file"
                hidden
                onChange={(e) => handleFile(slot.type, e.target.files && e.target.files[0])}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button variant="primary" onClick={handleNext}>Continue to Review</Button>
      </div>
    </div>
  );

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
            <p className="review-value">LKR {applicationData.amountRequested || '0'}</p>
          </div>
          <div>
            <span className="review-label">Tenure</span>
            <p className="review-value">{applicationData.tenureMonths || '0'} months</p>
          </div>
          <div>
            <span className="review-label">Purpose</span>
            <p className="review-value">{applicationData.purpose || 'Not Provided'}</p>
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
        <p>✓ I agree to the Loan Terms &amp; Conditions.</p>
      </div>

      {submitError && <div className="form-feedback is-error">{submitError}</div>}

      <div className="form-actions space-between">
        <Button variant="outline" onClick={handleBack}>Back</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Application'}
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

      <div className="stepper-container">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          let stepClass = 'step-circle';
          if (currentStep === stepNum) stepClass += ' active';
          if (currentStep > stepNum) stepClass += ' completed';

          return (
            <div key={stepNum} className="step-wrapper">
              <div className={stepClass}>{stepNum}</div>
              <span className={`step-label ${currentStep === stepNum ? 'active' : ''}`}>{step}</span>
              {stepNum !== steps.length && <div className={`step-line ${currentStep > stepNum ? 'completed' : ''}`}></div>}
            </div>
          );
        })}
      </div>

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
