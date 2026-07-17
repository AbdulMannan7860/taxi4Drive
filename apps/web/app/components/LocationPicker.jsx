"use client";

import { Crosshair, Loader2, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadGoogleMaps, SYDNEY_CENTER } from "../../lib/loadGoogleMaps";

const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function LocationPicker({ open, title, initialValue, showCurrentLocation, onClose, onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const autocompleteRef = useRef(null);
  const placesRef = useRef(null);
  const idleListenerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [mapsReady, setMapsReady] = useState(false);

  const reverseGeocode = useCallback((lat, lng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        setAddress(results[0].formatted_address);
        setQuery(results[0].formatted_address);
      }
    });
  }, []);

  const moveMapTo = useCallback(
    (lat, lng, zoom = 16) => {
      if (!mapRef.current) return;
      mapRef.current.panTo({ lat, lng });
      if (zoom) mapRef.current.setZoom(zoom);
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  const selectPlace = useCallback(
    (placeId, description) => {
      if (!placesRef.current) return;

      placesRef.current.getDetails(
        { placeId, fields: ["formatted_address", "geometry", "name"] },
        (place, status) => {
          if (status !== "OK" || !place?.geometry?.location) return;

          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const formatted = place.formatted_address || description;

          setAddress(formatted);
          setQuery(formatted);
          setPredictions([]);
          moveMapTo(lat, lng, 16);
        }
      );
    },
    [moveMapTo]
  );

  const fetchPredictions = useCallback((input) => {
    if (!autocompleteRef.current || input.trim().length < 2) {
      setPredictions([]);
      return;
    }

    autocompleteRef.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: "au" },
        location: new window.google.maps.LatLng(SYDNEY_CENTER.lat, SYDNEY_CENTER.lng),
        radius: 80000
      },
      (results, status) => {
        if (status === "OK" && results) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      }
    );
  }, []);

  const debouncedFetchRef = useRef(null);
  if (!debouncedFetchRef.current) {
    debouncedFetchRef.current = debounce((input) => fetchPredictions(input), 280);
  }

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        moveMapTo(position.coords.latitude, position.coords.longitude, 17);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setError("Could not access your location. Check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [moveMapTo]);

  useEffect(() => {
    if (!open) return;

    setQuery(initialValue || "");
    setAddress(initialValue || "");
    setPredictions([]);
    setError("");
    setLoading(true);

    let cancelled = false;

    loadGoogleMaps(mapsApiKey)
      .then((maps) => {
        if (cancelled || !mapContainerRef.current) return;

        geocoderRef.current = new maps.Geocoder();
        autocompleteRef.current = new maps.places.AutocompleteService();
        placesRef.current = new maps.places.PlacesService(document.createElement("div"));

        const map = new maps.Map(mapContainerRef.current, {
          center: SYDNEY_CENTER,
          zoom: 13,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false
        });

        mapRef.current = map;

        const onIdle = debounce(() => {
          const center = map.getCenter();
          if (center) reverseGeocode(center.lat(), center.lng());
        }, 400);

        idleListenerRef.current = map.addListener("idle", onIdle);
        setMapsReady(true);
        setLoading(false);

        if (initialValue) {
          geocoderRef.current.geocode({ address: initialValue }, (results, status) => {
            if (status === "OK" && results?.[0]?.geometry?.location) {
              const loc = results[0].geometry.location;
              map.setCenter(loc);
              map.setZoom(16);
              setAddress(results[0].formatted_address);
            }
          });
        } else if (showCurrentLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => moveMapTo(position.coords.latitude, position.coords.longitude, 17),
            () => setError("Could not access your location. Check browser permissions."),
            { enableHighAccuracy: true, timeout: 12000 }
          );
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      if (idleListenerRef.current) {
        window.google?.maps?.event?.removeListener(idleListenerRef.current);
        idleListenerRef.current = null;
      }
      mapRef.current = null;
      setMapsReady(false);
    };
  }, [open, initialValue, showCurrentLocation, reverseGeocode, moveMapTo]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  function handleQueryChange(event) {
    const value = event.target.value;
    setQuery(value);
    debouncedFetchRef.current(value);
  }

  function handleConfirm() {
    if (!address.trim()) {
      setError("Please select a location on the map or from search results.");
      return;
    }

    const center = mapRef.current?.getCenter();
    onSelect({
      address: address.trim(),
      lat: center?.lat() ?? null,
      lng: center?.lng() ?? null
    });
    onClose();
  }

  if (!open) return null;

  return (
    <div className="location-picker-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="location-picker-sheet">
        <header className="location-picker-header">
          <button className="location-picker-close" type="button" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
          <h3>{title}</h3>
        </header>

        <div className="location-picker-search">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search for an address or place"
            autoComplete="off"
            autoFocus
          />
          {query && (
            <button
              className="location-picker-clear"
              type="button"
              onClick={() => {
                setQuery("");
                setPredictions([]);
              }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showCurrentLocation && (
          <button className="location-picker-current" type="button" onClick={useCurrentLocation} disabled={locating || !mapsReady}>
            {locating ? <Loader2 size={18} className="spin" /> : <Crosshair size={18} />}
            Use my current location
          </button>
        )}

        {predictions.length > 0 && (
          <ul className="location-picker-predictions" role="listbox">
            {predictions.map((item) => (
              <li key={item.place_id}>
                <button type="button" onClick={() => selectPlace(item.place_id, item.description)} role="option">
                  <MapPin size={16} />
                  <span>
                    <strong>{item.structured_formatting?.main_text || item.description}</strong>
                    <small>{item.structured_formatting?.secondary_text}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="location-picker-map-wrap">
          {loading && (
            <div className="location-picker-map-loading">
              <Loader2 size={28} className="spin" />
              <span>Loading map...</span>
            </div>
          )}
          <div ref={mapContainerRef} className="location-picker-map" />
          <div className="location-picker-pin" aria-hidden="true">
            <MapPin size={36} fill="currentColor" />
          </div>
        </div>

        <div className="location-picker-footer">
          {address && <p className="location-picker-selected">{address}</p>}
          {error && <p className="location-picker-error" role="alert">{error}</p>}
          <button className="button primary wide" type="button" onClick={handleConfirm} disabled={!mapsReady}>
            Confirm location
          </button>
        </div>
      </div>
    </div>
  );
}
