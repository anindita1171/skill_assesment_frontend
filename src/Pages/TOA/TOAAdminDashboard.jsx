
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/toa/admin";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  "Not Approved": "bg-red-100 text-red-800",
};

const batchStatusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-800",
  "Under Review": "bg-purple-100 text-purple-800",
  "Correction Required": "bg-red-100 text-red-800",
  Approved: "bg-green-100 text-green-800",
};

const qualificationDocuments = [
  { key: "tenth", label: "10th Certificate" },
  { key: "twelfth", label: "12th / Intermediate Certificate" },
  { key: "graduation", label: "Graduation Certificate" },
  { key: "postGraduation", label: "Post Graduation Certificate" },
  { key: "phd", label: "PhD Certificate" },
];

const TOAAdminDashboard = () => {
  const navigate = useNavigate();

  const [batches, setBatches] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [remarks, setRemarks] = useState({});
  const [submittingId, setSubmittingId] = useState("");
  const [openingDocument, setOpeningDocument] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem("toa_admin_token");
    localStorage.removeItem("toa_admin_user");
    navigate("/toa");
  }, [navigate]);

  const loadDashboard = useCallback(async () => {
    const token = localStorage.getItem("toa_admin_token");

    if (!token) {
      navigate("/toa");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Always fetch all assessors. Filtering is done in the UI
      // so pending assessors are never hidden from batch readiness.
      const [batchResponse, assessorResponse] = await Promise.all([
        fetch(`${API_URL}/batches`, { headers }),
        fetch(`${API_URL}/assessors`, { headers }),
      ]);

      if (
        [batchResponse.status, assessorResponse.status].some(
          (status) => status === 401 || status === 403
        )
      ) {
        logout();
        return;
      }

      const [batchData, assessorData] = await Promise.all([
        batchResponse.json(),
        assessorResponse.json(),
      ]);

      if (!batchResponse.ok || !batchData.success) {
        throw new Error(
          batchData.message || "Unable to load batches."
        );
      }

      if (!assessorResponse.ok || !assessorData.success) {
        throw new Error(
          assessorData.message || "Unable to load assessors."
        );
      }

      const nextBatches = Array.isArray(batchData.batches)
        ? batchData.batches
        : [];

      setBatches(nextBatches);
      setAssessors(
        Array.isArray(assessorData.assessors)
          ? assessorData.assessors
          : []
      );

      // Keep the selected batch synchronized after a review action.
      setSelectedBatch((previous) => {
        if (!previous) return null;

        const previousId = String(
          previous.id || previous._id || ""
        );

        const updated = nextBatches.find(
          (batch) =>
            String(batch.id || batch._id || "") === previousId
        );

        return updated || previous;
      });
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to connect to the TOA backend."
      );
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getAssessorBatchId = (assessor) => {
    if (assessor.batch?.id) {
      return String(assessor.batch.id);
    }

    if (assessor.batch?._id) {
      return String(assessor.batch._id);
    }

    if (typeof assessor.batchId === "string") {
      return assessor.batchId;
    }

    if (assessor.batchId?._id) {
      return String(assessor.batchId._id);
    }

    return "";
  };

  // All assessors belonging to the selected batch, regardless of filter.
  const allAssessorsInBatch = useMemo(() => {
    if (!selectedBatch) return [];

    const selectedBatchId = String(
      selectedBatch.id || selectedBatch._id || ""
    );

    return assessors.filter(
      (assessor) =>
        getAssessorBatchId(assessor) === selectedBatchId
    );
  }, [assessors, selectedBatch]);

  // The status filter only affects what is displayed, not batch readiness.
  const displayedAssessors = useMemo(() => {
    if (filter === "All") return allAssessorsInBatch;

    return allAssessorsInBatch.filter(
      (assessor) => assessor.status === filter
    );
  }, [allAssessorsInBatch, filter]);

  const assessorCounts = useMemo(
    () => ({
      All: allAssessorsInBatch.length,
      Pending: allAssessorsInBatch.filter(
        (item) => item.status === "Pending"
      ).length,
      Approved: allAssessorsInBatch.filter(
        (item) => item.status === "Approved"
      ).length,
      "Not Approved": allAssessorsInBatch.filter(
        (item) => item.status === "Not Approved"
      ).length,
    }),
    [allAssessorsInBatch]
  );

  const batchCounts = useMemo(
    () => ({
      batches: batches.length,
      assessors: batches.reduce(
        (total, batch) => total + Number(batch.assessorCount || 0),
        0
      ),
      pending: assessors.filter(
        (item) => item.status === "Pending"
      ).length,
      approved: assessors.filter(
        (item) => item.status === "Approved"
      ).length,
    }),
    [batches, assessors]
  );

  const batchHasPendingAssessors = allAssessorsInBatch.some(
    (assessor) => assessor.status === "Pending"
  );

  const batchReviewReady =
    allAssessorsInBatch.length > 0 &&
    !batchHasPendingAssessors &&
    allAssessorsInBatch.every((assessor) =>
      ["Approved", "Not Approved"].includes(assessor.status)
    );

  const openAssessorDocument = async (
    assessorId,
    documentType
  ) => {
    const token = localStorage.getItem("toa_admin_token");

    if (!token) {
      logout();
      return;
    }

    const requestKey = `${assessorId}-${documentType}`;

    setOpeningDocument(requestKey);
    setErrorMessage("");

    // Open the tab directly from the click to avoid popup blocking.
    const previewTab = window.open("about:blank", "_blank");

    if (!previewTab) {
      setOpeningDocument("");
      setErrorMessage(
        "Your browser blocked the document preview. Allow pop-ups for this site and try again."
      );
      return;
    }

    try {
      previewTab.document.title = "Loading document";
      previewTab.document.body.textContent = "Loading document...";

      const response = await fetch(
        `${API_URL}/assessors/${encodeURIComponent(
          assessorId
        )}/documents/${encodeURIComponent(documentType)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401 || response.status === 403) {
        previewTab.close();
        logout();
        return;
      }

      if (!response.ok) {
        let message = "Unable to open this document.";

        try {
          const data = await response.json();
          message = data.message || message;
        } catch {
          // Keep the default error message.
        }

        previewTab.close();
        setErrorMessage(message);
        return;
      }

      const blob = await response.blob();

      const supportedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!supportedTypes.includes(blob.type)) {
        previewTab.close();
        setErrorMessage(
          "Only PDF, JPG and PNG documents can be previewed."
        );
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      previewTab.location.href = objectUrl;

      previewTab.addEventListener(
        "unload",
        () => URL.revokeObjectURL(objectUrl),
        { once: true }
      );
    } catch (error) {
      if (previewTab && !previewTab.closed) {
        previewTab.close();
      }

      setErrorMessage(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setOpeningDocument("");
    }
  };

  const handleReview = async (assessor, status) => {
    const assessorId = assessor._id || assessor.id;

    if (!assessorId) {
      setErrorMessage("The assessor record does not contain an ID.");
      return;
    }

    const reviewRemarks = (remarks[assessorId] || "").trim();

    if (status === "Not Approved" && !reviewRemarks) {
      setErrorMessage(
        "Please enter the reason for rejecting this application."
      );
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to mark ${
          assessor.fullName || "this assessor"
        }'s application as "${status}"?`
      )
    ) {
      return;
    }

    const token = localStorage.getItem("toa_admin_token");

    if (!token) {
      logout();
      return;
    }

    setSubmittingId(assessorId);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/assessors/${encodeURIComponent(
          assessorId
        )}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            remarks: reviewRemarks,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update the application."
        );
      }

      setActionMessage(
        `${assessor.fullName || "Assessor"}'s application has been marked ${status}.`
      );

      setReviewingId("");
      setRemarks((previous) => ({
        ...previous,
        [assessorId]: "",
      }));

      await loadDashboard();
    } catch (error) {
      setErrorMessage(
        error.message || "Review failed. Please try again."
      );
    } finally {
      setSubmittingId("");
    }
  };

  const handleSubmitBatchReview = async () => {
    if (!selectedBatch) return;

    const batchId = selectedBatch.id || selectedBatch._id;

    if (!batchId) {
      setErrorMessage("The batch record does not contain an ID.");
      return;
    }

    if (!batchReviewReady) {
      setErrorMessage(
        batchHasPendingAssessors
          ? "Review every Pending assessor before submitting the batch review."
          : "This batch does not have any assessors ready for review submission."
      );
      return;
    }

    if (
      !window.confirm(
        "Submit the completed assessor review to the Training Partner? If any assessor is Not Approved, the batch will be returned for corrections."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("toa_admin_token");

    if (!token) {
      logout();
      return;
    }

    const requestId = `batch-${batchId}`;

    setSubmittingId(requestId);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/batches/${encodeURIComponent(
          batchId
        )}/submit-review`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit the batch review."
        );
      }

      setActionMessage(
        data.message ||
          "The batch review has been submitted successfully."
      );

      await loadDashboard();
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to submit the batch review."
      );
    } finally {
      setSubmittingId("");
    }
  };

  const showBatch = (batch) => {
    setSelectedBatch(batch);
    setFilter("All");
    setReviewingId("");
    setErrorMessage("");
    setActionMessage("");
  };

  const showBatches = () => {
    setSelectedBatch(null);
    setFilter("All");
    setReviewingId("");
    setErrorMessage("");
    setActionMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white shadow">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              TOA Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-indigo-100">
              Training Organisation / Awarding Body Portal
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {actionMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {actionMessage}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading TOA Admin Dashboard...
          </div>
        ) : !selectedBatch ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Batch Management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a batch to review its assessor applications and
                supporting documents.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                { label: "Total Batches", value: batchCounts.batches },
                {
                  label: "Total Assessors",
                  value: batchCounts.assessors,
                },
                {
                  label: "Pending Assessors",
                  value: batchCounts.pending,
                },
                {
                  label: "Approved Assessors",
                  value: batchCounts.approved,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {batches.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <h3 className="font-semibold text-gray-700">
                  No batches found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Batches will appear here after they are created by a
                  Training Partner.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-5">
                  <h3 className="font-bold text-gray-800">
                    All Batches
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Batch Number",
                          "Batch Code",
                          "Batch Name",
                          "Batch Date",
                          "Training Partner",
                          "Assessors",
                          "Batch Status",
                          "Action",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {batches.map((batch) => (
                        <tr
                          key={batch.id || batch._id}
                          className="hover:bg-indigo-50/40"
                        >
                          <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-gray-800">
                            Batch {batch.batchNumber ?? "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {batch.batchCode || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {batch.batchName || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {batch.batchDate || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                            {batch.trainingPartner || "Unknown TP"}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-gray-800">
                            {batch.assessorCount ?? 0}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${
                                batchStatusStyles[batch.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {batch.status || "Unknown"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-4">
                            <button
                              type="button"
                              onClick={() => showBatch(batch)}
                              className="rounded-lg bg-indigo-700 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                            >
                              View Assessors
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={showBatches}
                  className="mb-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  ← Back to Batches
                </button>

                <h2 className="text-xl font-bold text-gray-800">
                  Assessors — Batch {selectedBatch.batchNumber}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedBatch.batchCode} · {selectedBatch.batchName} ·{" "}
                  {selectedBatch.batchDate}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    batchStatusStyles[selectedBatch.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedBatch.status || "Unknown"}
                </span>

                {["Submitted", "Under Review"].includes(
                  selectedBatch.status
                ) && (
                  <button
                    type="button"
                    onClick={handleSubmitBatchReview}
                    disabled={
                      Boolean(submittingId) ||
                      !batchReviewReady
                    }
                    title={
                      batchHasPendingAssessors
                        ? "Review every Pending assessor first."
                        : !batchReviewReady
                          ? "At least one assessor is required."
                          : "Submit the completed review to the TP."
                    }
                    className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submittingId ===
                    `batch-${selectedBatch.id || selectedBatch._id}`
                      ? "Submitting..."
                      : "Submit Review to TP"}
                  </button>
                )}
              </div>
            </div>

            {["Submitted", "Under Review"].includes(
              selectedBatch.status
            ) && (
              <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
                {batchHasPendingAssessors ? (
                  <>
                    <strong>Review in progress.</strong> Review all{" "}
                    {assessorCounts.Pending} Pending assessor application(s)
                    before submitting the batch review.
                  </>
                ) : batchReviewReady ? (
                  <>
                    <strong>Review completed.</strong> Every assessor has
                    been reviewed. You can now submit the batch review to
                    the Training Partner.
                  </>
                ) : (
                  <>
                    <strong>No assessors available.</strong> The batch must
                    contain at least one assessor before the review can be
                    submitted.
                  </>
                )}
              </div>
            )}

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: "Applications",
                  value: assessorCounts.All,
                },
                {
                  label: "Pending",
                  value: assessorCounts.Pending,
                },
                {
                  label: "Approved",
                  value: assessorCounts.Approved,
                },
                {
                  label: "Not Approved",
                  value: assessorCounts["Not Approved"],
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {["All", "Pending", "Approved", "Not Approved"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setFilter(status);
                      setActionMessage("");
                      setErrorMessage("");
                    }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      filter === status
                        ? "bg-indigo-700 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                    {" ("}
                    {assessorCounts[status]}
                    {")"}
                  </button>
                )
              )}
            </div>

            {displayedAssessors.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <h3 className="font-semibold text-gray-700">
                  No assessor applications found in this batch
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try another status filter or return to the batch list.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {displayedAssessors.map((assessor) => {
                  const id = assessor._id || assessor.id;
                  const status = assessor.status || "Pending";
                  const isPending = status === "Pending";
                  const documents = assessor.documents || {};

                  const hasLegacyQualification =
                    Boolean(
                      assessor.qualificationCertificateUploaded
                    ) ||
                    Boolean(assessor.hasQualificationCertificate) ||
                    Boolean(assessor.qualificationCertificatePath);

                  const hasAnyIndividualCertificate =
                    qualificationDocuments.some((document) =>
                      Boolean(documents[document.key])
                    );

                  const trainingPartner =
                    assessor.trainingPartner ||
                    assessor.createdBy?.username ||
                    "Not available";

                  return (
                    <section
                      key={id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-5">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {assessor.fullName || "Name not available"}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Assessor ID:{" "}
                            {assessor.assessorId || "Not assigned"}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Training Partner: {trainingPartner}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          ["Father's Name", assessor.fatherName],
                          ["Mother's Name", assessor.motherName],
                          ["Mobile", assessor.mobile],
                          ["Email", assessor.email],
                          ["Gender", assessor.gender],
                          ["Date of Birth", assessor.dateOfBirth],
                          ["Qualification", assessor.qualification],
                          [
                            "Experience (years)",
                            assessor.experienceYears,
                          ],
                          ["Specialization", assessor.specialization],
                          ["Address", assessor.address],
                          ["ID Proof Details", assessor.idProofDetails],
                          [
                            "Aadhaar",
                            assessor.aadhaarLast4
                              ? `XXXX-XXXX-${assessor.aadhaarLast4}`
                              : "Not available",
                          ],
                        ].map(([label, value]) => (
                          <div key={label} className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              {label}
                            </p>
                            <p className="mt-1 break-words text-sm text-gray-800">
                              {value !== undefined &&
                              value !== null &&
                              value !== ""
                                ? String(value)
                                : "Not provided"}
                            </p>
                          </div>
                        ))}

                        <div className="sm:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Qualification Certificates
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {qualificationDocuments.map((document) => {
                              if (!documents[document.key]) return null;

                              const requestKey = `${id}-${document.key}`;

                              return (
                                <button
                                  key={document.key}
                                  type="button"
                                  disabled={
                                    openingDocument === requestKey
                                  }
                                  onClick={() =>
                                    openAssessorDocument(
                                      id,
                                      document.key
                                    )
                                  }
                                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                                >
                                  {openingDocument === requestKey
                                    ? "Opening..."
                                    : `View ${document.label}`}
                                </button>
                              );
                            })}

                            {!hasAnyIndividualCertificate &&
                              hasLegacyQualification && (
                                <button
                                  type="button"
                                  disabled={
                                    openingDocument ===
                                    `${id}-qualification`
                                  }
                                  onClick={() =>
                                    openAssessorDocument(
                                      id,
                                      "qualification"
                                    )
                                  }
                                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                                >
                                  {openingDocument ===
                                  `${id}-qualification`
                                    ? "Opening..."
                                    : "View Qualification Certificate"}
                                </button>
                              )}

                            {!hasAnyIndividualCertificate &&
                              !hasLegacyQualification && (
                                <p className="text-sm text-gray-500">
                                  No qualification certificates available.
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Photograph
                          </p>

                          {documents.photograph ||
                          assessor.photographUploaded ||
                          assessor.hasPhotograph ? (
                            <button
                              type="button"
                              disabled={
                                openingDocument === `${id}-photograph`
                              }
                              onClick={() =>
                                openAssessorDocument(id, "photograph")
                              }
                              className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                            >
                              {openingDocument === `${id}-photograph`
                                ? "Opening..."
                                : "View Photograph"}
                            </button>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">
                              No photograph available.
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Aadhaar Document
                          </p>

                          {documents.aadhaar ? (
                            <button
                              type="button"
                              disabled={
                                openingDocument === `${id}-aadhaar`
                              }
                              onClick={() =>
                                openAssessorDocument(id, "aadhaar")
                              }
                              className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                            >
                              {openingDocument === `${id}-aadhaar`
                                ? "Opening..."
                                : "View Aadhaar Document"}
                            </button>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">
                              No Aadhaar document available.
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Experience Certificate
                          </p>

                          {documents.experience ? (
                            <button
                              type="button"
                              disabled={
                                openingDocument === `${id}-experience`
                              }
                              onClick={() =>
                                openAssessorDocument(id, "experience")
                              }
                              className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                            >
                              {openingDocument === `${id}-experience`
                                ? "Opening..."
                                : "View Experience Certificate"}
                            </button>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">
                              No experience certificate available.
                            </p>
                          )}
                        </div>

                        {assessor.adminRemarks && (
                          <div className="sm:col-span-2 lg:col-span-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Admin Remarks
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm text-red-700">
                              {assessor.adminRemarks}
                            </p>
                          </div>
                        )}
                      </div>

                      {isPending && (
                        <div className="border-t border-gray-100 bg-gray-50 p-5">
                          {reviewingId === id && (
                            <div className="mb-4">
                              <label
                                htmlFor={`remarks-${id}`}
                                className="mb-2 block text-sm font-semibold text-gray-700"
                              >
                                Remarks (required when rejecting)
                              </label>

                              <textarea
                                id={`remarks-${id}`}
                                rows={3}
                                maxLength={1000}
                                value={remarks[id] || ""}
                                onChange={(event) =>
                                  setRemarks((previous) => ({
                                    ...previous,
                                    [id]: event.target.value,
                                  }))
                                }
                                placeholder="Enter the reason for rejection or review notes..."
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {reviewingId !== id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewingId(id);
                                  setErrorMessage("");
                                  setActionMessage("");
                                }}
                                className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-800"
                              >
                                Review Application
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={submittingId === id}
                                  onClick={() =>
                                    handleReview(assessor, "Approved")
                                  }
                                  className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                                >
                                  {submittingId === id
                                    ? "Saving..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  disabled={submittingId === id}
                                  onClick={() =>
                                    handleReview(
                                      assessor,
                                      "Not Approved"
                                    )
                                  }
                                  className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                                >
                                  {submittingId === id
                                    ? "Saving..."
                                    : "Reject"}
                                </button>

                                <button
                                  type="button"
                                  disabled={submittingId === id}
                                  onClick={() => {
                                    setReviewingId("");
                                    setErrorMessage("");
                                  }}
                                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TOAAdminDashboard;
