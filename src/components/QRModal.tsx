import { useEffect, useRef } from "react";
import "./QRModal.css";
import qrCodeImage from "../../docs/moodboard/arbor-parser.png";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * QR Code Modal - Naturalist Specimen Card
 *
 * Designed to feel like discovering a pressed botanical specimen in an archive.
 * The QR code appears as a mysterious cipher, like a scientific notation system
 * from a 19th-century field guide.
 */
export function QRModal({ isOpen, onClose }: QRModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key and backdrop click
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleBackdropClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleBackdropClick);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleBackdropClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="qr-modal-backdrop">
      <div ref={modalRef} className="qr-modal-card">
        {/* Decorative corner pins */}
        <div className="qr-pin qr-pin-tl" />
        <div className="qr-pin qr-pin-tr" />
        <div className="qr-pin qr-pin-bl" />
        <div className="qr-pin qr-pin-br" />

        {/* Scientific specimen header */}
        <div className="qr-header">
          <div className="qr-taxonomy">
            <em className="qr-genus">Arbor Parser</em>
            <span className="qr-species">digitalis</span>
          </div>
          <div className="qr-collection-info">
            Specimen No. <span className="qr-number">2025.11.22</span>
          </div>
        </div>

        {/* QR code as a "pressed specimen" */}
        <div className="qr-specimen-container">
          <img src={qrCodeImage} alt="QR Code" className="qr-image" />
          <div className="qr-specimen-label">
            <em>Codex Binarius Arborem</em>
            <br />
            <small>Scan to observe in natural habitat</small>
          </div>
        </div>

        {/* Field notes section */}
        <div className="qr-notes">
          <p className="qr-note-text">
            <strong>Field Note:</strong> This cipher pattern encodes the
            coordinates to the digital specimen's natural environment. Point
            your observation device to translate.
          </p>
          <div className="qr-contact-info">
            <p className="qr-collector">
              <strong>Collected by:</strong> Russell Pasetes
            </p>
            <div className="qr-links">
              <a
                href="https://www.linkedin.com/in/russell-pasetes-065a11160/"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-link"
              >
                LinkedIn
              </a>
              <span className="qr-separator">•</span>
              <a
                href="https://x.com/rslantonie"
                target="_blank"
                rel="noopener noreferrer"
                className="qr-link"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Close instruction */}
        <button className="qr-close-button" onClick={onClose}>
          Close Specimen Card
        </button>
      </div>
    </div>
  );
}
