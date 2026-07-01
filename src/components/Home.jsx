import { useEffect, useState } from 'react';
import MapView from './MapView.jsx';
import SightingForm from './SightingForm.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';

// The signed-in experience: a full-screen flood-zone map, with the report form
// as an overlay. We ask for the user's location once on entry; if they decline,
// everything still works — they just set the location manually on the map.
export default function Home() {
  const [view, setView] = useState('map'); // 'map' | 'report'
  const [refreshKey, setRefreshKey] = useState(0);
  const { coords, status, locate } = useGeolocation();

  // Ask for location upfront so it's ready by the time they open the form.
  useEffect(() => {
    locate();
  }, [locate]);

  const closeReport = () => {
    setRefreshKey((k) => k + 1); // re-pull markers (a new report may exist)
    setView('map');
  };

  if (view === 'report') {
    return <SightingForm initialCoords={coords} onClose={closeReport} />;
  }

  return (
    <MapView
      userCoords={coords}
      geoStatus={status}
      onLocate={locate}
      onReport={() => setView('report')}
      refreshKey={refreshKey}
    />
  );
}
