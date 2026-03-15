/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import AlphaGate from './components/gatekeeping/AlphaGate';
import { 
  LayoutDashboard, Users, Calendar, Map, Utensils, Info, CheckCircle, ChevronRight, X, User, Plus, Filter, Search, Star, Clock, MapPin, AlertTriangle, ShieldCheck, Zap, Activity, BookOpen, Globe, Droplets, Volume2, Sparkles, Wand2, Compass, Layers, PieChart, Settings, LogOut, Bell, Menu, ChevronDown, ChevronUp, Edit2, Trash2, Save, ArrowLeft, Download, Share2, Heart, MessageSquare, Coffee, Camera, FastForward, Play, Pause, Repeat, SkipForward, SkipBack, Maximize2, Minimize2, ExternalLink, HelpCircle, Briefcase, Award, Smile, Frown, Meh, Eye, EyeOff, Lock, Unlock, Key, Trash, RefreshCw, Send, Check, Paperclip, Mail, Phone, Home, ShoppingBag, CreditCard, Gift, Music, Film, Video, Image, Mic, Speaker, Headphones, Bluetooth, Wifi, Battery, Cloud, Sun, Moon, Wind, Thermometer, Umbrella, Sunrise, Sunset,
  ArrowRight, CloudRain, Shield, Target, Crown, Rocket, Accessibility, Ruler, History, UserPlus
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────
type View = 'home' | 'crew' | 'trip_dashboard' | 'guest_survey' | 'vault' | 'new_trip' | 'account_setup' | 'library' | 'transportation' | 'calendar' | 'keepsake' | 'map' | 'packing' | 'subscription' | 'adventures' | 'settings';

interface GuestContent {
  id: number | string;
  name: string;
  age: number;
  height: number;
  allergies: string;
  email: string;
  surveyCompleted: boolean;
  surveyPreferences?: {
    wantIds: string[];
    skipIds: string[];
    noPreference: boolean;
    topTen: string[];
  };
}

interface Adventure {
  id: string;
  name: string;
  resortId: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'past' | 'live';
  onSite: boolean;
  hotelName?: string;
  parks: string[];
  guests: GuestContent[];
  breakStrategy: 'power' | 'hotel' | 'pool';
  pacing: 'intense' | 'moderate' | 'relaxed';
  primaryFocus: 'thrills' | 'toddlers' | 'classic' | 'shows';
  diningStrategy: 'snacks' | 'quick' | 'table' | 'signature';
  singleRiderAllowed?: boolean;
  dasAllowed?: boolean;
  llMultiPassAllowed?: boolean;
  llSinglePassAllowed?: boolean;
  arrivalIntent?: 'leisurely' | 'rope-drop' | 'evening-only';
  splurgeAppetite?: 'moderate' | 'low' | 'high';
  premiumInterests?: string[];
  diningReservationIntent?: boolean;
}

function App() {
  const initialToken = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null;
  const [activeView, setActiveView] = useState<View>(initialToken ? 'guest_survey' : 'home');
  const [surveyToken] = useState<string | null>(initialToken);
  const [surveyStep, setSurveyStep] = useState(1);

  // ── Guest Preference Survey Modal state ────────────────────────────────────
  const [surveyModalGuest, setSurveyModalGuest] = useState<GuestContent | null>(null);
  const [surveyModalStep, setSurveyModalStep] = useState<1 | 2 | 3>(1);
  const [surveySelections, setSurveySelections] = useState<Record<string, 'want' | 'skip'>>({});
  const [surveyNoPreference, setSurveyNoPreference] = useState(false);
  const [surveyTopTen, setSurveyTopTen] = useState<string[]>([]);
  const [surveyDetailItem, setSurveyDetailItem] = useState<(typeof mockResearchItems)[0] | null>(null);
  const [surveyActiveTab, setSurveyActiveTab] = useState<string>('Ride');

  const openSurveyForGuest = (guest: GuestContent) => {
    setSurveyModalGuest(guest);
    setSurveyModalStep(1);
    setSurveyActiveTab('Ride');
    setSurveyDetailItem(null);
    if (guest.surveyPreferences) {
      const prefs = guest.surveyPreferences;
      const sel: Record<string, 'want' | 'skip'> = {};
      prefs.wantIds.forEach(id => { sel[id] = 'want'; });
      prefs.skipIds.forEach(id => { sel[id] = 'skip'; });
      setSurveySelections(sel);
      setSurveyNoPreference(prefs.noPreference);
      setSurveyTopTen(prefs.topTen);
    } else {
      setSurveySelections({});
      setSurveyNoPreference(false);
      setSurveyTopTen([]);
    }
  };

  const submitSurvey = () => {
    if (!surveyModalGuest) return;
    const prefs = {
      wantIds: Object.entries(surveySelections).filter(([, v]) => v === 'want').map(([k]) => k),
      skipIds: Object.entries(surveySelections).filter(([, v]) => v === 'skip').map(([k]) => k),
      noPreference: surveyNoPreference,
      topTen: surveyTopTen,
    };
    setAdventures(prev => prev.map(adv => ({
      ...adv,
      guests: adv.guests.map(g => g.id === surveyModalGuest.id
        ? { ...g, surveyCompleted: true, surveyPreferences: prefs }
        : g
      )
    })));
    setSurveyModalStep(3);
    setTimeout(() => setSurveyModalGuest(null), 2500);
  };

  const [adventures, setAdventures] = useState<Adventure[]>([
    {
      id: 'adv_1',
      name: 'The Plaid Legacy',
      resortId: 'WDW',
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      status: 'planning',
      onSite: true,
      hotelName: 'Disney\'s Polynesian Village Resort',
      parks: ['Magic Kingdom', 'Epcot'],
      guests: [],
      breakStrategy: 'power',
      pacing: 'moderate',
      primaryFocus: 'classic',
      diningStrategy: 'quick'
    },
    {
      id: 'adv_2',
      name: 'Disneyland Holiday',
      resortId: 'DL',
      startDate: '2025-12-20',
      endDate: '2025-12-25',
      status: 'past',
      onSite: false,
      parks: ['Disneyland Park', 'Disney California Adventure'],
      guests: [],
      breakStrategy: 'hotel',
      pacing: 'relaxed',
      primaryFocus: 'toddlers',
      diningStrategy: 'table'
    }
  ]);
  const [activeAdventureId, setActiveAdventureId] = useState<string>('adv_1');
  const [breakStrategy, setBreakStrategy] = useState<'power' | 'hotel' | 'pool'>('power');
  const [rideCountGoal, setRideCountGoal] = useState<'intense' | 'moderate' | 'relaxed'>('moderate');
  const [primaryFocus, setPrimaryFocus] = useState<'thrills' | 'toddlers' | 'classic' | 'shows'>('classic');
  const [diningStrategy, setDiningStrategy] = useState<'snacks' | 'quick' | 'table' | 'signature'>('quick');

  const [parkFilter, setParkFilter] = useState<string>(() => activeAdventureId ? (adventures.find(a => a.id === activeAdventureId)?.parks?.[0] ?? 'Magic Kingdom') : 'Magic Kingdom');

  // Sync states with active adventure


  useEffect(() => {
    const adv = adventures.find(a => a.id === activeAdventureId);
    if (adv) {
      // eslint-disable-next-line
      setBreakStrategy(adv.breakStrategy);
      setRideCountGoal(adv.pacing);
      setPrimaryFocus(adv.primaryFocus);
      setDiningStrategy(adv.diningStrategy);
    }
  }, [activeAdventureId, adventures]);

  const updateActiveAdv = (updates: Partial<Adventure>) => {
    setAdventures(prev => prev.map(a => a.id === activeAdventureId ? { ...a, ...updates } : a));
  };

  const [members, setMembers] = useState<GuestContent[]>([
    { id: 1, name: 'Patchen', age: 35, height: 72, allergies: 'None', email: 'patchenu@gmail.com', surveyCompleted: true },
    { id: 2, name: 'Patchen Jr.', age: 5, height: 42, allergies: 'Peanuts', email: '', surveyCompleted: false }
  ]);

  const [editingMember, setEditingMember] = useState<GuestContent | null>(null);
  const [editingMemberSource, setEditingMemberSource] = useState<'global' | 'adventure' | 'wizard'>('global');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'profile' | 'preferences' | 'subscription'>('profile');

  // ── Interactive Map State ──────────────────────────────────────────────
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMapMouseDown = (e: React.MouseEvent) => {
    setIsMapDragging(true);
    setDragStart({ x: e.clientX - mapPan.x, y: e.clientY - mapPan.y });
  };

  const handleMapMouseMove = (e: React.MouseEvent) => {
    if (!isMapDragging) return;
    setMapPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMapMouseUp = () => {
    setIsMapDragging(false);
  };

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleLocateMe = () => {
    setMapZoom(1);
    setMapPan({ x: 0, y: 0 });
  };

  const isTripMode = activeView === 'trip_dashboard';

  const globalSidebarItems = [
    { id: 'home', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'adventures', label: 'My Adventures', icon: MapPin },
    { id: 'library', label: 'The Library', icon: BookOpen },
    { id: 'transportation', label: 'Transportation', icon: Compass },
    { id: 'calendar', label: 'The Magic Window', icon: Calendar },
    { id: 'map', label: 'The Compass', icon: Map },
    { id: 'packing', label: "The Traveler's Trunk", icon: Umbrella },
    { id: 'keepsake', label: 'The Digital Gallery', icon: Camera },
    { id: 'crew', label: 'Family & Friends', icon: Users },
    { id: 'subscription', label: 'Citadel Plan', icon: Crown },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarItems = isTripMode ? [] : globalSidebarItems;

  const [researchFilter, setResearchFilter] = useState<string>('Ride');
  const [searchText, setSearchText] = useState<string>('');
  const researchCategories = ['Ride', 'Show', 'Parade', 'Character', 'Dining', 'Seasonal'];

  // ── Full Attraction Catalog ────────────────────────────────────────────────
  const mockResearchItems = [
    // ── Magic Kingdom: Rides ──
    { id: 'mk-r1', title: 'TRON Lightcycle / Run', type: 'Ride', park: 'Magic Kingdom', context: 'ILL Required', color: '#9ae6b4', rating: 4.8, length: '2 min', description: 'High-speed indoor/outdoor motorcycle-style coaster.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Indoor/Outdoor', heightReq: '48 in', notable: 'Intense Launch', dasEligible: true, loudNoises: true, strobeLights: true, singleRider: true, childSwap: true, earlyMorningAccess: true, travelTime: '20 min walk', closedDuringVisit: false },
    { id: 'mk-r2', title: 'Space Mountain', type: 'Ride', park: 'Magic Kingdom', context: 'Hard to get LL', color: '#fbd38d', rating: 4.6, length: '3 min', description: 'Classic indoor coaster hurtling through the dark cosmos.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: '44 in', notable: 'Classic Coaster', dasEligible: true, loudNoises: true, strobeLights: true, singleRider: true, childSwap: true, earlyMorningAccess: true, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'mk-r3', title: 'Seven Dwarfs Mine Train', type: 'Ride', park: 'Magic Kingdom', context: 'ILL Required', color: '#9ae6b4', rating: 4.7, length: '3 min', description: 'Swinging family coaster through the dwarf mine.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Indoor/Outdoor', heightReq: '38 in', notable: 'Best for Families', dasEligible: true, loudNoises: false, strobeLights: false, childSwap: true, earlyMorningAccess: true, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-r4', title: "Peter Pan's Flight", type: 'Ride', park: 'Magic Kingdom', context: 'Hard to get LL', color: '#fbd38d', rating: 4.5, length: '3 min', description: 'Gentle dark ride soaring over London and Neverland.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Classic Magic', dasEligible: true, loudNoises: false, strobeLights: false, earlyMorningAccess: true, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'mk-r5', title: 'Haunted Mansion', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.8, length: '9 min', description: '999 happy haunts lurk in this iconic dark ride.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'All-Ages Classic', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '12 min walk', closedDuringVisit: false },
    { id: 'mk-r6', title: 'Big Thunder Mountain Railroad', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on AM', defaultStyle: true, rating: 4.6, length: '4 min', description: 'Wildest ride in the wilderness — outdoor mine coaster.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: '40 in', notable: 'Good AM Ride', dasEligible: true, loudNoises: false, strobeLights: false, singleRider: true, childSwap: true, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'mk-r7', title: "Tiana's Bayou Adventure", type: 'Ride', park: 'Magic Kingdom', context: 'Hard to get LL', color: '#9ae6b4', rating: 4.4, length: '9 min', description: 'Log flume celebrating the spirit of New Orleans.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor/Indoor', heightReq: '40 in', notable: 'Gets You Wet', dasEligible: true, loudNoises: false, strobeLights: false, childSwap: true, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-r8', title: 'Pirates of the Caribbean', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.7, length: '15 min', description: 'Classic boat ride through the golden age of piracy.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Long Length', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'mk-r9', title: 'Jungle Cruise', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.5, length: '10 min', description: 'Skipper-led boat tour with audio-animatronic animals and dad jokes.', thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Outdoor', heightReq: 'Any', notable: 'Great for Kids', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '7 min walk', closedDuringVisit: false },
    { id: 'mk-r10', title: 'Under the Sea', type: 'Ride', park: 'Magic Kingdom', context: 'Fast Walk-on', defaultStyle: true, rating: 4.2, length: '6 min', description: 'Musical journey through the Little Mermaid story.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor AC', heightReq: 'Any', notable: 'Omnimover', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-r11', title: 'Buzz Lightyear Space Ranger Spin', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.3, length: '5 min', description: 'Interactive dark ride — blast targets to score points.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor AC', heightReq: 'Any', notable: 'Interactive', dasEligible: true, loudNoises: false, strobeLights: true, travelTime: '6 min walk', closedDuringVisit: false },
    { id: 'mk-r12', title: 'Monsters Inc Laugh Floor', type: 'Show', park: 'Magic Kingdom', context: 'On The Hour', defaultStyle: true, rating: 4.4, length: '20 min', description: 'Live improv comedy show featuring Monsters Inc characters.', environment: 'Indoor AC, Theater', notable: 'Interactive Comedy', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'mk-r13', title: 'Walt Disney World Railroad', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.1, length: '20 min', description: 'Scenic steam train circling the park perimeter.', thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Outdoor', heightReq: 'Any', notable: 'Rest Your Feet', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: 'Main Street', closedDuringVisit: true },
    { id: 'mk-r14', title: "It's a Small World", type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.0, length: '11 min', description: 'Classic boat ride celebrating the children of the world.', thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Indoor AC', heightReq: 'Any', notable: 'Holiday Version Dec', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'mk-r15', title: 'The Many Adventures of Winnie the Pooh', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.2, length: '4 min', description: 'Gentle ride through the Hundred Acre Wood.', thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Indoor AC', heightReq: 'Any', notable: 'Toddler Fave', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '6 min walk', closedDuringVisit: false },
    { id: 'mk-r16', title: 'Mad Tea Party', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 3.8, length: '4 min', description: 'Spinning teacup ride — control the spin yourself.', thrillLevel: 'Moderate', ticketClass: 'Standby Only', environment: 'Outdoor', heightReq: 'Any', notable: 'Spinning', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-r17', title: 'Dumbo the Flying Elephant', type: 'Ride', park: 'Magic Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.1, length: '2 min', description: "Classic aerial ride that's a must for young children.", thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Outdoor', heightReq: 'Any', notable: 'Toddler Must-Do', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '7 min walk', closedDuringVisit: false },
    // ── Magic Kingdom: Shows & Parades ──
    { id: 'mk-s1', title: 'Happily Ever After', type: 'Show', park: 'Magic Kingdom', context: 'Nightly ~9:00 PM', color: '#fbb6ce', rating: 4.9, length: '18 min', description: 'Epic nighttime fireworks spectacular at Cinderella Castle.', environment: 'Outdoor', notable: 'Signature Finale', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '30 min early for spot', closedDuringVisit: false },
    { id: 'mk-s2', title: 'Festival of Fantasy Parade', type: 'Parade', park: 'Magic Kingdom', context: 'Daily 3:00 PM', color: '#fbb6ce', rating: 4.7, length: '12 min', description: 'Grand daytime parade with elaborate floats and Disney characters.', environment: 'Outdoor Route', notable: 'Fire-breathing Dragon', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '15 min to secure spot', closedDuringVisit: false },
    { id: 'mk-s3', title: 'Enchanted Tiki Room', type: 'Show', park: 'Magic Kingdom', context: 'Every 20 min', defaultStyle: true, rating: 4.0, length: '12 min', description: 'Classic singing birds and flowers in the original Disney attraction.', environment: 'Indoor AC, Theater', notable: 'Classic Disney', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '7 min walk', closedDuringVisit: false },
    { id: 'mk-s4', title: 'Move It! Shake It! Celebrate It!', type: 'Parade', park: 'Magic Kingdom', context: 'Multiple Times Daily', defaultStyle: true, rating: 3.9, length: '15 min', description: 'Interactive street party parade through Main Street USA.', environment: 'Outdoor Route', notable: 'Interactive', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: 'Main Street', closedDuringVisit: false },
    // ── Magic Kingdom: Characters ──
    { id: 'mk-c1', title: 'Mickey at Town Square Theater', type: 'Character', park: 'Magic Kingdom', context: 'LL Available', color: '#e9d8fd', rating: 4.9, length: '15 min', description: 'Meet Mickey in his dressing room inside the Town Square Theater.', environment: 'Indoor AC', notable: 'Iconic First Stop', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '1 min walk', closedDuringVisit: false },
    { id: 'mk-c2', title: 'Princesses at Princess Fairytale Hall', type: 'Character', park: 'Magic Kingdom', context: 'LL Available', color: '#e9d8fd', rating: 4.8, length: '20 min', description: 'Meet Cinderella, Rapunzel, and visiting royalty.', environment: 'Indoor AC', notable: 'Rotating Princesses', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-c3', title: 'Tinker Bell at Town Square', type: 'Character', park: 'Magic Kingdom', context: 'Walk-Up', color: '#e9d8fd', rating: 4.5, length: '10 min', description: 'Meet Tink and Pixie Hollow friends in Fantasyland.', environment: 'Indoor AC', notable: 'High Demand', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '6 min walk', closedDuringVisit: false },
    // ── Magic Kingdom: Dining ──
    { id: 'mk-d1', title: 'Be Our Guest Restaurant', type: 'Dining', park: 'Magic Kingdom', context: 'Table Service', color: '#fbd38d', rating: 4.6, length: '75 min', description: 'Dine in the Beast\'s enchanted castle — stunning atmosphere.', environment: 'Indoor, Themed', notable: 'Hard to get Res', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '12 min walk', closedDuringVisit: false },
    { id: 'mk-d2', title: 'Columbia Harbour House', type: 'Dining', park: 'Magic Kingdom', context: 'Quick Service', defaultStyle: true, rating: 4.3, length: '30 min', description: 'Seafood and American classics in a nautical colonial setting.', environment: 'Indoor AC', notable: 'Great Upstairs Seating', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'mk-d3', title: 'Cinderella\'s Royal Table', type: 'Dining', park: 'Magic Kingdom', context: 'Signature', color: '#fbd38d', rating: 4.8, length: '90 min', description: 'Princess dining inside Cinderella Castle — a bucket list meal.', environment: 'Indoor, Themed', notable: 'Book 60 Days Out', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'mk-d4', title: 'Cosmic Ray\'s Starlight Café', type: 'Dining', park: 'Magic Kingdom', context: 'Quick Service', defaultStyle: true, rating: 4.0, length: '20 min', description: 'Largest quick-service at MK — burgers, ribs, chicken in Tomorrowland.', environment: 'Indoor AC', notable: 'Biggest QS', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '3 min walk', closedDuringVisit: false },
    // ── Magic Kingdom: Seasonal ──
    { id: 'mk-sea1', title: 'Mickey\'s Not-So-Scary Halloween Party', type: 'Seasonal', park: 'Magic Kingdom', context: 'Separate Ticket', color: '#f6ad55', rating: 4.9, length: 'Entire Evening', description: 'After-hours event with trick-or-treating, Boo to You Parade, and exclusive villain shows. Typically Aug–Oct.', environment: 'Outdoor, After-Hours', notable: 'Sells Out Fast', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: 'Starts 4 PM', closedDuringVisit: false },
    { id: 'mk-sea2', title: "Mickey's Very Merry Christmas Party", type: 'Seasonal', park: 'Magic Kingdom', context: 'Separate Ticket', color: '#f6ad55', rating: 4.9, length: 'Entire Evening', description: 'After-hours holiday event with snow on Main Street and special parades. Typically Nov–Dec.', environment: 'Outdoor, After-Hours', notable: 'Holiday Must-Do', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: 'Starts 4 PM', closedDuringVisit: false },
    // ── EPCOT: Rides ──
    { id: 'ep-r1', title: 'Guardians of the Galaxy: Cosmic Rewind', type: 'Ride', park: 'Epcot', context: 'Virtual Queue / ILL', color: '#9ae6b4', rating: 4.9, length: '3 min', description: 'Reverse-launching coaster in a dark cosmic setting.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '42 in', notable: 'Reverse Launch', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '25 min monorail', closedDuringVisit: false },
    { id: 'ep-r2', title: 'Test Track', type: 'Ride', park: 'Epcot', context: 'LL Available', color: '#fbd38d', rating: 4.4, length: '5 min', description: 'Design a concept car then test it at high speed.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor/Outdoor', heightReq: '40 in', notable: 'High Speed', dasEligible: true, loudNoises: false, strobeLights: true, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'ep-r3', title: 'Remy\'s Ratatouille Adventure', type: 'Ride', park: 'Epcot', context: 'Hard to get LL', color: '#fbd38d', rating: 4.5, length: '5 min', description: 'Shrink down to Remy\'s size and scurry through Gusteau\'s kitchen.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Best for Young Kids', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'ep-r4', title: 'Mission: SPACE — Orange', type: 'Ride', park: 'Epcot', context: 'Walk-on', defaultStyle: true, rating: 4.3, length: '5 min', description: 'Intense centrifuge that simulates a rocket launch to Mars.', thrillLevel: 'High', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor AC', heightReq: '44 in', notable: 'Motion Sickness Risk', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'ep-r5', title: 'Mission: SPACE — Green', type: 'Ride', park: 'Epcot', context: 'Walk-on', defaultStyle: true, rating: 4.0, length: '5 min', description: 'Tame Earth orbit version — great for the whole family.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor AC', heightReq: 'Any', notable: 'Toddler Safe', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'ep-r6', title: 'Soarin\' Around the World', type: 'Ride', park: 'Epcot', context: 'LL Available', color: '#fbd38d', rating: 4.7, length: '5 min', description: 'Hang-glider simulation over 13 global destinations.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor AC', heightReq: '40 in', notable: 'Scent Effects', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'ep-r7', title: 'Journey of Water', type: 'Ride', park: 'Epcot', context: 'Walk-on', defaultStyle: true, rating: 4.1, length: '12 min', description: 'Walk-through water play experience inspired by Moana.', thrillLevel: 'Mild', ticketClass: 'Standby Only', environment: 'Outdoor', heightReq: 'Any', notable: 'Cooling Break', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'ep-r8', title: 'Frozen Ever After', type: 'Ride', park: 'Epcot', context: 'Hard to get LL', color: '#fbd38d', rating: 4.5, length: '5 min', description: 'Boat ride through the kingdom of Arendelle celebrating summer.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Great for Families', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '12 min walk', closedDuringVisit: false },
    // ── EPCOT: Shows ──
    { id: 'ep-s1', title: 'Luminous the Symphony of Us', type: 'Show', park: 'Epcot', context: 'Nightly ~9:00 PM', color: '#fbb6ce', rating: 4.7, length: '14 min', description: 'World Showcase lagoon nighttime spectacular with projections and fireworks.', environment: 'Outdoor', notable: 'Signature Nighttime', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '20 min early for spot', closedDuringVisit: false },
    { id: 'ep-s2', title: 'Voices of Liberty', type: 'Show', park: 'Epcot', context: 'Multiple Times', defaultStyle: true, rating: 4.6, length: '15 min', description: 'A cappella American patriotic performances inside the American Adventure rotunda.', environment: 'Indoor AC', notable: 'Hidden Gem', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: 'World Showcase', closedDuringVisit: false },
    // ── EPCOT: Dining ──
    { id: 'ep-d1', title: 'Space 220', type: 'Dining', park: 'Epcot', context: 'Signature', color: '#fbd38d', rating: 4.6, length: '90 min', description: 'Dine 220 miles above Earth in this immersive space station restaurant.', environment: 'Indoor, Themed', notable: 'Stellar Views', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'ep-d2', title: 'Le Cellier Steakhouse', type: 'Dining', park: 'Epcot', context: 'Signature', color: '#fbd38d', rating: 4.8, length: '90 min', description: 'AAA Four Diamond steakhouse in the Canada pavilion.', environment: 'Indoor', notable: 'Best Steaks WDW', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: 'World Showcase', closedDuringVisit: false },
    { id: 'ep-d3', title: 'La Cantina de San Angel', type: 'Dining', park: 'Epcot', context: 'Quick Service', defaultStyle: true, rating: 4.2, length: '30 min', description: 'Mexican quick service with outdoor seating on the World Showcase Lagoon.', environment: 'Outdoor', notable: 'Great View', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: 'World Showcase', closedDuringVisit: false },
    // ── EPCOT: Seasonal ──
    { id: 'ep-sea1', title: 'EPCOT International Food & Wine Festival', type: 'Seasonal', park: 'Epcot', context: 'Included w/Admission', color: '#f6ad55', rating: 4.8, length: 'All Day', description: 'World-renowned festival with global marketplace booths, celebrity chef demos, and concerts. Typically Jul–Nov.', environment: 'Outdoor, World Showcase', notable: 'Best Disney Festival', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: 'All Day', closedDuringVisit: false },
    { id: 'ep-sea2', title: 'EPCOT International Flower & Garden Festival', type: 'Seasonal', park: 'Epcot', context: 'Included w/Admission', color: '#f6ad55', rating: 4.7, length: 'All Day', description: 'Spring festival with topiaries, outdoor kitchens, and garden exhibits. Typically Mar–Jun.', environment: 'Outdoor', notable: 'Spring Highlight', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: 'All Day', closedDuringVisit: false },
    { id: 'ep-sea3', title: 'EPCOT International Festival of the Arts', type: 'Seasonal', park: 'Epcot', context: 'Included w/Admission', color: '#f6ad55', rating: 4.6, length: 'All Day', description: 'Celebrating visual, culinary, and performing arts. Typically Jan–Feb.', environment: 'Outdoor', notable: 'Great in Winter', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: 'All Day', closedDuringVisit: false },
    // ── Hollywood Studios: Rides ──
    { id: 'hs-r1', title: 'Star Wars: Rise of the Resistance', type: 'Ride', park: 'Hollywood Studios', context: 'Virtual Queue / ILL', color: '#9ae6b4', rating: 5.0, length: '18 min', description: 'Most immersive Disney attraction ever — captured by First Order, then rescued.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'Best Ride at WDW', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '15 min walk', closedDuringVisit: false },
    { id: 'hs-r2', title: 'Millennium Falcon: Smugglers Run', type: 'Ride', park: 'Hollywood Studios', context: 'LL Available', color: '#fbd38d', rating: 4.5, length: '5 min', description: 'Pilot the Falcon — choose pilot, gunner, or engineer and earn your score.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: '38 in', notable: 'Interactive Roles', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '12 min walk', closedDuringVisit: false },
    { id: 'hs-r3', title: 'Slinky Dog Dash', type: 'Ride', park: 'Hollywood Studios', context: 'Hard to get LL', color: '#fbd38d', rating: 4.6, length: '3 min', description: 'Family coaster through Andy\'s backyard from Toy Story.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: '38 in', notable: 'Family Coaster', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'hs-r4', title: 'Tower of Terror', type: 'Ride', park: 'Hollywood Studios', context: 'LL Available', color: '#fbd38d', rating: 4.8, length: '10 min', description: 'Twilight Zone-inspired drop ride at the Hollywood Tower Hotel.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'True Horror Theming', dasEligible: false, loudNoises: true, strobeLights: true, travelTime: '7 min walk', closedDuringVisit: false },
    { id: 'hs-r5', title: 'Rock \'n\' Roller Coaster', type: 'Ride', park: 'Hollywood Studios', context: 'LL Available', color: '#fbd38d', rating: 4.6, length: '3 min', description: 'Indoor coaster launching 0-60 in 2.8 seconds to an Aerosmith soundtrack.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '48 in', notable: 'Fastest Launch at WDW', dasEligible: false, loudNoises: true, strobeLights: true, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'hs-r6', title: 'Mickey & Minnie\'s Runaway Railway', type: 'Ride', park: 'Hollywood Studios', context: 'LL Available', color: '#fbd38d', rating: 4.7, length: '6 min', description: 'Step into a Mickey cartoon — no height requirement.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'All Ages', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'hs-r7', title: 'Toy Story Mania!', type: 'Ride', park: 'Hollywood Studios', context: 'Walk-on Afternoons', defaultStyle: true, rating: 4.4, length: '7 min', description: 'Carnival game shooting ride through Toy Story worlds.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor AC', heightReq: 'Any', notable: 'Interactive Scoring', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '8 min walk', closedDuringVisit: false },
    // ── Hollywood Studios: Shows ──
    { id: 'hs-s1', title: 'Indiana Jones Epic Stunt Spectacular', type: 'Show', park: 'Hollywood Studios', context: 'Multiple Times Daily', color: '#fbb6ce', rating: 4.6, length: '30 min', description: 'Live stunt show recreating action sequences from Raiders of the Lost Ark.', environment: 'Outdoor Theater', notable: 'Crowd Fave', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'hs-s2', title: 'Fantasmic!', type: 'Show', park: 'Hollywood Studios', context: 'Nightly (Seasonal)', color: '#fbb6ce', rating: 4.8, length: '28 min', description: 'Mickey\'s dream-turned-nightmare nighttime spectacular with water screens and fireworks.', environment: 'Outdoor Amphitheater', notable: 'Night Show Masterpiece', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '45 min early for seats', closedDuringVisit: false },
    { id: 'hs-s3', title: 'Star Wars: A Galactic Spectacular', type: 'Show', park: 'Hollywood Studios', context: 'Nightly', color: '#fbb6ce', rating: 4.7, length: '15 min', description: 'Nighttime fireworks and projection show celebrating the Star Wars saga.', environment: 'Outdoor', notable: 'Nighttime Must-Do', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '20 min early for spot', closedDuringVisit: false },
    // ── Animal Kingdom: Rides ──
    { id: 'ak-r1', title: 'Avatar Flight of Passage', type: 'Ride', park: 'Animal Kingdom', context: 'ILL Recommended', color: '#9ae6b4', rating: 5.0, length: '5 min', description: 'Fly on a banshee over Pandora — the most popular WDW ride.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '44 in', notable: '#1 Rated WDW Ride', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '15 min walk', closedDuringVisit: false },
    { id: 'ak-r2', title: 'Expedition Everest', type: 'Ride', park: 'Animal Kingdom', context: 'LL Available', color: '#fbd38d', rating: 4.7, length: '4 min', description: 'High-speed coaster through the Himalayas — featuring the Yeti.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Outdoor/Indoor', heightReq: '44 in', notable: 'Backwards Section', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'ak-r3', title: 'Kilimanjaro Safaris', type: 'Ride', park: 'Animal Kingdom', context: 'Walk-on AM', defaultStyle: true, rating: 4.8, length: '18 min', description: 'Open-air safari truck through authentic African savanna with live animals.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: 'Any', notable: 'GO EARLY — Animals Active', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'ak-r4', title: 'Na\'vi River Journey', type: 'Ride', park: 'Animal Kingdom', context: 'LL Available', color: '#fbd38d', rating: 4.3, length: '4 min', description: 'Gentle boat ride through bioluminescent Pandora forest.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Stunning AA Shaman', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '15 min walk', closedDuringVisit: false },
    { id: 'ak-r5', title: 'Dinosaur', type: 'Ride', park: 'Animal Kingdom', context: 'Walk-on', defaultStyle: true, rating: 4.1, length: '4 min', description: 'Time rover mission to rescue a dinosaur before the asteroid hits.', thrillLevel: 'High', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'Very Dark & Loud', dasEligible: false, loudNoises: true, strobeLights: true, travelTime: '8 min walk', closedDuringVisit: false },
    // ── Animal Kingdom: Shows ──
    { id: 'ak-s1', title: 'Rivers of Light: We Are One', type: 'Show', park: 'Animal Kingdom', context: 'Nightly', color: '#fbb6ce', rating: 4.4, length: '15 min', description: 'Nighttime spectacular on the Discovery River with floating lanterns and animal films.', environment: 'Outdoor Amphitheater', notable: 'Night Spectacular', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '30 min early for seats', closedDuringVisit: false },
    { id: 'ak-s2', title: 'Finding Nemo: The Big Blue... and Beyond!', type: 'Show', park: 'Animal Kingdom', context: 'Multiple Times Daily', defaultStyle: true, rating: 4.3, length: '30 min', description: 'Theatrical show celebrating Nemo, Marlin, and ocean friends.', environment: 'Indoor Theater, AC', notable: 'Great for Young Kids', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    // ── Disneyland: Rides ──
    { id: 'dl-r1', title: 'Star Wars: Rise of the Resistance', type: 'Ride', park: 'Disneyland', context: 'ILL Recommended', color: '#9ae6b4', rating: 5.0, length: '18 min', description: 'Most immersive attraction ever — captured by First Order, then rescued.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'Best Ride at DL', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dl-r2', title: 'Indiana Jones Adventure', type: 'Ride', park: 'Disneyland', context: 'LL Available', color: '#fbd38d', rating: 4.7, length: '5 min', description: 'Jeep expedition through a cursed temple with Indy himself.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '46 in', notable: 'DL Original', dasEligible: false, loudNoises: true, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dl-r3', title: 'Matterhorn Bobsleds', type: 'Ride', park: 'Disneyland', context: 'Walk-on', defaultStyle: true, rating: 4.5, length: '3 min', description: 'Iconic outdoor coaster through a snowy mountain with the Yeti.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Outdoor', heightReq: '35 in', notable: 'DL Icon', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dl-r4', title: 'Pirates of the Caribbean', type: 'Ride', park: 'Disneyland', context: 'Walk-on', defaultStyle: true, rating: 4.8, length: '16 min', description: 'The original and longest version of this classic boat ride.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 2', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Better than WDW', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'dl-r5', title: 'Haunted Mansion', type: 'Ride', park: 'Disneyland', context: 'Walk-on', defaultStyle: true, rating: 4.9, length: '9 min', description: 'The original Haunted Mansion — slightly different than WDW\'s version.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Holiday Overlay Nov–Jan', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'dl-r6', title: 'Big Thunder Mountain Railroad', type: 'Ride', park: 'Disneyland', context: 'Walk-on AM', defaultStyle: true, rating: 4.6, length: '4 min', description: 'Wildest ride in the wilderness — outdoor mine coaster through red rock.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: '40 in', notable: 'Iconic Canyon Setting', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dl-r7', title: 'Space Mountain', type: 'Ride', park: 'Disneyland', context: 'LL Available', color: '#fbd38d', rating: 4.5, length: '3 min', description: 'Slightly different track layout from WDW — still a classic space coaster.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'Classic DL', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '5 min walk', closedDuringVisit: false },
    { id: 'dl-r8', title: 'Splash Mountain (Tiana\'s Bayou Adventure)', type: 'Ride', park: 'Disneyland', context: 'Reopening Soon', color: '#fbd38d', rating: 4.4, length: '9 min', description: 'Log flume reimagining featuring Tiana and New Orleans characters.', thrillLevel: 'Moderate', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: '40 in', notable: 'Check Status', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: true },
    // ── Disneyland: Shows & Parades ──
    { id: 'dl-s1', title: 'Wondrous Journeys', type: 'Show', park: 'Disneyland', context: 'Nightly', color: '#fbb6ce', rating: 4.7, length: '20 min', description: 'Nighttime fireworks show celebrating 100 years of Disney.', environment: 'Outdoor', notable: 'Must-See', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '30 min early for spot', closedDuringVisit: false },
    { id: 'dl-s2', title: 'Magic Happens Parade', type: 'Parade', park: 'Disneyland', context: 'Multiple Times Daily', color: '#fbb6ce', rating: 4.8, length: '20 min', description: 'Vibrant daytime parade honoring magical Disney movie moments.', environment: 'Outdoor Route', notable: 'Newer Parade', dasEligible: true, loudNoises: true, strobeLights: false, travelTime: '20 min to secure spot', closedDuringVisit: false },
    // ── Disneyland: Seasonal ──
    { id: 'dl-sea1', title: 'Oogie Boogie Bash', type: 'Seasonal', park: 'Disneyland', context: 'Separate Ticket', color: '#f6ad55', rating: 4.9, length: 'Entire Evening', description: 'Halloween ticketed event at DCA — villains-themed with exclusive treats and shows. Typically Aug–Oct.', environment: 'Outdoor, After-Hours', notable: 'DCA Event', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: 'Starts 3 PM', closedDuringVisit: false },
    { id: 'dl-sea2', title: 'Merriest Nites', type: 'Seasonal', park: 'Disneyland', context: 'Separate Ticket', color: '#f6ad55', rating: 4.8, length: 'Entire Evening', description: 'Holiday after-hours event at Disneyland with unique entertainment. Typically Nov–Jan.', environment: 'Outdoor, After-Hours', notable: 'Holiday Must-Do', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: 'Starts 4 PM', closedDuringVisit: false },
    // ── DCA: Rides ──
    { id: 'dca-r1', title: 'WEB SLINGERS: A Spider-Man Adventure', type: 'Ride', park: "Disney's California Adventure", context: 'LL Available', color: '#fbd38d', rating: 4.5, length: '4 min', description: 'Interactive web-slinging ride to collect Spider-Bots.', thrillLevel: 'Mild', ticketClass: 'LL Multi Pass Tier 1', environment: 'Indoor, Dark', heightReq: 'Any', notable: 'Interactive', dasEligible: true, loudNoises: false, strobeLights: true, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dca-r2', title: 'Guardians of the Galaxy – Mission: BREAKOUT!', type: 'Ride', park: "Disney's California Adventure", context: 'LL Available', color: '#fbd38d', rating: 4.8, length: '3 min', description: 'Random drop/rise tower ride with Guardians music and visuals.', thrillLevel: 'High', ticketClass: 'LL Single Pass', environment: 'Indoor, Dark', heightReq: '40 in', notable: 'Best Drop Ride', dasEligible: false, loudNoises: true, strobeLights: true, travelTime: '8 min walk', closedDuringVisit: false },
    { id: 'dca-r3', title: 'Incredicoaster', type: 'Ride', park: "Disney's California Adventure", context: 'Walk-on PM', defaultStyle: true, rating: 4.4, length: '2 min', description: 'High-speed outdoor coaster through Pixar Pier.', thrillLevel: 'High', ticketClass: 'LL Multi Pass Tier 1', environment: 'Outdoor', heightReq: '48 in', notable: 'Best Coaster at DCA', dasEligible: false, loudNoises: false, strobeLights: false, travelTime: '10 min walk', closedDuringVisit: false },
    { id: 'dca-r4', title: 'Radiator Springs Racers', type: 'Ride', park: "Disney's California Adventure", context: 'ILL Recommended', color: '#9ae6b4', rating: 4.9, length: '7 min', description: 'Convertible race through Cars Land – the best theming at DCA.', thrillLevel: 'Moderate', ticketClass: 'LL Single Pass', environment: 'Outdoor/Indoor', heightReq: '40 in', notable: 'Best Theming DCA', dasEligible: true, loudNoises: false, strobeLights: false, travelTime: '12 min walk', closedDuringVisit: false },
    // ── DCA: Shows ──
    { id: 'dca-s1', title: 'World of Color', type: 'Show', park: "Disney's California Adventure", context: 'Nightly', color: '#fbb6ce', rating: 4.7, length: '22 min', description: 'Fountain and projection night show at Paradise Bay.', environment: 'Outdoor', notable: 'Standing Show', dasEligible: true, loudNoises: true, strobeLights: true, travelTime: '30 min early', closedDuringVisit: false },
  ];

  type ActivityItem = {
    id: string;
    title: string;
    type: string; // 'ride' | 'dining' | 'show' | 'parade' | 'character' | 'break' | 'meal'
    park?: string;
    context?: string;
    researchId?: string;
    description?: string;
    reason?: string;
    // timing fields
    waitMins?: number;        // estimated line wait
    durationMins?: number;   // ride/show/meal duration
    travelMinsToNext?: number; // walk/transit to NEXT attraction
    // meal break fields
    isMealBreak?: boolean;
    mealWindowMins?: number; // ± tolerance in minutes
    // metadata
    length?: string;
    thrillLevel?: string;
    ticketClass?: string;
    heightReq?: string;
    environment?: string;
    dasEligible?: boolean;
    loudNoises?: boolean;
    strobeLights?: boolean;
    earlyMorningAccess?: boolean;
    travelTime?: string;
  };
  const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityItem | null>(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);


  // INTERACTIVE DAILY ITINERARY — ordered queue model
  const dragItem = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const draggedResearchItem = useRef<any | null>(null);

  // Day range state: dayStart in minutes-since-midnight
  const [dayStart, setDayStart] = useState(7 * 60); // 7:00 AM
  const [dayEnd, setDayEnd] = useState(22 * 60); // 10:00 PM

  // ALL_HOURS for the selector dropdowns (15-min granularity for start/end)
  const ALL_HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6..23
  const formatHour = (h: number) => {
    const period = h < 12 ? 'AM' : 'PM';
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(display).padStart(2, '0')}:00 ${period}`;
  };
  // Format total minutes → "HH:MM AM/PM"
  const formatMins = (totalMins: number): string => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    const period = h < 12 ? 'AM' : 'PM';
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${String(display).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: '1', title: 'Rope Drop Arrival', type: 'break', context: 'Arrive 45 mins early', waitMins: 0, durationMins: 30 },
    { id: '2', title: 'Space Mountain', type: 'ride', context: 'Hard to get LL', waitMins: 10, durationMins: 3, ticketClass: 'LL Multi Pass Tier 1', thrillLevel: 'Moderate' },
    { id: '3', title: 'Seven Dwarfs Mine Train', type: 'ride', context: 'Requires ILL', waitMins: 5, durationMins: 3, ticketClass: 'LL Single Pass', thrillLevel: 'Moderate' },
    { id: '4', title: 'Lunch at Be Our Guest', type: 'meal', context: 'Reservation Confirmed', waitMins: 0, durationMins: 75, isMealBreak: true, mealWindowMins: 15 },
    { id: '5', title: 'Festival of Fantasy Parade', type: 'show', context: 'Stake out a spot 20 min early', waitMins: 20, durationMins: 12 },
    { id: '6', title: 'Hotel Nap / Pool Time', type: 'break', context: '1–2 hrs', waitMins: 0, durationMins: 90, isMealBreak: false },
    { id: '7', title: 'Haunted Mansion', type: 'ride', context: 'Standby Walk-on', waitMins: 20, durationMins: 9, thrillLevel: 'Mild' },
    { id: '8', title: 'Happily Ever After', type: 'show', context: 'Dessert Party', waitMins: 30, durationMins: 18 },
  ]);

  // ── Zone lookup: attraction title → park zone key ──────────────────────────
  const ATTRACTION_ZONE: Record<string, string> = {
    // Magic Kingdom zones
    'TRON Lightcycle / Run': 'mk-tomorrowland', 'Space Mountain': 'mk-tomorrowland',
    'Monsters Inc Laugh Floor': 'mk-tomorrowland', 'Buzz Lightyear Space Ranger Spin': 'mk-tomorrowland',
    'Cosmic Ray\'s Starlight Café': 'mk-tomorrowland',
    'Seven Dwarfs Mine Train': 'mk-fantasyland', 'Peter Pan\'s Flight': 'mk-fantasyland',
    'It\'s a Small World': 'mk-fantasyland', 'The Many Adventures of Winnie the Pooh': 'mk-fantasyland',
    'Mad Tea Party': 'mk-fantasyland', 'Dumbo the Flying Elephant': 'mk-storybook',
    'Under the Sea': 'mk-storybook', 'Princesses at Princess Fairytale Hall': 'mk-fantasyland',
    'Tinker Bell at Town Square': 'mk-fantasyland', 'Be Our Guest Restaurant': 'mk-fantasyland',
    'Haunted Mansion': 'mk-liberty', 'Columbia Harbour House': 'mk-liberty',
    'Tiana\'s Bayou Adventure': 'mk-frontierland', 'Big Thunder Mountain Railroad': 'mk-frontierland',
    'Enchanted Tiki Room': 'mk-adventureland', 'Pirates of the Caribbean': 'mk-adventureland',
    'Jungle Cruise': 'mk-adventureland',
    'Walt Disney World Railroad': 'mk-mainstreet', 'Mickey at Town Square Theater': 'mk-mainstreet',
    'Move It! Shake It! Celebrate It!': 'mk-mainstreet', 'Cinderella\'s Royal Table': 'mk-hub',
    'Festival of Fantasy Parade': 'mk-mainstreet', 'Happily Ever After': 'mk-hub',
    'Mickey\'s Not-So-Scary Halloween Party': 'mk-hub', 'Mickey\'s Very Merry Christmas Party': 'mk-hub',
    // Epcot zones
    'Guardians of the Galaxy: Cosmic Rewind': 'ep-worlds', 'Test Track': 'ep-worlds',
    'Mission: SPACE — Orange': 'ep-worlds', 'Mission: SPACE — Green': 'ep-worlds',
    'Soarin\' Around the World': 'ep-worlds', 'Journey of Water': 'ep-worlds',
    'Space 220': 'ep-worlds', 'Luminous the Symphony of Us': 'ep-showcase',
    'Frozen Ever After': 'ep-showcase-n', 'Remy\'s Ratatouille Adventure': 'ep-showcase-f',
    'Voices of Liberty': 'ep-showcase', 'Le Cellier Steakhouse': 'ep-showcase',
    'La Cantina de San Angel': 'ep-showcase',
    // Hollywood Studios zones
    'Star Wars: Rise of the Resistance': 'hs-swge', 'Millennium Falcon: Smugglers Run': 'hs-swge',
    'Slinky Dog Dash': 'hs-toy', 'Tower of Terror': 'hs-sunset',
    'Rock \u2019n\u2019 Roller Coaster': 'hs-sunset', 'Mickey & Minnie\'s Runaway Railway': 'hs-hollywood',
    'Indiana Jones Epic Stunt Spectacular': 'hs-echo',
    // Animal Kingdom zones
    'Avatar Flight of Passage': 'ak-pandora', 'Na\'vi River Journey': 'ak-pandora',
    'Expedition Everest': 'ak-asia', 'Kali River Rapids': 'ak-asia',
    'Kilimanjaro Safaris': 'ak-africa',
  };

  // ── Zone-to-zone base walk times in minutes ───────────────────────────────
  //   Using a simplified symmetric distance matrix. Zones not in the table
  //   fall back to DEFAULT_WALK.
  const DEFAULT_WALK = 8;
  const ZONE_WALK: Record<string, Record<string, number>> = {
    // Magic Kingdom
    'mk-mainstreet': { 'mk-hub': 2, 'mk-tomorrowland': 5, 'mk-fantasyland': 9, 'mk-storybook': 11, 'mk-liberty': 10, 'mk-frontierland': 10, 'mk-adventureland': 8 },
    'mk-hub': { 'mk-mainstreet': 2, 'mk-tomorrowland': 4, 'mk-fantasyland': 5, 'mk-storybook': 7, 'mk-liberty': 7, 'mk-frontierland': 7, 'mk-adventureland': 6 },
    'mk-tomorrowland': { 'mk-mainstreet': 5, 'mk-hub': 4, 'mk-fantasyland': 8, 'mk-storybook': 10, 'mk-liberty': 12, 'mk-frontierland': 14, 'mk-adventureland': 12 },
    'mk-fantasyland': { 'mk-mainstreet': 9, 'mk-hub': 5, 'mk-tomorrowland': 8, 'mk-storybook': 3, 'mk-liberty': 6, 'mk-frontierland': 11, 'mk-adventureland': 13 },
    'mk-storybook': { 'mk-mainstreet': 11, 'mk-hub': 7, 'mk-tomorrowland': 10, 'mk-fantasyland': 3, 'mk-liberty': 8, 'mk-frontierland': 13, 'mk-adventureland': 15 },
    'mk-liberty': { 'mk-mainstreet': 10, 'mk-hub': 7, 'mk-tomorrowland': 12, 'mk-fantasyland': 6, 'mk-storybook': 8, 'mk-frontierland': 5, 'mk-adventureland': 7 },
    'mk-frontierland': { 'mk-mainstreet': 10, 'mk-hub': 7, 'mk-tomorrowland': 14, 'mk-fantasyland': 11, 'mk-storybook': 13, 'mk-liberty': 5, 'mk-adventureland': 4 },
    'mk-adventureland': { 'mk-mainstreet': 8, 'mk-hub': 6, 'mk-tomorrowland': 12, 'mk-fantasyland': 13, 'mk-storybook': 15, 'mk-liberty': 7, 'mk-frontierland': 4 },
    // Epcot
    'ep-worlds': { 'ep-showcase': 14, 'ep-showcase-n': 18, 'ep-showcase-f': 20 },
    'ep-showcase': { 'ep-worlds': 14, 'ep-showcase-n': 8, 'ep-showcase-f': 10 },
    'ep-showcase-n': { 'ep-worlds': 18, 'ep-showcase': 8, 'ep-showcase-f': 5 },
    'ep-showcase-f': { 'ep-worlds': 20, 'ep-showcase': 10, 'ep-showcase-n': 5 },
    // Hollywood Studios
    'hs-swge': { 'hs-toy': 10, 'hs-sunset': 12, 'hs-hollywood': 14, 'hs-echo': 12 },
    'hs-toy': { 'hs-swge': 10, 'hs-sunset': 8, 'hs-hollywood': 10, 'hs-echo': 8 },
    'hs-sunset': { 'hs-swge': 12, 'hs-toy': 8, 'hs-hollywood': 6, 'hs-echo': 7 },
    'hs-hollywood': { 'hs-swge': 14, 'hs-toy': 10, 'hs-sunset': 6, 'hs-echo': 8 },
    'hs-echo': { 'hs-swge': 12, 'hs-toy': 8, 'hs-sunset': 7, 'hs-hollywood': 8 },
    // Animal Kingdom
    'ak-pandora': { 'ak-asia': 10, 'ak-africa': 12 },
    'ak-asia': { 'ak-pandora': 10, 'ak-africa': 6 },
    'ak-africa': { 'ak-pandora': 12, 'ak-asia': 6 },
  };

  // ── Lookup walk time between two activity titles ──────────────────────────
  const _activeAdv = adventures.find((a: { id: string }) => a.id === activeAdventureId);
  const hasStroller = (_activeAdv as { guests?: { hasStroller?: boolean }[] } | undefined)?.guests?.some(g => g.hasStroller) ?? false;
  const STROLLER_MULTIPLIER = hasStroller ? 1.35 : 1.0;

  const getWalkMins = (fromTitle: string, toTitle: string): number => {
    const fromZone = ATTRACTION_ZONE[fromTitle];
    const toZone = ATTRACTION_ZONE[toTitle];
    if (!fromZone || !toZone || fromZone === toZone) return fromZone === toZone ? 2 : DEFAULT_WALK;
    const base = ZONE_WALK[fromZone]?.[toZone] ?? ZONE_WALK[toZone]?.[fromZone] ?? DEFAULT_WALK;
    return Math.round(base * STROLLER_MULTIPLIER);
  };

  // Compute running arrival time for each activity
  const computedTimes = (() => {
    const times: number[] = [];
    let cursor = dayStart;
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      times.push(cursor);
      const wait = act.waitMins ?? 0;
      const duration = act.durationMins ?? 30;
      // Walk to the NEXT activity (computed from zones, not stored)
      const next = activities[i + 1];
      const travel = next ? getWalkMins(act.title, next.title) : 0;
      cursor += wait + duration + travel;
    }
    return times;
  })();

  // Expose computed walk to next for display in the connector pill
  const computedWalkToNext = (index: number): number => {
    if (index >= activities.length - 1) return 0;
    return getWalkMins(activities[index].title, activities[index + 1].title);
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedResearchItem.current !== null) {
      const research = draggedResearchItem.current;
      const newItem: ActivityItem = {
        id: `act_${crypto.randomUUID()}`,
        title: research.title,
        type: research.type.toLowerCase(),
        context: research.context,
        researchId: research.id,
        description: research.description,
        reason: 'Added manually from Research Assistant',
        waitMins: 15,
        durationMins: research.length ? parseInt(research.length, 10) || 20 : 20,
        // travelMinsToNext intentionally omitted — computed dynamically from zones
        length: research.length,
        thrillLevel: research.thrillLevel,
        ticketClass: research.ticketClass,
        heightReq: research.heightReq,
        environment: research.environment,
        dasEligible: research.dasEligible,
        loudNoises: research.loudNoises,
        strobeLights: research.strobeLights,
        travelTime: research.travelTime,
      };
      const _activities = [...activities];
      _activities.splice(dropIndex, 0, newItem);
      setActivities(_activities);
      draggedResearchItem.current = null;
    } else if (dragItem.current !== null && dragItem.current !== dropIndex) {
      const _activities = [...activities];
      const [moved] = _activities.splice(dragItem.current, 1);
      _activities.splice(dropIndex, 0, moved);
      setActivities(_activities);
      dragItem.current = null;
    }
  };

  // WIZARD STATE
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    name: 'Summer Magic 2026',
    startDate: '',
    endDate: '',
    parks: ['Magic Kingdom', 'Epcot'],
    pacing: 'moderate' as 'intense' | 'moderate' | 'relaxed',
    primaryFocus: 'classic' as 'thrills' | 'toddlers' | 'classic' | 'shows',
    dining: 'quick' as 'snacks' | 'quick' | 'table' | 'signature',
    breakStrategy: 'power' as 'power' | 'hotel' | 'pool',
    singleRiderAllowed: false,
    dasAllowed: false,
    llMultiPassAllowed: false,
    llSinglePassAllowed: false,
    arrivalIntent: 'leisurely' as 'rope-drop' | 'leisurely' | 'evening-only',
    onSite: true,
    hotelName: '',
    splurgeAppetite: 'moderate' as 'low' | 'moderate' | 'high',
    premiumInterests: [] as string[],
    diningReservationIntent: false,
    guests: [] as GuestContent[]
  });

  const handleWizardComplete = () => {
    // Generate ID only when the handler is executed (event context)
    const uniqueId = new Date().getTime();
    const newAdv: Adventure = {
      id: `adv_${uniqueId}`,
      name: wizardData.name,
      resortId: wizardData.parks.some(p => p.includes('Disneyland') || p.includes('California')) ? 'DL' : 'WDW',
      startDate: wizardData.startDate || new Date().toISOString().split('T')[0],
      endDate: wizardData.endDate || new Date(uniqueId + 86400000 * 5).toISOString().split('T')[0],
      status: 'planning',
      onSite: wizardData.onSite,
      hotelName: wizardData.onSite ? wizardData.hotelName : undefined,
      parks: wizardData.parks.length > 0 ? wizardData.parks : ['Magic Kingdom'],
      guests: wizardData.guests,
      breakStrategy: wizardData.breakStrategy,
      pacing: wizardData.pacing,
      primaryFocus: wizardData.primaryFocus,
      diningStrategy: wizardData.dining,
      singleRiderAllowed: wizardData.singleRiderAllowed,
      dasAllowed: wizardData.dasAllowed,
      llMultiPassAllowed: wizardData.llMultiPassAllowed,
      llSinglePassAllowed: wizardData.llSinglePassAllowed,
      arrivalIntent: wizardData.arrivalIntent,
      splurgeAppetite: wizardData.splurgeAppetite,
      premiumInterests: wizardData.premiumInterests,
      diningReservationIntent: wizardData.diningReservationIntent,
    };
    setAdventures([...adventures, newAdv]);
    setActiveAdventureId(newAdv.id);
    setActiveView('trip_dashboard');
  };

  // ACCOUNT SETUP STATE
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState({
    plannerName: '',
    travelStyle: 'moderate' as 'intense' | 'moderate' | 'relaxed',
    favoritePark: 'Magic Kingdom'
  });

  const handleSetupComplete = () => {
    // In a real app, this would save to user profile
    setMembers(prev => {
      const exists = prev.find(m => m.name === setupData.plannerName);
      if (exists) return prev;
      return [...prev, { id: Date.now(), name: setupData.plannerName, age: 30, height: 70, allergies: 'None', email: '', surveyCompleted: false }];
    });
    setSetupStep(1);
    setActiveView('home');
  };

  return (
    <AlphaGate>
      <div className={`min-h-screen bg-parchment text-obsidian font-sans flex flex-col ${(activeView === 'guest_survey' || activeView === 'account_setup') ? 'guest-survey-mode' : ''}`}>
      
      {/* Global Top Nav for Sub-Views */}
      {activeView !== 'guest_survey' && activeView !== 'account_setup' && activeView !== 'home' && (
        <header className="w-full flex justify-between items-center px-8 py-4 border-b border-slate/15 bg-white shrink-0">
           <div className="flex items-center gap-4">
              <button title="The Journal" onClick={() => setActiveView('home')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate hover:text-navy transition-colors">
                 <ArrowRight size={14} className="rotate-180" /> The Journal
              </button>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-parchment rounded-none shadow-sm border border-slate/15 p-1 relative">
                <select 
                  className="bg-transparent border border-transparent pl-3 pr-8 py-1.5 text-[10px] font-black uppercase tracking-widest text-obsidian outline-none cursor-pointer appearance-none z-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231A1A1B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center]"
                  value={activeAdventureId} 
                  onChange={(e) => setActiveAdventureId(e.target.value)}
                  title="Switch Active Trip"
                >
                  {adventures.map(adv => (
                    <option key={adv.id} value={adv.id}>{adv.name}</option>
                  ))}
                </select>
              </div>
           </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${activeView !== 'home' ? 'p-8' : 'p-0'}`}>
        
        {/* 0. THE JOURNAL (HOME) */}
        {activeView === 'home' && (
          <div className="view-home animate-in fade-in duration-500 w-full flex flex-col items-center py-12 px-6">
            
            {/* Header Greeting */}
            <div className="text-center mb-16 flex flex-col items-center">
               <div className="mb-8 p-3 bg-obsidian rounded-none border border-slate/20 flex items-center justify-center">
                 <Shield size={32} className="text-parchment" />
               </div>
               <h1 className="text-4xl md:text-5xl font-header text-obsidian tracking-tight">Welcome, Patchen. Your Journey Awaits.</h1>
            </div>

            <div className="w-full max-w-5xl">
               
               {/* The Four Experience Collections */}
               <div className="flex flex-col gap-12 w-full max-w-6xl mx-auto">
                  
                  {/* The Daily Pulse */}
                  <div>
                     <h3 className="text-3xl font-header text-obsidian mb-6 pb-4 border-b border-slate/15">The Daily Pulse</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => setActiveView('home')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><Home size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Hearth</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Your central gathering place for today's highlights.</p>
                        </div>
                        <div onClick={() => {
                           const activeAdv = adventures.find(a => a.status !== 'past');
                           if (activeAdv) {
                              setActiveAdventureId(activeAdv.id);
                              setActiveView('trip_dashboard');
                           } else {
                              setActiveView('new_trip');
                           }
                        }} className="bg-white border-2 border-thistle rounded-none p-6 flex flex-col cursor-pointer hover:bg-thistle transition-all group overflow-hidden relative md:col-span-2">
                           <div className="absolute top-0 right-0 p-2 text-thistle group-hover:text-white">
                              <Compass size={16} />
                           </div>
                           <div className="mb-4 text-[#947120] group-hover:text-white"><Compass size={28} /></div>
                           <h4 className="text-2xl font-header text-thistle group-hover:text-white mb-2 truncate">The Active Adventure</h4>
                           <p className="text-slate font-sans tracking-tight text-sm overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white/80">Your live, time-synced journey through the park.</p>
                           <span className="mt-8 text-xs font-black uppercase tracking-widest text-thistle group-hover:text-white flex justify-between items-center">
                             The Golden Anchor
                             <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                           </span>
                        </div>
                        <div onClick={() => setActiveView('map')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden md:col-span-3">
                           <div className="mb-4 text-obsidian"><Map size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Compass</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Our "Logic over Luck" interactive guide to the magic around you.</p>
                        </div>
                     </div>
                  </div>

                  {/* The Grand Plan */}
                  <div>
                     <h3 className="text-3xl font-header text-obsidian mb-6 pb-4 border-b border-slate/15">The Grand Plan</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => setActiveView('adventures')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><MapPin size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Intelligent Blueprint</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Your master strategic vision.</p>
                        </div>
                        <div onClick={() => setActiveView('calendar')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><Calendar size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Magic Window</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Predictive crowd modeling and timing.</p>
                        </div>
                        <div onClick={() => setActiveView('transportation')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><Compass size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Royal Carriage</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Refined logistics for transit and arrivals.</p>
                        </div>
                     </div>
                  </div>

                  {/* Pillar Three: The Library & Provisions */}
                  <div>
                     <h3 className="text-3xl font-header text-obsidian mb-6 pb-4 border-b border-slate/15">The Field Kit</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => setActiveView('library')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><BookOpen size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Library of Whispers</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Curated secrets, menus, and hidden details.</p>
                        </div>
                        <div onClick={() => setActiveView('packing')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><Briefcase size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Traveler's Trunk</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Contextual packing and gear checklists.</p>
                        </div>
                        <div onClick={() => setActiveView('crew')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden">
                           <div className="mb-4 text-obsidian"><Users size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Inner Circle</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Managing your family, friends, and shared access keys.</p>
                        </div>
                     </div>
                  </div>

                  {/* The Keepsake */}
                  <div>
                     <h3 className="text-3xl font-header text-obsidian mb-6 pb-4 border-b border-slate/15">The Keepsake</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div onClick={() => setActiveView('keepsake')} className="bg-white border border-slate/15 rounded-none p-6 flex flex-col cursor-pointer hover:border-b-2 hover:border-b-thistle transition-all group overflow-hidden md:col-span-3 lg:col-span-1">
                           <div className="mb-4 text-obsidian"><ShieldCheck size={24} /></div>
                           <h4 className="text-xl font-header text-obsidian mb-2 truncate">The Digital Gallery</h4>
                           <p className="text-slate font-sans tracking-tight text-xs overflow-hidden text-ellipsis whitespace-nowrap">Your archival record and post-trip "Echo."</p>
                        </div>
                     </div>
                  </div>

               </div>
               
               {/* Footer / Settings Access from Dashboard */}
               <div className="mt-16 pt-8 border-t border-slate/15 flex justify-center">
                  <button title="System Preferences" onClick={() => setActiveView('settings')} className="text-[10px] font-black uppercase tracking-widest text-slate hover:text-obsidian flex items-center gap-2 transition-colors">
                     <Settings size={14} /> System Preferences
                  </button>
               </div>

            </div>
          </div>
        )}

          {/* 1. UNIFIED TRIP DASHBOARD VIEW */}
          {activeView === 'trip_dashboard' && (() => {
            const activeAdv = adventures.find(a => a.id === activeAdventureId);
            if (!activeAdv) return null;
            return (
              <div className="view-trip-dashboard animate-in fade-in zoom-in-95 duration-500">
                <div className="hero-section mb-10 bg-navy text-white p-12 rounded-3xl relative overflow-hidden flex flex-col gap-8 items-stretch">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl -mr-48 -mt-48 mix-blend-screen pointer-events-none"></div>

                  {/* Top Row: Title, Edit, and Weather */}
                  <div className="relative z-10 flex justify-between items-end w-full">
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h1 className="text-5xl font-header m-0 leading-none">{activeAdv.name}</h1>
                        <button
                          onClick={() => {
                            setWizardData({
                              name: activeAdv.name,
                              startDate: activeAdv.startDate,
                              endDate: activeAdv.endDate,
                              onSite: activeAdv.onSite,
                              hotelName: activeAdv.hotelName || '',
                              parks: activeAdv.parks,
                              guests: activeAdv.guests,
                              breakStrategy: activeAdv.breakStrategy,
                              pacing: activeAdv.pacing,
                              primaryFocus: activeAdv.primaryFocus,
                              dining: activeAdv.diningStrategy,
                              singleRiderAllowed: activeAdv.singleRiderAllowed || false,
                              dasAllowed: activeAdv.dasAllowed || false,
                              llMultiPassAllowed: activeAdv.llMultiPassAllowed || false,
                              llSinglePassAllowed: activeAdv.llSinglePassAllowed || false,
                              arrivalIntent: activeAdv.arrivalIntent || 'leisurely',
                              splurgeAppetite: activeAdv.splurgeAppetite || 'moderate',
                              premiumInterests: activeAdv.premiumInterests || [],
                              diningReservationIntent: activeAdv.diningReservationIntent || false
                            });
                            setWizardStep(1);
                            setActiveView('new_trip');
                          }}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          <Settings size={12} /> Edit Trip
                        </button>
                      </div>
                      <p className="opacity-60 text-lg mt-4">{activeAdv.parks.join(', ')} • {new Date(activeAdv.startDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-4 shrink-0">
                      <div className="bg-white/10 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md border border-white/5">
                        <CloudRain size={24} className="text-white/60" />
                        <div className="text-left">
                          <span className="block text-[8px] uppercase tracking-widest text-gold mb-0.5">Forecast</span>
                          <span className="block font-black text-xl leading-none">74°F</span>
                          <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-1">Scattered Showers</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Planner Params & Context */}
                  <div className="relative z-10 flex items-stretch gap-6 pt-6 border-t border-white/10 w-full">
                    <div className="flex bg-white/5 rounded-2xl p-2 border border-white/10">
                      <div className="px-4 py-2 flex flex-col gap-1 border-r border-white/10">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Mid-Day Break</label>
                        <select aria-label="Strategy" title="Strategy" className="bg-transparent font-bold text-sm outline-none text-white cursor-pointer" value={breakStrategy} onChange={e => {
                          const val = e.target.value as 'power' | 'hotel' | 'pool';
                          setBreakStrategy(val);
                          updateActiveAdv({ breakStrategy: val });
                        }}>
                          <option value="power" className="text-navy">Power Through</option>
                          <option value="hotel" className="text-navy">Hotel Break</option>
                          <option value="pool" className="text-navy">Pool Break</option>
                        </select>
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1 border-r border-white/10">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Pacing</label>
                        <select aria-label="Pacing" title="Pacing" className="bg-transparent font-bold text-sm outline-none text-white cursor-pointer" value={rideCountGoal} onChange={e => {
                          const val = e.target.value as 'intense' | 'moderate' | 'relaxed';
                          setRideCountGoal(val);
                          updateActiveAdv({ pacing: val });
                        }}>
                          <option value="intense" className="text-navy">Intense</option>
                          <option value="moderate" className="text-navy">Moderate</option>
                          <option value="relaxed" className="text-navy">Relaxed</option>
                        </select>
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1 border-r border-white/10">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Primary Focus</label>
                        <select aria-label="Primary Focus" title="Primary Focus" className="bg-transparent font-bold text-sm outline-none text-white cursor-pointer" value={primaryFocus} onChange={e => {
                          const val = e.target.value as 'thrills' | 'toddlers' | 'classic' | 'shows';
                          setPrimaryFocus(val);
                          updateActiveAdv({ primaryFocus: val });
                        }}>
                          <option value="thrills" className="text-navy">Thrill Seekers</option>
                          <option value="toddlers" className="text-navy">Toddler Friendly</option>
                          <option value="classic" className="text-navy">Classic Magic</option>
                          <option value="shows" className="text-navy">Shows & Characters</option>
                        </select>
                      </div>
                      <div className="px-4 py-2 flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase tracking-widest opacity-40">Dining</label>
                        <select aria-label="Dining Strategy" title="Dining Strategy" className="bg-transparent font-bold text-sm outline-none text-white cursor-pointer" value={diningStrategy} onChange={e => {
                          const val = e.target.value as 'snacks' | 'quick' | 'table' | 'signature';
                          setDiningStrategy(val);
                          updateActiveAdv({ diningStrategy: val });
                        }}>
                          <option value="snacks" className="text-navy">Snacks Only</option>
                          <option value="quick" className="text-navy">Quick Service</option>
                          <option value="table" className="text-navy">Table Service</option>
                          <option value="signature" className="text-navy">Signature Dining</option>
                        </select>
                      </div>
                    </div>

                    {/* Accommodation Context placed in Header */}
                    <div className="flex-1 bg-gold/10 border border-gold/20 rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <MapPin size={20} className="text-gold" />
                      </div>
                      <div className="text-left flex-1 pl-2">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-black text-[10px] uppercase tracking-widest text-gold">{activeAdv.onSite ? 'On-Site Resort Guest' : 'Off-Site Guest'}</h5>
                          {activeAdv.onSite && activeAdv.hotelName && (
                            <>
                              <span className="text-gold opacity-40">•</span>
                              <span className="font-bold text-sm text-white">{activeAdv.hotelName}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[10px] opacity-60 leading-tight">
                          {activeAdv.onSite ? 'Travel times to hotel prioritized for midday breaks. Eligible for early park entry and 7-day advance LL.' : 'Eligible for 3-day advance LL reservations.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Interactive Daily Itinerary */}
                  <div className="col-span-6 flex flex-col gap-6">
                    <div className="luxury-card p-10 flex-1">
                      <div className="flex justify-between items-center mb-5 border-b border-navy/5 pb-5">
                        <div>
                          <h3 className="text-2xl font-header text-navy">Daily Itinerary</h3>
                          <p className="text-sm opacity-60 mt-1">Drag and drop activities to organize your day.</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="btn-primary-mini flex items-center justify-center gap-2 w-[140px]">
                            <Sparkles size={16} /> Build For Me
                          </button>
                          <button className="btn-primary-mini flex items-center justify-center gap-2 w-[140px]">
                            <CheckCircle size={16} /> Lock Plan
                          </button>
                        </div>
                      </div>

                      {/* ── Who's Coming ──────────────────────────────────── */}
                      <div className="mb-6 relative">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 mr-1 flex items-center gap-1"><Users size={11} /> Who's Coming</span>
                          {activeAdv.guests.length === 0 && (
                            <span className="text-[11px] text-navy/40 italic">No group members added yet.</span>
                          )}
                          {activeAdv.guests.map(g => (
                            <div key={g.id} className="flex items-center gap-1.5 bg-white border border-navy/10 rounded-full px-3 py-1.5 shadow-sm">
                              <div className="w-5 h-5 rounded-full bg-gold/80 text-navy text-[10px] font-black flex items-center justify-center shrink-0">
                                {g.name.charAt(0)}
                              </div>
                              <span className="text-xs font-bold text-navy">{g.name}</span>
                              {g.surveyCompleted && <CheckCircle size={11} className="text-teal shrink-0" />}
                              <button
                                title={`Remove ${g.name} from this trip`}
                                onClick={() => setAdventures(prev => prev.map(adv =>
                                  adv.id === activeAdventureId
                                    ? { ...adv, guests: adv.guests.filter(x => x.id !== g.id) }
                                    : adv
                                ))}
                                className="text-navy/20 hover:text-rose transition-colors ml-0.5"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          ))}

                          {/* Add Member button + dropdown */}
                          <div className="relative">
                            <button
                              onClick={() => setShowGuestPicker(v => !v)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-dashed border-navy/20 text-navy/50 hover:border-gold hover:text-gold transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                              <UserPlus size={11} /> Add Member
                            </button>

                            {showGuestPicker && (
                              <div className="absolute top-full left-0 mt-2 z-30 w-72 bg-white rounded-2xl shadow-2xl border border-navy/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="px-4 py-3 border-b border-navy/5 flex items-center justify-between">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">Family & Friends</span>
                                  <button title="Close" onClick={() => setShowGuestPicker(false)} className="text-navy/30 hover:text-navy"><X size={14} /></button>
                                </div>
                                {members.length === 0 && (
                                  <div className="px-4 py-5 text-xs text-navy/40 text-center italic">No family or friends added yet. Add them in Family & Friends.</div>
                                )}
                                <div className="max-h-64 overflow-y-auto">
                                  {members.map(m => {
                                    const isOnTrip = activeAdv.guests.some(g => g.id === m.id);
                                    return (
                                      <button
                                        key={m.id}
                                        onClick={() => {
                                          setAdventures(prev => prev.map(adv => {
                                            if (adv.id !== activeAdventureId) return adv;
                                            if (isOnTrip) return { ...adv, guests: adv.guests.filter(g => g.id !== m.id) };
                                            return { ...adv, guests: [...adv.guests, m] };
                                          }));
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isOnTrip ? 'bg-teal/5 hover:bg-teal/10' : 'hover:bg-navy/3'}`}
                                      >
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${isOnTrip ? 'bg-teal text-white' : 'bg-gold/20 text-navy'}`}>
                                          {isOnTrip ? <CheckCircle size={14} /> : m.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <span className="font-bold text-sm block truncate">{m.name}</span>
                                          <span className="text-[10px] text-navy/40">Age {m.age} · {m.height && `${m.height} in`}{m.allergies !== 'None' ? ` · ⚠ ${m.allergies}` : ''}</span>
                                        </div>
                                        {isOnTrip && <span className="text-[9px] font-black uppercase text-teal shrink-0">On Trip</span>}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* ── Day Hours Selector ────────────────────────────── */}
                      <div className="flex items-center gap-4 mb-7 p-4 bg-navy/[0.025] rounded-2xl border border-navy/5">
                        <div className="flex items-center gap-2 flex-1 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest text-navy/50 shrink-0">
                            <Clock size={11} className="inline -mt-0.5 mr-1" />Your Day
                          </span>
                          <select
                            aria-label="Day start time"
                            title="Day start time"
                            value={dayStart}
                            onChange={(e) => setDayStart(Number(e.target.value))}
                            className="text-xs font-bold bg-white border border-navy/10 rounded-xl px-3 py-2 text-navy outline-none focus:border-gold transition-colors cursor-pointer"
                          >
                            {ALL_HOURS.filter(h => h * 60 < dayEnd).map(h => (
                              <option key={h} value={h * 60}>{formatHour(h)}</option>
                            ))}
                          </select>
                          <span className="text-xs font-black text-navy/30">→</span>
                          <select
                            aria-label="Day end time"
                            title="Day end time"
                            value={dayEnd}
                            onChange={(e) => setDayEnd(Number(e.target.value))}
                            className="text-xs font-bold bg-white border border-navy/10 rounded-xl px-3 py-2 text-navy outline-none focus:border-gold transition-colors cursor-pointer"
                          >
                            {ALL_HOURS.filter(h => h * 60 > dayStart).map(h => (
                              <option key={h} value={h * 60}>{formatHour(h)}</option>
                            ))}
                          </select>
                          <span className="text-[11px] font-bold text-navy/40">{Math.round((dayEnd - dayStart) / 60)} hrs</span>
                        </div>

                        {/* Park Hours Reference */}
                        <div className="flex items-center gap-4 shrink-0 pl-6 border-l border-white/10 ml-2">
                          <div className="flex flex-col gap-2">
                            {(activeAdv?.parks ?? []).slice(0, 2).map((park, pi) => {
                              // Mock park hours keyed by park name
                              const PARK_HOURS: Record<string, { open: string; close: string; earlyEntry?: string; extendedEvening?: string }> = {
                                'Magic Kingdom': { open: '09:00 AM', close: '11:00 PM', earlyEntry: '08:30 AM', extendedEvening: '11:00 PM - 1:00 AM' },
                                'Epcot': { open: '09:00 AM', close: '09:30 PM', earlyEntry: '08:30 AM', extendedEvening: '9:30 PM - 11:30 PM' },
                                'Hollywood Studios': { open: '09:00 AM', close: '09:00 PM', earlyEntry: '08:30 AM' },
                                'Animal Kingdom': { open: '08:00 AM', close: '06:00 PM', earlyEntry: '07:30 AM' },
                                'Disneyland': { open: '08:00 AM', close: '12:00 AM', earlyEntry: '07:30 AM' },
                                "Disney's California Adventure": { open: '08:00 AM', close: '10:00 PM', earlyEntry: '07:30 AM' },
                              };
                              const hours = PARK_HOURS[park] ?? { open: '09:00 AM', close: '09:00 PM' };

                              return (
                                <div key={pi} className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-navy/50 w-28 truncate">{park}</span>
                                    <span className="text-sm font-bold text-navy">{hours.open} – {hours.close}</span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mt-1">
                                    {hours.earlyEntry && (
                                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shrink-0 ${activeAdv?.onSite ? 'bg-gold/10 text-navy border-gold/20' : 'bg-navy/5 text-navy/40 border-navy/10'}`}>
                                        <Crown size={10} />
                                        <span>Early Entry {hours.earlyEntry}</span>
                                        {!activeAdv?.onSite && <span className="opacity-50 ml-1 lowercase">(resort only)</span>}
                                      </div>
                                    )}
                                    {hours.extendedEvening && (
                                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shrink-0 ${activeAdv?.onSite ? 'bg-purple-500/10 text-navy border-purple-500/20' : 'bg-navy/5 text-navy/40 border-navy/10'}`}>
                                        <Moon size={10} />
                                        <span>Ext Hrs {hours.extendedEvening}</span>
                                        {!activeAdv?.onSite && <span className="opacity-50 ml-1 lowercase">(deluxe resort only)</span>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* ── Itinerary Queue ── */}
                      <div className="space-y-1">
                        {activities.map((activity, index) => {
                          const arrivalMins = computedTimes[index];
                          const arrivalTime = formatMins(arrivalMins);
                          const isPastDayEnd = arrivalMins >= dayEnd;
                          const isMeal = activity.type === 'meal' || activity.isMealBreak;
                          const isBreak = activity.type === 'break' && !isMeal;

                          return (
                            <div key={activity.id}>
                              {/* ── Drop Zone / Walk Connector Between Items ── */}
                              <div
                                className="relative flex items-center gap-3 mx-0 my-0.5 cursor-copy group/drop"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(index)}
                                title="Drop here to insert"
                              >
                                {/* line left of time column */}
                                <div className="w-28 shrink-0 flex justify-end pr-4">
                                  {index > 0 && (activity.travelMinsToNext === undefined || (activities[index - 1]?.travelMinsToNext ?? 0) > 0) ? (
                                    <span className="text-[9px] font-black text-navy/25 uppercase tracking-widest"></span>
                                  ) : null}
                                </div>
                                {/* walk pill in the gap */}
                                {index > 0 && computedWalkToNext(index - 1) > 0 ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/6 border border-navy/20 text-[10px] font-black text-navy/70 uppercase tracking-widest">
                                    <ArrowRight size={10} className="text-navy/35" />
                                    {computedWalkToNext(index - 1)} min walk
                                    {hasStroller && <span className="text-[8px] font-black text-navy/40 ml-0.5">(w/ stroller)</span>}
                                  </div>
                                ) : (
                                  <div className="h-2 flex-1 rounded-full group-hover/drop:bg-gold/10 border-2 border-transparent group-hover/drop:border-dashed group-hover/drop:border-gold/40 transition-all" />
                                )}
                              </div>

                              <div
                                className={`flex gap-4 items-stretch group ${isPastDayEnd ? 'opacity-40' : ''}`}
                                draggable={!isBreak}
                                onDragStart={() => { dragItem.current = index; }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(index)}
                              >
                                {/* ── Time Column ── */}
                                <div className="w-28 shrink-0 flex flex-col items-end justify-center pr-4 border-r-2 border-teal/40 gap-0.5">
                                  <span className="text-sm font-black text-teal uppercase tracking-wider">{arrivalTime}</span>
                                </div>

                                {/* ── Card ── */}
                                <div className="flex-1">

                                  {isMeal ? (
                                    // ── Meal Break Card ────────────────────────────────────────
                                    <div className="min-h-[64px] flex items-center gap-4 px-5 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 group/meal relative">
                                      <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                                        <Utensils size={16} />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-bold text-sm text-orange-700 block">{activity.title}</span>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          {activity.context && (
                                            <span className="text-[10px] text-orange-600/70 font-bold uppercase tracking-widest">{activity.context}</span>
                                          )}
                                          {activity.durationMins && (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-orange-500/80 uppercase tracking-widest">
                                              <Clock size={9} /> {activity.durationMins} min
                                            </span>
                                          )}
                                          {(activity.mealWindowMins ?? 0) > 0 && (
                                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-100 px-1.5 py-0.5 rounded-full border border-orange-200">
                                              ±{activity.mealWindowMins}m window
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 shrink-0">Meal</span>
                                      <button
                                        title="Remove meal break"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-orange-100 text-orange-400 hover:bg-orange-200 hover:text-orange-600 transition-colors opacity-0 group-hover/meal:opacity-100"
                                        onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ) : isBreak ? (
                                    // ── Rest/Break Card ────────────────────────────────────────
                                    <div className="min-h-[64px] flex items-center gap-4 px-5 py-3 rounded-2xl border-2 border-dashed border-teal/30 bg-teal/5 group/break relative">
                                      <div className="w-9 h-9 rounded-xl bg-teal/15 text-teal flex items-center justify-center shrink-0">
                                        <Coffee size={16} />
                                      </div>
                                      <div className="flex-1">
                                        <span className="font-bold text-sm text-teal block">{activity.title}</span>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          {activity.context && (
                                            <span className="text-[10px] text-teal/70 font-bold uppercase tracking-widest">{activity.context}</span>
                                          )}
                                          {activity.durationMins && (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-teal/50 uppercase tracking-widest">
                                              <Clock size={9} /> {activity.durationMins} min
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <span className="text-[9px] font-black uppercase tracking-widest text-teal/40 shrink-0">Break</span>
                                      <button
                                        title="Remove break"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-teal/10 text-teal/40 hover:bg-rose/10 hover:text-rose transition-colors opacity-0 group-hover/break:opacity-100"
                                        onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    // ── Activity Card ──────────────────────────────────────────
                                    <div className="min-h-[64px] p-4 rounded-2xl border-2 border-navy/15 bg-white hover:border-gold/60 shadow-sm cursor-grab active:cursor-grabbing transition-all flex items-center gap-4 relative group/act">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                        ${activity.type === 'ride' ? 'bg-gold/10 text-gold' :
                                          activity.type === 'show' || activity.type === 'parade' ? 'bg-teal/10 text-teal' :
                                            activity.type === 'dining' ? 'bg-rose/10 text-rose' :
                                              activity.type === 'character' ? 'bg-purple-100 text-purple-500' :
                                                'bg-navy/5 text-navy'}
                                      `}>
                                        {activity.type === 'ride' ? <Rocket size={18} /> :
                                          activity.type === 'dining' ? <Utensils size={18} /> :
                                            activity.type === 'show' || activity.type === 'parade' ? <Star size={18} /> :
                                              <Coffee size={18} />}
                                      </div>
                                      <div className="text-left flex-1 pr-8">
                                        <div className="flex items-center flex-wrap gap-2 mb-1">
                                          <h4
                                            className="font-bold text-sm text-navy cursor-pointer hover:underline"
                                            onClick={() => setSelectedActivityForDetails(activity)}
                                          >
                                            {activity.title}
                                          </h4>
                                          {activity.ticketClass && (
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/30">{activity.ticketClass}</span>
                                          )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                                          <span className="text-[10px] uppercase font-black tracking-widest text-navy/50">{activity.type}</span>
                                          {activity.context && (
                                            <span className={`text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full
                                              ${activity.context.includes('ILL') ? 'bg-gold/10 text-gold border border-gold/30' :
                                                activity.context.includes('LL') ? 'bg-gold/10 text-gold-dark border border-gold/40' :
                                                  'bg-navy/8 text-navy/70 border border-navy/20'}`}>
                                              {activity.context}
                                            </span>
                                          )}
                                          {activity.durationMins && (
                                            <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-widest text-navy/40">
                                              <Clock size={9} /> {activity.durationMins} min
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {/* Wait time — large badge on far right */}
                                      {(activity.waitMins ?? 0) > 0 && (
                                        <div className="shrink-0 flex flex-col items-center justify-center text-center px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 mr-8">
                                          <span className="text-xl font-black text-amber-700 leading-none">{activity.waitMins}</span>
                                          <span className="text-[8px] font-black uppercase tracking-widest text-amber-500 mt-0.5">min wait</span>
                                        </div>
                                      )}
                                      <button
                                        title="Remove activity"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-navy/5 text-navy/30 hover:bg-rose/10 hover:text-rose transition-colors opacity-0 group-hover/act:opacity-100"
                                        onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* ── Final Drop Zone + Add Break row ── */}
                        <div
                          className="h-2 rounded-full hover:h-5 hover:bg-gold/10 border-2 border-transparent hover:border-dashed hover:border-gold/40 mx-6 cursor-copy transition-all"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(activities.length)}
                          title="Drop here to append"
                        />
                        <div className="flex items-center gap-2 pt-2 pl-32 flex-wrap">
                          {[
                            { label: '☕ Snack', title: 'Snack Break', ctx: '15 min', dur: 15, travel: 5 },
                            { label: '😴 Rest', title: 'Rest & Recharge', ctx: '30 min', dur: 30, travel: 10 },
                            { label: '🏊 Pool', title: 'Pool / Cool-Down', ctx: '1–2 hrs', dur: 90, travel: 15 },
                            { label: '🏨 Hotel', title: 'Hotel Break', ctx: '1–2 hrs', dur: 90, travel: 15 },
                            { label: '🍽 Meal', title: 'Meal Break', ctx: '', dur: 60, travel: 10, isMeal: true },
                          ].map(b => (
                            <button
                              key={b.label}
                              title={`Add: ${b.title}`}
                              onClick={() => setActivities([...activities, {
                                id: `break_${Date.now()}`,
                                title: b.title,
                                type: b.isMeal ? 'meal' : 'break',
                                context: b.ctx || undefined,
                                waitMins: 0,
                                durationMins: b.dur,
                                travelMinsToNext: b.travel,
                                isMealBreak: b.isMeal,
                                mealWindowMins: b.isMeal ? 20 : undefined,
                              }])}
                              className="px-3 py-1.5 text-[10px] font-black rounded-xl bg-white text-navy/60 border border-navy/10 hover:border-gold/40 hover:text-navy transition-all whitespace-nowrap shadow-sm"
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cast & Strategy Details */}
                  <div className="col-span-6 flex flex-col gap-8">

                    {/* Embedded Adventure Group */}
                    <div className="luxury-card p-6 text-left border-t-4 border-gold">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-header flex items-center gap-3"><Users size={20} className="text-gold" /> Adventure Group</h4>
                        <span className="badge-gold">{activeAdv.guests.length} Members</span>
                      </div>
                      {activeAdv.guests.length > 0 ? (
                        <div className="space-y-4">
                          {activeAdv.guests.map(g => (
                            <div key={g.id} className="flex items-center gap-4 p-4 bg-navy/[0.02] rounded-xl border border-navy/5">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-navy/40 text-lg shadow-sm shrink-0">
                                {g.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-base block truncate pr-2">{g.name}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {g.surveyCompleted && (
                                      <div title="Preferences Saved"><CheckCircle size={14} className="text-teal shrink-0" /></div>
                                    )}
                                    <button
                                      onClick={() => openSurveyForGuest(g)}
                                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors ${g.surveyCompleted ? 'bg-navy/5 hover:bg-navy/10 text-navy/50 hover:text-navy/80' : 'bg-gold/10 hover:bg-gold/20 text-gold'}`}
                                    >
                                      <Sparkles size={10} /> {g.surveyCompleted ? 'Re-take' : 'Take Survey'}
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] opacity-60">
                                  <span>Age {g.age}</span>
                                  <span className="w-1 h-1 rounded-full bg-navy/20"></span>
                                  <span>{g.height} in</span>
                                  {g.allergies !== 'None' && (
                                    <>
                                      <span className="w-1 h-1 rounded-full bg-navy/20"></span>
                                      <span className="text-rose font-bold">{g.allergies}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center border-dashed border-2 border-navy/10 rounded-xl">
                          <p className="text-xs opacity-40">No group members added yet.</p>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-navy/10">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-xs font-black uppercase tracking-widest opacity-50">Invite Members</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {members.filter(m => !activeAdv.guests.some(g => g.id === m.id)).map(availableMember => (
                            <button
                              title={`Add ${availableMember.name}`}
                              key={availableMember.id}
                              onClick={() => {
                                setAdventures(adventures.map(a => a.id === activeAdv.id ? { ...a, guests: [...a.guests, availableMember] } : a));
                              }}
                              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-navy/5 text-navy hover:bg-gold/20 hover:text-gold rounded-full transition-colors flex items-center gap-1"
                            >
                              <Plus size={10} /> {availableMember.name || 'Unnamed'}
                            </button>
                          ))}
                          <button
                            title="Create a new adventure group member"
                            onClick={() => {
                              setEditingMember({ id: Date.now(), name: '', age: 0, height: 0, allergies: 'None', email: '', surveyCompleted: false });
                              setEditingMemberSource('adventure');
                            }}
                            className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-navy hover:bg-gold hover:text-navy rounded-full transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <UserPlus size={12} /> + New Group Member
                          </button>
                        </div>
                      </div>
                    </div>



                    {/* Research Quick Access */}
                    <div className="rounded-[24px] border border-navy/5 shadow-[0_4px_20px_rgba(10,25,41,0.03)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(10,25,41,0.06)] transition-all duration-400 p-6 bg-gradient-to-br from-navy to-[#1a3345] text-white text-left relative overflow-hidden flex flex-col flex-1 min-h-[500px]">
                      <div className="relative z-10 shrink-0">
                        <BookOpen size={24} className="text-gold mb-4" />
                        <h4 className="text-lg font-header mb-2">Research Assistant</h4>
                        <p className="text-xs text-white/80 mb-4 leading-relaxed">Filter by park and category, then drag into your itinerary.</p>
                        <input
                          aria-label="Search attractions"
                          title="Search attractions"
                          type="text"
                          placeholder="Search attractions..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          className="w-full bg-white/20 border border-white/40 rounded-xl p-3 text-sm placeholder:text-white/60 outline-none focus:border-gold transition-colors mb-4 text-white"
                        />

                        {/* Park Filter — no All Parks button */}
                        <div className="flex gap-2 overflow-x-auto mb-3 custom-scrollbar">
                          {activeAdv.parks.map(park => (
                            <button
                              key={park}
                              onClick={() => setParkFilter(park)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border
                                 ${parkFilter === park ? 'bg-white text-navy border-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white'}`}
                            >
                              {park.replace("Disney's ", '').replace('Disney ', '').split(' ')[0]}
                            </button>
                          ))}
                        </div>

                        {/* Category Filter — no All button */}
                        <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                          {researchCategories.map(cat => (
                            <button
                              key={cat}
                              onClick={() => setResearchFilter(cat)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors border
                                ${researchFilter === cat
                                  ? 'bg-gold text-navy border-gold'
                                  : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white'}
                              `}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Attraction Results */}
                      <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {(() => {
                          const filtered = mockResearchItems
                            .filter(item => item.park.toLowerCase() === parkFilter.toLowerCase())
                            .filter(item => item.type === researchFilter)
                            .filter(item => !searchText || item.title.toLowerCase().includes(searchText.toLowerCase()) || item.description.toLowerCase().includes(searchText.toLowerCase()));
                          if (filtered.length === 0) return (
                            <div className="text-center py-8 text-white/40 text-xs font-bold uppercase tracking-widest">No attractions match your filters</div>
                          );
                          return filtered.map(item => (
                            <div
                              key={item.id}
                              className={`p-4 rounded-xl border cursor-grab active:cursor-grabbing transition-all group flex flex-col gap-3 ${item.closedDuringVisit
                                ? 'bg-white/5 border-white/15 opacity-60'
                                : 'bg-white/10 border-white/30 hover:border-gold/80'
                                }`}
                              draggable={!item.closedDuringVisit}
                              onDragStart={() => { if (!item.closedDuringVisit) draggedResearchItem.current = item; }}
                              onDragEnd={() => { draggedResearchItem.current = null; }}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {item.closedDuringVisit && (
                                      <span className="text-[9px] font-black uppercase tracking-widest bg-rose/20 text-rose border border-rose/30 px-1.5 py-0.5 rounded-full shrink-0">🔧 Closed</span>
                                    )}
                                    <h5 className={`font-bold text-sm group-hover:text-gold transition-colors ${item.closedDuringVisit ? 'line-through opacity-60' : ''}`}>{item.title}</h5>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{item.type}</span>
                                    {item.defaultStyle ? (
                                      <span className="text-[8px] font-black uppercase tracking-widest text-white/90 bg-white/20 px-1.5 py-0.5 rounded border border-white/40">
                                        {item.context}
                                      </span>
                                    ) : (
                                      <span
                                        className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border"
                                        style={{ color: item.color, backgroundColor: `${item.color}33`, borderColor: `${item.color}66` }}
                                      >
                                        {item.context}
                                      </span>
                                    )}
                                    {item.ticketClass && <span className="text-[8px] font-black uppercase tracking-widest text-gold bg-gold/10 px-1.5 py-0.5 rounded border border-gold/30">{item.ticketClass}</span>}
                                  </div>
                                </div>
                                {item.rating && (
                                  <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                                    <Star size={12} className="text-gold fill-gold" />
                                    <span className="text-xs font-bold text-white/90">{item.rating}</span>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-white/70 leading-relaxed border-l-2 border-white/10 pl-3">
                                {item.description}
                              </p>

                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                                {item.length && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase font-bold tracking-wider">
                                    <Clock size={12} className="text-white/40" /> {item.length}
                                  </div>
                                )}
                                {item.heightReq && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase font-bold tracking-wider">
                                    <Ruler size={12} className="text-white/40" /> {item.heightReq}
                                  </div>
                                )}
                                {item.thrillLevel && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase font-bold tracking-wider">
                                    <Activity size={12} className={item.thrillLevel === 'High' ? 'text-rose' : 'text-white/40'} /> {item.thrillLevel} Thrill
                                  </div>
                                )}
                                {item.environment && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-white/60 uppercase font-bold tracking-wider">
                                    <MapPin size={12} className="text-white/40" /> {item.environment}
                                  </div>
                                )}
                                {/* travelTime intentionally suppressed — walk time is computed dynamically */}
                              </div>
                              <div className="flex flex-col gap-3 mt-4">
                                {(item.dasEligible || Boolean((item as Record<string, unknown>).singleRider) || Boolean((item as Record<string, unknown>).childSwap) || Boolean((item as Record<string, unknown>).earlyMorningAccess)) && (
                                  <div>
                                    <span className="text-[7px] uppercase font-black text-white/30 block mb-1.5 tracking-[2px]">Rules & Options</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.dasEligible && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal/10 border border-teal/20 text-[9px] text-teal-light font-black uppercase tracking-widest" title="DAS Eligible">
                                          <Accessibility size={10} /> DAS
                                        </div>
                                      )}
                                      {Boolean((item as Record<string, unknown>).earlyMorningAccess) && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-[9px] text-orange-300 font-black uppercase tracking-widest" title="Early Morning Entry Available">
                                          <Crown size={10} /> Early Morning Access
                                        </div>
                                      )}
                                      {Boolean((item as Record<string, unknown>).singleRider) && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-[9px] text-purple-300 font-black uppercase tracking-widest" title="Single Rider Line Available">
                                          <Users size={10} /> Single Rider
                                        </div>
                                      )}
                                      {Boolean((item as Record<string, unknown>).childSwap) && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-[9px] text-sky-300 font-black uppercase tracking-widest" title="Child Switch / Rider Swap Available">
                                          <RefreshCw size={10} /> Child Switch
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {(item.loudNoises || item.strobeLights) && (
                                  <div>
                                    <span className="text-[7px] uppercase font-black text-white/30 block mb-1.5 tracking-[2px]">Warnings</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {item.loudNoises && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose/10 border border-rose/20 text-[9px] text-rose-light font-black uppercase tracking-widest" title="Loud Noises">
                                          <Volume2 size={10} /> Loud Noises
                                        </div>
                                      )}
                                      {item.strobeLights && (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-[9px] text-gold-light font-black uppercase tracking-widest" title="Strobe Lights">
                                          <Zap size={10} /> Strobes
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {item.notable && (
                                <div className="mt-1 flex items-start gap-2 bg-navy/20 p-2 rounded-lg border border-white/5">
                                  <Info size={12} className="text-blue-300 mt-0.5 shrink-0" />
                                  <span className="text-[10px] text-white/80 leading-tight"><strong>Notable:</strong> {item.notable}</span>
                                </div>
                              )}
                              {!item.closedDuringVisit && (
                                <button
                                  title={`Add ${item.title} to itinerary`}
                                  onClick={() => {
                                    const firstEmpty = activities.findIndex(a => a === null);
                                    if (firstEmpty !== -1) {
                                      const updated = [...activities];
                                      updated[firstEmpty] = { id: `ra_${item.id}`, title: item.title, type: item.type.toLowerCase(), context: item.context, researchId: item.id, description: item.description, length: item.length, thrillLevel: item.thrillLevel, ticketClass: item.ticketClass, heightReq: item.heightReq, environment: item.environment, dasEligible: item.dasEligible, loudNoises: item.loudNoises, strobeLights: item.strobeLights, earlyMorningAccess: (item as Record<string, unknown>).earlyMorningAccess as boolean, travelTime: item.travelTime };
                                      setActivities(updated);
                                    }
                                  }}
                                  className="w-full mt-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-colors flex items-center justify-center gap-1"
                                >
                                  <ArrowRight size={10} /> Add to Itinerary
                                </button>
                              )}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                </div >
              </div >
            );
          })()}

          {/* 3. CREW HUB VIEW */}
          {
            activeView === 'crew' && (
              <div className="view-crew">
                <div className="flex justify-between items-center mb-10">
                  <div className="text-left">
                    <h2 className="text-3xl font-header mb-2">Family & Friends</h2>
                    <p className="opacity-60">Manage registered members for all your adventures.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingMember({ id: Date.now(), name: '', age: 0, height: 0, allergies: 'None', email: '', surveyCompleted: false });
                      setEditingMemberSource('global');
                    }}
                    className="btn-primary-mini flex items-center gap-2"
                  >
                    <UserPlus size={16} /> Add New Member
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-header flex items-center gap-2"><Users size={20} className="text-gold" /> The Roster</h3>
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {members.map((member, index) => (
                         <div key={member.id} className="luxury-card p-6 flex flex-col gap-6 group hover:border-gold/30 transition-all text-left relative bg-white border border-navy/5 shadow-sm">
                           <button
                             onClick={() => { setEditingMember({ ...member }); setEditingMemberSource('global'); }}
                             className="absolute inset-0 z-0 cursor-pointer"
                             aria-label={`Edit ${member.name}`}
                           />
                           <div className="flex justify-between items-start relative z-10 pointer-events-none">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-navy/5 rounded-2xl flex items-center justify-center font-black text-navy/40">
                                 {index + 1}
                               </div>
                               <div>
                                 <h4 className="font-bold text-lg text-navy">{member.name || 'New Member'}</h4>
                                 <span className="text-[10px] text-navy/40 uppercase font-black tracking-widest">{member.email || 'No email provided'}</span>
                               </div>
                             </div>
                             <button
                               title="Delete Member"
                               onClick={(e) => { e.stopPropagation(); setMembers(members.filter(m => m.id !== member.id)); }}
                               className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose/5 rounded-lg pointer-events-auto"
                             >
                               <Plus size={16} className="rotate-45 text-rose/40 hover:text-rose" />
                             </button>
                           </div>

                           <div className="grid grid-cols-4 gap-3 relative z-10 pointer-events-none">
                             <div className="bg-navy/[0.02] p-3 rounded-xl border border-navy/5">
                               <label className="text-[8px] font-black opacity-40 text-navy block uppercase mb-1">Inches</label>
                               <span className="font-bold text-sm text-navy">{member.height || '--'}</span>
                             </div>
                             <div className="bg-navy/[0.02] p-3 rounded-xl border border-navy/5">
                               <label className="text-[8px] font-black opacity-40 text-navy block uppercase mb-1">Age</label>
                               <span className="font-bold text-sm text-navy">{member.age || '--'}</span>
                             </div>
                             <div className="bg-navy/[0.02] p-3 rounded-xl col-span-2 border border-navy/5">
                               <label className="text-[8px] font-black opacity-40 text-navy block uppercase mb-1">Allergies</label>
                               <span className="font-bold text-sm text-navy truncate block">{member.allergies || 'None'}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Co-Planners Column */}
                  <div className="lg:col-span-4 flex flex-col gap-6">
                     <div className="flex justify-between items-center mb-0">
                        <h3 className="text-xl font-header flex items-center gap-2"><Key size={20} className="text-gold" /> Co-Planners</h3>
                     </div>
                     <div className="luxury-card p-6 border border-navy/5 shadow-sm bg-gradient-to-br from-white to-navy/5 relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl -mt-16 -mr-16 pointer-events-none"></div>
                        <p className="text-xs text-navy/60 mb-6 relative z-10">Invite family members to view the itinerary, or grant them edit access to help plan the magic.</p>
                        
                        <div className="space-y-3 relative z-10 mb-8">
                           {/* Existing Co-Planner */}
                           <div className="bg-white border border-navy/5 p-4 rounded-2xl flex items-center justify-between shadow-sm group">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">LU</div>
                                 <div className="text-left">
                                    <span className="font-bold text-sm text-navy block mb-0.5">Lauren Uchiyama</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 flex items-center gap-1 w-fit"><Settings size={8} /> Editor</span>
                                 </div>
                              </div>
                              <button className="text-navy/20 hover:text-navy transition-colors" title="Manage Role"><ChevronDown size={16} /></button>
                           </div>

                           {/* Pending Invitation */}
                           <div className="bg-white/50 border border-navy/5 p-4 rounded-2xl flex items-center justify-between group">
                              <div className="flex items-center gap-3 opacity-60">
                                 <div className="w-8 h-8 rounded-full border border-dashed border-navy/30 text-navy/40 flex items-center justify-center text-xs font-bold"><Mail size={12} /></div>
                                 <div className="text-left">
                                    <span className="font-bold text-sm text-navy block mb-0.5">grandma@example.com</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/40 bg-navy/5 px-1.5 py-0.5 rounded border border-navy/10 flex items-center gap-1 w-fit"><Eye size={8} /> Viewer (Pending)</span>
                                 </div>
                              </div>
                              <button className="text-rose/40 hover:text-rose transition-colors" title="Cancel Invite"><Plus size={16} className="rotate-45" /></button>
                           </div>
                        </div>

                        {/* Invite Form */}
                        <div className="mt-auto relative z-10 p-5 bg-white rounded-2xl border border-navy/5 shadow-sm">
                           <h4 className="font-header text-sm text-navy mb-3">Send Invitation</h4>
                           <div className="space-y-3">
                              <input type="email" placeholder="Email address..." className="w-full bg-navy/5 border border-transparent rounded-lg px-3 py-2 text-xs font-bold text-navy outline-none focus:border-gold transition-colors" />
                              <div className="flex gap-2">
                                 <select title="Select Role" className="flex-1 bg-navy/5 border border-transparent rounded-lg px-3 py-2 text-xs font-bold text-navy outline-none focus:border-gold transition-colors cursor-pointer appearance-none">
                                    <option value="viewer">Viewer</option>
                                    <option value="editor">Editor</option>
                                 </select>
                                 <button className="bg-navy text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-colors break-keep whitespace-nowrap">Invite</button>
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>
                </div>
              </div>
            )
          }




          {/* 4. THE LIBRARY VIEW */}
          {activeView === 'library' && (
            <div className="view-library animate-in fade-in zoom-in-95 duration-300">
              <div className="text-left mb-8">
                <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><BookOpen className="text-gold" /> The Library</h2>
                <p className="opacity-60">Explore attractions, dining, shows, and experiences to build your perfect trip.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
                  <input
                    title="Search library"
                    type="text"
                    placeholder="Search for rides, restaurants, or experiences..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-navy/10 bg-white/50 backdrop-blur-md shadow-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all font-bold text-navy"
                  />
                </div>
                <div className="flex bg-navy/5 p-1.5 rounded-2xl overflow-x-auto shrink-0 custom-scrollbar items-center border border-navy/5">
                  {['All', ...researchCategories].map(cat => (
                    <button
                      key={cat}
                      title={`Filter by ${cat}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setResearchFilter(cat)}
                      className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${researchFilter === cat ? 'bg-white text-navy shadow-[0_2px_10px_rgba(10,25,41,0.06)] scale-100' : 'text-navy/50 hover:text-navy hover:bg-navy/5 scale-95 hover:scale-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-wrap gap-2 mb-8 items-center bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-navy/5 shadow-sm">
                <Filter size={14} className="text-navy/40 ml-2 mr-1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 mr-2">Filter by Park:</span>
                {['All Parks', 'Magic Kingdom', 'Epcot', 'Hollywood Studios', 'Animal Kingdom'].map(park => (
                  <button
                    key={park}
                    title={`Filter by ${park}`}
                    onClick={() => setParkFilter(park)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${parkFilter === park ? 'bg-navy text-white border-navy shadow-md' : 'bg-white text-navy/60 border-navy/10 hover:border-gold/50 hover:text-gold hover:shadow-sm'}`}
                  >
                    {park}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockResearchItems
                  .filter(item => parkFilter === 'All Parks' || item.park.toLowerCase() === parkFilter.toLowerCase())
                  .filter(item => researchFilter === 'All' || item.type === researchFilter)
                  .filter(item => !searchText || item.title.toLowerCase().includes(searchText.toLowerCase()) || item.description.toLowerCase().includes(searchText.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="luxury-card overflow-hidden group hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(10,25,41,0.08)] transition-all duration-400 flex flex-col items-start text-left border border-navy/5 bg-white relative">
                      <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-300 group-hover:h-2 ${item.type === 'Ride' ? 'bg-gradient-to-r from-gold to-yellow-300' : item.type === 'Dining' ? 'bg-gradient-to-r from-rose to-pink-400' : item.type === 'Show' ? 'bg-gradient-to-r from-teal to-emerald-400' : 'bg-gradient-to-r from-navy to-blue-500'}`}></div>
                      <div className="p-6 w-full flex-1 flex flex-col pt-7">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 ${item.type === 'Ride' ? 'bg-gold/10 text-gold-dark border-gold/30' : item.type === 'Dining' ? 'bg-rose/10 text-rose border-rose/30' : item.type === 'Show' ? 'bg-teal/10 text-teal border-teal/30' : 'bg-navy/5 text-navy border-navy/10'}`}>
                             {item.type === 'Ride' ? <Rocket size={10} /> : item.type === 'Dining' ? <Utensils size={10} /> : item.type === 'Show' ? <Star size={10} /> : <Coffee size={10} />}
                             {item.type}
                          </span>
                          {item.rating && (
                            <div className="flex items-center gap-1.5 bg-navy/5 px-2.5 py-1.5 rounded-lg border border-navy/5">
                              <Star size={12} className="text-gold fill-gold" />
                              <span className="text-[11px] font-black text-navy">{item.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-header text-xl mb-1 group-hover:text-gold transition-colors line-clamp-2 leading-tight">{item.title}</h3>
                        <div className="flex items-center gap-1.5 mb-4 text-[10px] font-black uppercase tracking-widest text-navy/40">
                           <MapPin size={10} /> {item.park}
                        </div>
                        
                        <p className="text-xs text-navy/60 mb-6 line-clamp-3 flex-1 leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-auto w-full pt-4 border-t border-navy/5">
                          {item.ticketClass && <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/10 px-2 py-1 rounded border border-gold/20">{item.ticketClass}</span>}
                          {item.thrillLevel && <span className="text-[9px] px-2 py-1 bg-navy/5 rounded text-navy/60 font-black uppercase tracking-widest border border-navy/10">Thrill: {item.thrillLevel}</span>}
                          {item.heightReq && item.heightReq !== 'Any' && <span className="text-[9px] px-2 py-1 bg-navy/5 rounded text-navy/60 font-black uppercase tracking-widest flex items-center gap-1 border border-navy/10"><Ruler size={10} /> {item.heightReq}</span>}
                        </div>
                      </div>
                      
                      {/* Hover Reveal Action */}
                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm border-t border-navy/5 flex items-center justify-between pointer-events-none group-hover:pointer-events-auto">
                         <span className="text-[10px] font-black uppercase tracking-widest text-navy/50">{item.length ? `Duration: ${item.length}` : 'Explore Details'}</span>
                         <div className="w-8 h-8 rounded-full bg-gold text-navy flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-300 shadow-sm">
                            <ArrowRight size={14} />
                         </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 5. TRANSPORTATION HUB VIEW */}
          {activeView === 'transportation' && (
            <div className="view-transportation animate-in fade-in zoom-in-95 duration-300">
              <div className="text-left mb-8">
                <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><Compass className="text-gold" /> The Royal Carriage</h2>
                <p className="opacity-60">Refined logistics for transit and arrivals across the resort.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Navigator Tool (Left) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="luxury-card p-8 bg-gradient-to-br from-navy to-[#1a3345] text-white overflow-hidden relative border-t-4 border-gold shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                    
                    <h3 className="font-header text-2xl mb-6 relative z-10 flex items-center gap-2"><Map size={20} className="text-gold" /> Route Navigator</h3>
                    
                    <div className="relative z-10 space-y-4">
                      {/* From Field */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2 pl-2">Starting Point</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold z-10" />
                          <select title="Starting Point" className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white appearance-none outline-none focus:border-gold transition-colors cursor-pointer relative z-0">
                            <option value="pop" className="text-navy">Disney's Pop Century Resort</option>
                            <option value="poly" className="text-navy">Disney's Polynesian Village</option>
                            <option value="mk" className="text-navy">Magic Kingdom Park</option>
                            <option value="ep" className="text-navy">Epcot</option>
                            <option value="hs" className="text-navy">Disney's Hollywood Studios</option>
                            <option value="ak" className="text-navy">Disney's Animal Kingdom</option>
                            <option value="ds" className="text-navy">Disney Springs</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10" />
                        </div>
                      </div>
                      
                      {/* Connector Line */}
                      <div className="h-6 flex items-center justify-center relative">
                         <div className="absolute inset-y-0 w-0.5 border-l-2 border-dashed border-white/20"></div>
                         <div className="w-8 h-8 rounded-full bg-navy border-2 border-white/20 z-10 flex items-center justify-center text-white/50 hover:text-white hover:border-gold cursor-pointer transition-colors shadow-sm">
                            <Repeat size={14} className="rotate-90" />
                         </div>
                      </div>

                      {/* To Field */}
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block mb-2 pl-2">Destination</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose z-10" />
                          <select title="Destination" className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-white appearance-none outline-none focus:border-gold transition-colors cursor-pointer relative z-0">
                            <option value="hs" className="text-navy">Disney's Hollywood Studios</option>
                            <option value="mk" className="text-navy">Magic Kingdom Park</option>
                            <option value="ep" className="text-navy">Epcot</option>
                            <option value="ak" className="text-navy">Disney's Animal Kingdom</option>
                            <option value="poly" className="text-navy">Disney's Polynesian Village</option>
                            <option value="pop" className="text-navy">Disney's Pop Century Resort</option>
                            <option value="ds" className="text-navy">Disney Springs</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none z-10" />
                        </div>
                      </div>
                    </div>

                    {/* Result Block */}
                    <div className="mt-8 bg-white/10 rounded-2xl p-5 border border-white/10 relative z-10 backdrop-blur-sm shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30 flex items-center gap-1"><Zap size={10}/> Fastest Route</span>
                        <span className="text-2xl font-black">22 <span className="text-sm text-white/60 uppercase tracking-widest">MIN</span></span>
                      </div>
                      
                      <div className="flex gap-2 items-stretch mt-4">
                        <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10 text-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="w-8 h-8 rounded-full bg-[#E5F2FF] text-[#0066CC] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><Cloud size={14} /></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Skyliner</span>
                           <span className="text-xs font-bold text-white/50">14 min</span>
                        </div>
                        <div className="w-6 flex flex-col items-center justify-center shrink-0">
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20 mb-1"></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20 mb-1"></div>
                           <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center border border-white/10 text-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform"><Activity size={14} /></div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Walk</span>
                           <span className="text-xs font-bold text-white/50">8 min</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/50 text-center mt-4 uppercase tracking-widest font-black">Transfer at Caribbean Beach Station</p>
                    </div>
                  </div>
                </div>

                {/* Transit Methods (Right) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Disney Skyliner', icon: <Cloud size={18} />, colorClass: 'bg-blue-100/50 text-blue-600 border-blue-200 group-hover:border-blue-400 group-hover:bg-blue-600 group-hover:text-white', desc: 'Aerial gondola network connecting Epcot, Hollywood Studios, and 4 resorts with continuous loading.' },
                    { title: 'Monorail System', icon: <RefreshCw size={18} />, colorClass: 'bg-indigo-100/50 text-indigo-600 border-indigo-200 group-hover:border-indigo-400 group-hover:bg-indigo-600 group-hover:text-white', desc: 'The highway in the sky connecting Magic Kingdom, Epcot, and 3 deluxe resort hotels.' },
                    { title: 'Bus Transportation', icon: <Activity size={18} />, colorClass: 'bg-teal/10 text-teal border-teal/20 group-hover:border-teal/40 group-hover:bg-teal group-hover:text-white', desc: 'Complimentary bus service available from all resorts to all theme parks and Disney Springs.' },
                    { title: 'Watercraft', icon: <Droplets size={18} />, colorClass: 'bg-cyan-100/50 text-cyan-600 border-cyan-200 group-hover:border-cyan-400 group-hover:bg-cyan-600 group-hover:text-white', desc: 'Scenic ferryboats, water taxis, and Friendship boats servicing select waterfront resorts and parks.' },
                    { title: 'Walking Paths', icon: <UserPlus size={18} />, colorClass: 'bg-green-100/50 text-green-600 border-green-200 group-hover:border-green-400 group-hover:bg-green-600 group-hover:text-white', desc: 'Dedicated pedestrian walkways. Epcot to Hollywood Studios takes ~20 minutes.' },
                    { title: 'Ride Share (Minnie Vans)', icon: <Target size={18} />, colorClass: 'bg-rose/10 text-rose border-rose/20 group-hover:border-rose/40 group-hover:bg-rose group-hover:text-white', desc: 'Personalized premium point-to-point transportation operated by Lyft. Extra cost applies.' }
                  ].map((method, idx) => (
                    <div key={idx} className="luxury-card p-5 border border-navy/5 bg-white group hover:-translate-y-1 transition-all duration-300 text-left flex flex-col items-start cursor-pointer hover:shadow-md relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 group-hover:bg-gold/10 transition-colors pointer-events-none"></div>
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${method.colorClass}`}>
                          {method.icon}
                       </div>
                       <h4 className="font-header text-lg mb-2 text-navy relative z-10">{method.title}</h4>
                       <p className="text-xs text-navy/60 leading-relaxed mb-4 flex-1 relative z-10">{method.desc}</p>
                       <div className="mt-auto pt-4 border-t border-navy/5 w-full flex items-center justify-between relative z-10">
                          <span className="text-[9px] font-black uppercase tracking-widest text-navy/40 group-hover:text-gold transition-colors">View Network Map</span>
                          <ArrowRight size={12} className="text-navy/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {/* 6. CROWD CALENDAR VIEW */}
          {activeView === 'calendar' && (
            <div className="view-calendar animate-in fade-in zoom-in-95 duration-300">
               <div className="text-left mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><Calendar className="text-gold" /> The Magic Window</h2>
                  <p className="opacity-60">Predictive crowd modeling and timing to find your perfect window.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                   {/* Context Filter */}
                   <div className="relative w-full md:w-64">
                      <select title="Resort Context" className="w-full bg-white border border-navy/10 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-navy appearance-none outline-none focus:border-gold transition-colors cursor-pointer shadow-sm">
                         <option value="wdw" className="text-navy">Walt Disney World (All Parks)</option>
                         <option value="dlr" className="text-navy">Disneyland Resort (All Parks)</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" />
                   </div>

                   {/* Legend */}
                   <div className="flex flex-wrap gap-4 bg-white px-4 py-2 rounded-2xl border border-navy/5 shadow-sm">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/60"><div className="w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300"></div> Low</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/60"><div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></div> Mod</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/60"><div className="w-3 h-3 rounded-full bg-rose/10 border border-rose/20"></div> High</div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-navy/60"><div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-300"></div> Peak</div>
                   </div>
                </div>
              </div>

              <div className="luxury-card p-8 bg-white overflow-hidden relative border border-navy/5 shadow-md">
                <div className="flex justify-between items-center mb-8">
                   <h3 className="text-2xl font-header text-navy flex items-center gap-3">
                     September 2026
                     <div className="flex gap-1 ml-4">
                       <button title="Previous Month" className="p-2 rounded-xl bg-navy/5 text-navy/40 hover:bg-navy/10 hover:text-navy transition-colors"><ChevronRight size={16} className="rotate-180" /></button>
                       <button title="Next Month" className="p-2 rounded-xl bg-navy/5 text-navy/40 hover:bg-navy/10 hover:text-navy transition-colors"><ChevronRight size={16} /></button>
                     </div>
                   </h3>
                   <div className="flex items-center gap-2">
                     <button className="px-4 py-2 bg-navy/5 text-navy rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-navy/10 transition-colors">Today</button>
                   </div>
                </div>

                <div className="grid grid-cols-7 gap-3 md:gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-navy/40 mb-2">{day}</div>
                  ))}
                  
                  {/* Empty days for offset */}
                  <div className="col-span-2"></div>

                  {Array.from({ length: 30 }).map((_, i) => {
                     const date = i + 1;
                     // generate mock crowd data
                     let overallLevel = 'mod';
                     let overallColor = 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400 hover:shadow-amber-100/50';
                     let event = null;
                     
                     // Park specific mockup strings (e.g. MK: High, EP: Mod)
                     let parksData = [
                        { name: 'MK', level: 'high', color: 'bg-rose/20' },
                        { name: 'EP', level: 'mod', color: 'bg-amber-100' },
                        { name: 'HS', level: 'peak', color: 'bg-purple-200' },
                        { name: 'AK', level: 'low', color: 'bg-emerald-100' }
                     ];

                     if (date >= 4 && date <= 7) {
                         overallLevel = 'peak';
                         overallColor = 'bg-purple-50 border-purple-200 text-purple-700 hover:border-purple-400 hover:shadow-purple-100/50';
                         event = 'Labor Day Weekend';
                         parksData = parksData.map(p => ({...p, level: 'peak', color: 'bg-purple-200'}));
                     } else if (date === 1 || date === 2 || date === 3) {
                         overallLevel = 'high';
                         overallColor = 'bg-rose/5 border-rose/20 text-rose hover:border-rose/40 hover:shadow-rose-100/50';
                         parksData[0].level = 'peak'; parksData[0].color = 'bg-purple-200';
                         parksData[3].level = 'high'; parksData[3].color = 'bg-rose/20';
                     } else if (date >= 15 && date <= 18) {
                         overallLevel = 'low';
                         overallColor = 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:shadow-emerald-100/50';
                         parksData = parksData.map(p => ({...p, level: 'low', color: 'bg-emerald-100'}));
                     } else if (date % 7 === 5 || date % 7 === 6) { 
                         overallLevel = 'high';
                         overallColor = 'bg-rose/5 border-rose/20 text-rose hover:border-rose/40 hover:shadow-rose-100/50';
                         if (date === 25) {
                            event = 'Halloween Party Start';
                            parksData[0].level = 'low'; parksData[0].color = 'bg-emerald-100'; // MK closes early
                         }
                     }

                     return (
                      <div key={date} className={`md:h-32 h-24 rounded-2xl border-2 p-2 flex flex-col transition-all hover:scale-[1.02] cursor-pointer relative group shadow-sm hover:shadow-lg ${overallColor}`}>
                         <div className="flex justify-between items-start mb-1">
                            <span className="font-header text-lg leading-none">{date}</span>
                            {event && <Sparkles size={12} className="opacity-50" />}
                         </div>
                         
                         {/* Multi-Park Context Grid */}
                         <div className="grid grid-cols-2 gap-1 mb-auto mt-1">
                            {parksData.map(park => (
                               <div key={park.name} className="flex items-center gap-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${park.color}`}></div>
                                  <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-80">{park.name}</span>
                               </div>
                            ))}
                         </div>

                         <div className="text-left mt-auto">
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-60 block border-t border-black/5 pt-1">AVG: {overallLevel}</span>
                            {event && <span className="text-[9px] font-bold leading-tight mt-1 px-1.5 py-0.5 rounded-md bg-white/50 border border-white/20 block truncate group-hover:whitespace-normal group-hover:absolute group-hover:z-10 group-hover:bg-white group-hover:shadow-xl group-hover:w-[150%] md:group-hover:w-[200%] transition-all">{event}</span>}
                         </div>
                      </div>
                     );
                  })}
                </div>
              </div>
            </div>
          )}


          {/* 7. DIGITAL VAULT VIEW */}
          {
            activeView === 'vault' && (
              <div className="view-vault animate-in fade-in zoom-in-95 duration-300">
                <div className="text-left mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                  <div>
                    <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><ShieldCheck className="text-gold" /> The Vault</h2>
                    <p className="opacity-60">Securely store and manage your tickets, reservations, itineraries, and payment methods.</p>
                  </div>
                  <button className="btn-primary-mini flex items-center gap-2">
                     <Plus size={16} /> Add Document
                  </button>
                </div>

                {/* Top Row: Important Documents & Payment Methods */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
                  {/* Documents Column */}
                  <div className="xl:col-span-8 flex flex-col gap-6">
                     <div className="luxury-card p-8 bg-white border border-navy/5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-header text-navy flex items-center gap-2"><Paperclip size={18} className="text-gold" /> Important Documents</h3>
                           <button className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy transition-colors">View All</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {/* Airline Ticket Mock */}
                           <div className="group border border-navy/10 rounded-2xl p-4 flex items-center gap-4 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy/10 group-hover:bg-gold transition-colors"></div>
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                 <Send className="-rotate-45" size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-navy truncate">Delta Airlines Itinerary</h4>
                                 <p className="text-[10px] uppercase font-black tracking-widest text-navy/40 mt-1">PDF • 2.4 MB</p>
                              </div>
                              <button title="Download" aria-label="Download" className="text-navy/20 group-hover:text-gold transition-colors"><Download size={16} /></button>
                           </div>
                           
                           {/* Hotel Confirmation Mock */}
                           <div className="group border border-navy/10 rounded-2xl p-4 flex items-center gap-4 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy/10 group-hover:bg-gold transition-colors"></div>
                              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                 <Home size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-navy truncate">Polynesian Village Conf.</h4>
                                 <p className="text-[10px] uppercase font-black tracking-widest text-navy/40 mt-1">IMAGE • 1.1 MB</p>
                              </div>
                              <button title="Download" aria-label="Download" className="text-navy/20 group-hover:text-gold transition-colors"><Download size={16} /></button>
                           </div>

                           {/* Rental Car Mock */}
                           <div className="group border border-navy/10 rounded-2xl p-4 flex items-center gap-4 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-navy/10 group-hover:bg-gold transition-colors"></div>
                              <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                                 <Map size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-navy truncate">Alamo Rental Agreement</h4>
                                 <p className="text-[10px] uppercase font-black tracking-widest text-navy/40 mt-1">PDF • 800 KB</p>
                              </div>
                              <button title="Download" aria-label="Download" className="text-navy/20 group-hover:text-gold transition-colors"><Download size={16} /></button>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Methods Column */}
                  <div className="xl:col-span-4 flex flex-col gap-6">
                    <div className="luxury-card p-8 bg-gradient-to-br from-navy to-[#1a3345] text-white overflow-hidden relative shadow-md h-full flex flex-col justify-between group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -mt-24 -mr-24 pointer-events-none group-hover:bg-gold/20 transition-colors"></div>
                      
                      <div className="relative z-10 box-border">
                        <div className="flex justify-between items-center mb-8">
                           <h3 className="text-xl font-header flex items-center gap-2"><CreditCard size={18} className="text-gold" /> Active Card</h3>
                           <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Manage</button>
                        </div>
                        
                        <div className="mb-8">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Card Number</span>
                             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" alt="Mastercard" className="h-5 opacity-80" />
                          </div>
                          <div className="text-2xl font-header tracking-widest text-white drop-shadow-sm">•••• •••• •••• 4242</div>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <span className="block text-[8px] font-black uppercase tracking-widest text-white/50 mb-1">Cardholder Name</span>
                            <span className="font-bold text-sm tracking-wide">P. UCHIYAMA</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black uppercase tracking-widest text-white/50 mb-1">Expires</span>
                            <span className="font-bold text-sm tracking-wide">12 / 28</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-3 relative z-10">
                        <Lock size={14} className="text-teal" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-relaxed">Secured with AES-256 Plaid Encryption</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Tickets & Passes, Dining Confirmations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Tickets & Passes */}
                   <div className="luxury-card p-8 bg-white border border-navy/5 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-header text-navy flex items-center gap-2"><History size={18} className="text-gold" /> Theme Park Tickets</h3>
                         <button className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy transition-colors">Link Ticket</button>
                      </div>

                      <div className="space-y-4">
                         <div className="border border-gold/30 bg-gold/5 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-4"><CheckCircle size={16} className="text-gold" /></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gold block mb-1">Active Pass</span>
                            <h4 className="font-header text-lg text-navy mb-4">4-Day Park Hopper Ticket</h4>
                            
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-black text-sm">PU</div>
                               <div>
                                  <span className="text-sm font-bold text-navy block">Patchen Uchiyama</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">ID: TKT-8942-0193</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="border border-navy/10 bg-white rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-navy/30 transition-all">
                            <span className="text-[9px] font-black uppercase tracking-widest text-navy/40 block mb-1">Used Pass</span>
                            <h4 className="font-header text-lg text-navy/60 mb-4">Mickey's Not-So-Scary Halloween</h4>
                            
                            <div className="flex items-center gap-4 opacity-60">
                               <div className="w-10 h-10 bg-navy/10 text-navy rounded-full flex items-center justify-center font-black text-sm">PU</div>
                               <div>
                                  <span className="text-sm font-bold text-navy block">Patchen Uchiyama</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Oct 29, 2025</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Dining Confirmations */}
                   <div className="luxury-card p-8 bg-white border border-navy/5 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-header text-navy flex items-center gap-2"><Utensils size={18} className="text-gold" /> Dining Confirmations</h3>
                         <button className="text-[10px] font-black uppercase tracking-widest text-navy/40 hover:text-navy transition-colors">Add Manually</button>
                      </div>

                      <div className="space-y-4">
                         {/* Dining Card 1 */}
                         <div className="border border-navy/10 rounded-2xl p-5 flex items-start gap-4 hover:border-gold/30 hover:shadow-sm cursor-pointer transition-all bg-white relative">
                            <div className="w-2 h-full absolute left-0 top-0 bg-gold rounded-l-xl"></div>
                            <div className="w-12 h-12 bg-rose/10 text-rose rounded-xl flex items-center justify-center shrink-0 ml-2">
                               <Coffee size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-navy text-sm">Cinderella's Royal Table</h4>
                                  <span className="bg-navy/5 text-navy px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Conf: #84920</span>
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mt-1 mb-3">Magic Kingdom • Breakfast</p>
                               <div className="flex items-center gap-4 text-xs font-bold text-navy/70">
                                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gold" /> Oct 15, 2026</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> 8:30 AM</span>
                                  <span className="flex items-center gap-1.5"><Users size={12} className="text-gold" /> 4 Guests</span>
                               </div>
                            </div>
                         </div>

                         {/* Dining Card 2 */}
                         <div className="border border-navy/10 rounded-2xl p-5 flex items-start gap-4 hover:border-gold/30 hover:shadow-sm cursor-pointer transition-all bg-white relative">
                            <div className="w-2 h-full absolute left-0 top-0 bg-rose rounded-l-xl"></div>
                            <div className="w-12 h-12 bg-navy/5 text-navy rounded-xl flex items-center justify-center shrink-0 ml-2">
                               <Utensils size={20} />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-navy text-sm">Le Cellier Steakhouse</h4>
                                  <span className="bg-navy/5 text-navy px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Conf: #11933</span>
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 mt-1 mb-3">Epcot (Canada) • Dinner</p>
                               <div className="flex items-center gap-4 text-xs font-bold text-navy/70">
                                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gold" /> Oct 16, 2026</span>
                                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> 6:15 PM</span>
                                  <span className="flex items-center gap-1.5"><Users size={12} className="text-gold" /> 2 Guests</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )
          }

          {/* 7A. INTERACTIVE MAP VIEW */}
          {
            activeView === 'map' && (
              <div className="view-map animate-in fade-in zoom-in-95 duration-500 h-[calc(100vh-140px)] flex flex-col">
                <div className="flex justify-between items-end mb-6 shrink-0">
                  <div>
                    <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><Map className="text-gold" /> The Compass</h2>
                    <p className="opacity-60">Our "Logic over Luck" interactive guide to the magic around you.</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="bg-white border border-navy/10 text-navy px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"><MapPin size={14} className="text-rose"/> Magic Kingdom</button>
                     <button className="bg-white border border-navy/10 text-navy px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"><Compass size={14} className="text-blue-500"/> Locate Me</button>
                  </div>
                </div>

                <div 
                  className={`flex-1 rounded-3xl overflow-hidden border border-navy/10 shadow-inner relative bg-[#e5e3df] ${isMapDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  onMouseDown={handleMapMouseDown}
                  onMouseMove={handleMapMouseMove}
                  onMouseUp={handleMapMouseUp}
                  onMouseLeave={handleMapMouseUp}
                >
                   <div 
                     className="absolute inset-0 transition-transform duration-75 origin-center will-change-transform"
                     style={{ transform: `translate(${mapPan.x}px, ${mapPan.y}px) scale(${mapZoom})` }}
                   >
                     <img src="https://media.disneywebassets.com/dam/wdpro-assets/parks-and-tickets/destinations/magic-kingdom/magic-kingdom-map-16x9.jpg" alt="Disney Map Mock" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] max-w-none object-cover opacity-80 pointer-events-none" />
                     {/* Map Overlays Mock */}
                     <div className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group cursor-pointer" onClick={(e) => e.stopPropagation()}>
                           <div className="w-10 h-10 bg-rose text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-10 hover:scale-110 transition-transform">
                              <Coffee size={18} />
                           </div>
                           <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-navy/10 text-[10px] font-black uppercase tracking-widest text-navy whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              Next Up: Sleepy Hollow
                           </div>
                        </div>
                     </div>

                     <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2">
                        <div className="relative group cursor-pointer" onClick={(e) => e.stopPropagation()}>
                           <div className="w-8 h-8 bg-blue-500 text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-10 hover:scale-110 transition-transform">
                              <ShieldCheck size={14} />
                           </div>
                           <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white px-3 py-1.5 rounded-lg shadow-xl border border-navy/10 text-[10px] font-black uppercase tracking-widest text-navy whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              Seven Dwarfs Mine Train (65m)
                           </div>
                        </div>
                     </div>
                   </div>
                   
                   {/* Map Controls */}
                   <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                      <button title="Zoom In" aria-label="Zoom In" onClick={handleZoomIn} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-navy/5 flex items-center justify-center text-navy hover:bg-navy/5 transition-colors"><Plus size={18} /></button>
                      <button title="Zoom Out" aria-label="Zoom Out" onClick={handleZoomOut} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-navy/5 flex items-center justify-center text-navy hover:bg-navy/5 transition-colors"><Plus size={18} className="rotate-45" /></button>
                   </div>
                   <div className="absolute bottom-6 left-6 flex bg-white rounded-xl shadow-lg border border-navy/5 p-1">
                      <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg bg-navy/5 text-navy">Rides</button>
                      <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors">Dining</button>
                      <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg text-navy/40 hover:text-navy hover:bg-navy/5 transition-colors">Facilities</button>
                   </div>
                </div>
              </div>
            )
          }

          {/* 7B. SMART PACKING LIST VIEW */}
          {
            activeView === 'packing' && (
              <div className="view-packing animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                  <div>
                     <h2 className="text-4xl font-header mb-2 text-navy flex items-center gap-3"><Umbrella className="text-gold" /> The Traveler's Trunk</h2>
                     <p className="opacity-60">AI-generated checklist based on your park days, reservations, and weather forecasts.</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="bg-white border border-navy/10 text-navy px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"><RefreshCw size={14} className="text-teal" /> Refresh AI Suggestions</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-8 flex flex-col gap-6">
                      <div className="luxury-card p-8 bg-white border border-navy/5 shadow-sm">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-header text-navy">Your Checked List</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">12 / 45 Items Packed</span>
                         </div>
                         
                         <div className="w-full h-2 bg-navy/5 rounded-full overflow-hidden mb-8">
                            <div className="h-full bg-emerald-400" style={{ width: '25%' }}></div>
                         </div>

                         <div className="space-y-6">
                            {/* Category: Park Essentials */}
                            <div>
                               <h4 className="text-sm font-bold text-navy mb-3 flex items-center gap-2 border-b border-navy/5 pb-2"><MapPin size={14} className="text-navy/40" /> Park Essentials</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors bg-emerald-50/50 border-emerald-100">
                                     <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 accent-emerald-500" />
                                     <span className="text-sm font-bold text-navy line-through opacity-60">MagicBands (x4)</span>
                                  </label>
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors">
                                     <input type="checkbox" className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold" />
                                     <span className="text-sm font-bold text-navy">Portable Phone Chargers</span>
                                  </label>
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors">
                                     <input type="checkbox" className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold" />
                                     <span className="text-sm font-bold text-navy">Refillable Water Bottles</span>
                                  </label>
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors">
                                     <input type="checkbox" className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold" />
                                     <span className="text-sm font-bold text-navy">Ponchos / Rain Gear</span>
                                  </label>
                               </div>
                            </div>
                            
                            {/* Category: Apparel */}
                            <div>
                               <h4 className="text-sm font-bold text-navy mb-3 flex items-center gap-2 border-b border-navy/5 pb-2"><Cloud size={14} className="text-navy/40" /> Apparel & Footwear</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors">
                                     <input type="checkbox" className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold" />
                                     <span className="text-sm font-bold text-navy">Comfortable Walking Shoes (x2)</span>
                                  </label>
                                  <label className="flex items-center gap-3 p-3 rounded-xl border border-navy/10 hover:bg-navy/5 cursor-pointer transition-colors">
                                     <input type="checkbox" className="w-4 h-4 rounded text-gold focus:ring-gold accent-gold" />
                                     <div className="flex-1">
                                        <span className="text-sm font-bold text-navy block">Light Jackets</span>
                                        <span className="text-[10px] text-navy/40 uppercase font-black tracking-widest block mt-0.5">AI: Forecast shows cool evenings</span>
                                     </div>
                                  </label>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4 flex flex-col gap-6">
                      <div className="luxury-card p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 shadow-sm relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/50 rounded-full blur-2xl -mt-16 -mr-16 pointer-events-none"></div>
                         <h3 className="text-xl font-header text-navy flex items-center gap-2 mb-4 relative z-10"><CloudRain size={18} className="text-blue-500" /> Trip Weather Focus</h3>
                         
                         <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl mb-4 relative z-10 border border-blue-50">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                                  <CloudRain size={24} />
                               </div>
                               <div>
                                  <span className="text-2xl font-header block leading-none">78° / 65°</span>
                                  <span className="text-[10px] uppercase font-black tracking-widest text-navy/40 mt-1 block">Expected Avg</span>
                               </div>
                            </div>
                         </div>
                         <p className="text-xs text-navy/70 leading-relaxed italic relative z-10">AI Insights: "Expect warm afternoons but the chance of afternoon thunderstorms is high. Pack ponchos and waterproof shoes."</p>
                      </div>

                      <div className="luxury-card p-6 bg-white border border-navy/5 shadow-sm">
                         <h3 className="text-xl font-header text-navy flex items-center gap-2 mb-4"><Sparkles size={18} className="text-gold" /> Contextual Items</h3>
                         <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                               <div className="w-6 h-6 rounded bg-rose/10 text-rose flex items-center justify-center shrink-0 mt-0.5"><Utensils size={12}/></div>
                               <div>
                                  <span className="text-xs font-bold text-navy block">Dress Code: Signature Dining</span>
                                  <span className="text-[10px] text-navy/50 block mt-0.5">You have reservations at Victoria & Albert's. Proper attire required.</span>
                               </div>
                            </li>
                            <li className="flex items-start gap-3">
                               <div className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5"><History size={12}/></div>
                               <div>
                                  <span className="text-xs font-bold text-navy block">Halloween Party Costumes</span>
                                  <span className="text-[10px] text-navy/50 block mt-0.5">Mickey's Not-So-Scary on Oct 29.</span>
                               </div>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>
              </div>
            )
          }

          {/* 8. DIGITAL KEEPSAKE VIEW */}
          {
            activeView === 'keepsake' && (
              <div className="view-keepsake animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                  <div>
                     <h2 className="text-4xl font-header mb-2 text-navy flex items-center gap-3"><Camera className="text-gold" /> The Digital Gallery</h2>
                     <p className="opacity-60">Relive your magical memories, stats, and hidden secrets uncovered during your journey.</p>
                  </div>
                  <div className="flex gap-3">
                     <select title="Trip Selection" className="bg-white border border-navy/10 rounded-xl px-4 py-2 font-bold text-sm text-navy outline-none focus:border-gold">
                        <option>Summer Vacation 2025</option>
                        <option>Halloween Trip 2024</option>
                     </select>
                     <button title="Share Keepsake" className="btn-primary-mini flex items-center gap-2 pr-5"><Share2 size={14} /> Share</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   {/* Left Col: Day-in-Review Reel & Next-Trip Bridge */}
                   <div className="lg:col-span-8 flex flex-col gap-8">
                      {/* The Reel */}
                      <div className="luxury-card p-0 overflow-hidden relative border border-navy/5 shadow-md group">
                         {/* Reel Header */}
                         <div className="p-8 bg-navy text-white relative z-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mt-32 -mr-32 pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-6">
                               <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gold block mb-1">Day-in-Review Reel</span>
                                  <h3 className="text-2xl font-header">Magic Kingdom Memories</h3>
                               </div>
                               <button title="Play Reel" className="w-10 h-10 rounded-full bg-white text-navy flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                  <Play fill="currentColor" size={16} className="ml-1" />
                               </button>
                            </div>
                            
                            {/* Metric Milestones */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                               <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Distance Walked</span>
                                  <span className="font-header text-2xl text-white">14.2 <span className="text-[10px] opacity-60 flex-0 font-sans tracking-widest">MILES</span></span>
                               </div>
                               <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Time Saved</span>
                                  <span className="font-header text-2xl text-teal-400">4.5 <span className="text-[10px] opacity-60 flex-0 font-sans tracking-widest text-white">HOURS</span></span>
                               </div>
                               <div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1">Hidden Mickeys</span>
                                  <span className="font-header text-2xl text-gold">12 <span className="text-[10px] opacity-60 flex-0 font-sans tracking-widest text-white">FOUND</span></span>
                               </div>
                            </div>
                         </div>
                         
                         {/* Reel Timeline */}
                         <div className="p-8 bg-white relative">
                            <div className="absolute left-10 top-8 bottom-8 w-px bg-navy/10 pointer-events-none"></div>
                            
                            <div className="space-y-8 relative z-10">
                               <div className="flex gap-6">
                                  <div className="w-5 h-5 rounded-full bg-navy border-4 border-white mt-1 shrink-0 relative z-10"></div>
                                  <div className="flex-1">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-1 block">8:45 AM</span>
                                     <h4 className="font-bold text-navy mb-2">Rope Drop at Seven Dwarfs Mine Train</h4>
                                     <div className="h-32 w-full max-w-sm rounded-xl bg-navy/5 border border-navy/10 overflow-hidden flex items-center justify-center mb-3">
                                        <Image size={24} className="text-navy/20" />
                                     </div>
                                     <p className="text-xs text-navy/60 leading-relaxed italic border-l-2 border-navy/20 pl-3">"You beat the rush and saved 65 minutes in line first thing in the morning!"</p>
                                  </div>
                               </div>
                               
                               <div className="flex gap-6">
                                  <div className="w-5 h-5 rounded-full bg-gold border-4 border-white mt-1 shrink-0 relative z-10"></div>
                                  <div className="flex-1">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-1 block">1:15 PM</span>
                                     <h4 className="font-bold text-navy mb-2">Lunch at Be Our Guest</h4>
                                     <div className="grid grid-cols-2 gap-3 max-w-sm mb-3">
                                        <div className="h-24 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center"><Utensils size={20} className="text-navy/20" /></div>
                                        <div className="h-24 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center"><Camera size={20} className="text-navy/20" /></div>
                                     </div>
                                     <p className="text-xs text-navy/60 leading-relaxed italic border-l-2 border-navy/20 pl-3">"The Grey Stuff was indeed delicious."</p>
                                  </div>
                               </div>
                               
                               <div className="flex gap-6">
                                  <div className="w-5 h-5 rounded-full bg-rose border-4 border-white mt-1 shrink-0 relative z-10"></div>
                                  <div className="flex-1">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-1 block">9:00 PM</span>
                                     <h4 className="font-bold text-navy mb-2">Happily Ever After</h4>
                                     <div className="h-40 w-full max-w-sm rounded-xl bg-gradient-to-t from-navy/80 to-navy/40 flex items-end p-4 border border-navy/10 relative overflow-hidden">
                                        <Sparkles size={24} className="text-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 relative z-10">Video Clip (0:15)</span>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Next-Trip Bridge (Memory Vault) */}
                      <div className="luxury-card p-8 border border-navy/5 shadow-sm bg-gradient-to-r from-[#F9F7F2] to-white relative overflow-hidden">
                         <div className="flex items-start gap-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
                               <Compass size={28} />
                            </div>
                            <div>
                               <h3 className="text-xl font-header text-navy mb-2">The Memory Vault</h3>
                               <p className="text-sm text-navy/60 mb-4">We've securely saved your "Favorites" to prioritize for your next visit.</p>
                               <div className="flex flex-wrap gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white border border-navy/10 flex items-center gap-1.5"><Heart size={10} className="text-rose fill-rose" /> Blue Bayou Water Table</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white border border-navy/10 flex items-center gap-1.5"><Heart size={10} className="text-rose fill-rose" /> Cosmic Rewind (Front Row)</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white border border-navy/10 flex items-center gap-1.5"><Heart size={10} className="text-rose fill-rose" /> Sleepy Hollow Waffles</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Sovereign Scrapbook */}
                   <div className="lg:col-span-4">
                      <div className="luxury-card h-full p-8 border border-gold/20 shadow-xl bg-[#F9F7F2] relative overflow-hidden group">
                         {/* Texture overlay for Parchment feel */}
                         
                         <div className="relative z-10 flex flex-col h-full">
                            <div className="text-center mb-8 pb-6 border-b border-navy/10 relative">
                               <Sparkles size={16} className="text-gold absolute -top-2 right-4 animate-pulse" />
                               <span className="text-[10px] font-black uppercase tracking-[4px] text-navy/40 block mb-2">Heirloom Edition</span>
                               <h3 className="text-3xl font-header text-navy" style={{ fontFamily: 'Georgia, serif' }}>Sovereign<br />Scrapbook</h3>
                            </div>

                            <p className="text-xs text-navy/60 text-center leading-relaxed italic mb-8 font-serif px-4">
                               "A boutique collection framing your memories as digital stationery. Beautifully aged, perfectly preserved."
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                               <div className="aspect-[3/4] rounded shadow-md border-4 border-white bg-navy/10 rotate-[-2deg] flex items-center justify-center hover:rotate-0 transition-transform cursor-pointer hover:shadow-lg hover:z-10 bg-gradient-to-br from-navy/5 to-navy/10"><Image size={24} className="text-navy/20" /></div>
                               <div className="aspect-square rounded shadow-md border-4 border-white bg-navy/10 rotate-[3deg] flex items-center justify-center hover:rotate-0 transition-transform cursor-pointer hover:shadow-lg hover:z-10 mt-6 bg-gradient-to-bl from-navy/5 to-navy/10"><Image size={24} className="text-navy/20" /></div>
                               <div className="col-span-2 aspect-video rounded shadow-md border-4 border-white bg-navy/10 flex items-center justify-center -mt-2 hover:scale-[1.02] transition-transform cursor-pointer hover:shadow-lg bg-gradient-to-t from-navy/5 to-navy/10"><Image size={24} className="text-navy/20" /></div>
                            </div>

                            {/* The Secret Log */}
                            <div className="mt-auto bg-white/50 backdrop-blur-sm p-5 rounded-xl border border-navy/10">
                               <h4 className="font-header text-sm text-navy mb-3 flex items-center gap-2"><Key size={14} className="text-gold" /> The Secret Log</h4>
                               <div className="space-y-3">
                                  <div className="text-left text-xs text-navy/70 leading-relaxed border-l-2 border-gold pl-3 italic font-serif">
                                     Discovered the hidden passage behind the Main Street Cinema at 10:14 AM.
                                  </div>
                                  <div className="text-left text-xs text-navy/70 leading-relaxed border-l-2 border-gold pl-3 italic font-serif">
                                     Triggered the "Galactic Hero" tier on Buzz Lightyear's Space Ranger Spin.
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )
          }

          {/* 8.5 SUBSCRIPTION CHECKOUT VIEW */}
          {
            activeView === 'subscription' && (
              <div className="view-subscription animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center max-w-3xl mx-auto mb-16">
                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6 border-2 border-gold/20 shadow-lg">
                      <Crown size={32} />
                   </div>
                   <h2 className="text-4xl lg:text-5xl font-header mb-4 text-navy">Upgrade to Citadel</h2>
                   <p className="text-lg opacity-60 text-navy/80 font-light">Unlock the full power of the Plaid AI Engine. Get real-time crowd predictions, automated dining snipers, and premium team collaboration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                   
                   {/* Standard Plan */}
                   <div className="luxury-card p-10 bg-white border border-navy/5 shadow-sm text-left relative group hover:border-navy/20 transition-all flex flex-col">
                      <h3 className="text-2xl font-header text-navy mb-2">Explorer</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                         <span className="text-4xl font-black text-navy">$0</span>
                         <span className="text-sm font-bold text-navy/40 uppercase tracking-widest">/ forever</span>
                      </div>
                      <p className="text-sm text-navy/60 mb-8 font-light">Perfect for casual planning and standard itinerary management.</p>
                      <ul className="space-y-4 mb-8 flex-1">
                         <li className="flex items-start gap-3 text-sm text-navy/80">
                            <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>1 Active Adventure at a time</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-navy/80">
                            <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>Basic AI Itinerary Generation</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-navy/80">
                            <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>Up to 4 Co-Planners</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-navy/40">
                            <X size={18} className="text-navy/20 shrink-0 mt-0.5" />
                            <span className="line-through">Automated Dining Snipers</span>
                         </li>
                      </ul>
                      <button className="w-full bg-navy/5 text-navy font-bold py-3 rounded-xl hover:bg-navy/10 transition-colors uppercase tracking-widest text-[10px]">Current Plan</button>
                   </div>

                   {/* Premium Plan */}
                   <div className="luxury-card p-10 bg-gradient-to-br from-navy to-[#1a3345] text-white border border-gold/30 shadow-2xl relative flex flex-col overflow-hidden transform md:-translate-y-4">
                      {/* Stylistic bg glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mt-32 -mr-32 pointer-events-none"></div>
                      
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark"></div>
                      <div className="absolute top-4 right-4 bg-gold/20 border border-gold/50 text-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Popular</div>
                      
                      <h3 className="text-2xl font-header text-white mb-2 flex items-center gap-2"><Crown size={20} className="text-gold" /> Citadel</h3>
                      <div className="flex items-baseline gap-1 mb-6">
                         <span className="text-4xl font-black text-white">$12</span>
                         <span className="text-sm font-bold text-white/40 uppercase tracking-widest">/ month</span>
                      </div>
                      <p className="text-sm text-white/60 mb-8 font-light border-b border-white/10 pb-6">The ultimate VIP trip planning experience with total AI integration.</p>
                      
                      <ul className="space-y-4 mb-8 flex-1">
                         <li className="flex items-start gap-3 text-sm text-white/90">
                            <Check size={18} className="text-gold shrink-0 mt-0.5" />
                            <span><strong>Unlimited</strong> Active Adventures</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white/90">
                            <Check size={18} className="text-gold shrink-0 mt-0.5" />
                            <span>Advanced Plaid AI Context Engine</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white/90">
                            <Check size={18} className="text-gold shrink-0 mt-0.5" />
                            <span>Automated Dining Reservation Snipers</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white/90">
                            <Check size={18} className="text-gold shrink-0 mt-0.5" />
                            <span>The Traveler's Trunk & Weather Intel</span>
                         </li>
                         <li className="flex items-start gap-3 text-sm text-white/90">
                            <Check size={18} className="text-gold shrink-0 mt-0.5" />
                            <span>The Digital Gallery & Memories</span>
                         </li>
                      </ul>
                      
                      <button className="w-full bg-gold hover:bg-gold-light text-navy font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(201,169,103,0.3)] hover:shadow-[0_0_30px_rgba(201,169,103,0.5)] transform hover:-translate-y-1 uppercase tracking-widest text-[11px] flex items-center justify-center gap-2">
                         <Lock size={14} /> Upgrade Now
                      </button>
                      <p className="text-center text-[10px] text-white/40 mt-4 font-bold uppercase tracking-widest">Cancel Anytime. Secure Checkout.</p>
                   </div>
                   
                </div>
              </div>
            )
          }

          {/* 8.7 SETTINGS VIEW */}
          {
            activeView === 'settings' && (
               <div className="view-settings animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
                  <div className="flex justify-between items-end mb-10">
                    <div className="text-left text-navy">
                       <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><Settings className="text-gold" /> System Preferences</h2>
                       <p className="opacity-60 text-navy">Manage your profile, application settings, and subscription details.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="md:col-span-1 space-y-2">
                        <button onClick={() => setActiveSettingsTab('profile')} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeSettingsTab === 'profile' ? 'bg-navy text-white shadow-md' : 'text-navy hover:bg-navy/5'}`}>Profile</button>
                        <button onClick={() => setActiveSettingsTab('preferences')} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeSettingsTab === 'preferences' ? 'bg-navy text-white shadow-md' : 'text-navy hover:bg-navy/5'}`}>Preferences</button>
                        <button onClick={() => setActiveSettingsTab('subscription')} className={`w-full text-left px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${activeSettingsTab === 'subscription' ? 'bg-navy text-white shadow-md' : 'text-navy hover:bg-navy/5'}`}>
                          <span>Subscription</span>
                          <Crown size={14} className={activeSettingsTab === 'subscription' ? 'text-gold' : 'text-navy/40'} />
                        </button>
                     </div>
                     
                     <div className="md:col-span-3">
                        {activeSettingsTab === 'profile' && (
                           <div className="luxury-card p-8 bg-white border border-navy/5 text-left animate-in fade-in">
                              <h3 className="font-header text-2xl text-navy mb-6">Profile Settings</h3>
                              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-navy/10">
                                 <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl font-header">P</div>
                                 <div>
                                    <button className="bg-navy/5 px-4 py-2 rounded-lg text-xs font-bold text-navy hover:bg-navy/10 transition-colors uppercase tracking-widest mb-2">Change Avatar</button>
                                    <p className="text-[10px] text-navy/40 uppercase tracking-widest">JPG, GIF or PNG. Max size of 800K</p>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6 mb-6">
                                 <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-navy/40 mb-2 block">First Name</label>
                                    <input type="text" defaultValue="Patchen" className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 font-bold text-navy outline-none focus:border-gold transition-colors" />
                                 </div>
                                 <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-navy/40 mb-2 block">Last Name</label>
                                    <input type="text" defaultValue="Uchiyama" className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 font-bold text-navy outline-none focus:border-gold transition-colors" />
                                 </div>
                                 <div className="col-span-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-navy/40 mb-2 block">Email Address</label>
                                    <input type="email" defaultValue="patchenu@gmail.com" className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 font-bold text-navy outline-none focus:border-gold transition-colors" />
                                 </div>
                              </div>
                              <button className="bg-gold text-navy font-black uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl hover:bg-gold-light transition-colors">Save Changes</button>
                           </div>
                        )}

                        {activeSettingsTab === 'preferences' && (
                           <div className="luxury-card p-8 bg-white border border-navy/5 text-left animate-in fade-in">
                              <h3 className="font-header text-2xl text-navy mb-6">System Preferences</h3>
                              <div className="space-y-6">
                                 <div className="flex justify-between items-center pb-6 border-b border-navy/5">
                                    <div>
                                       <h4 className="font-bold text-navy">Push Notifications</h4>
                                       <p className="text-sm text-navy/60">Receive alerts for dining snipers and itinerary updates.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                                       <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                 </div>
                                 <div className="flex justify-between items-center pb-6 border-b border-navy/5">
                                    <div>
                                       <h4 className="font-bold text-navy">Email Summaries</h4>
                                       <p className="text-sm text-navy/60">Weekly digests of your upcoming adventure prep.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                                       <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                                    </div>
                                 </div>
                                 <div className="flex justify-between items-center pb-6 border-b border-navy/5">
                                    <div>
                                       <h4 className="font-bold text-navy">Dark Mode</h4>
                                       <p className="text-sm text-navy/60">Switch to a darker theme for nighttime planning.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-navy/10 rounded-full relative cursor-pointer">
                                       <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {activeSettingsTab === 'subscription' && (
                           <div className="animate-in fade-in">
                              <div className="luxury-card p-8 bg-gradient-to-br from-navy to-[#1a3345] text-white border border-gold/30 shadow-2xl relative flex flex-col overflow-hidden text-left mb-8">
                                 <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mt-32 -mr-32 pointer-events-none"></div>
                                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-light via-gold to-gold-dark"></div>
                                 
                                 <div className="flex justify-between items-start mb-2 relative z-10">
                                   <h3 className="text-3xl font-header text-white flex items-center gap-2"><Crown size={24} className="text-gold" /> Citadel Plan</h3>
                                   <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle size={10} /> Active</span>
                                 </div>
                                 
                                 <div className="flex items-baseline gap-1 mb-8 relative z-10 border-b border-white/10 pb-8">
                                    <span className="text-4xl font-black text-white">$12</span>
                                    <span className="text-sm font-bold text-white/40 uppercase tracking-widest">/ month</span>
                                    <span className="ml-4 text-xs text-white/60">Next billing date: Nov 14, 2026</span>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div>
                                       <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-2">Payment Method</h4>
                                       <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                                          <div className="w-8 h-5 bg-white rounded flex items-center justify-center text-[8px] font-black text-navy">VISA</div>
                                          <div>
                                             <span className="block text-sm font-bold">•••• 4242</span>
                                             <span className="block text-[9px] text-white/40 uppercase tracking-widest">Expires 12/28</span>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-2">
                                       <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-widest border border-white/10">Update Payment</button>
                                       <button className="bg-transparent hover:bg-rose/10 hover:text-rose text-white/40 font-bold py-3 rounded-xl transition-colors text-xs uppercase tracking-widest">Cancel Plan</button>
                                    </div>
                                 </div>
                              </div>

                              <div className="luxury-card p-8 border border-navy/5 text-left bg-white">
                                 <h3 className="font-header text-xl text-navy mb-6">Billing History</h3>
                                 <table className="w-full text-sm">
                                    <thead>
                                       <tr className="text-[10px] font-black uppercase tracking-widest text-navy/40 border-b border-navy/5">
                                          <th className="pb-3 text-left">Date</th>
                                          <th className="pb-3 text-left">Amount</th>
                                          <th className="pb-3 text-left">Status</th>
                                          <th className="pb-3 text-right">Receipt</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr className="border-b border-navy/5 last:border-0">
                                          <td className="py-4 font-bold text-navy">Oct 14, 2026</td>
                                          <td className="py-4">$12.00</td>
                                          <td className="py-4"><span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">Paid</span></td>
                                          <td className="py-4 text-right"><button className="text-gold hover:text-gold-dark transition-colors"><ExternalLink size={14} className="inline" /></button></td>
                                       </tr>
                                       <tr className="border-b border-navy/5 last:border-0">
                                          <td className="py-4 font-bold text-navy">Sep 14, 2026</td>
                                          <td className="py-4">$12.00</td>
                                          <td className="py-4"><span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">Paid</span></td>
                                          <td className="py-4 text-right"><button className="text-gold hover:text-gold-dark transition-colors"><ExternalLink size={14} className="inline" /></button></td>
                                       </tr>
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )
          }

          {/* 8.8 MY ADVENTURES VIEW */}
          {
            activeView === 'adventures' && (
               <div className="view-adventures animate-in fade-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-end mb-10">
                     <div className="text-left">
                        <h2 className="text-3xl font-header mb-2 flex items-center gap-3"><MapPin className="text-gold" /> The Intelligent Blueprint</h2>
                        <p className="opacity-60">Your complete archive of past, present, and future trips.</p>
                     </div>
                     <button
                       onClick={() => {
                         setWizardStep(1);
                         setActiveView('new_trip');
                       }}
                       className="btn-primary-mini flex items-center gap-2"
                     >
                       <Plus size={16} /> New Trip
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {adventures.map(adv => (
                      <div key={adv.id} onClick={() => { setActiveAdventureId(adv.id); setActiveView('trip_dashboard'); }} className="luxury-card p-6 cursor-pointer hover:-translate-y-1 transition-transform group relative overflow-hidden text-left">
                        <div className={`absolute top-0 left-0 w-full h-1 ${adv.status === 'past' ? 'bg-navy/20' : 'bg-gold'}`}></div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${adv.status === 'past' ? 'bg-navy/5 text-navy/40' : 'bg-gold/10 text-gold'}`}>
                          {adv.status === 'past' ? <History size={24} /> : <Compass size={24} />}
                        </div>
                        <h4 className={`font-header text-xl mb-2 ${adv.status === 'past' ? 'text-navy/60' : ''}`}>{adv.name}</h4>
                        <p className="text-xs opacity-60 mb-6">{adv.parks.join(', ')}</p>
                        <div className={`flex justify-between items-center text-xs font-bold uppercase tracking-widest mt-auto pt-4 border-t border-navy/5 ${adv.status === 'past' ? 'text-navy/40' : 'text-gold'}`}>
                          <span>{new Date(adv.startDate).toLocaleDateString()}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                        </div>
                      </div>
                    ))}
                    
                    <div onClick={() => { setWizardStep(1); setActiveView('new_trip'); }} className="luxury-card p-6 cursor-pointer hover:-translate-y-1 transition-transform group border-2 border-dashed border-navy/10 hover:border-gold/50 bg-transparent flex flex-col items-center justify-center min-h-[220px]">
                      <div className="w-12 h-12 bg-navy/5 rounded-full flex items-center justify-center mb-4 text-navy opacity-40 group-hover:opacity-100 transition-opacity">
                        <Plus size={24} />
                      </div>
                      <span className="font-bold text-sm text-navy">Add New Adventure</span>
                    </div>
                  </div>
               </div>
            )
          }

          {/* 9. TRIP CREATION WIZARD */}
          {
            activeView === 'new_trip' && (
              <div className="flex flex-row -mx-12 -mt-12 min-h-[calc(100vh-90px)] bg-white ring-1 ring-navy/5">
                {/* Left Side: Curation Storytelling Hero */}
                <div className="w-5/12 bg-navy text-white relative overflow-hidden flex flex-col items-center justify-center p-16 sticky top-0 h-screen">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#1a3345]"></div>
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl -mr-48 -mt-48 mix-blend-screen animate-pulse duration-10000"></div>
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl -ml-48 -mb-48 mix-blend-screen"></div>

                  <div className="relative z-10 w-full text-center max-w-sm mt-[-80px]">
                    <Sparkles className="text-gold mx-auto mb-12 animate-pulse" size={48} />

                    {wizardStep === 1 && (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        <span className="text-[10px] uppercase font-black tracking-[4px] text-gold mb-6 block">Chapter One</span>
                        <h2 className="text-5xl font-header mb-6 leading-tight">The Blank<br />Canvas</h2>
                        <p className="opacity-60 text-lg leading-relaxed font-light">Every great adventure begins with a spark. Define the parameters of your next masterpiece.</p>
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        <span className="text-[10px] uppercase font-black tracking-[4px] text-gold mb-6 block">Chapter Two</span>
                        <h2 className="text-5xl font-header mb-6 leading-tight">Curate The<br />Vibe</h2>
                        <p className="opacity-60 text-lg leading-relaxed font-light">Tell our Plaid AI what kind of pacing and dining matches your family's rhythm.</p>
                      </div>
                    )}
                    {wizardStep === 3 && (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        <span className="text-[10px] uppercase font-black tracking-[4px] text-gold mb-6 block">Chapter Three</span>
                        <h2 className="text-5xl font-header mb-6 leading-tight">Gather Your<br />Party</h2>
                        <p className="opacity-60 text-lg leading-relaxed font-light">A great storyteller needs an audience. Who will share these memories with you?</p>
                      </div>
                    )}
                    {wizardStep === 4 && (
                      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                        <span className="text-[10px] uppercase font-black tracking-[4px] text-gold mb-6 block">Final Chapter</span>
                        <h2 className="text-5xl font-header mb-6 leading-tight">Ignite The<br />Magic</h2>
                        <p className="opacity-60 text-lg leading-relaxed font-light">The foundational elements are set. Let the Plaid Engine orchestrate the details.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: The Form */}
                <div className="w-7/12 p-12 lg:p-24 bg-white min-h-screen">
                  <div className="max-w-2xl mx-auto">

                    {/* Progress Bar */}
                    <div className="mb-16">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-navy/40 mb-4">
                        <span>Configuration Protocol</span>
                        <span>{wizardStep * 25}% Complete</span>
                      </div>
                      <div className="w-full h-1 bg-navy/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gold transition-all duration-700 ease-in-out" style={{ width: (wizardStep / 4) * 100 + '%' }}></div>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[400px]">
                      {wizardStep === 1 && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4">Adventure Name</label>
                            <input
                              type="text"
                              value={wizardData.name}
                              onChange={(e) => setWizardData({ ...wizardData, name: e.target.value })}
                              className="w-full text-3xl font-header border-b border-navy/10 pb-4 focus:border-gold transition-colors outline-none bg-transparent placeholder-navy/20"
                              placeholder="e.g. Summer Magic 2026"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                              <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Calendar size={14} /> Start Date</label>
                              <input type="date" className="w-full p-4 bg-navy/[0.02] rounded-xl border border-navy/5 font-bold outline-none" />
                            </div>
                            <div>
                              <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Calendar size={14} /> End Date</label>
                              <input type="date" className="w-full p-4 bg-navy/[0.02] rounded-xl border border-navy/5 font-bold outline-none" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Map size={14} /> Park Itinerary Priorities</label>
                            <div className="grid grid-cols-2 gap-4">
                              {['Magic Kingdom', 'Epcot', 'Hollywood Studios', 'Animal Kingdom'].map(park => (
                                <label key={park} className="cursor-pointer">
                                  <input type="checkbox" className="peer sr-only" defaultChecked={park === 'Magic Kingdom'} />
                                  <div className="p-5 rounded-xl border-2 border-navy/5 text-center transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10">
                                    <span className="text-sm font-bold block">{park}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><MapPin size={14} /> Accommodation Context</label>
                            <div className="space-y-4">
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-navy/20 text-gold focus:ring-gold" checked={wizardData.onSite} onChange={(e) => setWizardData({ ...wizardData, onSite: e.target.checked })} />
                                <span className="text-sm font-bold">Staying On-Site (Resort Guest)</span>
                              </label>
                              {wizardData.onSite && (
                                <div className="pl-8 animate-in fade-in zoom-in-95 duration-300">
                                  <input
                                    type="text"
                                    placeholder="e.g. Disney's Grand Floridian Resort"
                                    value={wizardData.hotelName || ''}
                                    onChange={(e) => setWizardData({ ...wizardData, hotelName: e.target.value })}
                                    className="w-full p-4 bg-navy/[0.02] rounded-xl border border-navy/5 font-bold outline-none focus:border-gold transition-colors text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {wizardStep === 2 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Sparkles size={14} /> Trip Pacing (The Speed)</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <label className="cursor-pointer">
                                <input type="radio" name="pacing" className="peer sr-only" value="intense" onChange={(e) => setWizardData({ ...wizardData, pacing: e.target.value as 'intense' | 'moderate' | 'relaxed' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Zap className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Intense</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Maximize every minute. Go-go-go pace from open to close.</p>
                                </div>
                              </label>
                              <label className="cursor-pointer">
                                <input type="radio" name="pacing" className="peer sr-only" value="moderate" defaultChecked onChange={(e) => setWizardData({ ...wizardData, pacing: e.target.value as 'intense' | 'moderate' | 'relaxed' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Heart className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Moderate</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Steady pace with some breathing room and lunch breaks.</p>
                                </div>
                              </label>
                              <label className="cursor-pointer">
                                <input type="radio" name="pacing" className="peer sr-only" value="relaxed" onChange={(e) => setWizardData({ ...wizardData, pacing: e.target.value as 'intense' | 'moderate' | 'relaxed' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Target className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Relaxed</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Take it easy. Soak in the atmosphere and move gently.</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* NEW ARRIVAL INTENT BLOCK */}
                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Clock size={14} /> Arrival Intent</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <label className="cursor-pointer">
                                <input type="radio" name="arrival" className="peer sr-only" value="rope-drop" onChange={(e) => setWizardData({ ...wizardData, arrivalIntent: e.target.value as 'rope-drop' | 'leisurely' | 'evening-only' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Crown className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Rope Drop</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Arrive 45 mins before open. First to ride!</p>
                                </div>
                              </label>
                              <label className="cursor-pointer">
                                <input type="radio" name="arrival" className="peer sr-only" value="leisurely" defaultChecked onChange={(e) => setWizardData({ ...wizardData, arrivalIntent: e.target.value as 'rope-drop' | 'leisurely' | 'evening-only' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Coffee className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Leisurely</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Sleep in, grab coffee, arrive 10:00 AM+.</p>
                                </div>
                              </label>
                              <label className="cursor-pointer">
                                <input type="radio" name="arrival" className="peer sr-only" value="evening-only" onChange={(e) => setWizardData({ ...wizardData, arrivalIntent: e.target.value as 'rope-drop' | 'leisurely' | 'evening-only' })} />
                                <div className="p-6 rounded-2xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-4">
                                  <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center"><Star className="text-gold" size={20} /></div>
                                  <h4 className="font-header text-lg">Evening</h4>
                                  <p className="text-[10px] opacity-60 leading-relaxed">Arrive around 4:00 PM for dinner & fireworks.</p>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Target size={14} /> Primary Focus</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {[
                                { id: 'thrills', title: 'Thrill Seekers', desc: 'Coasters & Big Drops', icon: Zap },
                                { id: 'toddlers', title: 'Toddler Friendly', desc: 'Gentle & Height-Free', icon: Heart },
                                { id: 'classic', title: 'Classic Magic', desc: 'Nostalgic Dark Rides', icon: Star },
                                { id: 'shows', title: 'Shows & Chars', desc: 'Parades & Greets', icon: Users }
                              ].map(focus => (
                                <label key={focus.id} className="cursor-pointer">
                                  <input type="radio" name="focus" className="peer sr-only" value={focus.id} defaultChecked={focus.id === 'classic'} onChange={(e) => setWizardData({ ...wizardData, primaryFocus: e.target.value as 'thrills' | 'toddlers' | 'classic' | 'shows' })} />
                                  <div className="p-4 rounded-xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-2">
                                    <focus.icon size={18} className="text-navy opacity-60 peer-checked:text-gold" />
                                    <h4 className="font-bold text-xs">{focus.title}</h4>
                                    <p className="text-[9px] opacity-40 leading-tight">{focus.desc}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Utensils size={14} /> Dining Style</label>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {[
                                { id: 'snacks', title: 'Snacks Only', icon: Coffee },
                                { id: 'quick', title: 'Quick Service', icon: Zap },
                                { id: 'table', title: 'Table Service', icon: Utensils },
                                { id: 'signature', title: 'Signature', icon: Crown }
                              ].map(style => (
                                <label key={style.id} className="cursor-pointer">
                                  <input type="radio" name="dining" className="peer sr-only" value={style.id} defaultChecked={style.id === 'quick'} onChange={(e) => setWizardData({ ...wizardData, dining: e.target.value as 'snacks' | 'quick' | 'table' | 'signature' })} />
                                  <div className="p-4 rounded-xl border-2 border-navy/5 transition-all peer-checked:border-teal peer-checked:bg-teal/5 hover:border-navy/10 flex flex-col items-center text-center gap-2">
                                    <style.icon size={18} className="text-navy opacity-60 peer-checked:text-teal" />
                                    <h4 className="font-bold text-xs">{style.title}</h4>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Clock size={14} /> Mid-Day Break Strategy</label>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { id: 'power', title: 'Power Through', desc: 'No scheduled breaks', icon: Zap },
                                { id: 'hotel', title: 'Hotel Break', desc: 'Nap or recharge at resort', icon: Coffee },
                                { id: 'pool', title: 'Pool / Cool-Down', desc: 'Afternoon swim & relax', icon: Compass }
                              ].map(strategy => (
                                <label key={strategy.id} className="cursor-pointer">
                                  <input type="radio" name="break" className="peer sr-only" value={strategy.id} checked={wizardData.breakStrategy === strategy.id} onChange={(e) => setWizardData({ ...wizardData, breakStrategy: e.target.value as 'power' | 'hotel' | 'pool' })} />
                                  <div className="p-4 rounded-xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-2">
                                    <strategy.icon size={18} className="text-navy opacity-60 peer-checked:text-gold" />
                                    <h4 className="font-bold text-xs">{strategy.title}</h4>
                                    <p className="text-[9px] opacity-40 leading-tight">{strategy.desc}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Utensils size={14} /> Dining Reservation Coverage</label>
                            <div
                              onClick={() => setWizardData(prev => ({ ...prev, diningReservationIntent: !prev.diningReservationIntent }))}
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${wizardData.diningReservationIntent ? 'border-teal bg-teal/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                            >
                              <div className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-colors ${wizardData.diningReservationIntent ? 'bg-teal' : 'bg-navy/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${wizardData.diningReservationIntent ? 'left-7' : 'left-1'}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Active Reservation Scouting</h4>
                                <p className="text-xs opacity-50 leading-relaxed">Recommended for Table Service or Signature dining. We will actively monitor reservation drops to secure your requested time blocks.</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Users size={14} /> Single Rider Lines</label>
                            <div
                              onClick={() => setWizardData(prev => ({ ...prev, singleRiderAllowed: !prev.singleRiderAllowed }))}
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${wizardData.singleRiderAllowed ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                            >
                              <div className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-colors ${wizardData.singleRiderAllowed ? 'bg-gold' : 'bg-navy/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${wizardData.singleRiderAllowed ? 'left-7' : 'left-1'}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Use Single-Rider Lines</h4>
                                <p className="text-xs opacity-50 leading-relaxed">For groups that want to maximize ride count. Each person joins the single rider queue independently — great for thrill-seekers who don't mind splitting up temporarily.</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Accessibility size={14} /> Disability Access Service (DAS)</label>
                            <div
                              onClick={() => setWizardData(prev => ({ ...prev, dasAllowed: !prev.dasAllowed }))}
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${wizardData.dasAllowed ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                            >
                              <div className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-colors ${wizardData.dasAllowed ? 'bg-gold' : 'bg-navy/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${wizardData.dasAllowed ? 'left-7' : 'left-1'}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Use Disability Access Service (DAS)</h4>
                                <p className="text-xs opacity-50 leading-relaxed">Disney's Disability Access Service lets eligible guests receive a return time instead of waiting in the standby queue. We'll route the day to maximize DAS efficiency.</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Zap size={14} /> Lightning Lane Multi Pass</label>
                            <div
                              onClick={() => setWizardData(prev => ({ ...prev, llMultiPassAllowed: !prev.llMultiPassAllowed }))}
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${wizardData.llMultiPassAllowed ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                            >
                              <div className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-colors ${wizardData.llMultiPassAllowed ? 'bg-gold' : 'bg-navy/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${wizardData.llMultiPassAllowed ? 'left-7' : 'left-1'}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Use Lightning Lane Multi Pass</h4>
                                <p className="text-xs opacity-50 leading-relaxed">An add-on purchase that lets you book return times for select attractions one at a time throughout the day. We'll prioritize LL-eligible rides and factor in booking strategy.</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-4 flex items-center gap-2"><Crown size={14} /> Lightning Lane Single Pass</label>
                            <div
                              onClick={() => setWizardData(prev => ({ ...prev, llSinglePassAllowed: !prev.llSinglePassAllowed }))}
                              className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${wizardData.llSinglePassAllowed ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                            >
                              <div className={`w-12 h-6 rounded-full flex-shrink-0 relative transition-colors ${wizardData.llSinglePassAllowed ? 'bg-gold' : 'bg-navy/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${wizardData.llSinglePassAllowed ? 'left-7' : 'left-1'}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Use Lightning Lane Single Pass</h4>
                                <p className="text-xs opacity-50 leading-relaxed">A per-ride purchase for the highest-demand attractions (TRON, Guardians, Seven Dwarfs, etc.) that are not included in Multi Pass. We'll build your day around getting these booked first.</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Sparkles size={14} /> Splurge Appetite</label>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { id: 'low', title: 'Value First', desc: 'Budget-friendly goals', icon: CreditCard },
                                { id: 'moderate', title: 'Moderate', desc: 'Mix of value & treat', icon: Star },
                                { id: 'high', title: 'Luxury / VIP', desc: 'Premium experiences', icon: Crown }
                              ].map(splurge => (
                                <label key={splurge.id} className="cursor-pointer">
                                  <input type="radio" name="splurge" className="peer sr-only" value={splurge.id} checked={wizardData.splurgeAppetite === splurge.id} onChange={(e) => setWizardData({ ...wizardData, splurgeAppetite: e.target.value as 'low' | 'moderate' | 'high' })} />
                                  <div className="p-4 rounded-xl border-2 border-navy/5 transition-all peer-checked:border-gold peer-checked:bg-gold/5 hover:border-navy/10 flex flex-col items-center text-center gap-2">
                                    <splurge.icon size={18} className="text-navy opacity-60 peer-checked:text-gold" />
                                    <h4 className="font-bold text-xs">{splurge.title}</h4>
                                    <p className="text-[9px] opacity-40 leading-tight">{splurge.desc}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-6 flex items-center gap-2"><Crown size={14} /> Premium Interests</label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                              {[
                                { id: 'droids', title: 'Droid Building', icon: Rocket },
                                { id: 'lightsabers', title: 'Lightsabers', icon: Zap },
                                { id: 'makeovers', title: 'Royal Makeovers', icon: Sparkles },
                                { id: 'dessert-party', title: 'Dessert Parties', icon: Star },
                                { id: 'vip-tour', title: 'VIP Tours', icon: ShieldCheck },
                                { id: 'dining-events', title: 'Dining Events', icon: Utensils }
                              ].map(item => {
                                const isSelected = wizardData.premiumInterests.includes(item.id);
                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      setWizardData(prev => ({
                                        ...prev,
                                        premiumInterests: isSelected
                                          ? prev.premiumInterests.filter(id => id !== item.id)
                                          : [...prev.premiumInterests, item.id]
                                      }));
                                    }}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white/50 hover:border-navy/10'}`}
                                  >
                                    <item.icon size={14} className={isSelected ? 'text-gold' : 'text-navy/40'} />
                                    <span className="text-[10px] font-bold">{item.title}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      )}

                      {wizardStep === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                          <div className="flex justify-between items-end mb-8">
                            <p className="text-base opacity-60 leading-relaxed max-w-xl m-0">Who is joining you on this adventure? Select from your family & friends list below.</p>
                            <button
                              onClick={() => {
                                setEditingMember({ id: Date.now(), name: '', age: 0, height: 0, allergies: 'None', email: '', surveyCompleted: false });
                                setEditingMemberSource('wizard');
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-navy bg-gold px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                            >
                              + Quick Add Member
                            </button>
                          </div>

                          <div className="grid gap-4">
                            {members.map((m) => {
                              const isSelected = wizardData.guests.some(g => g.id === m.id);
                              return (
                                <div
                                  key={m.id}
                                  onClick={() => {
                                    if (isSelected) {
                                      setWizardData(prev => ({ ...prev, guests: prev.guests.filter(g => g.id !== m.id) }));
                                    } else {
                                      setWizardData(prev => ({ ...prev, guests: [...prev.guests, m] }));
                                    }
                                  }}
                                  className={`flex items-center gap-6 p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-gold bg-gold/5' : 'border-navy/5 bg-white hover:border-navy/10'}`}
                                >
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-gold bg-gold text-navy' : 'border-navy/20 bg-transparent text-transparent'}`}>
                                    <CheckCircle size={16} />
                                  </div>
                                  <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                                    <span className="font-bold text-lg col-span-2">{m.name}</span>
                                    <span className="text-xs opacity-60">Age: {m.age}</span>
                                    {m.allergies !== 'None' ? (
                                      <span className="text-xs text-rose font-bold bg-rose/10 px-2 py-1 rounded w-fit">Alert: {m.allergies}</span>
                                    ) : (
                                      <span className="text-xs text-teal font-bold bg-teal/10 px-2 py-1 rounded w-fit">Cleared</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {wizardStep === 4 && (
                        <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="w-32 h-32 bg-navy mx-auto rounded-full flex items-center justify-center mb-10 relative">
                            <div className="absolute inset-0 rounded-full border border-gold border-dashed animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-2 rounded-full border border-gold border-solid animate-[spin_15s_linear_infinite_reverse]"></div>
                            <Send size={48} className="text-gold transform translate-x-1 -translate-y-1" />
                          </div>

                          <h3 className="text-4xl font-header mb-6">Ready to Share the Magic</h3>

                          <p className="text-base opacity-60 mb-12 max-w-lg mx-auto leading-relaxed">
                            By finalizing, you will activate the Adventure Dashboard. We will securely send beautifully branded emails to all members, asking them to rank their top 5 must-dos, favorite characters, and dining requests.
                          </p>

                          <div className="bg-navy/[0.03] p-8 rounded-3xl max-w-md mx-auto text-left flex items-start gap-6 border border-navy/5">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                              <Mail size={24} className="text-navy" />
                            </div>
                            <div>
                              <span className="font-header text-xl block mb-2">Automated Survey</span>
                              <span className="text-xs uppercase font-bold tracking-widest opacity-60">Pending {wizardData.guests.filter(g => g.email).length} Invitations</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-navy/10 px-4">
                      {wizardStep > 1 ? (
                        <button onClick={() => setWizardStep(s => s - 1)} className="px-8 py-4 font-bold text-sm opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2">
                          <ChevronRight size={16} className="rotate-180" /> Back
                        </button>
                      ) : <div></div>}

                      {wizardStep < 4 ? (
                        <button onClick={() => setWizardStep(s => s + 1)} className="py-4 px-10 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-full flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5">
                          Continue <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button onClick={handleWizardComplete} className="py-4 px-10 bg-navy hover:bg-[#1a3345] text-gold font-bold rounded-full flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-navy/30 hover:-translate-y-0.5 uppercase tracking-widest text-xs">
                          <Sparkles size={16} /> Finalize Curation
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )
          }

          {/* 7. ACCOUNT SETUP WIZARD */}
          {
            activeView === 'account_setup' && (
              <div className="view-setup min-h-screen flex items-center justify-center bg-navy w-[100vw] absolute inset-0 z-50 text-white">
                <div className="max-w-3xl w-full p-12 relative overflow-hidden">
                  <div className="absolute top-10 right-10 text-gold opacity-30 animate-pulse">
                    <Sparkles size={48} />
                  </div>

                  {setupStep === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center mb-8">
                        <Crown size={32} className="text-gold" />
                      </div>
                      <h1 className="text-5xl font-header mb-4 leading-tight">Welcome to your<br /><span className="text-gold">Magical Planning Studio</span></h1>
                      <p className="text-xl opacity-80 mb-12 font-light max-w-lg">Before you begin curating unforgettable memories, let's tailor the experience to your lead planner philosophy.</p>

                      <div className="space-y-6 max-w-md">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-widest text-gold mb-3">Lead Planner Name</label>
                          <input
                            type="text"
                            value={setupData.plannerName}
                            onChange={(e) => setSetupData({ ...setupData, plannerName: e.target.value })}
                            placeholder="e.g. Sarah"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-gold outline-none transition-colors text-lg"
                          />
                        </div>
                        <button
                          disabled={!setupData.plannerName}
                          onClick={() => setSetupStep(2)}
                          className="w-full py-4 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        >
                          Continue Initialization <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}

                  {setupStep === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <h2 className="text-4xl font-header mb-4">What is your primary <br /><span className="text-gold">touring philosophy?</span></h2>
                      <p className="opacity-80 mb-10 text-lg">This helps us tune the AI recommendations.</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div onClick={() => setSetupData({ ...setupData, travelStyle: 'relaxed' as "relaxed" | "moderate" | "intense" })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${setupData.travelStyle === 'relaxed' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Clock size={24} className={setupData.travelStyle === 'relaxed' ? 'text-gold' : 'text-white/60'} />
                          </div>
                          <h4 className="font-bold mb-2">Relaxed</h4>
                          <p className="text-sm opacity-60">Soak in the vibes, snacks, and gentle atmosphere.</p>
                        </div>

                        <div onClick={() => setSetupData({ ...setupData, travelStyle: 'moderate' as "relaxed" | "moderate" | "intense" })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${setupData.travelStyle === 'moderate' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Compass size={24} className={setupData.travelStyle === 'moderate' ? 'text-gold' : 'text-white/60'} />
                          </div>
                          <h4 className="font-bold mb-2">Moderate</h4>
                          <p className="text-sm opacity-60">Hit the headliners, but keep a steady, balanced rhythm.</p>
                        </div>

                        <div onClick={() => setSetupData({ ...setupData, travelStyle: 'intense' as "relaxed" | "moderate" | "intense" })} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${setupData.travelStyle === 'intense' ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <Rocket size={24} className={setupData.travelStyle === 'intense' ? 'text-gold' : 'text-white/60'} />
                          </div>
                          <h4 className="font-bold mb-2">Intense</h4>
                          <p className="text-sm opacity-60">High-speed, max efficiency. Maximize ride count at all costs.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button onClick={() => setSetupStep(1)} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Back</button>
                        <button onClick={() => handleSetupComplete()} className="flex-1 py-4 bg-gold hover:bg-yellow-500 text-navy font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-lg">
                          Launch Planner Dashboard <Rocket size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* 8. GUEST SURVEY VIEW (Standalone minimal view) */}
          {
            activeView === 'guest_survey' && (
              <div className="view-guest-survey flex flex-col items-center justify-center min-h-[80vh]">
                {surveyToken === 'expired' ? (
                  <div className="luxury-card p-10 max-w-lg w-full text-center">
                    <div className="w-16 h-16 bg-rose/10 text-rose rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-3xl font-header mb-4">Magic Link Expired</h2>
                    <p className="opacity-60 mb-8 max-w-sm mx-auto">This survey link has expired or is invalid. Please contact the Lead Planner of your adventure to request a new link.</p>
                    <button className="btn-primary-mini w-full flex justify-center py-4 text-sm" onClick={() => window.location.href = '/'}>
                      Return to Login
                    </button>
                  </div>
                ) : surveyStep === 4 ? (
                  <div className="luxury-card p-10 max-w-lg w-full text-center animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} />
                    </div>
                    <h2 className="text-3xl font-header mb-4">Magic Received!</h2>
                    <p className="opacity-60 mb-8 max-w-sm mx-auto">Thank you. Your priorities have been sent securely to your Lead Planner and the Plaid Magic Engine.</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gold">See You Real Soon</p>
                  </div>
                ) : (
                  <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-10">
                      <div className="inline-flex bg-gold p-3 rounded-2xl mb-6 shadow-xl shadow-gold/20">
                        <Sparkles size={24} className="text-navy" />
                      </div>
                      <h1 className="text-4xl font-header mb-3">Your Magic Awaits</h1>
                      <p className="opacity-60 text-sm">Help us craft the perfect itinerary by telling us what you love most about Disney.</p>
                    </div>

                    <div className="luxury-card p-10 mt-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-2 bg-navy/5">
                        <div className="h-full bg-gold transition-all duration-700" style={{ width: `${(surveyStep / 4) * 100}%` }}></div>
                      </div>
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mb-6">Step {surveyStep} of 4</p>

                      {surveyStep === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <h3 className="text-xl font-header mb-2">Rides & Attractions</h3>
                          <p className="opacity-60 text-sm mb-2">Tell us how you feel about each experience. If you're unsure, just skip — that's helpful too!</p>
                          <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest mb-6">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-teal/70 inline-block" />Want</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose/70 inline-block" />Skip</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-navy/10 inline-block" />No Opinion</span>
                          </div>

                          <div className="space-y-2 mb-8 max-h-[480px] overflow-y-auto pr-1">
                            {[
                              { id: 'space_mtn', name: 'Space Mountain', tag: 'Thrills · Indoor Coaster' },
                              { id: 'haunted_mansion', name: 'Haunted Mansion', tag: 'Classic · Dark Ride' },
                              { id: 'pirates', name: 'Pirates of the Caribbean', tag: 'Classic · Boat Ride' },
                              { id: 'jungle_cruise', name: 'Jungle Cruise', tag: 'Classic · Boat Tour' },
                              { id: 'big_thunder', name: 'Big Thunder Mountain Railroad', tag: 'Thrills · Outdoor Coaster' },
                              { id: 'splash_mtn', name: 'Tiana\'s Bayou Adventure', tag: 'Thrills · Log Flume' },
                              { id: 'seven_dwarfs', name: 'Seven Dwarfs Mine Train', tag: 'Family · Coaster' },
                              { id: 'peter_pan', name: 'Peter Pan\'s Flight', tag: 'Classic · Dark Ride' },
                              { id: 'rise', name: 'Star Wars: Rise of the Resistance', tag: 'Thrills · Immersive' },
                              { id: 'guardians', name: 'Guardians of the Galaxy: Cosmic Rewind', tag: 'Thrills · Coaster' },
                              { id: 'remy', name: 'Remy\'s Ratatouille Adventure', tag: 'Family · Dark Ride' },
                              { id: 'fop', name: 'Avatar: Flight of Passage', tag: 'Thrills · Simulator' },
                              { id: 'slinky', name: 'Slinky Dog Dash', tag: 'Family · Coaster' },
                              { id: 'toy_story', name: 'Toy Story Mania!', tag: 'Family · Shooter' },
                              { id: 'rocknroller', name: "Rock 'n' Roller Coaster", tag: 'Thrills · Indoor Coaster' },
                              { id: 'tower', name: 'Tower of Terror', tag: 'Thrills · Drop Tower' },
                            ].map(ride => (
                              <div key={ride.id} className="flex items-center gap-3 p-3 rounded-xl border border-navy/5 bg-white/60 hover:bg-white transition-colors">
                                <div className="flex-1 min-w-0">
                                  <span className="font-bold text-sm block truncate">{ride.name}</span>
                                  <span className="text-[10px] opacity-50">{ride.tag}</span>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <label className="cursor-pointer">
                                    <input type="radio" name={ride.id} value="want" className="peer sr-only" />
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-navy/10 text-[10px] font-black text-navy/40 transition-all peer-checked:border-teal peer-checked:bg-teal/10 peer-checked:text-teal hover:border-teal/50">✓</span>
                                  </label>
                                  <label className="cursor-pointer">
                                    <input type="radio" name={ride.id} value="skip" className="peer sr-only" />
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-navy/10 text-[10px] font-black text-navy/40 transition-all peer-checked:border-rose peer-checked:bg-rose/10 peer-checked:text-rose hover:border-rose/50">✕</span>
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {surveyStep === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <h3 className="text-xl font-header mb-2">Characters & Shows</h3>
                          <p className="opacity-60 text-sm mb-6">Who is your priority for meet-and-greets and live entertainment?</p>

                          <div className="space-y-3 mb-8">
                            {[
                              { title: 'The Classics', desc: 'Mickey, Minnie, Donald, Goofy', icon: Star },
                              { title: 'Disney Royalty', desc: 'Princesses, Princes & Fairies', icon: Crown },
                              { title: 'A Galaxy Far, Far Away', desc: 'Star Wars – heroes and villains', icon: Rocket },
                              { title: 'Marvel Heroes', desc: 'Avengers, Spider-Man & more', icon: Shield },
                              { title: 'Pixar Pals', desc: 'Buzz, Woody, Mike & Sulley', icon: Heart },
                              { title: 'Live Shows & Fireworks', desc: 'Fantasmic, Harmonious, MKFSH', icon: Sparkles },
                            ].map(char => (
                              <label key={char.title} className="flex items-center gap-4 p-4 rounded-xl border border-navy/10 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all group">
                                <input type="checkbox" className="w-5 h-5 accent-gold flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="font-bold block text-sm group-hover:text-navy">{char.title}</span>
                                  <span className="text-xs opacity-50 block">{char.desc}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {surveyStep === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <h3 className="text-xl font-header mb-2">Accessibility & Sensory</h3>
                          <p className="opacity-60 text-sm mb-6">This helps us tailor your experience. All information is private and only shared with your Lead Planner.</p>

                          <div className="space-y-6 mb-8">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-3">Disability Access Service (DAS)</p>
                              <label className="flex items-start gap-4 p-4 rounded-xl border border-navy/10 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all group">
                                <input type="checkbox" className="w-5 h-5 accent-gold flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold block text-sm">Someone in our party uses DAS</span>
                                  <span className="text-xs opacity-50 leading-relaxed block">Disney's Disability Access Service lets guests with disabilities use a return-time system instead of the standard queue. This affects how we route the day.</span>
                                </div>
                              </label>
                            </div>

                            <div>
                              <p className="text-xs font-black uppercase tracking-widest opacity-40 mb-3">Sensory Considerations</p>
                              <div className="space-y-2">
                                <label className="flex items-start gap-4 p-4 rounded-xl border border-navy/10 hover:border-amber-400/50 hover:bg-amber-50 cursor-pointer transition-all group">
                                  <input type="checkbox" className="w-5 h-5 accent-amber-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block text-sm">Strobe Light Sensitivity</span>
                                    <span className="text-xs opacity-50 leading-relaxed block">We will flag rides with strobe effects (e.g., Space Mountain, Guardians) so you can decide in advance.</span>
                                  </div>
                                </label>
                                <label className="flex items-start gap-4 p-4 rounded-xl border border-navy/10 hover:border-amber-400/50 hover:bg-amber-50 cursor-pointer transition-all group">
                                  <input type="checkbox" className="w-5 h-5 accent-amber-500 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold block text-sm">Loud Noise Sensitivity</span>
                                    <span className="text-xs opacity-50 leading-relaxed block">We will note attractions with startling audio effects or high-decibel environments so you can plan accordingly.</span>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {surveyStep === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <h3 className="text-xl font-header mb-2">Dining Style</h3>
                          <p className="opacity-60 text-sm mb-6">How do you prefer to eat while in the parks?</p>

                          <div className="space-y-3 mb-8">
                            {[
                              { title: 'Snacks On-the-Go', desc: 'Churros, Dole Whip, and keep moving — minimize downtime', icon: Coffee },
                              { title: 'Quick & Casual', desc: 'Counter service — eat fast, get back to the rides', icon: Zap },
                              { title: 'Table Service', desc: 'Sit-down meal in the AC — a welcome mid-day break', icon: Utensils },
                              { title: 'Character Dining', desc: 'Meals with Disney Characters coming to the table', icon: Heart },
                              { title: 'Signature Fine Dining', desc: 'Premium reservation-only restaurants for a special occasion', icon: Crown },
                            ].map(dining => (
                              <label key={dining.title} className="flex items-center gap-4 p-4 rounded-xl border border-navy/10 hover:border-gold/50 hover:bg-gold/5 cursor-pointer transition-all group">
                                <input type="radio" name="dining" className="w-5 h-5 accent-gold flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="font-bold block text-sm group-hover:text-navy">{dining.title}</span>
                                  <span className="text-xs opacity-50 block">{dining.desc}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-6 border-t border-navy/5">
                        {surveyStep > 1 ? (
                          <button onClick={() => setSurveyStep(s => s - 1)} className="text-sm font-bold opacity-60 hover:opacity-100 transition-opacity">← Back</button>
                        ) : (
                          <button className="text-sm font-bold opacity-40 hover:opacity-100 transition-opacity">Skip for now</button>
                        )}

                        {surveyStep < 4 ? (
                          <button
                            onClick={() => setSurveyStep(s => s + 1)}
                            className="btn-primary-mini flex items-center gap-2"
                          >
                            Continue <ArrowRight size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setSurveyStep(5)}
                            className="btn-primary-mini flex items-center gap-2 bg-teal text-white hover:shadow-teal/30"
                          >
                            Submit Survey <Send size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        
        :root {
          --plaid-alabaster: #F5F5F0; /* Soft cream/beige matching the public site */
          --plaid-navy: #0A1929;
          --plaid-gold: #D4AF37; /* The signature gold */
          --plaid-teal: #2D5A5A;
          --plaid-rose: #B33951;
          --sidebar-width: 300px;
        }

        * { box-sizing: border-box; }
        body { 
          margin: 0; 
          padding: 0; 
          color: var(--plaid-navy);
          line-height: 1.6;
        }

        .font-header { 
          font-family: 'Playfair Display', serif; 
          font-weight: 900;
          letter-spacing: 0.01em; /* Slight increase for readability */
        }
        
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--plaid-alabaster);
          color: var(--plaid-navy);
          font-family: 'Inter', sans-serif;
        }

        .guest-survey-mode .main-content {
          margin-left: 0 !important;
          padding: 2rem !important;
        }

        /* Adjust global Tailwind opacities to be much clearer */
        .opacity-20 { opacity: 0.4 !important; }
        .opacity-30 { opacity: 0.5 !important; }
        .opacity-40 { opacity: 0.65 !important; }
        .opacity-50 { opacity: 0.75 !important; }
        .opacity-60 { opacity: 0.85 !important; }

        /* Sidebar Styles */
        .sidebar {
          width: var(--sidebar-width);
          background: white;
          border-right: 1px solid rgba(18, 35, 46, 0.05);
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
          padding: 0 0.5rem;
        }

        .logo-text {
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: -0.01em;
          text-transform: uppercase;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          border: none;
          background: transparent;
          color: #12232E66;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          text-decoration: none;
        }

        .nav-item:hover {
          color: var(--plaid-navy);
          background: rgba(18, 35, 46, 0.03);
        }

        .nav-item.active {
          color: var(--plaid-navy);
          background: rgba(18, 35, 46, 0.04);
        }

        .active-glow {
          position: absolute;
          left: -1rem;
          width: 4px;
          height: 20px;
          background: var(--plaid-gold);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 0 10px var(--plaid-gold);
        }

        .sidebar-footer {
          padding-top: 2rem;
          border-top: 1px solid rgba(18, 35, 46, 0.05);
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(18, 35, 46, 0.02);
          border-radius: 16px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: var(--plaid-gold);
          color: var(--plaid-navy);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }

        .user-info {
          flex: 1;
          text-align: left;
        }

        .user-name {
          display: block;
          font-weight: 800;
          font-size: 0.8rem;
        }

        .user-role {
          display: block;
          font-size: 0.65rem;
          opacity: 0.4;
          text-transform: uppercase;
          font-weight: 800;
        }

        .logout-icon {
          opacity: 0.2;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .logout-icon:hover { opacity: 1; }

        /* Main Content Styles */
        .main-content {
          margin-left: var(--sidebar-width);
          flex: 1;
          padding: 2.5rem 3.5rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3.5rem;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .telemetry-pill {
          background: white;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          border: 1px solid rgba(18, 35, 46, 0.05);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 900;
          font-size: 0.65rem;
          letter-spacing: 1px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          background: var(--plaid-teal);
          border-radius: 50%;
        }

        .status-dot.pulse {
          box-shadow: 0 0 0 rgba(45, 90, 90, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(45, 90, 90, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(45, 90, 90, 0); }
          100% { box-shadow: 0 0 0 0px rgba(45, 90, 90, 0); }
        }

        .btn-primary-mini {
          background: var(--plaid-gold);
          color: var(--plaid-navy);
          padding: 0.85rem 1.75rem;
          border-radius: 9999px; /* Pill-shaped */
          border: none;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        /* View Mission Styles */
        .hero-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 3rem;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .hero-subtitle {
          font-size: 1rem;
          opacity: 0.4;
          margin: 0;
          font-weight: 600;
        }

        .weather-widget {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
           background: white;
           padding: 1rem 1.5rem;
           border-radius: 20px;
           border: 1px solid rgba(18, 35, 46, 0.05);
        }

        .luxury-card {
          background: white;
          border-radius: 24px;
          border: 1px solid rgba(10, 25, 41, 0.05); /* Softer border */
          box-shadow: 0 4px 20px rgba(10, 25, 41, 0.03); /* Whisper soft shadow */
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }

        .luxury-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(10, 25, 41, 0.06);
        }

        .badge-teal {
          background: rgba(45, 90, 90, 0.1);
          color: var(--plaid-teal);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 900;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-gold {
          background: rgba(212, 175, 55, 0.1);
          color: var(--plaid-gold);
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: 900;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .view-container > div {
          animation: fadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* Utility */
        .gold-text { color: var(--plaid-gold); }
        .text-gold { color: var(--plaid-gold); }
        .text-teal { color: var(--plaid-teal); }
        .text-rose { color: var(--plaid-rose); }
        .text-navy { color: var(--plaid-navy); }
        .bg-gold { background-color: var(--plaid-gold); }
        .bg-navy { background-color: var(--plaid-navy); }
        .text-white { color: white; }

        input, select {
            `
      }} />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* GUEST PREFERENCE SURVEY MODAL                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {
        surveyModalGuest && (() => {
          const tripParks = (() => {
            const adv = adventures.find(a => a.id === activeAdventureId);
            return adv?.parks ?? [];
          })();
          const SURVEY_TABS = ['Ride', 'Show', 'Parade', 'Character', 'Dining', 'Seasonal'];
          const catalogItems = mockResearchItems.filter(item =>
            tripParks.some(p => item.park.toLowerCase() === p.toLowerCase())
          );
          const tabItems = catalogItems.filter(i => i.type === surveyActiveTab);

          const toggleSelection = (id: string, val: 'want' | 'skip') => {
            setSurveySelections(prev => {
              const next = { ...prev };
              if (next[id] === val) delete next[id]; else next[id] = val;
              return next;
            });
          };

          const toggleTopTen = (id: string) => {
            setSurveyTopTen(prev => {
              if (prev.includes(id)) return prev.filter(x => x !== id);
              if (prev.length >= 10) return prev;
              return [...prev, id];
            });
          };

          const wantedItems = surveyNoPreference
            ? catalogItems
            : catalogItems.filter(i => surveySelections[i.id] === 'want');

          const rankable = wantedItems.length > 0 ? wantedItems : catalogItems;

          return (
            <div className="fixed inset-0 bg-navy/85 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-[#F5F5F0] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">

                {/* ── Modal Header ── */}
                <div className="bg-gradient-to-r from-navy to-[#1a3345] text-white px-8 py-6 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shrink-0">
                      <Sparkles size={20} className="text-navy" />
                    </div>
                    <div>
                      <h2 className="text-xl font-header leading-none">{surveyModalGuest.name}'s Preferences</h2>
                      <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest mt-0.5">
                        {surveyModalStep === 1 ? 'Step 1 of 2 — What interests you?' : surveyModalStep === 2 ? 'Step 2 of 2 — Rank your top 10' : 'All done!'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Progress dots */}
                    <div className="flex gap-2">
                      {[1, 2].map(s => (
                        <div key={s} className={`w-2 h-2 rounded-full transition-all ${surveyModalStep >= s ? 'bg-gold' : 'bg-white/20'}`} />
                      ))}
                    </div>
                    <button
                      title="Close survey"
                      onClick={() => setSurveyModalGuest(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* ── STEP 1: Attraction Selection ── */}
                {surveyModalStep === 1 && (
                  <div className="flex flex-1 min-h-0">
                    {/* Left: list */}
                    <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${surveyDetailItem ? 'w-1/2' : 'w-full'}`}>
                      {/* No-preference toggle */}
                      <div className="px-8 pt-6 pb-4 shrink-0 border-b border-navy/8">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${surveyNoPreference ? 'bg-teal' : 'bg-navy/20'}`}>
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${surveyNoPreference ? 'left-4' : 'left-0.5'}`} />
                          </div>
                          <input type="checkbox" className="sr-only" checked={surveyNoPreference} onChange={e => { setSurveyNoPreference(e.target.checked); if (e.target.checked) setSurveySelections({}); }} />
                          <div>
                            <span className="font-bold text-sm text-navy">I'm open to everything — no strong preferences</span>
                            <span className="block text-[11px] text-navy/50">Skip individual selections and go straight to ranking your top 10.</span>
                          </div>
                        </label>
                      </div>

                      {/* Tabs */}
                      {!surveyNoPreference && (
                        <div className="flex gap-1 px-8 pt-4 shrink-0 overflow-x-auto pb-1">
                          {SURVEY_TABS.map(tab => {
                            const count = catalogItems.filter(i => i.type === tab && surveySelections[i.id] === 'want').length;
                            return (
                              <button
                                key={tab}
                                onClick={() => { setSurveyActiveTab(tab); setSurveyDetailItem(null); }}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 transition-all ${surveyActiveTab === tab ? 'bg-navy text-white' : 'bg-navy/5 text-navy/60 hover:bg-navy/10 hover:text-navy'}`}
                              >
                                {tab}
                                {count > 0 && (
                                  <span className="w-4 h-4 rounded-full bg-teal text-white text-[9px] font-black flex items-center justify-center">{count}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Legend */}
                      {!surveyNoPreference && (
                        <div className="flex gap-5 px-8 py-3 text-[10px] font-black uppercase tracking-widest text-navy/50 shrink-0">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal/60 inline-block" />Want</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose/60 inline-block" />Skip</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-navy/15 inline-block" />No opinion</span>
                          <span className="ml-auto text-gold">Click name for details</span>
                        </div>
                      )}

                      {/* Items list */}
                      <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-1.5 custom-scrollbar">
                        {(surveyNoPreference ? catalogItems : tabItems).map(item => {
                          const sel = surveySelections[item.id];
                          const isWant = sel === 'want';
                          const isSkip = sel === 'skip';
                          const isDetailOpen = surveyDetailItem?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isDetailOpen ? 'border-gold/50 bg-gold/5' : 'border-navy/6 bg-white hover:border-navy/15'} ${item.closedDuringVisit ? 'opacity-40' : ''}`}
                            >
                              {/* Name + tag */}
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => setSurveyDetailItem(isDetailOpen ? null : item)}
                                  className="font-bold text-sm text-navy hover:text-gold transition-colors text-left block truncate"
                                  title="Click for details"
                                >
                                  {item.title}
                                </button>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] uppercase font-black tracking-widest text-navy/40">{item.type}</span>
                                  {item.heightReq && item.heightReq !== 'Any' && (
                                    <span className="text-[9px] font-bold text-navy/40">• {item.heightReq}</span>
                                  )}
                                  {item.thrillLevel && (
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${item.thrillLevel === 'High' ? 'text-rose/70' : item.thrillLevel === 'Moderate' ? 'text-orange-500/70' : 'text-navy/30'}`}>
                                      {item.thrillLevel}
                                    </span>
                                  )}
                                  {item.closedDuringVisit && <span className="text-[9px] font-black text-rose/70 uppercase">🔧 Closed</span>}
                                </div>
                              </div>

                              {/* Want / Skip buttons */}
                              {!surveyNoPreference && (
                                <div className="flex gap-2 shrink-0">
                                  <button
                                    title="I want to do this"
                                    disabled={!!item.closedDuringVisit}
                                    onClick={() => toggleSelection(item.id, 'want')}
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all ${isWant ? 'border-teal bg-teal text-white shadow-md shadow-teal/20 scale-110' : 'border-navy/15 text-navy/30 hover:border-teal/60 hover:text-teal'}`}
                                  >✓</button>
                                  <button
                                    title="I want to skip this"
                                    disabled={!!item.closedDuringVisit}
                                    onClick={() => toggleSelection(item.id, 'skip')}
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] font-black transition-all ${isSkip ? 'border-rose bg-rose text-white shadow-md shadow-rose/20 scale-110' : 'border-navy/15 text-navy/30 hover:border-rose/60 hover:text-rose'}`}
                                  >✕</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Details drawer */}
                    {surveyDetailItem && (
                      <div className="w-80 border-l border-navy/10 flex flex-col bg-gradient-to-b from-navy to-[#1a3345] text-white animate-in slide-in-from-right-4 duration-200 shrink-0">
                        <div className="p-6 flex items-start justify-between border-b border-white/10 shrink-0">
                          <div>
                            <h4 className="font-bold text-base leading-tight">{surveyDetailItem.title}</h4>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{surveyDetailItem.type}</span>
                          </div>
                          <button
                            title="Close details"
                            onClick={() => setSurveyDetailItem(null)}
                            className="text-white/40 hover:text-white shrink-0 mt-0.5"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                          {surveyDetailItem.rating && (
                            <div className="flex items-center gap-2">
                              <Star size={14} className="text-gold fill-gold" />
                              <span className="font-bold text-sm">{surveyDetailItem.rating}</span>
                              <span className="text-white/40 text-xs">/ 5.0</span>
                            </div>
                          )}

                          <p className="text-sm text-white/80 leading-relaxed">{surveyDetailItem.description}</p>

                          <div className="grid grid-cols-2 gap-3">
                            {surveyDetailItem.length && (
                              <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Duration</span>
                                <div className="flex items-center gap-1 text-xs font-bold"><Clock size={12} className="text-white/40" /> {surveyDetailItem.length}</div>
                              </div>
                            )}
                            {surveyDetailItem.heightReq && (
                              <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Height</span>
                                <div className="flex items-center gap-1 text-xs font-bold"><Ruler size={12} className="text-white/40" /> {surveyDetailItem.heightReq}</div>
                              </div>
                            )}
                            {surveyDetailItem.thrillLevel && (
                              <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Thrill</span>
                                <div className={`flex items-center gap-1 text-xs font-bold ${surveyDetailItem.thrillLevel === 'High' ? 'text-rose' : 'text-white/80'}`}>
                                  <Activity size={12} /> {surveyDetailItem.thrillLevel}
                                </div>
                              </div>
                            )}
                            {surveyDetailItem.environment && (
                              <div>
                                <span className="block text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Environment</span>
                                <div className="flex items-center gap-1 text-xs font-bold text-white/80"><MapPin size={12} className="text-white/40" /> {surveyDetailItem.environment}</div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            {(surveyDetailItem.dasEligible || Boolean((surveyDetailItem as Record<string, unknown>).singleRider) || Boolean((surveyDetailItem as Record<string, unknown>).childSwap) || Boolean((surveyDetailItem as Record<string, unknown>).earlyMorningAccess)) && (
                              <div>
                                <span className="text-[8px] uppercase font-black text-white/30 block mb-1 tracking-[2px]">Rules & Options</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {surveyDetailItem.dasEligible && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal/20 text-teal border border-teal/30">DAS</span>}
                                  {Boolean((surveyDetailItem as Record<string, unknown>).earlyMorningAccess) && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">Early Morning Access</span>}
                                  {Boolean((surveyDetailItem as Record<string, unknown>).singleRider) && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">Single Rider</span>}
                                  {Boolean((surveyDetailItem as Record<string, unknown>).childSwap) && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">Child Switch</span>}
                                </div>
                              </div>
                            )}

                            {(surveyDetailItem.loudNoises || surveyDetailItem.strobeLights) && (
                              <div>
                                <span className="text-[8px] uppercase font-black text-white/30 block mb-1 tracking-[2px]">Warnings</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {surveyDetailItem.loudNoises && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose/20 text-rose/90 border border-rose/30">Loud Noises</span>}
                                  {surveyDetailItem.strobeLights && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">Strobe Lights</span>}
                                </div>
                              </div>
                            )}
                          </div>

                          {surveyDetailItem.notable && (
                            <div className="bg-navy/30 p-3 rounded-xl border border-white/5 flex gap-2">
                              <Info size={12} className="text-blue-300 mt-0.5 shrink-0" />
                              <span className="text-[11px] text-white/80 leading-tight"><strong>Note:</strong> {surveyDetailItem.notable}</span>
                            </div>
                          )}

                          {surveyDetailItem.context && (
                            <div className="bg-gold/10 p-3 rounded-xl border border-gold/20 flex gap-2">
                              <Sparkles size={12} className="text-gold mt-0.5 shrink-0" />
                              <span className="text-[11px] text-white/80 leading-tight">{surveyDetailItem.context}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick-select from detail drawer */}
                        <div className="p-4 border-t border-white/10 flex gap-2 shrink-0">
                          <button
                            onClick={() => toggleSelection(surveyDetailItem.id, 'want')}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${surveySelections[surveyDetailItem.id] === 'want' ? 'bg-teal text-white' : 'bg-white/10 text-white/60 hover:bg-teal/30 hover:text-white'}`}
                          >✓ Want</button>
                          <button
                            onClick={() => toggleSelection(surveyDetailItem.id, 'skip')}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${surveySelections[surveyDetailItem.id] === 'skip' ? 'bg-rose text-white' : 'bg-white/10 text-white/60 hover:bg-rose/30 hover:text-white'}`}
                          >✕ Skip</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 2: Top-10 Priority Ranking ── */}
                {surveyModalStep === 2 && (
                  <div className="flex flex-1 min-h-0 gap-0">
                    {/* Left: pool of items to pick from */}
                    <div className="flex-1 flex flex-col min-h-0 border-r border-navy/10">
                      <div className="px-8 py-5 border-b border-navy/8 shrink-0">
                        <h3 className="font-header text-navy text-lg">Build Your Top 10</h3>
                        <p className="text-[12px] text-navy/60 mt-1">Click any attraction to add it, in priority order. You can add up to 10.</p>
                      </div>
                      <div className="flex-1 overflow-y-auto px-8 py-4 space-y-1.5 custom-scrollbar">
                        {rankable.map(item => {
                          const rank = surveyTopTen.indexOf(item.id);
                          const isRanked = rank !== -1;
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleTopTen(item.id)}
                              disabled={!isRanked && surveyTopTen.length >= 10}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${isRanked ? 'border-gold/40 bg-gold/8 shadow-sm' : surveyTopTen.length >= 10 ? 'border-navy/5 bg-navy/3 opacity-40 cursor-not-allowed' : 'border-navy/8 bg-white hover:border-navy/20 hover:bg-navy/3'}`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${isRanked ? 'bg-gold text-navy shadow-md shadow-gold/20' : 'bg-navy/8 text-navy/30'}`}>
                                {isRanked ? rank + 1 : '·'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className={`font-bold text-sm block truncate ${isRanked ? 'text-navy' : 'text-navy/70'}`}>{item.title}</span>
                                <span className="text-[9px] uppercase font-black tracking-widest text-navy/40">{item.type}
                                  {item.thrillLevel ? ` · ${item.thrillLevel}` : ''}
                                  {item.length ? ` · ${item.length}` : ''}
                                </span>
                              </div>
                              {isRanked && <X size={12} className="text-navy/30 hover:text-rose shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: ranked list */}
                    <div className="w-72 flex flex-col bg-navy/[0.02] shrink-0">
                      <div className="px-6 py-5 border-b border-navy/8 shrink-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-[11px] uppercase tracking-widest text-navy/60">Your Ranked List</h4>
                          <span className={`text-xs font-black ${surveyTopTen.length === 10 ? 'text-gold' : 'text-navy/40'}`}>{surveyTopTen.length}/10</span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
                        {surveyTopTen.length === 0 && (
                          <p className="text-[11px] text-navy/30 text-center pt-8 italic">Nothing ranked yet.<br />Click items on the left to add them.</p>
                        )}
                        {surveyTopTen.map((id, i) => {
                          const item = catalogItems.find(x => x.id === id);
                          if (!item) return null;
                          return (
                            <div key={id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-navy/8 shadow-sm">
                              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-navy font-black text-xs shrink-0 shadow-md shadow-gold/20">
                                {i + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs block truncate">{item.title}</span>
                                <span className="text-[9px] text-navy/40 font-bold uppercase tracking-wide">{item.type}</span>
                              </div>
                              <button
                                title={`Remove ${item.title} from ranking`}
                                onClick={() => toggleTopTen(id)}
                                className="text-navy/20 hover:text-rose transition-colors shrink-0"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Confirmation ── */}
                {surveyModalStep === 3 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in zoom-in-95 duration-400">
                    <div className="w-20 h-20 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal/10">
                      <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-header text-navy mb-3">Magic Received!</h2>
                    <p className="text-sm text-navy/60 max-w-sm">
                      {surveyModalGuest.name}'s preferences have been saved and will shape the perfect itinerary.
                      {surveyTopTen.length > 0 && ` Top ${surveyTopTen.length} priorities captured.`}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold mt-6">See You Real Soon ✨</p>
                  </div>
                )}

                {/* ── Modal Footer ── */}
                {surveyModalStep !== 3 && (
                  <div className="px-8 py-5 border-t border-navy/8 flex items-center justify-between shrink-0 bg-white/60">
                    {surveyModalStep === 1 ? (
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-navy/50 font-bold">
                          {Object.values(surveySelections).filter(v => v === 'want').length} wanted
                          {' · '}
                          {Object.values(surveySelections).filter(v => v === 'skip').length} skipped
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSurveyModalStep(1); setSurveyDetailItem(null); }}
                        className="text-sm font-bold text-navy/50 hover:text-navy transition-colors flex items-center gap-1.5"
                      >
                        ← Back to Selection
                      </button>
                    )}

                    {surveyModalStep === 1 ? (
                      <button
                        onClick={() => { setSurveyModalStep(2); setSurveyDetailItem(null); }}
                        className="btn-primary-mini flex items-center gap-2"
                      >
                        Continue to Ranking <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={submitSurvey}
                        className="btn-primary-mini flex items-center gap-2 bg-teal text-white hover:shadow-lg hover:shadow-teal/30"
                      >
                        Submit Preferences <Send size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })()
      }

      {/* Activity Details Modal */}
      {
        selectedActivityForDetails && (
          <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-navy text-white rounded-3xl p-8 max-w-lg w-full relative border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setSelectedActivityForDetails(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                ${selectedActivityForDetails.type === 'ride' || selectedActivityForDetails.type === 'Ride' ? 'bg-gold/10 text-gold' :
                    selectedActivityForDetails.type === 'dining' || selectedActivityForDetails.type === 'Dining' ? 'bg-rose/10 text-rose' :
                      selectedActivityForDetails.type === 'show' || selectedActivityForDetails.type === 'Show' ? 'bg-teal/10 text-teal' : 'bg-navy/5 text-navy'}
              `}>
                  {selectedActivityForDetails.type === 'ride' || selectedActivityForDetails.type === 'Ride' ? <Rocket size={24} /> :
                    selectedActivityForDetails.type === 'dining' || selectedActivityForDetails.type === 'Dining' ? <Utensils size={24} /> :
                      selectedActivityForDetails.type === 'show' || selectedActivityForDetails.type === 'Show' ? <Star size={24} /> : <Coffee size={24} />}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedActivityForDetails.title}</h3>
                  <span className="text-xs uppercase font-black tracking-widest text-white/50">{selectedActivityForDetails.type}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
                {selectedActivityForDetails.length && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Duration</span>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold">
                      <Clock size={14} className="text-white/60" /> {selectedActivityForDetails.length}
                    </div>
                  </div>
                )}
                {selectedActivityForDetails.travelTime && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Travel</span>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold">
                      <ArrowRight size={14} className="text-white/60" /> {selectedActivityForDetails.travelTime}
                    </div>
                  </div>
                )}
                {selectedActivityForDetails.heightReq && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Height</span>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold">
                      <Ruler size={14} className="text-white/60" /> {selectedActivityForDetails.heightReq}
                    </div>
                  </div>
                )}
                {selectedActivityForDetails.thrillLevel && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/40">Thrill</span>
                    <div className="flex items-center gap-1.5 text-xs text-white/90 font-bold">
                      <Activity size={14} className={selectedActivityForDetails.thrillLevel === 'High' ? 'text-rose' : 'text-white/60'} /> {selectedActivityForDetails.thrillLevel}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {(selectedActivityForDetails.dasEligible || Boolean((selectedActivityForDetails as Record<string, unknown>).singleRider) || Boolean((selectedActivityForDetails as Record<string, unknown>).childSwap) || selectedActivityForDetails.earlyMorningAccess) && (
                  <div>
                    <span className="text-[9px] uppercase font-black text-white/30 block mb-2 tracking-[2px]">Rules & Options</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivityForDetails.dasEligible && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-teal/10 border border-teal/20 text-[10px] text-teal-light font-black uppercase tracking-widest">
                          <Accessibility size={12} /> DAS Eligible
                        </div>
                      )}
                      {selectedActivityForDetails.earlyMorningAccess && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-400/20 text-[10px] text-orange-300 font-black uppercase tracking-widest">
                          <Crown size={12} /> Early Morning Access
                        </div>
                      )}
                      {Boolean((selectedActivityForDetails as Record<string, unknown>).singleRider) && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-[10px] text-purple-300 font-black uppercase tracking-widest">
                          <Users size={12} /> Single Rider
                        </div>
                      )}
                      {Boolean((selectedActivityForDetails as Record<string, unknown>).childSwap) && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[10px] text-sky-300 font-black uppercase tracking-widest">
                          <RefreshCw size={12} /> Child Switch
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {(selectedActivityForDetails.loudNoises || selectedActivityForDetails.strobeLights) && (
                  <div>
                    <span className="text-[9px] uppercase font-black text-white/30 block mb-2 tracking-[2px]">Warnings</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivityForDetails.loudNoises && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose/10 border border-rose/20 text-[10px] text-rose-light font-black uppercase tracking-widest">
                          <Volume2 size={12} /> Loud Noises
                        </div>
                      )}
                      {selectedActivityForDetails.strobeLights && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold/10 border border-gold/30 text-[10px] text-gold-light font-black uppercase tracking-widest">
                          <Zap size={12} /> Strobe Lights
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedActivityForDetails.description && (
                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {selectedActivityForDetails.description}
                </p>
              )}

              {selectedActivityForDetails.reason && (
                <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 flex gap-3">
                  <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[10px] uppercase tracking-widest text-gold mb-1">Why It's Here</h5>
                    <p className="text-xs text-white/80">{selectedActivityForDetails.reason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* ── EDIT MEMBER MODAL ── */}
      {editingMember && (
        <div className="fixed inset-0 bg-navy/85 backdrop-blur-md z-[70] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#F5F5F0] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            <div className="bg-gradient-to-r from-navy to-[#1a3345] text-white px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-header leading-none">{editingMember.name ? 'Edit Member' : 'Add New Member'}</h2>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest mt-1">Adventure Group Details</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-8 pb-4 space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  placeholder="e.g. Mickey Mouse"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-2">Email Address <span className="text-[9px] opacity-60 lowercase font-normal">(optional)</span></label>
                <input
                  type="email"
                  value={editingMember.email || ''}
                  onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  placeholder="For surveys & itineraries"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-2">Age</label>
                  <input
                    type="number"
                    value={editingMember.age || ''}
                    onChange={e => setEditingMember({ ...editingMember, age: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-2">Height (inches)</label>
                  <input
                    type="number"
                    value={editingMember.height || ''}
                    onChange={e => setEditingMember({ ...editingMember, height: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                    placeholder="e.g. 48"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-widest opacity-40 block mb-2">Allergies & Restrictions</label>
                <input
                  type="text"
                  value={editingMember.allergies === 'None' ? '' : editingMember.allergies}
                  onChange={e => setEditingMember({ ...editingMember, allergies: e.target.value || 'None' })}
                  className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                  placeholder="e.g. Peanuts, Gluten"
                />
              </div>
            </div>

            <div className="p-8 pt-4 flex gap-3">
              <button
                onClick={() => setEditingMember(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-navy/60 hover:bg-navy/5 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!editingMember.name}
                onClick={() => {
                  const m = editingMember;

                  // Update global members array:
                  if (members.some(mem => mem.id === m.id)) {
                    setMembers(members.map(mem => mem.id === m.id ? m : mem));
                  } else {
                    setMembers([...members, m]);
                  }

                  // If adding from wizard, update wizardData
                  if (editingMemberSource === 'wizard' && !wizardData.guests.some(g => g.id === m.id)) {
                    setWizardData(prev => ({ ...prev, guests: [...prev.guests, m] }));
                  } else if (editingMemberSource === 'wizard') {
                    setWizardData(prev => ({ ...prev, guests: prev.guests.map(g => g.id === m.id ? m : g) }));
                  }

                  // If adding from active adventure itinerary
                  if (editingMemberSource === 'adventure') {
                    if (!adventures.find(a => a.id === activeAdventureId)?.guests.some(g => g.id === m.id)) {
                      setAdventures(adventures.map(a => a.id === activeAdventureId ? { ...a, guests: [...a.guests, m] } : a));
                    } else {
                      setAdventures(adventures.map(a => a.id === activeAdventureId ? { ...a, guests: a.guests.map(g => g.id === m.id ? m : g) } : a));
                    }
                  }

                  setEditingMember(null);
                }}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none
                  ${editingMember.name ? 'bg-gold hover:bg-gold-light hover:shadow-lg hover:-translate-y-0.5 text-navy' : 'bg-navy/10 text-navy/30 cursor-not-allowed'}
                `}
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

    </div >
    </AlphaGate>
  );
}

export default App;
