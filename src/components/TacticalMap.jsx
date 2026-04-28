import React, { useEffect, useRef, useState } from 'react';
import { Compass, MapPin } from 'lucide-react';

const TacticalMap = ({ coords }) => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState({ area: "Detecting Area...", city: "City Lock...", country: "Country..." });

  useEffect(() => {
    const google = window.google;
    if (google && mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
            center: coords,
            zoom: 15,
            mapTypeId: 'satellite',
            disableDefaultUI: true,
        });

        // REVERSE GEOCODING (ADDRESS FETCH)
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: coords }, (results, status) => {
            if (status === "OK" && results[0]) {
                const parts = results[0].address_components;
                const locInfo = {
                    area: parts.find(p => p.types.includes("sublocality"))?.long_name || "Zone Alpha",
                    city: parts.find(p => p.types.includes("locality"))?.long_name || "Sector Hub",
                    country: parts.find(p => p.types.includes("country"))?.long_name || "Global"
                };
                setAddress(locInfo);
            }
        });

        // MAP MARKER
        new google.maps.Marker({
            position: coords,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#ff3366",
                fillOpacity: 1,
                strokeWeight: 4,
                strokeColor: "#ffffff",
            }
        });
    }
  }, [coords]);

  return (
    <div className="v4-map-wrapper" style={{ height: '100%', position: 'relative' }}>
        {/* COMPASS OVERLAY */}
        <div className="compass-overlay">
           <div className="dir north">N</div>
           <div className="dir south">S</div>
           <div className="dir east">E</div>
           <div className="dir west">W</div>
           <Compass size={40} color="rgba(0, 229, 255, 0.4)" strokeWidth={1} />
        </div>

        {/* ADDRESS INFO OVERLAY (TOP LEFT) */}
        <div className="address-overlay">
            <div className="addr-row"><MapPin size={12} color="#ff3366" /> <b>AREA:</b> {address.area}</div>
            <div className="addr-row"><b>CITY:</b> {address.city}</div>
            <div className="addr-row"><b>COUNTRY:</b> {address.country}</div>
            <div className="addr-row" style={{ fontSize: '0.6rem', opacity: 0.6 }}>LOC: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</div>
        </div>

        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default TacticalMap;
