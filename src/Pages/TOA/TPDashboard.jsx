import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//const API_URL = "http://localhost:5001/api/toa/batches";
//const ASSESSOR_API = "http://localhost:5001/api/toa/assessors";

const API_URL = "/api/toa/batches";
const ASSESSOR_API = "/api/toa/assessors";

const initialAssessorForm = {
  batchId: "",
  fullName: "",
  fatherName: "",
  motherName: "",
  mobile: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  qualification: "",
  experienceYears: "",
  specialization: "",
  address: "",
  idProofDetails: "Aadhar",
  aadhaar: "",
};

const qualificationLevels = [
  { value: "10th", label: "10th" },
  { value: "Intermediate / 12th", label: "Intermediate / 12th" },
  { value: "Graduation", label: "Graduation" },
  { value: "Post Graduation", label: "Post Graduation" },
  { value: "PhD", label: "PhD" },
];

const qualificationDocuments = [
  { field: "certificate10th", label: "10th Certificate" },
  { field: "certificate12th", label: "Intermediate / 12th Certificate" },
  { field: "certificateGraduation", label: "Graduation Certificate" },
  { field: "certificatePostGraduation", label: "Post Graduation Certificate" },
  { field: "certificatePhD", label: "PhD Certificate" },
];

const initialQualificationFiles = {
  certificate10th: null,
  certificate12th: null,
  certificateGraduation: null,
  certificatePostGraduation: null,
  certificatePhD: null,
};

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  "Not Approved": "bg-red-100 text-red-800",
};

const TPDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [batchDate, setBatchDate] = useState(new Date().toLocaleDateString("en-CA"));
  const [showBatchConfirmation, setShowBatchConfirmation] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [submittingBatchId, setSubmittingBatchId] = useState("");
  const [assessors, setAssessors] = useState([]);
  const [loadingAssessors, setLoadingAssessors] = useState(false);
  const [submittingAssessor, setSubmittingAssessor] = useState(false);
  const [showAssessorForm, setShowAssessorForm] = useState(false);
  const [assessorForm, setAssessorForm] = useState(initialAssessorForm);
  const [qualificationFiles, setQualificationFiles] = useState(initialQualificationFiles);
  const [photograph, setPhotograph] = useState(null);
  const [aadhaarPdf, setAadhaarPdf] = useState(null);
