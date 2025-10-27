import React, { useState } from "react";
import "./segment.css";
import Modal from "../../components/modal/modal";
import Dropdown from "../../components/dropdown/dropdown";
import { toast } from "react-toastify";
import { SCHEMA_OPTIONS } from "../../constants/schemaOptions";

// --------------------------- CORS ISSUE NOTE ---------------------------
// When calling https://webhook.site directly from the browser (React app),
// you will get a CORS error because webhook.site does not send the
// 'Access-Control-Allow-Origin' header required by browsers.
//
// To bypass this during testing, I used a public CORS proxy service:
//   https://cors-anywhere.herokuapp.com/
// The proxy adds the required CORS headers so the request succeeds.
//
// Example:
// fetch("https://cors-anywhere.herokuapp.com/https://webhook.site/<your-id>", { ... })
//
// If the proxy returns 403 Forbidden, visit this link once to enable temporary access:
//   https://cors-anywhere.herokuapp.com/corsdemo
//
// In real-world apps, this call should be made from a backend server
// (e.g., Node/Express) to avoid CORS issues completely.
// -----------------------------------------------------------------------

const CORS_PROXY = process.env.REACT_APP_CORS_PROXY;
const WEBHOOK_URL = process.env.REACT_APP_WEBHOOK_URL;

export const saveSegmentToWebhook = async (payload) => {
  const response = await fetch(CORS_PROXY + WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response;
};

export default function Segment() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [savedSchemas, setSavedSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState({
    label: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSaveSegment = async () => {
    if (!segmentName || savedSchemas?.length === 0) {
      toast.warn("Please enter a segment name and add at least one schema.");
      return;
    }

    if (!segmentName) {
      toast.warn("Please enter segment name.");
      return;
    }
    if (!savedSchemas?.length) {
      toast.warn("Please add at least one schema.");
      return;
    }

    const schemaPayload = savedSchemas?.map((schemaValue) => {
      const schemaLabel =
        SCHEMA_OPTIONS?.find((opt) => opt?.value === schemaValue)?.label || "";
      return { [schemaValue]: schemaLabel };
    });

    const payload = {
      segment_name: segmentName,
      schema: schemaPayload,
    };

    try {
      setLoading(true);

      const response = await saveSegmentToWebhook(payload);

      if (response?.status === 200 || response?.ok) {
        toast.success("Segment saved successfully!");
        // reset states to default values and close modal
        setShowModal(false);
        setSegmentName("");
        setSavedSchemas([]);
        setLoading(false);
      } else {
        toast.error("Failed to save segment. Try again.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  const handleModal = () => {
    if (showModal) return;
    setShowModal(true);
  };

  const handleSchemaSelection = (e) => {
    setSelectedSchema(e);
  };

  const handleAddSegment = () => {
    if (!selectedSchema?.value) {
      toast.warn("Please select a schema first.");
      return;
    }

    setSavedSchemas((prev) =>
      prev.includes(selectedSchema.value)
        ? prev
        : [...prev, selectedSchema.value]
    );
    // clear Dropdown placeholder after adding schema
    setSelectedSchema({ label: "", value: "" });
  };

  const handleCancel = () => {
    if (loading) return;
    // reset the states to default
    setShowModal(false);
    setSelectedSchema({ label: "", value: "" });
    setSegmentName("");
    setSavedSchemas([]);
  };

  return (
    <>
      <div className="header">Segment Home</div>
      <div className="container">
        <button className="save-btn" onClick={handleModal}>
          Save Segment
        </button>

        <Modal show={showModal} onClose={handleCancel}>
          <h3>Save Segment</h3>
          <input
            type="text"
            placeholder="Enter segment name"
            style={{
              width: "90%",
              padding: "8px",
              marginBottom: "1rem",
              fontSize: "14px",
            }}
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />

          {/* Display selected schemas in a Blue Box */}
          {savedSchemas?.length ? (
            <div className="selected-segments">
              {[...savedSchemas]?.map((schema) => (
                <Dropdown
                  placeholder={
                    SCHEMA_OPTIONS?.find((opt) => opt?.value === schema)?.label
                  }
                  options={[]}
                />
              ))}
            </div>
          ) : null}

          <Dropdown
            options={SCHEMA_OPTIONS?.filter(
              (opt) => !savedSchemas?.includes(opt?.value)
            )}
            selected={selectedSchema}
            onSelect={handleSchemaSelection}
            placeholder="Add schema to segment"
          />

          <button className="add-schema" onClick={handleAddSegment}>
            +Add new schema
          </button>

          <div className="footer">
            <button
              className="save-segment-btn"
              onClick={handleSaveSegment}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save the segment"}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
