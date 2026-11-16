
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";




const API_URL = "/api/toa/batches";
const ASSESSOR_API = "/api/toa/assessors";

const ASSESSOR_RATE = 8000;

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
  { field: "certificate10th", label: "10th Certificate", key: "tenth" },
  {
    field: "certificate12th",
    label: "Intermediate / 12th Certificate",
    key: "twelfth",
  },
  {
    field: "certificateGraduation",
    label: "Graduation Certificate",
    key: "graduation",
  },
  {
    field: "certificatePostGraduation",
    label: "Post Graduation Certificate",
    key: "postGraduation",
  },
  { field: "certificatePhD", label: "PhD Certificate", key: "phd" },
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
  Submitted: "bg-blue-100 text-blue-800",
  "Under Review": "bg-purple-100 text-purple-800",
  "Correction Required": "bg-red-100 text-red-800",
  Draft: "bg-gray-100 text-gray-700",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedCertificateTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const numberToWords = (number) => {
  if (!Number.isFinite(number) || number < 0) return "";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const belowThousand = (value) => {
    let result = "";

    if (value >= 100) {
      result += `${ones[Math.floor(value / 100)]} Hundred`;
      value %= 100;

      if (value > 0) result += " ";
    }

    if (value >= 20) {
      result += tens[Math.floor(value / 10)];

      if (value % 10 > 0) {
        result += ` ${ones[value % 10]}`;
      }
    } else if (value > 0) {
      result += ones[value];
    }

    return result;
  };

  const convert = (value) => {
    if (value === 0) return "Zero";

    const groups = [
      { divisor: 10000000, name: "Crore" },
      { divisor: 100000, name: "Lakh" },
      { divisor: 1000, name: "Thousand" },
      { divisor: 1, name: "" },
    ];

    let remaining = value;
    const parts = [];

    for (const group of groups) {
      const amount = Math.floor(remaining / group.divisor);

      if (amount > 0) {
        parts.push(
          `${belowThousand(amount)}${group.name ? ` ${group.name}` : ""}`
        );
        remaining %= group.divisor;
      }
    }

    return parts.join(" ");
  };

  const wholeRupees = Math.floor(number);
  const paise = Math.round((number - wholeRupees) * 100);

  let result = `Rupees ${convert(wholeRupees)}`;

  if (paise > 0) {
    result += ` and ${convert(paise)} Paise`;
  }

  return `${result} Only`;
};

