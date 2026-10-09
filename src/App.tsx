import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Place, 
  CitizenReport, 
  Itinerary, 
  WeatherData,
  NavigationPage
} from './types';
import { localDb } from './services/storageService';
import { CURATED_PLACES } from './services/placesService';
import { getCitizenReports, voteOnReport } from './services/citizenReportService';
import { fetchCurrentWeather } from './services/weatherService';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { InteractiveMap } from './components/InteractiveMap';
import { PlacesDirectoryPage } from './components/PlacesDirectoryPage';
import { TripPlannerView } from './components/TripPlannerView';
import { PlaceComparisonMatrix } from './components/PlaceComparisonMatrix';
import { CitizenReportsHub } from './components/CitizenReportsHub';
import { CityInsightsDashboard } from './components/CityInsightsDashboard';
import { SavedAdventuresPage } from './components/SavedAdventuresPage';
import { UserProfilePage } from './components/UserProfilePage';
import { AdminModerationDesk } from './components/AdminModerationDesk';
import { ReportModal } from './components/ReportModal';
import { AuthModal } from './components/AuthModal';
import { ExploreCityAssistant } from './components/ExploreCityAssistant';
import { Footer } from './components/Footer';

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationPage>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(localDb.getUser());
  const [places, setPlaces] = useState<Place[]>(CURATED_PLACES);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  // Bookmarks & Saved Itineraries
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>(localDb.getItineraries());
  
  // Comparison slots (default with 2 initial destinations for immediate comparison utility)
  const [comparisonPlaces, setComparisonPlaces] = useState<Place[]>([CURATED_PLACES[0], CURATED_PLACES[2]]);

  // Selected Place for Map Detail Drawer
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(CURATED_PLACES[0]);

  // Report submission modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportInitialCoords, setReportInitialCoords] = useState<{ lat: number; lng: number } | undefined>();
  const [reportInitialDraft, setReportInitialDraft] = useState<{ title?: string; description?: string; category?: any } | undefined>();

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Initial Data Load
  useEffect(() => {
    // 1. Fetch citizen reports
    getCitizenReports().then(setCitizenReports);

    // 2. Fetch live weather
    fetchCurrentWeather().then(setWeather);

    // 3. Load saved bookmarks
    const localSaved = localDb.getSavedPlaces();
    const matched = localSaved
      .map(sp => places.find(p => p.id === sp.place_id || p.place_id === sp.place_id))
      .filter((p): p is Place => Boolean(p));
    if (matched.length > 0) {
      setSavedPlaces(matched);
    } else {
      // Default sample bookmarks for instant demonstration
      setSavedPlaces([CURATED_PLACES[0], CURATED_PLACES[1]]);
    }
  }, []);

  // Sync user changes to local storage
  const handleSetCurrentUser = (user: UserProfile) => {
    setCurrentUser(user);
    localDb.setUser(user);
  };

  // Bookmark handlers
  const handleBookmarkPlace = (place: Place) => {
    const exists = savedPlaces.some(p => p.id === place.id);
    let updated: Place[];
    if (exists) {
      updated = savedPlaces.filter(p => p.id !== place.id);
    } else {
      updated = [...savedPlaces, place];
    }
    setSavedPlaces(updated);
    localDb.saveSavedPlaces(updated.map(p => ({
      id: `saved-${p.id}`,
      user_id: currentUser.id,
      place_id: p.id,
      name: p.name,
      category: p.category,
      address: p.address,
      rating: p.rating,
      price_level: p.price_level,
      lat: p.lat,
      lng: p.lng,
      created_at: new Date().toISOString()
    })));
  };

  const handleRemoveSavedPlace = (placeId: string) => {
    const updated = savedPlaces.filter(p => p.id !== placeId);
    setSavedPlaces(updated);
    localDb.saveSavedPlaces(updated.map(p => ({
      id: `saved-${p.id}`,
      user_id: currentUser.id,
      place_id: p.id,
      name: p.name,
      category: p.category,
      address: p.address,
      rating: p.rating,
      price_level: p.price_level,
      lat: p.lat,
      lng: p.lng,
      created_at: new Date().toISOString()
    })));
  };

  const isBookmarked = (placeId: string) => {
    return savedPlaces.some(p => p.id === placeId);
  };

  // Comparison handlers
  const handleAddToCompare = (place: Place) => {
    if (!comparisonPlaces.some(p => p.id === place.id)) {
      if (comparisonPlaces.length >= 3) {
        setComparisonPlaces([comparisonPlaces[1], comparisonPlaces[2], place]);
      } else {
        setComparisonPlaces([...comparisonPlaces, place]);
      }
    }
    setActiveTab('compare');
  };

  const handleRemoveFromCompare = (placeId: string) => {
    setComparisonPlaces(comparisonPlaces.filter(p => p.id !== placeId));
  };

  // Vote handler
  const handleVoteReport = async (reportId: string, type: 'up' | 'verify') => {
    const updated = await voteOnReport(reportId, type);
    if (updated) {
      setCitizenReports(prev => prev.map(r => r.id === reportId ? updated : r));
    }
  };

  // Report creation handler
  const handleReportCreated = (newReport: CitizenReport) => {
    setCitizenReports(prev => [newReport, ...prev]);
  };

  // Report moderation update handler
  const handleReportUpdated = (updatedReport: CitizenReport) => {
    setCitizenReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  // Save itinerary handler
  const handleSaveItinerary = (itin: Itinerary) => {
    const updated = [itin, ...savedItineraries.filter(i => i.id !== itin.id)];
    setSavedItineraries(updated);
    localDb.saveItineraries(updated);
  };

  const handleRemoveItinerary = (itinId: string) => {
    const updated = savedItineraries.filter(i => i.id !== itinId);
    setSavedItineraries(updated);
    localDb.saveItineraries(updated);
  };

  const handleOpenReportModalWithCoords = (lat: number, lng: number) => {
    setReportInitialCoords({ lat, lng });
    setReportModalOpen(true);
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const pendingReportsCount = citizenReports.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={handleSetCurrentUser}
        weather={weather}
        savedCount={savedPlaces.length + savedItineraries.length}
        pendingReportsCount={pendingReportsCount}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeDashboard
            weather={weather}
            places={places}
            reports={citizenReports}
            onNavigate={setActiveTab}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              setActiveTab('explore');
            }}
            onBookmarkPlace={handleBookmarkPlace}
            isBookmarked={isBookmarked}
          />
        )}

        {activeTab === 'explore' && (
          <InteractiveMap
            places={places}
            citizenReports={citizenReports}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            onBookmarkPlace={handleBookmarkPlace}
            isBookmarked={isBookmarked}
            onAddToCompare={handleAddToCompare}
            onOpenReportModalWithCoords={handleOpenReportModalWithCoords}
          />
        )}

        {activeTab === 'places' && (
          <PlacesDirectoryPage
            places={places}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              setActiveTab('explore');
            }}
            onBookmarkPlace={handleBookmarkPlace}
            isBookmarked={isBookmarked}
            onAddToCompare={handleAddToCompare}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'planner' && weather && (
          <TripPlannerView
            weather={weather}
            onSaveItinerary={handleSaveItinerary}
            isSaved={(id) => savedItineraries.some(i => i.id === id)}
          />
        )}

        {activeTab === 'compare' && (
          <PlaceComparisonMatrix
            comparisonPlaces={comparisonPlaces}
            allPlaces={places}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddToCompare={handleAddToCompare}
            onClearCompare={() => setComparisonPlaces([])}
          />
        )}

        {activeTab === 'reports' && (
          <CitizenReportsHub
            reports={citizenReports}
            onVote={handleVoteReport}
            onOpenCreateModal={() => {
              setReportInitialCoords(undefined);
              setReportModalOpen(true);
            }}
          />
        )}

        {activeTab === 'insights' && (
          <CityInsightsDashboard
            reports={citizenReports}
            places={places}
          />
        )}

        {activeTab === 'saved' && (
          <SavedAdventuresPage
            savedPlaces={savedPlaces}
            savedItineraries={savedItineraries}
            onRemoveSavedPlace={handleRemoveSavedPlace}
            onRemoveItinerary={handleRemoveItinerary}
            onSelectPlace={(place) => {
              setSelectedPlace(place);
              setActiveTab('explore');
            }}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfilePage
            currentUser={currentUser}
            onUpdateUser={handleSetCurrentUser}
            userReports={citizenReports.filter(r => r.user_id === currentUser.id)}
            savedPlacesCount={savedPlaces.length}
            savedItinerariesCount={savedItineraries.length}
            onNavigate={setActiveTab}
            onOpenAuthModal={() => handleOpenAuthModal('login')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminModerationDesk
            currentUser={currentUser}
            reports={citizenReports}
            onReportUpdated={handleReportUpdated}
          />
        )}
      </main>

      {/* Citizen Report Creation Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setReportInitialDraft(undefined);
        }}
        allReports={citizenReports}
        onReportCreated={handleReportCreated}
        initialCoords={reportInitialCoords}
        initialDraft={reportInitialDraft}
      />

      {/* Auth (Login / Sign Up) Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          handleSetCurrentUser(user);
          setAuthModalOpen(false);
        }}
        initialMode={authModalMode}
      />

      {/* Multilingual Voice AI Assistant (Explore City Assistant — English, Hindi, Marathi) */}
      <ExploreCityAssistant
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportDraft={(draft) => {
          setReportInitialDraft(draft);
          setReportModalOpen(true);
        }}
      />

      {/* Global Footer */}
      <Footer />

    </div>
  );
}

export default App;
