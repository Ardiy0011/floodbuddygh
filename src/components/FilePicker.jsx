import { useRef, useState, useEffect } from 'react';

/**
 * Mobile-first photo picker.
 *
 * Uses a hidden <input type="file" accept="image/*" capture="environment">
 * so that on phones it opens the rear camera directly, while on desktop it
 * falls back to a normal file dialog. Renders a live preview of the chosen
 * photo and lifts the selected File up to the parent via onSelect.
 */
export default function FilePicker({ onSelect, file }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Build / revoke an object URL for the preview whenever the file changes.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) onSelect(selected);
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="picker">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        hidden
      />

      <button type="button" className="picker__drop" onClick={openPicker}>
        {previewUrl ? (
          <img src={previewUrl} alt="Selected flood" className="picker__preview" />
        ) : (
          <span className="picker__placeholder">
            <span className="picker__icon">📷</span>
            Tap to capture or choose a photo
          </span>
        )}
      </button>

      {file && (
        <button type="button" className="picker__retake" onClick={openPicker}>
          Retake / choose another
        </button>
      )}
    </div>
  );
}
