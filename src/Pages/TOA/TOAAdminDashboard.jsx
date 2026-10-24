
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001/api/toa/admin";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  "Not Approved": "bg-red-100 text-red-800",
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

  const [assessors, setAssessors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [remarks, setRemarks] = useState({});
  const [submittingId, setSubmittingId] = useState("");
  const [openingDocument, setOpeningDocument] = useState("");

  const token = localStorage.getItem("toa_admin_token");

  const logout = useCallback(() => {
    localStorage.removeItem("toa_admin_token");
    localStorage.removeItem("toa_admin_user");
    navigate("/toa");
  }, [navigate]);

  const loadAssessors = useCallback(async () => {
    const currentToken = localStorage.getItem("toa_admin_token");

    if (!currentToken) {
      navigate("/toa");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const query =
        filter === "All" ? "" : `?status=${encodeURIComponent(filter)}`;

      const response = await fetch(`${API_URL}/assessors${query}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load assessor applications."
        );
      }

      setAssessors(Array.isArray(data.assessors) ? data.assessors : []);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to connect to the TOA backend."
      );
    } finally {
      setLoading(false);
    }
  }, [filter, logout, navigate]);

  useEffect(() => {
    loadAssessors();
  }, [loadAssessors]);

  // Opens a private document using the authenticated admin endpoint.
  const openAssessorDocument = async (assessorId, documentType) => {
    const currentToken = localStorage.getItem("toa_admin_token");

    if (!currentToken) {
      logout();
      return;
    }

    const requestKey = `${assessorId}-${documentType}`;
    setOpeningDocument(requestKey);
    setErrorMessage("");

    // Open synchronously so that the browser is less likely to block it.
    const previewTab = window.open("about:blank", "_blank");

    if (!previewTab) {
      setOpeningDocument("");
      setErrorMessage(
        "Your browser blocked the document preview. Please allow pop-ups for this site and try again."
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
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
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
          // Keep the default message if the response is not JSON.
        }

        previewTab.close();
        setErrorMessage(message);
        return;
      }

      const blob = await response.blob();

      if (
        ![
          "application/pdf",
          "image/jpeg",
          "image/png",
        ].includes(blob.type)
      ) {
        previewTab.close();
        setErrorMessage(
          "This file cannot be previewed. Only PDF, JPG and PNG files are supported."
        );
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      previewTab.location.href = objectUrl;

      // Release the temporary URL when the preview tab is closed.
      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
      };

      previewTab.addEventListener("unload", cleanup, { once: true });
    } catch (error) {
      if (previewTab && !previewTab.closed) {
        previewTab.close();
      }

      setErrorMessage(
        error.message || "Unable to connect to the server to open the document."
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

    const confirmed = window.confirm(
      `Are you sure you want to mark ${assessor.fullName}'s application as "${status}"?`
    );

    if (!confirmed) return;

    setSubmittingId(assessorId);
    setErrorMessage("");
    setActionMessage("");

    try {
      const response = await fetch(
        `${API_URL}/assessors/${encodeURIComponent(assessorId)}/review`,
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
        `${assessor.fullName}'s application has been marked ${status}.`
      );

      setReviewingId("");
      setRemarks((previous) => ({
        ...previous,
        [assessorId]: "",
      }));

      await loadAssessors();
    } catch (error) {
      setErrorMessage(error.message || "Review failed. Please try again.");
    } finally {
      setSubmittingId("");
    }
  };

  const counts = {
    All: assessors.length,
    Pending: assessors.filter((item) => item.status === "Pending").length,
    Approved: assessors.filter((item) => item.status === "Approved").length,
    "Not Approved": assessors.filter(
      (item) => item.status === "Not Approved"
    ).length,
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
              onClick={loadAssessors}
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
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Assessor Applications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review each assessor's uploaded qualification certificates and
            photograph before making an approval decision.
          </p>
        </div>

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

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Applications", value: counts.All },
            { label: "Pending", value: counts.Pending },
            { label: "Approved", value: counts.Approved },
            { label: "Not Approved", value: counts["Not Approved"] },
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
          {["All", "Pending", "Approved", "Not Approved"].map((status) => (
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
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading assessor applications...
          </div>
        ) : assessors.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h3 className="font-semibold text-gray-700">
              No assessor applications found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Applications will appear here after a Training Partner submits
              assessor details.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {assessors.map((assessor) => {
              const id = assessor._id || assessor.id;
              const status = assessor.status || "Pending";
              const isPending = status === "Pending";
              const documents = assessor.documents || {};

              // Support both the new per-qualification format and older records.
              const hasLegacyQualification =
                Boolean(assessor.qualificationCertificateUploaded) ||
                Boolean(assessor.hasQualificationCertificate) ||
                Boolean(assessor.qualificationCertificatePath);

              const hasAnyIndividualCertificate =
                qualificationDocuments.some((document) =>
                  Boolean(documents[document.key])
                );

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
                        Assessor ID: {assessor.assessorId || "Not assigned"}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Training Partner:{" "}
                        {assessor.tpUsername ||
                          assessor.trainingPartnerUsername ||
                          assessor.trainingPartner ||
                          assessor.createdBy?.username ||
                          "Not available"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[status] || "bg-gray-100 text-gray-700"
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
                      ["Experience (years)", assessor.experienceYears],
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
                              disabled={openingDocument === requestKey}
                              onClick={() =>
                                openAssessorDocument(id, document.key)
                              }
                              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:cursor-wait disabled:opacity-50"
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
                              disabled={openingDocument === `${id}-qualification`}
                              onClick={() =>
                                openAssessorDocument(id, "qualification")
                              }
                              className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                            >
                              {openingDocument === `${id}-qualification`
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
                          disabled={openingDocument === `${id}-photograph`}
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
                            placeholder="Enter the reason for rejection or any review notes..."
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
                              {submittingId === id ? "Saving..." : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={submittingId === id}
                              onClick={() =>
                                handleReview(assessor, "Not Approved")
                              }
                              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                            >
                              Reject
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
      </main>
    </div>
  );
};

export default TOAAdminDashboard;
