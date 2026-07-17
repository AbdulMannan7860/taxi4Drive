"use client";

import { ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import LocationPicker from "./LocationPicker";

export default function LocationField({
  label,
  value,
  placeholder,
  required,
  showCurrentLocation = false,
  onChange
}) {
  const [open, setOpen] = useState(false);

  function handleSelect(location) {
    onChange(location);
  }

  return (
    <>
      <label className="location-field">
        {label}
        <button
          className={`location-field-trigger ${value ? "has-value" : ""}`}
          type="button"
          onClick={() => setOpen(true)}
        >
          <MapPin size={18} />
          <span>{value || placeholder}</span>
          <ChevronRight size={18} />
        </button>
        <input type="hidden" value={value} required={required} />
      </label>

      <LocationPicker
        open={open}
        title={label}
        initialValue={value}
        showCurrentLocation={showCurrentLocation}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </>
  );
}