const getLocalDate = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatInvoiceDate = () => {
  const now = new Date();

  const date = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${date} ${time}`;
};

const TPDashboard = () => {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("Dashboard");
  const [batchDate, setBatchDate] = useState(getLocalDate());
  const [showBatchConfirmation, setShowBatchConfirmation] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [submittingBatchId, setSubmittingBatchId] = useState("");
  const [assessors, setAssessors] = useState([]);
  const [loadingAssessors, setLoadingAssessors] = useState(false);
  const [submittingAssessor, setSubmittingAssessor] = useState(false);

  const [showAssessorForm, setShowAssessorForm] = useState(false);
  const [editingAssessor, setEditingAssessor] = useState(null);
  const [assessorForm, setAssessorForm] = useState(initialAssessorForm);
  const [qualificationFiles, setQualificationFiles] = useState(
    initialQualificationFiles
  );
  const [photograph, setPhotograph] = useState(null);
  const [aadhaarPdf, setAadhaarPdf] = useState(null);
  const [experienceCertificate, setExperienceCertificate] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedAssessor, setSelectedAssessor] = useState(null);
  const [showAssessorDetails, setShowAssessorDetails] = useState(false);

  // Invoice preview state
  const [selectedInvoiceBatch, setSelectedInvoiceBatch] = useState(null);

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

  const getToken = () => localStorage.getItem("toa_tp_token");

  const resetAssessorForm = () => {
    setAssessorForm(initialAssessorForm);
    setQualificationFiles(initialQualificationFiles);
    setPhotograph(null);
    setAadhaarPdf(null);
    setExperienceCertificate(null);
    setEditingAssessor(null);
  };

  const fetchBatches = useCallback(async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoadingBatches(true);

    try {
      const response = await fetch(API_URL, {
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
      setErrorMessage(error.message || "Unable to load batches.");
    } finally {
      setLoadingBatches(false);
    }
  }, []);

  const fetchAssessors = useCallback(async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoadingAssessors(true);

    try {
      const response = await fetch(ASSESSOR_API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load assessor applications."
        );
      }

      setAssessors(data.assessors || []);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to load assessor applications."
      );
    } finally {
      setLoadingAssessors(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    if (
      [
        "Manage Assessors",
        "Batch Confirmation",
        "Invoices & Payments",
      ].includes(activePage)
    ) {
      fetchBatches();
      fetchAssessors();
    }
  }, [activePage, fetchBatches, fetchAssessors]);

  const getBatchId = (assessor) => {
    if (assessor.batchId && typeof assessor.batchId === "object") {
      return String(assessor.batchId._id || assessor.batchId.id || "");
    }

    return String(assessor.batchId || "");
  };

  const getAssessorCount = (batch) => {
    const batchId = String(batch._id || batch.id || "");

    return assessors.filter(
      (assessor) => getBatchId(assessor) === batchId
    ).length;
  };

  const getApprovedAssessorsForBatch = (batch) => {
    const batchId = String(batch._id || batch.id || "");

    return assessors.filter(
      (assessor) =>
        getBatchId(assessor) === batchId &&
        assessor.status === "Approved"
    );
  };

  const getInvoiceAmounts = (batch) => {
    const approvedCount = getApprovedAssessorsForBatch(batch).length;
    const subtotal = approvedCount * ASSESSOR_RATE;
    const total = subtotal;

    return {
      approvedCount,
      rate: ASSESSOR_RATE,
      subtotal,
      total,
    };
  };

  const canCorrectAssessor = (assessor) =>
    assessor.status === "Not Approved" &&
    ["Correction Required", "Under Review"].includes(
      assessor.batchStatus
    );

  const handleCreateBatch = async () => {
    const token = getToken();

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
      setSuccessMessage(
        `Batch ${data.batch.batchCode} created successfully.`
      );
      setActivePage("Dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Unable to create batch.");
    } finally {
      setCreatingBatch(false);
    }
  };

  const handleSubmitBatch = async (batch) => {
    const token = getToken();

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
      setErrorMessage(
        "This batch has already been submitted or cannot be submitted."
      );
      return;
    }

    const count = assessors.filter(
      (assessor) => getBatchId(assessor) === String(batchId)
    ).length;

    if (count < 1) {
      setErrorMessage(
        "Register at least one assessor before confirming this batch."
      );
      return;
    }

    if (
      !window.confirm(
        `Submit ${batch.batchCode} for Admin review? You cannot add new assessors after submission.`
      )
    ) {
      return;
    }

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

      await Promise.all([fetchBatches(), fetchAssessors()]);

      setSuccessMessage(
        `${batch.batchCode} has been submitted for Admin review.`
      );
    } catch (error) {
      setErrorMessage(error.message || "Unable to submit the batch.");
    } finally {
      setSubmittingBatchId("");
    }
  };

  const handleAssessorInput = (event) => {
    const { name, value } = event.target;

    setAssessorForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openNewAssessorForm = () => {
    resetAssessorForm();
    setShowAssessorForm(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const openCorrectionForm = (assessor) => {
    if (assessor.status !== "Not Approved") {
      setErrorMessage("Only rejected assessors can be corrected.");
      return;
    }

    if (
      !["Correction Required", "Under Review"].includes(
        assessor.batchStatus
      )
    ) {
      setErrorMessage(
        "This batch is not currently open for corrections."
      );
      return;
    }

    setEditingAssessor(assessor);

    setAssessorForm({
      batchId:
        typeof assessor.batchId === "object"
          ? assessor.batchId?._id || assessor.batchId?.id || ""
          : assessor.batchId || "",
      fullName: assessor.fullName || "",
      fatherName: assessor.fatherName || "",
      motherName: assessor.motherName || "",
      mobile: assessor.mobile || "",
      email: assessor.email || "",
      gender: assessor.gender || "",
      dateOfBirth: assessor.dateOfBirth || "",
      qualification: assessor.qualification || "",
      experienceYears:
        assessor.experienceYears === undefined
          ? ""
          : String(assessor.experienceYears),
      specialization: assessor.specialization || "",
      address: assessor.address || "",
      idProofDetails: assessor.idProofDetails || "Aadhar",
      aadhaar: "",
    });

    setQualificationFiles(initialQualificationFiles);
    setPhotograph(null);
    setAadhaarPdf(null);
    setExperienceCertificate(null);
    setShowAssessorDetails(false);
    setSelectedAssessor(null);
    setShowAssessorForm(true);
    setActivePage("Manage Assessors");
    setErrorMessage("");
    setSuccessMessage(
      `Editing rejected assessor ${assessor.assessorId}. Correct the details and resubmit.`
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateSelectedFile = (file, label, acceptedTypes) => {
    if (!file) return null;

    if (file.size > MAX_FILE_SIZE) {
      return `${label} must be 5 MB or smaller.`;
    }

    if (!acceptedTypes.includes(file.type)) {
      return `${label} has an unsupported file type.`;
    }

    return null;
  };

  const handleAssessorSubmit = async (event) => {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    const isEditing = Boolean(editingAssessor);

    if (!assessorForm.batchId) {
      setErrorMessage("Please select a batch.");
      return;
    }

    const selectedIndex = qualificationLevels.findIndex(
      (level) => level.value === assessorForm.qualification
    );

    if (selectedIndex < 0) {
      setErrorMessage(
        "Please select the highest completed qualification."
      );
      return;
    }

    const requiredDocuments = qualificationDocuments.slice(
      0,
      selectedIndex + 1
    );

    if (!isEditing) {
      const missingDocument = requiredDocuments.find(
        (document) => !qualificationFiles[document.field]
      );

      if (missingDocument) {
        setErrorMessage(
          `Please upload the ${missingDocument.label.toLowerCase()}.`
        );
        return;
      }

      if (!photograph) {
        setErrorMessage("Please upload the assessor photograph.");
        return;
      }

      if (!aadhaarPdf) {
        setErrorMessage("Please upload the Aadhaar Card PDF.");
        return;
      }

      if (!/^\d{12}$/.test(assessorForm.aadhaar)) {
        setErrorMessage("Enter a valid 12-digit Aadhaar number.");
        return;
      }
    }

    if (!/^[6-9]\d{9}$/.test(assessorForm.mobile.trim())) {
      setErrorMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        assessorForm.email.trim()
      )
    ) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (
      assessorForm.aadhaar &&
      !/^\d{12}$/.test(assessorForm.aadhaar)
    ) {
      setErrorMessage(
        "If changing Aadhaar, enter a valid 12-digit number."
      );
      return;
    }

    if (!isEditing && !assessorForm.aadhaar) {
      setErrorMessage("Enter the 12-digit Aadhaar number.");
      return;
    }

    const fileChecks = [];

    requiredDocuments.forEach((document) => {
      const file = qualificationFiles[document.field];

      if (file) {
        fileChecks.push(
          validateSelectedFile(
            file,
            document.label,
            allowedCertificateTypes
          )
        );
      }
    });

    fileChecks.push(
      validateSelectedFile(photograph, "Photograph", [
        "image/jpeg",
        "image/png",
      ])
    );

    fileChecks.push(
      validateSelectedFile(aadhaarPdf, "Aadhaar Card PDF", [
        "application/pdf",
      ])
    );

    fileChecks.push(
      validateSelectedFile(experienceCertificate, "Experience Certificate", [
        "application/pdf",
      ])
    );

    const fileError = fileChecks.find(Boolean);

    if (fileError) {
      setErrorMessage(fileError);
      return;
    }

    if (isEditing && !editingAssessor?.id && !editingAssessor?._id) {
      setErrorMessage(
        "The assessor record ID is missing. Refresh and try again."
      );
      return;
    }

    setSubmittingAssessor(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();

      Object.entries(assessorForm).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      requiredDocuments.forEach((document) => {
        const file = qualificationFiles[document.field];

        if (file) {
          formData.append(document.field, file);
        }
      });

      if (photograph) {
        formData.append("photograph", photograph);
      }

      if (aadhaarPdf) {
        formData.append("aadhaarPdf", aadhaarPdf);
      }

      if (experienceCertificate) {
        formData.append("experienceCertificate", experienceCertificate);
      }

      const assessorId = editingAssessor?.id || editingAssessor?._id;

      const url = isEditing
        ? `${ASSESSOR_API}/${encodeURIComponent(assessorId)}/resubmit`
        : ASSESSOR_API;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Unable to resubmit corrected assessor."
              : "Unable to submit assessor application.")
        );
      }

      resetAssessorForm();
      setShowAssessorForm(false);

      await Promise.all([fetchAssessors(), fetchBatches()]);

      setSuccessMessage(
        isEditing
          ? `Assessor ${data.assessor?.assessorId || ""} corrected and resubmitted successfully. Status: Pending Admin review.`
          : `Assessor application submitted successfully. Assessor ID: ${data.assessor?.assessorId || "assigned"}. Status: Pending approval.`
      );
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to submit assessor details."
      );
    } finally {
      setSubmittingAssessor(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 7mm;
          }

          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body * {
            visibility: hidden !important;
          }

          .invoice-print-area,
          .invoice-print-area * {
            visibility: visible !important;
          }

          .invoice-print-area {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            zoom: 0.82;
            transform-origin: top left !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            overflow: visible !important;
          }

          .invoice-print-area .mt-4 { margin-top: 5px !important; }
          .invoice-print-area .my-4 { margin-top: 6px !important; margin-bottom: 6px !important; }
          .invoice-print-area .mt-6 { margin-top: 8px !important; }
          .invoice-print-area .mt-8 { margin-top: 8px !important; }
          .invoice-print-area .mt-5 { margin-top: 6px !important; }
          .invoice-print-area .p-4 { padding: 7px !important; }
          .invoice-print-area .p-3 { padding: 6px !important; }
          .invoice-print-area .p-2 { padding: 4px !important; }
          .invoice-print-area img { max-height: 70px !important; }
          .invoice-print-area .min-h-24 { min-height: 45px !important; }
          .invoice-print-area .grid-cols-1 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .invoice-print-area .overflow-x-auto { overflow: visible !important; }
          .invoice-print-area table { table-layout: fixed !important; }
          .invoice-print-area td,
          .invoice-print-area th { overflow-wrap: anywhere !important; }

          .invoice-no-print {
            display: none !important;
          }

          .invoice-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .invoice-table th,
          .invoice-table td {
            border: 1px solid #333 !important;
            padding: 4px !important;
            font-size: 9px !important;
          }
        }
      `}</style>

      <aside className="bg-slate-900 p-5 text-white md:min-h-screen md:w-64 invoice-no-print">
        <h1 className="text-2xl font-bold">TOA Portal</h1>
        <p className="mt-1 text-sm text-slate-300">
          Training Partner Workspace
        </p>

        <nav className="mt-8 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setActivePage(item);
                setErrorMessage("");
                setSuccessMessage("");
                setSelectedInvoiceBatch(null);
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
        <header className="mb-8 invoice-no-print">
          <p className="text-sm text-gray-500">
            TOA Portal / {activePage}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {activePage}
          </h2>
        </header>

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 invoice-no-print"
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 invoice-no-print"
          >
            {successMessage}
          </div>
        )}

        {activePage === "Dashboard" && (
          <>
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">
                Welcome, Training Partner
              </h3>
              <p className="mt-2 text-gray-600">
                Create and manage your RailTel batches and assessor
                applications here.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage("Create Batch")}
                  className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Create a Batch
                </button>
                <button
                  type="button"
                  onClick={() => setActivePage("Manage Assessors")}
                  className="rounded-lg border border-indigo-600 px-5 py-3 font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Manage Assessors
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">
                  Created Batches
                </h3>
                <button
                  type="button"
                  onClick={fetchBatches}
                  disabled={loadingBatches}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingBatches ? "Loading..." : "Refresh"}
                </button>
              </div>

              {loadingBatches ? (
                <p className="mt-5 text-gray-500">Loading batches...</p>
              ) : batches.length === 0 ? (
                <p className="mt-5 text-gray-500">
                  No batches have been created yet.
                </p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-3">Batch Code</th>
                        <th className="p-3">Batch Name</th>
                        <th className="p-3">Generation Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batches.map((batch) => (
                        <tr
                          key={batch._id || batch.id}
                          className="border-b last:border-0"
                        >
                          <td className="p-3 font-semibold text-slate-800">
                            {batch.batchCode}
                          </td>
                          <td className="p-3">{batch.batchName}</td>
                          <td className="p-3">{batch.batchDate}</td>
                          <td className="p-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                statusStyles[batch.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {batch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activePage === "Create Batch" && (
          <div className="max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-slate-800">
              Generate a RailTel Batch
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              The backend generates a unique batch number.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className={labelClass}>Batch Name</label>
                <input
                  value="RailTel"
                  readOnly
                  className={`${inputClass} bg-gray-100`}
                />
              </div>
              <div>
                <label className={labelClass}>Batch Generation Date</label>
                <input
                  type="date"
                  value={batchDate}
                  onChange={(event) => setBatchDate(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");
                  setShowBatchConfirmation(true);
                }}
                className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Generate Batch
              </button>
            </div>

            {showBatchConfirmation && (
              <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                <h3 className="text-xl font-bold text-indigo-900">
                  Confirm Batch Details
                </h3>
                <div className="mt-5 space-y-3 rounded-lg bg-white p-4">
                  <p>
                    <span className="text-sm text-gray-500">Batch Name</span>
                    <br />
                    <strong>RailTel</strong>
                  </p>
                  <p>
                    <span className="text-sm text-gray-500">
                      Batch Generation Date
                    </span>
                    <br />
                    <strong>{batchDate}</strong>
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={creatingBatch}
                    onClick={() => setShowBatchConfirmation(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700"
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    disabled={creatingBatch}
                    onClick={handleCreateBatch}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
                  >
                    {creatingBatch ? "Creating..." : "Confirm & Create Batch"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === "Manage Assessors" && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Manage Assessors
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Register assessors, correct rejected applications, and
                    track Admin approval.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      Promise.all([fetchAssessors(), fetchBatches()])
                    }
                    disabled={loadingAssessors}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold"
                  >
                    {loadingAssessors ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (showAssessorForm) {
                        resetAssessorForm();
                        setShowAssessorForm(false);
                      } else {
                        openNewAssessorForm();
                      }
                    }}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {showAssessorForm
                      ? "Close Form"
                      : "Register New Assessor"}
                  </button>
                </div>
              </div>
            </div>

            {showAssessorForm && (
              <form
                onSubmit={handleAssessorSubmit}
                className="rounded-xl bg-white p-6 shadow-sm sm:p-8"
              >
                <h3 className="mb-4 text-xl font-semibold text-slate-800">
                  {editingAssessor
                    ? `Correct Assessor: ${editingAssessor.assessorId}`
                    : "Assessor Registration Form"}
                </h3>

                {editingAssessor && (
                  <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-semibold">
                      Correction requested by Admin
                    </p>
                    <p className="mt-2 whitespace-pre-wrap">
                      {editingAssessor.adminRemarks ||
                        "Please check and correct the assessor details."}
                    </p>
                    <p className="mt-2">
                      Existing assessor ID and batch assignment will be
                      retained. Leave Aadhaar blank to keep the currently
                      stored last four digits.
                    </p>
                  </div>
                )}

                {!editingAssessor && (
                  <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    Only the last four Aadhaar digits are stored by the
                    backend. Aadhaar PDF is required for new registrations.
                  </p>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Select Batch *</label>
                    <select
                      name="batchId"
                      value={assessorForm.batchId}
                      onChange={handleAssessorInput}
                      className={inputClass}
                      required
                      disabled={Boolean(editingAssessor)}
                    >
                      <option value="">Select a batch</option>
                      {batches
                        .filter((batch) =>
                          editingAssessor
                            ? String(batch._id || batch.id) ===
                              String(assessorForm.batchId)
                            : ["Pending", "Draft"].includes(batch.status)
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
                  </div>

                  {[
                    ["fullName", "Full Name"],
                    ["fatherName", "Father's Name"],
                    ["motherName", "Mother's Name"],
                    ["mobile", "Mobile Number"],
                    ["email", "Email Address"],
                    ["specialization", "Trade / Job-Role Specialization"],
                  ].map(([name, label]) => (
                    <div key={name}>
                      <label className={labelClass}>{label} *</label>
                      <input
                        name={name}
                        type={name === "email" ? "email" : "text"}
                        value={assessorForm[name]}
                        onChange={handleAssessorInput}
                        className={inputClass}
                        required
                      />
                    </div>
                  ))}

                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select
                      name="gender"
                      value={assessorForm.gender}
                      onChange={handleAssessorInput}
                      className={inputClass}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input
                      name="dateOfBirth"
                      type="date"
                      value={assessorForm.dateOfBirth}
                      onChange={handleAssessorInput}
                      max={getLocalDate()}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Highest Completed Qualification *
                    </label>
                    <select
                      name="qualification"
                      value={assessorForm.qualification}
                      onChange={handleAssessorInput}
                      className={inputClass}
                      required
                    >
                      <option value="">Select qualification</option>
                      {qualificationLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Experience (years) *</label>
                    <input
                      name="experienceYears"
                      type="number"
                      min="0"
                      max="70"
                      step="0.5"
                      value={assessorForm.experienceYears}
                      onChange={handleAssessorInput}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>ID Proof Details</label>
                    <input
                      name="idProofDetails"
                      value="Aadhaar"
                      readOnly
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Aadhaar Number {editingAssessor ? "(Optional)" : "*"}
                    </label>
                    <input
                      name="aadhaar"
                      type="password"
                      inputMode="numeric"
                      maxLength={12}
                      autoComplete="off"
                      value={assessorForm.aadhaar}
                      onChange={handleAssessorInput}
                      placeholder={
                        editingAssessor
                          ? "Leave blank to retain existing Aadhaar"
                          : "12-digit Aadhaar number"
                      }
                      className={inputClass}
                      required={!editingAssessor}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The full Aadhaar number is not returned by the server.
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Address *</label>
                    <textarea
                      name="address"
                      rows={3}
                      value={assessorForm.address}
                      onChange={handleAssessorInput}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <h4 className="text-lg font-semibold text-slate-800">
                      Educational Certificates
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {editingAssessor
                        ? "Existing documents will be retained if you do not upload replacements. Upload any missing certificates required for the selected qualification."
                        : "Upload every certificate up to the selected qualification. Each file must be 5 MB or smaller."}
                    </p>

                    {assessorForm.qualification && (
                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        {qualificationDocuments
                          .slice(
                            0,
                            qualificationLevels.findIndex(
                              (level) =>
                                level.value === assessorForm.qualification
                            ) + 1
                          )
                          .map((document) => {
                            const existingUploaded =
                              editingAssessor
                                ?.qualificationCertificatesUploaded?.[
                                  document.key
                                ];

                            return (
                              <div key={document.field}>
                                <label className={labelClass}>
                                  {document.label}{" "}
                                  {!editingAssessor ? "*" : "(Optional)"}
                                </label>

                                {editingAssessor && existingUploaded && (
                                  <p className="mb-2 text-xs font-medium text-green-700">
                                    Existing certificate available
                                  </p>
                                )}

                                <input
                                  name={document.field}
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                  onChange={(event) =>
                                    setQualificationFiles((previous) => ({
                                      ...previous,
                                      [document.field]:
                                        event.target.files?.[0] || null,
                                    }))
                                  }
                                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                                  required={
                                    !editingAssessor &&
                                    !qualificationFiles[document.field]
                                  }
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                  PDF, JPG or PNG · Maximum 5 MB
                                </p>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      Photograph{" "}
                      {editingAssessor ? "(Optional replacement)" : "*"}
                    </label>
                    {editingAssessor && editingAssessor.photographUploaded && (
                      <p className="mb-2 text-xs font-medium text-green-700">
                        Existing photograph available
                      </p>
                    )}
                    <input
                      name="photograph"
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={(event) =>
                        setPhotograph(event.target.files?.[0] || null)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                      required={!editingAssessor && !photograph}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      JPG or PNG · Maximum 5 MB
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Aadhaar Card PDF{" "}
                      {editingAssessor ? "(Optional replacement)" : "*"}
                    </label>
                    {editingAssessor && editingAssessor.aadhaarPdfUploaded && (
                      <p className="mb-2 text-xs font-medium text-green-700">
                        Existing Aadhaar PDF available
                      </p>
                    )}
                    <input
                      name="aadhaarPdf"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        setAadhaarPdf(event.target.files?.[0] || null)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                      required={!editingAssessor && !aadhaarPdf}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      PDF only · Maximum 5 MB
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Experience Certificate PDF (Optional)
                    </label>
                    {editingAssessor &&
                      editingAssessor.experienceCertificateUploaded && (
                        <p className="mb-2 text-xs font-medium text-green-700">
                          Existing experience certificate available
                        </p>
                      )}
                    <input
                      name="experienceCertificate"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(event) =>
                        setExperienceCertificate(
                          event.target.files?.[0] || null
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      PDF only · Maximum 5 MB
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submittingAssessor}
                    className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingAssessor
                      ? "Submitting..."
                      : editingAssessor
                      ? "Resubmit to Admin"
                      : "Submit Assessor Application"}
                  </button>

                  <button
                    type="button"
                    disabled={submittingAssessor}
                    onClick={() => {
                      resetAssessorForm();
                      setShowAssessorForm(false);
                      setErrorMessage("");
                    }}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">
                My Assessor Applications
              </h3>

              {loadingAssessors ? (
                <p className="mt-5 text-gray-500">
                  Loading assessor applications...
                </p>
              ) : assessors.length === 0 ? (
                <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">
                  No assessor applications found.
                </div>
              ) : (
                <div className="mt-5 space-y-6">
                  {batches.map((batch) => {
                    const batchId = String(batch._id || batch.id || "");

                    const batchAssessors = assessors.filter(
                      (assessor) => getBatchId(assessor) === batchId
                    );

                    return (
                      <div
                        key={batchId}
                        className="overflow-hidden rounded-xl border border-gray-200"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-5">
                          <div>
                            <h4 className="text-lg font-bold text-slate-800">
                              {batch.batchCode || "Batch"}
                            </h4>
                            <p className="mt-1 text-sm text-gray-600">
                              Batch Name: {batch.batchName || "RailTel"}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">
                              Batch Status: {batch.status}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-800">
                            {batchAssessors.length}{" "}
                            {batchAssessors.length === 1
                              ? "Assessor"
                              : "Assessors"}
                          </span>
                        </div>

                        <div className="space-y-4 p-5">
                          {batchAssessors.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                              No assessors have been added to this batch.
                            </p>
                          ) : (
                            batchAssessors.map((assessor) => (
                              <div
                                key={assessor.id || assessor._id}
                                className="rounded-xl border border-gray-200 p-5"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <h4 className="text-lg font-semibold text-gray-800">
                                      {assessor.fullName}
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Assessor ID: {assessor.assessorId}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Qualification: {assessor.qualification}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                      Specialization: {assessor.specialization}
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

                                    {canCorrectAssessor(assessor) && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openCorrectionForm(assessor)
                                        }
                                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                                      >
                                        Edit & Correct
                                      </button>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  <p className="break-words text-sm text-gray-600">
                                    <strong>Email: </strong>
                                    {assessor.email}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <strong>Mobile: </strong>
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
                                            assessor
                                              .qualificationCertificatesUploaded[
                                              key
                                            ]
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

                                {assessor.status === "Not Approved" &&
                                  !canCorrectAssessor(assessor) && (
                                    <p className="mt-3 text-sm text-gray-600">
                                      This batch is not currently open for
                                      corrections. Refresh the batch status
                                      or contact Admin.
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
                <h3 className="text-xl font-semibold text-slate-800">
                  Batch Confirmation
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Submit new batches for review and monitor correction status.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  Promise.all([fetchBatches(), fetchAssessors()])
                }
                disabled={loadingBatches || loadingAssessors}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Refresh
              </button>
            </div>

            {loadingBatches || loadingAssessors ? (
              <p className="mt-5 text-gray-500">Loading batches...</p>
            ) : batches.length === 0 ? (
              <p className="mt-5 text-gray-500">No batches found.</p>
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
                      const assessorCount = getAssessorCount(batch);
                      const canSubmit = ["Draft", "Pending"].includes(
                        batch.status
                      );

                      return (
                        <tr
                          key={batchId}
                          className="border-b last:border-0"
                        >
                          <td className="p-3 font-semibold text-slate-800">
                            {batch.batchCode || "—"}
                          </td>
                          <td className="p-3">
                            {batch.batchName || "RailTel"}
                          </td>
                          <td className="p-3">{assessorCount}</td>
                          <td className="p-3">
                            <span
                              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[batch.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {batch.status || "Pending"}
                            </span>
                          </td>
                          <td className="p-3">
                            {canSubmit ? (
                              <button
                                type="button"
                                onClick={() => handleSubmitBatch(batch)}
                                disabled={
                                  assessorCount < 1 ||
                                  submittingBatchId === String(batchId)
                                }
                                className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
                              >
                                {submittingBatchId === String(batchId)
                                  ? "Submitting..."
                                  : "Confirm Batch"}
                              </button>
                            ) : batch.status === "Correction Required" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setActivePage("Manage Assessors")
                                }
                                className="whitespace-nowrap rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white"
                              >
                                Correct Assessors
                              </button>
                            ) : batch.status === "Approved" ? (
                              <span className="text-sm font-medium text-green-700">
                                Approved
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-blue-700">
                                Submitted for review
                              </span>
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

        {activePage === "Invoices & Payments" && (
          <div className="space-y-6">
            {!selectedInvoiceBatch && (
              <div className="rounded-xl bg-white p-6 shadow-sm invoice-no-print">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      Proforma Invoices
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Invoices are available for batches approved by Admin.
                      The amount is calculated using approved assessors only.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      Promise.all([fetchBatches(), fetchAssessors()])
                    }
                    disabled={loadingBatches || loadingAssessors}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                  >
                    {loadingBatches || loadingAssessors
                      ? "Refreshing..."
                      : "Refresh"}
                  </button>
                </div>

                {loadingBatches || loadingAssessors ? (
                  <p className="mt-5 text-gray-500">
                    Loading invoice information...
                  </p>
                ) : (
                  <>
                    {batches.filter((batch) => batch.status === "Approved")
                      .length === 0 ? (
                      <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center">
                        <h4 className="font-semibold text-gray-700">
                          No approved batches yet
                        </h4>
                        <p className="mt-2 text-sm text-gray-500">
                          A proforma invoice will appear here after Admin
                          approves a batch.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="p-3">Batch Code</th>
                              <th className="p-3">Batch Name</th>
                              <th className="p-3">Approved Assessors</th>
                              <th className="p-3">Total Amount</th>
                              <th className="p-3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batches
                              .filter((batch) => batch.status === "Approved")
                              .map((batch) => {
                                const amounts = getInvoiceAmounts(batch);

                                return (
                                  <tr
                                    key={batch._id || batch.id}
                                    className="border-b last:border-0"
                                  >
                                    <td className="p-3 font-semibold">
                                      {batch.batchCode || "—"}
                                    </td>
                                    <td className="p-3">
                                      {batch.batchName || "RailTel"}
                                    </td>
                                    <td className="p-3">
                                      {amounts.approvedCount}
                                    </td>
                                    <td className="p-3 font-semibold">
                                      {formatINR(amounts.total)}
                                    </td>
                                    <td className="p-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setSelectedInvoiceBatch(batch)
                                        }
                                        disabled={amounts.approvedCount === 0}
                                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                                      >
                                        View Invoice
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {selectedInvoiceBatch && (() => {
              const batch = selectedInvoiceBatch;
              const amounts = getInvoiceAmounts(batch);
              const invoiceNumber = `TOA/PROFORMA/${String(
                batch.batchCode || batch._id || "BATCH"
              ).replace(/[^a-zA-Z0-9-]/g, "-")}`;

              return (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 invoice-no-print">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceBatch(null)}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      ← Back to Invoices
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintInvoice}
                      className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Save & Print
                    </button>
                  </div>

                  <div className="invoice-print-area mx-auto max-w-5xl border border-gray-300 bg-white p-5 text-black shadow-sm sm:p-8">
                    <div className="flex items-center justify-center border-b-2 border-black pb-4">
                      <img
                        src="/logo.png"
                        alt="Centurion University of Technology and Management Logo"
                        className="mx-auto block h-auto max-h-28 max-w-full object-contain"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="mt-4 border border-black">
                      <div className="border-b border-black p-3 text-center text-xl font-bold tracking-wide">
                        PROFORMA INVOICE
                      </div>

                      <div className="grid grid-cols-1 border-b border-black sm:grid-cols-2">
                        <div className="border-b border-black p-3 text-sm sm:border-b-0 sm:border-r">
                          <strong>Invoice No:</strong> {invoiceNumber}
                        </div>
                        <div className="p-3 text-sm">
                          <strong>Date:</strong> {formatInvoiceDate()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="border-b border-black p-4 text-sm leading-6 sm:border-b-0 sm:border-r">
                          <p className="mb-1 font-bold">To</p>
                          <p className="font-bold">HI2AI</p>
                          <p>Address: 204B, Block 3B, DDA HIG Flats</p>
                          <p>City: New Delhi</p>
                          <p>State: Delhi</p>
                          <p>Pin: 110055</p>
                        </div>

                        <div className="p-4 text-sm leading-6">
                          <p className="mb-1 font-bold">From</p>
                          <p className="font-bold">
                            CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT
                          </p>
                          <p>CIT Campus, Ramachandrapur, Jatni</p>
                          <p>Pin: 752050, Distt - Khordha</p>
                          <p>Odisha</p>
                          <p>Contact Person: Subrat Kumar Sahu</p>
                          <p>Contact: +91-7008811021</p>
                        </div>
                      </div>
                    </div>

                    <p className="my-4 text-sm leading-6">
                      <strong>Dear Sir,</strong> Kindly arrange to pay the
                      below amount towards the assessment fee.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="invoice-table w-full border-collapse text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-black p-2">Sl No</th>
                            <th className="border border-black p-2">
                              Description
                            </th>
                            <th className="border border-black p-2">
                              No. of Assessors
                            </th>
                            <th className="border border-black p-2">
                              Price per Assessor
                            </th>
                            <th className="border border-black p-2">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-black p-2">01</td>
                            <td className="border border-black p-2 leading-5">
                              <strong>Organisation:</strong> HI2AI
                              <br />
                              <strong>Assessment of Batch No.:</strong>{" "}
                              {batch.batchCode || "—"}
                              <br />
                              <strong>Batch Name:</strong>{" "}
                              {batch.batchName || "RailTel"}
                              <br />
                              
                            </td>
                            <td className="border border-black p-2 text-center">
                              {amounts.approvedCount}
                            </td>
                            <td className="border border-black p-2 text-right">
                              {formatINR(amounts.rate)}
                            </td>
                            <td className="border border-black p-2 text-right">
                              {formatINR(amounts.subtotal)}
                            </td>
                          </tr>

                          <tr className="bg-gray-100">
                            <td
                              colSpan={4}
                              className="border border-black p-2 text-right font-bold"
                            >
                              Total Amount
                            </td>
                            <td className="border border-black p-2 text-right font-bold">
                              {formatINR(amounts.total)}
                            </td>
                          </tr>

                          <tr>
                            <td
                              colSpan={5}
                              className="border border-black p-2 font-semibold"
                            >
                              Total Amount in Words: {numberToWords(amounts.total)}
                            </td>
                          </tr>

                          <tr>
                            <td
                              colSpan={5}
                              className="border border-black p-2 text-center font-semibold"
                            >
                              The amount including all taxes.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6">
                      <p className="mb-2 text-sm font-bold">
                        Please note the following details for transfer of funds
                      </p>

                      <table className="invoice-table w-full border-collapse text-sm">
                        <tbody>
                          {[
                            ["Bank", "AXIS Bank"],
                            [
                              "In Favour Of",
                              "CENTURION UNIVERSITY OF TECHNOLOGY AND MANAGEMENT",
                            ],
                            ["Branch Address", "Jatni"],
                            ["Account Type", "Current Account"],
                            ["Account No", "925020007436613"],
                            ["MICR Code", "751211006"],
                            ["IFSC", "UTIB0000718"],
                            ["PAN No", "AAAJC0752B"],
                            ["GST No", "21AAAJC0752B1Z8"],
                          ].map(([label, value]) => (
                            <tr key={label}>
                              <td className="w-1/3 border border-black p-2 font-semibold">
                                {label}
                              </td>
                              <td className="border border-black p-2">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                   
<div className="mt-5 grid grid-cols-2 gap-4">
                      <div className="col-span-2 flex min-h-24 flex-col items-end justify-end p-2 text-center">
                        <img
                          src="/Partha_sir_signature.png"
                          alt="Authorised Signature"
                          className="mb-2 block h-[50px] w-[150px] object-contain"
                        />
                        <div className="w-48 border-t border-black pt-2 text-xs font-bold">
                          Authorised Signatory
                        </div>
                      </div>
                    </div>


                    <p className="mt-5 text-center text-xs text-gray-500">
                      This is a proforma invoice generated for the selected
                      approved batch.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {[
          "Results & Certificates",
          "Organisation Profile",
        ].includes(activePage) && (
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              {activePage}
            </h3>
            <p className="mt-2 text-gray-600">
              This section will be implemented in the next stage.
            </p>
          </div>
        )}

        {showAssessorDetails && selectedAssessor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 invoice-no-print">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Assessor Details
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedAssessor.fullName}
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
                  ["Date of Birth", selectedAssessor.dateOfBirth],
                  ["Qualification", selectedAssessor.qualification],
                  ["Specialization", selectedAssessor.specialization],
                  ["Experience", selectedAssessor.experienceYears],
                  ["Status", selectedAssessor.status],
                  [
                    "Aadhaar",
                    selectedAssessor.aadhaarLast4
                      ? `XXXX-XXXX-${selectedAssessor.aadhaarLast4}`
                      : "Not available",
                  ],
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
                            selectedAssessor
                              .qualificationCertificatesUploaded[key]
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
