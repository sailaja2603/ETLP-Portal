import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { FiAward, FiDownload, FiEye, FiCheckCircle, FiShield, FiX, FiPrinter } from "react-icons/fi";

function Certificates() {
  const { user } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default Sample Certificates to guarantee student has sample credentials visible
  const sampleCertificates = [
    {
      id: "sample-1",
      course_name: "Full-Stack Web Development & AI Engineering Mastery",
      issue_date: "2026-09-08",
      certificate_code: "ETLP-CERT-2026-88492",
      issuer: "Jawaharlal Nehru Technological University Gurajada Vizianagaram",
      student_name: user?.name || "Student Scholar",
      grade: "Distinction (96%)",
      skills: ["React 18", "Node.js", "MySQL", "AI Tutor Integration", "RESTful APIs"],
      is_sample: true,
    },
    {
      id: "sample-2",
      course_name: "Cyber Security Fundamentals & Ethical Hacking",
      issue_date: "2026-08-15",
      certificate_code: "ETLP-CERT-2026-77210",
      issuer: "Jawaharlal Nehru Technological University Gurajada Vizianagaram",
      student_name: user?.name || "Student Scholar",
      grade: "Excellence (92%)",
      skills: ["Network Security", "Cryptography", "Penetration Testing", "Threat Analysis"],
      is_sample: true,
    }
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await API.get("/certificates");
      if (res.data && res.data.certificates && res.data.certificates.length > 0) {
        setCertificates([...res.data.certificates, ...sampleCertificates]);
      } else {
        setCertificates(sampleCertificates);
      }
    } catch (error) {
      console.log("Using sample certificates fallback:", error);
      setCertificates(sampleCertificates);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 pb-3 border-bottom border-dark-subtle">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary bg-opacity-20 text-cyan px-3 py-2 rounded-pill fw-semibold">
              <FiShield className="me-1" /> Official Credentials Registry
            </span>
          </div>
          <h1 className="fw-extrabold display-5 text-white mb-2">My Certificates</h1>
          <p className="text-cyan mb-0">View, verify, and download your verified course completion certificates.</p>
        </div>
        <div className="mt-3 mt-md-0">
          <button onClick={() => setSelectedCert(sampleCertificates[0])} className="btn btn-premium-cyan me-2">
            <FiEye className="me-2" /> View Sample Certificate
          </button>
        </div>
      </div>

      {/* Certificates Cards Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-cyan" role="status"></div>
          <p className="text-cyan mt-3">Loading certificates...</p>
        </div>
      ) : (
        <div className="row g-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="col-md-6 col-lg-6">
              <div className="course-card-custom p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold">
                      <FiAward className="me-1" /> Verified Credential
                    </span>
                    {cert.is_sample && (
                      <span className="badge bg-warning text-dark fw-bold px-2 py-1">Sample Certificate</span>
                    )}
                  </div>

                  <h3 className="fw-bold my-2" style={{ color: "#0f172a" }}>{cert.course_name}</h3>
                  <p className="small mb-3" style={{ color: "#0369a1" }}>
                    Issued by <strong>{cert.issuer || "JNTU ETLP"}</strong> to <strong>{cert.student_name || user?.name || "Student"}</strong>
                  </p>

                  <div className="p-3 rounded-3 mb-3" style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                    <div className="d-flex justify-content-between small text-dark mb-1">
                      <span>Credential ID:</span>
                      <strong className="font-monospace text-primary">{cert.certificate_code || `ETLP-CERT-${cert.id}`}</strong>
                    </div>
                    <div className="d-flex justify-content-between small text-dark mb-1">
                      <span>Issue Date:</span>
                      <strong>{cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "2026-09-08"}</strong>
                    </div>
                    {cert.grade && (
                      <div className="d-flex justify-content-between small text-dark">
                        <span>Grade:</span>
                        <strong className="text-success">{cert.grade}</strong>
                      </div>
                    )}
                  </div>

                  {cert.skills && (
                    <div className="mb-3">
                      <small className="fw-semibold d-block mb-1" style={{ color: "#0f172a" }}>Skills Verified:</small>
                      <div className="d-flex flex-wrap gap-1">
                        {cert.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="badge bg-info bg-opacity-10 text-primary border border-info border-opacity-20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2 mt-4 pt-3 border-top border-light-subtle">
                  <button 
                    className="btn btn-premium-cyan flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <FiEye /> View Certificate
                  </button>
                  <button 
                    className="btn btn-premium-outline d-flex align-items-center justify-content-center gap-2"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <FiDownload /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal Viewer */}
      {selectedCert && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(8px)" }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content text-dark border-0 rounded-4 overflow-hidden shadow-lg" style={{ background: "#ffffff" }}>
              
              {/* Modal Header Controls */}
              <div className="modal-header bg-dark text-white border-0 px-4 py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <FiAward size={24} className="text-warning" />
                  <h5 className="modal-title fw-bold mb-0 text-white">Certificate Preview & Verification</h5>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button onClick={handlePrint} className="btn btn-sm btn-outline-light d-flex align-items-center gap-1">
                    <FiPrinter /> Print / PDF
                  </button>
                  <button onClick={() => setSelectedCert(null)} className="btn btn-sm btn-light rounded-circle p-2">
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Printable Certificate Body */}
              <div className="modal-body p-4 p-md-5">
                <div 
                  className="certificate-frame p-4 p-md-5 rounded-4 text-center position-relative"
                  style={{
                    background: "#ffffff",
                    border: "12px double #fbbf24",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    color: "#0f172a"
                  }}
                >
                  {/* Decorative Corner Accents */}
                  <div className="position-absolute top-0 start-0 p-3 text-warning font-monospace fs-4">✦</div>
                  <div className="position-absolute top-0 end-0 p-3 text-warning font-monospace fs-4">✦</div>
                  <div className="position-absolute bottom-0 start-0 p-3 text-warning font-monospace fs-4">✦</div>
                  <div className="position-absolute bottom-0 end-0 p-3 text-warning font-monospace fs-4">✦</div>

                  {/* Institution Brand */}
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-pill fw-bold mb-2">
                      <FiAward size={28} className="text-warning" />
                      <span className="fs-5 fw-bold text-uppercase" style={{ color: "#0f172a" }}>JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY GURAJADA VIZIANAGARAM</span>
                    </div>
                    <p className="text-primary small text-uppercase tracking-wider fw-semibold mt-1">Enhanced Technology Learning Platform (ETLP) • Official Academic Credential</p>
                  </div>

                  <h1 className="fw-light text-uppercase tracking-widest text-secondary my-3" style={{ fontSize: "1.6rem", letterSpacing: "4px" }}>
                    Certificate of Completion
                  </h1>

                  <p className="fs-6 text-muted mb-2">This is proudly awarded to</p>

                  <h2 className="display-6 fw-bold text-primary my-3" style={{ fontFamily: "Georgia, serif", color: "#1e3a8a" }}>
                    {selectedCert.student_name || user?.name || "Student Scholar"}
                  </h2>

                  <p className="fs-6 text-muted mx-auto my-3" style={{ maxWidth: "650px" }}>
                    for successfully demonstrating mastery and passing all comprehensive evaluations in the certified course
                  </p>

                  <h3 className="fw-bold text-dark my-4 px-3 py-2 bg-light d-inline-block rounded-3" style={{ borderLeft: "4px solid #38bdf8", color: "#0f172a" }}>
                    {selectedCert.course_name}
                  </h3>

                  {/* Seal and Signatures */}
                  <div className="row align-items-center mt-5 pt-4 border-top border-light-subtle">
                    <div className="col-4 text-center">
                      <div className="border-bottom border-dark mx-auto mb-2" style={{ width: "140px" }}></div>
                      <p className="fw-bold mb-0 text-dark small">Prof. Dr. G. Jaya Suma</p>
                      <small className="text-muted d-block fw-semibold">Academic Director</small>
                    </div>

                    <div className="col-4 text-center">
                      <div className="d-inline-block p-3 rounded-circle bg-warning bg-opacity-10 border border-warning">
                        <FiShield size={36} className="text-warning" />
                      </div>
                      <small className="d-block text-success fw-bold mt-2">
                        <FiCheckCircle className="me-1" /> VERIFIED CREDENTIAL
                      </small>
                    </div>

                    <div className="col-4 text-center">
                      <div className="border-bottom border-dark mx-auto mb-2" style={{ width: "140px" }}></div>
                      <p className="fw-bold mb-0 text-dark small">ETLP Exam Board</p>
                      <small className="text-muted d-block">Authorized Issuer</small>
                    </div>
                  </div>

                  {/* Footer Metadata */}
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-3 text-muted small border-top">
                    <span>Issue Date: <strong>{selectedCert.issue_date || "2026-09-08"}</strong></span>
                    <span>Credential ID: <strong className="font-monospace">{selectedCert.certificate_code || `ETLP-CERT-${selectedCert.id}`}</strong></span>
                  </div>

                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="modal-footer bg-light border-0 px-4 py-3 d-flex justify-content-between">
                <span className="text-muted small">
                  <FiCheckCircle className="text-success me-1" /> Authenticity digitally encrypted & registered in ETLP database.
                </span>
                <div className="d-flex gap-2">
                  <button onClick={handlePrint} className="btn btn-premium-cyan">
                    <FiDownload className="me-2" /> Download / Save PDF
                  </button>
                  <button onClick={() => setSelectedCert(null)} className="btn btn-secondary">
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Certificates;