const [experienceCertificate, setExperienceCertificate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAssessor, setSelectedAssessor] = useState(null);
const [showAssessorDetails, setShowAssessorDetails] = useState(false);

  const menuItems = [
    "Dashboard",
    "Create Batch",
    "Manage Assessors",
    "Batch Confirmation",
    "Invoices & Payments",
    "Results & Certificates",
    "Organisation Profile",
  ];

  const logout = () => {
    localStorage.removeItem("toa_tp_token");
    localStorage.removeItem("toa_tp_user");
    navigate("/toa", { replace: true });
  };

  const handleUnauthorized = () => logout();

  const fetchBatches = async () => {
    const token = localStorage.getItem("toa_tp_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoadingBatches(true);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load batches.");
      }
      setBatches(data.batches || []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to connect to the TOA backend.");
    } finally {
      setLoadingBatches(false);
    }
  };

  const fetchAssessors = useCallback(async () => {
    const token = localStorage.getItem("toa_tp_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoadingAssessors(true);
    setErrorMessage("");
    try {
      const response = await fetch(ASSESSOR_API, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load assessor applications.");
      }
      setAssessors(data.assessors || []);
    } catch (error) {
      setErrorMessage(error.message || "Unable to load assessor applications.");
    } finally {
      setLoadingAssessors(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
    // Load batches when the dashboard mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  if (activePage === "Manage Assessors") {
    fetchBatches();
    fetchAssessors();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activePage, fetchAssessors]);

  const handleCreateBatch = async () => {
    const token = localStorage.getItem("toa_tp_token");
    if (!token) {
      handleUnauthorized();
      return;
    }
    if (!batchDate) {
      setErrorMessage("Please select a batch generation date.");
      return;
    }

    setCreatingBatch(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ batchDate }),
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create batch.");
      }
      setBatches((previous) => [data.batch, ...previous]);
      setShowBatchConfirmation(false);
      setSuccessMessage(`Batch ${data.batch.batchCode} created successfully.`);
      setActivePage("Dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Unable to connect to the TOA backend.");
    } finally {
      setCreatingBatch(false);
    }
  };

  const handleSubmitBatch = async (batch) => {
    const token = localStorage.getItem("toa_tp_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    const batchId = batch._id || batch.id;
    if (!batchId) {
      setErrorMessage("Invalid batch ID. Please refresh the batch list.");
      return;
    }

    if (!["Draft", "Pending"].includes(batch.status)) {
      setErrorMessage("This batch has already been submitted or cannot be submitted.");
      return;
    }

    const actualAssessorCount = assessors.filter(
      (assessor) => String(assessor.batchId || "") === String(batchId)
    ).length;

    if (actualAssessorCount < 1) {
      setErrorMessage("Please register at least one assessor for this batch before confirming it.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to submit ${batch.batchCode} for admin review? You will not be able to add assessors after submission.`
    );
    if (!confirmed) return;

    setSubmittingBatchId(String(batchId));
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(batchId)}/submit`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit the batch.");
      }

      const updatedBatch = data.updatedBatch || data.batch || data.updated || {};
      setBatches((previous) =>
        previous.map((item) =>
          String(item._id || item.id) === String(batchId)
            ? { ...item, ...updatedBatch, status: "Submitted" }
            : item
        )
      );
      setSuccessMessage(`${batch.batchCode} has been submitted successfully for admin review.`);
      await Promise.all([fetchBatches(), fetchAssessors()]);
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit the batch.");
    } finally {
      setSubmittingBatchId("");
    }
  };

  const handleAssessorInput = (event) => {
    const { name, value } = event.target;
    setAssessorForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAssessorSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("toa_tp_token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    const selectedIndex = qualificationLevels.findIndex(
      (level) => level.value === assessorForm.qualification
    );
    if (selectedIndex < 0) {
      setErrorMessage("Please select the highest completed qualification.");
      return;
    }

    const requiredDocuments = qualificationDocuments.slice(0, selectedIndex + 1);
    const missingDocument = requiredDocuments.find(
      (document) => !qualificationFiles[document.field]
    );
    if (missingDocument) {
      setErrorMessage(`Please upload the ${missingDocument.label.toLowerCase()}.`);
      return;
    }
    if (!photograph) {
      setErrorMessage("Please upload the assessor photograph.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(assessorForm.mobile)) {
      setErrorMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!/^\d{12}$/.test(assessorForm.aadhaar)) {
      setErrorMessage("Enter a valid 12-digit Aadhaar number.");
      return;
    }

    if (!aadhaarPdf) {
  setErrorMessage("Please upload the Aadhaar Card PDF.");
  return;
}

if (aadhaarPdf.type !== "application/pdf") {
  setErrorMessage("Aadhaar Card must be a PDF file.");
  return;
}

if (aadhaarPdf.size > 5 * 1024 * 1024) {
  setErrorMessage("Aadhaar Card PDF must be 5 MB or smaller.");
  return;
}

if (experienceCertificate) {
  if (experienceCertificate.type !== "application/pdf") {
    setErrorMessage("Experience Certificate must be a PDF file.");
    return;
  }

  if (experienceCertificate.size > 5 * 1024 * 1024) {
    setErrorMessage("Experience Certificate PDF must be 5 MB or smaller.");
    return;
  }
}

    const allowedCertificateTypes = ["application/pdf", "image/jpeg", "image/png"];
    for (const document of requiredDocuments) {
      const file = qualificationFiles[document.field];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`${document.label} must be 5 MB or smaller.`);
        return;
      }
      if (!allowedCertificateTypes.includes(file.type)) {
        setErrorMessage(`${document.label} must be a PDF, JPG, JPEG or PNG file.`);
        return;
      }
    }
    if (photograph.size > 5 * 1024 * 1024) {
      setErrorMessage("The photograph must be 5 MB or smaller.");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(photograph.type)) {
      setErrorMessage("The photograph must be a JPG or PNG file.");
      return;
    }

    setSubmittingAssessor(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const formData = new FormData();
      Object.entries(assessorForm).forEach(([key, value]) => formData.append(key, value));

      formData.append("aadhaarPdf", aadhaarPdf);

if (experienceCertificate) {
  formData.append("experienceCertificate", experienceCertificate);
}

      requiredDocuments.forEach((document) => {
        formData.append(document.field, qualificationFiles[document.field]);
      });
      formData.append("photograph", photograph);

      const response = await fetch(ASSESSOR_API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit the assessor application.");
      }

      setAssessorForm(initialAssessorForm);
      setQualificationFiles(initialQualificationFiles);
      setPhotograph(null);
      setShowAssessorForm(false);
      document
        .querySelectorAll('input[name^="certificate"], input[name="photograph"]')
        .forEach((input) => {
          input.value = "";
        });
      setSuccessMessage(
        `Assessor application submitted successfully. Assessor ID: ${data.assessor?.assessorId || "assigned"}. Status: Pending approval.`
      );
      await fetchAssessors();
    } catch (error) {
      setErrorMessage(error.message || "Unable to connect to the TOA backend.");
    } finally {
      setSubmittingAssessor(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="bg-slate-900 p-5 text-white md:min-h-screen md:w-64">
        <h1 className="text-2xl font-bold">TOA Portal</h1>
        <p className="mt-1 text-sm text-slate-300">Training Partner Workspace</p>
        <nav className="mt-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setActivePage(item);
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm ${
                activePage === item
                  ? "bg-indigo-600 text-white"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-8 w-full rounded-lg border border-slate-600 px-4 py-3 text-sm hover:bg-slate-800"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <header className="mb-8">
          <p className="text-sm text-gray-500">TOA Portal / {activePage}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">{activePage}</h2>
        </header>

        {errorMessage && (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
            {successMessage}
          </div>
        )}

        {activePage === "Dashboard" && (
          <>
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">Welcome, Training Partner</h3>
              <p className="mt-2 text-gray-600">
                Create and manage your RailTel batches and assessor applications here.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => { setActivePage("Create Batch"); setErrorMessage(""); setSuccessMessage(""); }}
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >Create a Batch</button>
                <button
                  type="button"
                  onClick={() => { setActivePage("Manage Assessors"); setErrorMessage(""); setSuccessMessage(""); }}
                  className="rounded-lg border border-indigo-600 px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
                >Manage Assessors</button>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">Created Batches</h3>
                <button type="button" onClick={fetchBatches} disabled={loadingBatches} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                  {loadingBatches ? "Loading..." : "Refresh"}
                </button>
              </div>
              {loadingBatches ? <p className="mt-5 text-gray-500">Loading your batches...</p> : batches.length === 0 ? (
                <p className="mt-5 text-gray-500">No batches have been created yet.</p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead><tr className="border-b bg-gray-50"><th className="p-3">Batch Code</th><th className="p-3">Batch Name</th><th className="p-3">Generation Date</th><th className="p-3">Status</th></tr></thead>
                    <tbody>{batches.map((batch) => (
                      <tr key={batch.id || batch._id} className="border-b last:border-0">
                        <td className="p-3 font-semibold text-slate-800">{batch.batchCode}</td>
                        <td className="p-3">{batch.batchName}</td>
                        <td className="p-3">{batch.batchDate}</td>
                        <td className="p-3"><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">{batch.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activePage === "Create Batch" && (
          <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-800">Generate a RailTel Batch</h3>
            <p className="mt-2 text-sm text-gray-500">A unique batch number will be generated by the backend and saved in the TOA database.</p>
            <div className="mt-6 space-y-5">
              <div><label className={labelClass}>Batch Name</label><input value="RailTel" readOnly className={`${inputClass} bg-gray-100`} /></div>
              <div><label className={labelClass}>Batch Generation Date</label><input type="date" value={batchDate} onChange={(event) => setBatchDate(event.target.value)} className={inputClass} required /></div>
              <button type="button" onClick={() => { setErrorMessage(""); setSuccessMessage(""); setShowBatchConfirmation(true); }} className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700">Generate Batch</button>
            </div>
            {showBatchConfirmation && (
              <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                <h3 className="text-xl font-bold text-indigo-900">Confirm Batch Details</h3>
                <p className="mt-2 text-sm text-indigo-800">Please review the details before creating your batch.</p>
                <div className="mt-5 space-y-3 rounded-lg bg-white p-4">
                  <div><p className="text-sm text-gray-500">Batch Name</p><p className="font-semibold text-gray-900">RailTel</p></div>
                  <div><p className="text-sm text-gray-500">Batch Generation Date</p><p className="font-semibold text-gray-900">{batchDate}</p></div>
                  <p className="text-sm text-gray-500">The unique batch code will be assigned when you confirm and create the batch.</p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button type="button" disabled={creatingBatch} onClick={() => setShowBatchConfirmation(false)} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Go Back</button>
                  <button type="button" disabled={creatingBatch} onClick={handleCreateBatch} className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{creatingBatch ? "Creating Batch..." : "Confirm & Create Batch"}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === "Manage Assessors" && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="text-xl font-semibold text-slate-800">Manage Assessors</h3><p className="mt-1 text-sm text-gray-500">Register assessors and track their approval status.</p></div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={fetchAssessors} disabled={loadingAssessors} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">{loadingAssessors ? "Refreshing..." : "Refresh"}</button>
                  <button type="button" onClick={() => { setShowAssessorForm((previous) => !previous); setErrorMessage(""); setSuccessMessage(""); }} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{showAssessorForm ? "Close Form" : "Register New Assessor"}</button>
                </div>
              </div>
            </div>

            {showAssessorForm && (
              <form onSubmit={handleAssessorSubmit} className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 text-xl font-semibold text-slate-800">Assessor Registration Form</h3>
                <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  Enter the assessor's details carefully. The complete Aadhaar number is validated by the backend but only its last four digits should be stored.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
  <label className={labelClass}>Select Batch *</label>

  <select
    name="batchId"
    value={assessorForm.batchId}
    onChange={handleAssessorInput}
    className={inputClass}
    required
  >
    <option value="">Select a batch</option>

    {batches
      .filter((batch) =>
        ["Pending", "Draft"].includes(batch.status)
      )
      .map((batch) => (
        <option
          key={batch._id || batch.id}
          value={batch._id || batch.id}
        >
          {batch.batchCode} — {batch.batchName}
        </option>
      ))}
  </select>

  <p className="mt-1 text-xs text-gray-500">
    Select the batch to which this assessor will be assigned.
    Only batches that have not been submitted are available.
  </p>
</div>
                  <div><label className={labelClass}>Full Name *</label><input name="fullName" value={assessorForm.fullName} onChange={handleAssessorInput} className={inputClass} required /></div>
                  <div><label className={labelClass}>Father's Name *</label><input name="fatherName" value={assessorForm.fatherName} onChange={handleAssessorInput} className={inputClass} required /></div>
                  <div><label className={labelClass}>Mother's Name *</label><input name="motherName" value={assessorForm.motherName} onChange={handleAssessorInput} className={inputClass} required /></div>
                  <div><label className={labelClass}>Mobile Number *</label><input name="mobile" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={assessorForm.mobile} onChange={handleAssessorInput} placeholder="10-digit mobile number" className={inputClass} required /></div>
                  <div><label className={labelClass}>Email Address *</label><input name="email" type="email" value={assessorForm.email} onChange={handleAssessorInput} className={inputClass} required /></div>
                  <div><label className={labelClass}>Gender *</label><select name="gender" value={assessorForm.gender} onChange={handleAssessorInput} className={inputClass} required><option value="">Select gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div><label className={labelClass}>Date of Birth *</label><input name="dateOfBirth" type="date" value={assessorForm.dateOfBirth} onChange={handleAssessorInput} max={new Date().toISOString().split("T")[0]} className={inputClass} required /></div>
                  <div>
                    <label className={labelClass}>Highest Completed Educational Qualification *</label>
                    <select name="qualification" value={assessorForm.qualification} onChange={(event) => { handleAssessorInput(event); setQualificationFiles(initialQualificationFiles); }} className={inputClass} required>
                      <option value="">Select highest qualification</option>
                      {qualificationLevels.map((level) => <option key={level.value} value={level.value}>{level.label}</option>)}
                    </select>
                  </div>
                  <div><label className={labelClass}>Experience (years) *</label><input name="experienceYears" type="number" min="0" max="70" step="0.5" value={assessorForm.experienceYears} onChange={handleAssessorInput} className={inputClass} required /></div>
                  <div><label className={labelClass}>Trade / Job-Role Specialization *</label><input name="specialization" value={assessorForm.specialization} onChange={handleAssessorInput} placeholder="Enter trade or job role" className={inputClass} required /></div>
                  <div>
  <label className={labelClass}>ID Proof Details</label>
  <input
    name="idProofDetails"
    value="Aadhaar"
    readOnly
    className={`${inputClass} bg-gray-100`}
  />
</div>
                  <div><label className={labelClass}>Aadhaar Number *</label><input name="aadhaar" type="password" inputMode="numeric" pattern="[0-9]{12}" maxLength={12} autoComplete="off" value={assessorForm.aadhaar} onChange={handleAssessorInput} placeholder="12-digit Aadhaar number" className={inputClass} required /><p className="mt-1 text-xs text-gray-500">Hidden while typing. Only the last four digits should be stored by the backend.</p></div>


<div>
  <label className={labelClass}>Aadhaar Card PDF *</label>
  <input
    type="file"
    accept="application/pdf,.pdf"
    onChange={(event) =>
      setAadhaarPdf(event.target.files?.[0] || null)
    }
    className={inputClass}
    required
  />
  <p className="mt-1 text-xs text-gray-500">
    Upload the assessor's Aadhaar document in PDF format. Maximum size: 5 MB.
  </p>
</div>

<div>
  <label className={labelClass}>
    Experience Certificate PDF (Optional)
  </label>
  <input
    type="file"
    accept="application/pdf,.pdf"
    onChange={(event) =>
      setExperienceCertificate(event.target.files?.[0] || null)
    }
    className={inputClass}
  />
  <p className="mt-1 text-xs text-gray-500">
    Upload an experience certificate if available. Maximum size: 5 MB.
  </p>
</div>




                  <div className="sm:col-span-2"><label className={labelClass}>Full Address *</label><textarea name="address" rows={3} value={assessorForm.address} onChange={handleAssessorInput} className={inputClass} required /></div>

                  <div className="sm:col-span-2">
                    <h4 className="text-lg font-semibold text-slate-800">Educational Certificates</h4>
                    <p className="mt-1 text-sm text-gray-500">Upload every certificate up to the highest qualification selected above. Each file must be 5 MB or smaller.</p>
                    {!assessorForm.qualification ? (
                      <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Select the highest completed qualification to see the required certificate uploads.</p>
                    ) : (
                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        {qualificationDocuments.slice(0, qualificationLevels.findIndex((level) => level.value === assessorForm.qualification) + 1).map((document) => (
                          <div key={document.field}>
                            <label className={labelClass}>{document.label} *</label>
                            <input key={`${document.field}-${assessorForm.qualification}`} name={document.field} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={(event) => { const file = event.target.files?.[0] || null; setQualificationFiles((previous) => ({ ...previous, [document.field]: file })); }} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm" required />
                            <p className="mt-1 text-xs text-gray-500">PDF, JPG or PNG · Maximum 5 MB</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div><label className={labelClass}>Photograph * (JPG or PNG)</label><input name="photograph" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={(event) => setPhotograph(event.target.files?.[0] || null)} className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm" required /><p className="mt-1 text-xs text-gray-500">Maximum size: 5 MB</p></div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button type="submit" disabled={submittingAssessor} className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{submittingAssessor ? "Submitting..." : "Submit Assessor Application"}</button>
                  <button type="button" disabled={submittingAssessor} onClick={() => { setShowAssessorForm(false); setAssessorForm(initialAssessorForm); setQualificationFiles(initialQualificationFiles); setPhotograph(null); setErrorMessage(""); }} className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                </div>
              </form>
            )}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">My Assessor Applications</h3>
              {loadingAssessors ? <p className="mt-5 text-gray-500">Loading assessor applications...</p> : assessors.length === 0 ? (
                <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center"><p className="font-medium text-gray-700">No assessor applications found.</p><p className="mt-2 text-sm text-gray-500">Select Register New Assessor to submit your first application.</p></div>
              ) : (
                
<div className="mt-5 space-y-6">
  {batches.map((batch) => {
    const batchId = String(batch._id || batch.id || "");

    const batchAssessors = assessors.filter((assessor) => {
      const assessorBatchId =
        assessor.batchId?._id ||
        assessor.batchId?.id ||
        assessor.batchId;

      return String(assessorBatchId || "") === batchId;
    });

    return (
      <div
        key={batchId}
        className="overflow-hidden rounded-xl border border-gray-200"
      >
        {/* Batch heading and total assessor count */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-5">
          <div>
            <h4 className="text-lg font-bold text-slate-800">
              {batch.batchCode || "Batch"}
            </h4>
            <p className="mt-1 text-sm text-gray-600">
              Batch Name: {batch.batchName || "RailTel"}
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-800">
            {batchAssessors.length}{" "}
            {batchAssessors.length === 1 ? "Assessor" : "Assessors"}
          </span>
        </div>

        {/* Assessor details for this batch */}
        <div className="space-y-4 p-5">
          {batchAssessors.length === 0 ? (
            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
              No assessors have been added to this batch yet.
            </p>
          ) : (
            batchAssessors.map((assessor) => (
              <div
                key={assessor._id || assessor.id}
                className="rounded-xl border border-gray-200 p-5"
              >
                
                  
<div className="flex flex-wrap items-start justify-between gap-3">
  <div>
    <h4 className="text-lg font-semibold text-gray-800">
      {assessor.fullName}
    </h4>

    <p className="mt-1 text-sm text-gray-500">
      Assessor ID: {assessor.assessorId || "Not assigned"}
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Qualification: {assessor.qualification || "Not provided"}
    </p>

    <p className="mt-1 text-sm text-gray-500">
      Specialization: {assessor.specialization || "Not provided"}
    </p>
  </div>

  <div className="flex flex-wrap items-center gap-2">
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[assessor.status] ||
        "bg-gray-100 text-gray-700"
      }`}
    >
      {assessor.status || "Pending"}
    </span>

    <button
      type="button"
      onClick={() => {
        setSelectedAssessor(assessor);
        setShowAssessorDetails(true);
      }}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      View Details
    </button>
  </div>
</div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="break-words text-sm text-gray-600">
                    <span className="font-medium">Email: </span>
                    {assessor.email}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile: </span>
                    {assessor.mobile}
                  </p>
                </div>

                {assessor.qualificationCertificatesUploaded && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Uploaded certificates
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {Object.entries({
                        "10th": "tenth",
                        "12th": "twelfth",
                        Graduation: "graduation",
                        "Post Graduation": "postGraduation",
                        PhD: "phd",
                      })
                        .filter(
                          ([, key]) =>
                            assessor.qualificationCertificatesUploaded[key]
                        )
                        .map(([label]) => (
                          <span
                            key={label}
                            className="rounded-full bg-green-100 px-2 py-1 text-green-800"
                          >
                            {label} uploaded
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {assessor.adminRemarks && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-800">
                      Admin Remarks
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                      {assessor.adminRemarks}
                    </p>
                  </div>
                )}

                {assessor.status === "Not Approved" && (
                  <p className="mt-3 text-sm text-gray-600">
                    Please review the admin remarks. Resubmission requires a
                    separate backend endpoint to be enabled.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  })}
</div>

              )}
            </div>
          </div>
        )}

        {activePage === "Batch Confirmation" && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Batch Confirmation</h3>
                <p className="mt-1 text-sm text-gray-500">Review the registered assessor count, then submit each batch to the admin for review.</p>
              </div>
              <button
                type="button"
                onClick={() => { Promise.all([fetchBatches(), fetchAssessors()]); }}
                disabled={loadingBatches || loadingAssessors || Boolean(submittingBatchId)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingBatches || loadingAssessors ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loadingBatches || loadingAssessors ? (
              <p className="mt-5 text-gray-500">Loading batches and assessor counts...</p>
            ) : batches.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">
                <p className="font-medium text-gray-700">No batches found.</p>
                <p className="mt-2 text-sm text-gray-500">Create a batch first, then register at least one assessor before confirming it.</p>
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3">Batch Code</th>
                      <th className="p-3">Batch Name</th>
                      <th className="p-3">Registered Assessors</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => {
                      const batchId = batch._id || batch.id;
                      const assessorCount = assessors.filter(
                        (assessor) => String(assessor.batchId || "") === String(batchId)
                      ).length;
                      const canSubmit = ["Draft", "Pending"].includes(batch.status);
                      const statusClass =
                        batch.status === "Submitted" ? "bg-blue-100 text-blue-800" :
                        batch.status === "Approved" ? "bg-green-100 text-green-800" :
                        batch.status === "Correction Required" ? "bg-red-100 text-red-800" :
                        batch.status === "Under Review" ? "bg-purple-100 text-purple-800" :
                        "bg-amber-100 text-amber-800";

                      return (
                        <tr key={batchId} className="border-b last:border-0">
                          <td className="p-3 font-semibold text-slate-800">{batch.batchCode || "—"}</td>
                          <td className="p-3">{batch.batchName || "RailTel"}</td>
                          <td className="p-3">
                            <span className={assessorCount > 0 ? "font-semibold text-green-700" : "font-semibold text-amber-700"}>
                              {assessorCount}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                              {batch.status || "Pending"}
                            </span>
                          </td>
                          <td className="p-3">
                            {canSubmit ? (
                              <button
                                type="button"
                                onClick={() => handleSubmitBatch(batch)}
                                disabled={assessorCount < 1 || submittingBatchId === String(batchId)}
                                title={assessorCount < 1 ? "Register at least one assessor before submitting this batch" : "Submit batch for admin review"}
                                className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {submittingBatchId === String(batchId) ? "Submitting..." : "Confirm Batch"}
                              </button>
                            ) : batch.status === "Submitted" || batch.status === "Under Review" ? (
                              <span className="whitespace-nowrap text-sm font-medium text-blue-700">Submitted for review</span>
                            ) : batch.status === "Approved" ? (
                              <span className="text-sm font-medium text-green-700">Approved</span>
                            ) : (
                              <span className="text-sm text-gray-500">No action available</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {! ["Dashboard", "Create Batch", "Manage Assessors", "Batch Confirmation"].includes(activePage) && (
          <div className="rounded-xl bg-white p-6 shadow-sm"><h3 className="text-lg font-semibold text-slate-800">{activePage}</h3><p className="mt-2 text-gray-600">This section will be implemented in the next stage.</p></div>
        )}
  {/* Assessor Details Popup */}
        {showAssessorDetails && selectedAssessor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Assessor Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedAssessor.fullName || "Assessor"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowAssessorDetails(false);
                    setSelectedAssessor(null);
                  }}
                  className="rounded-lg px-3 py-2 text-2xl text-gray-500 hover:bg-gray-100"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
                {[
                  ["Full Name", selectedAssessor.fullName],
                  ["Assessor ID", selectedAssessor.assessorId],
                  ["Father's Name", selectedAssessor.fatherName],
                  ["Mother's Name", selectedAssessor.motherName],
                  ["Email", selectedAssessor.email],
                  ["Mobile", selectedAssessor.mobile],
                  ["Gender", selectedAssessor.gender],
                  ["Date of Birth", selectedAssessor.dob],
                  ["Qualification", selectedAssessor.qualification],
                  ["Specialization", selectedAssessor.specialization],
                  ["Experience", selectedAssessor.experience],
                  ["Status", selectedAssessor.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium uppercase text-gray-500">
                      {label}
                    </p>
                    <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                      {value || "Not provided"}
                    </p>
                  </div>
                ))}

                <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Admin Remarks
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-800">
                    {selectedAssessor.adminRemarks || "No remarks"}
                  </p>
                </div>

                {selectedAssessor.qualificationCertificatesUploaded && (
                  <div className="rounded-lg bg-gray-50 p-3 sm:col-span-2">
                    <p className="text-sm font-semibold text-gray-700">
                      Qualification Certificates
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries({
                        "10th": "tenth",
                        "12th": "twelfth",
                        Graduation: "graduation",
                        "Post Graduation": "postGraduation",
                        PhD: "phd",
                      })
                        .filter(
                          ([, key]) =>
                            selectedAssessor.qualificationCertificatesUploaded[key]
                        )
                        .map(([label]) => (
                          <span
                            key={label}
                            className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800"
                          >
                            {label} uploaded
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t p-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssessorDetails(false);
                    setSelectedAssessor(null);
                  }}
                  className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
};

export default TPDashboard;
