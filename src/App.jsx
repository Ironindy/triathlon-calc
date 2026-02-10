import React, { useState, useRef, useEffect } from 'react';
import { Gauge, Waves, Bike, Timer, Clock, Activity, ChevronDown } from 'lucide-react';

export default function TriathlonCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const canvasRef = useRef(null);
  
  // Calculator state
  const [paceUnit, setPaceUnit] = useState('1km');
  const [distance, setDistance] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [timeSeconds, setTimeSeconds] = useState('');
  const [speed, setSpeed] = useState('');
  const [paceMinutes, setPaceMinutes] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');
  
  // fixedPair: exactly 2 user-input fields [anchorField, recentField]
  //
  // anchorField (index 0):
  //   The field that must remain fixed to protect the calculation result.
  //   Set when fixedPair is first completed (i.e. the second direct input arrives).
  //   At that moment, the first input becomes the anchor — because the user's intent
  //   was to find the dependent values based on these two inputs, and the anchor
  //   is the "opposite side" of whatever was first calculated as dependent.
  //   When a dependent field is later edited, the anchor stays — only recentField is replaced.
  //
  // recentField (index 1):
  //   The most recently input field. Gets replaced when the user edits a dependent field.
  //
  // Invariant: fixedPair never exceeds 2 entries.
  // Only user direct input (onChange handlers) can modify fixedPair.
  // Calculation results NEVER modify fixedPair.
  const [fixedPair, setFixedPair] = useState([null, null]);

  // Ref to track latest field values without triggering useEffect
  const valuesRef = useRef({});
  valuesRef.current = {
    distance, timeHours, timeMinutes, timeSeconds,
    speed, paceMinutes, paceSeconds, paceUnit
  };

  // Counter that increments on every user input action to trigger recalculation
  const [calcTrigger, setCalcTrigger] = useState(0);

  // Race timer state
  const [courseMode, setCourseMode] = useState('standard');
  const [swimDistance, setSwimDistance] = useState('1.5');
  const [swimHours, setSwimHours] = useState('');
  const [swimMinutes, setSwimMinutes] = useState('');
  const [swimSeconds, setSwimSeconds] = useState('');
  const [t1Hours, setT1Hours] = useState('');
  const [t1Minutes, setT1Minutes] = useState('');
  const [t1Seconds, setT1Seconds] = useState('');
  const [bikeDistance, setBikeDistance] = useState('40');
  const [bikeHours, setBikeHours] = useState('');
  const [bikeMinutes, setBikeMinutes] = useState('');
  const [bikeSeconds, setBikeSeconds] = useState('');
  const [t2Hours, setT2Hours] = useState('');
  const [t2Minutes, setT2Minutes] = useState('');
  const [t2Seconds, setT2Seconds] = useState('');
  const [runDistance, setRunDistance] = useState('10');
  const [runHours, setRunHours] = useState('');
  const [runMinutes, setRunMinutes] = useState('');
  const [runSeconds, setRunSeconds] = useState('');
  const [totalTime, setTotalTime] = useState(null);

  // Course presets
  const coursePresets = {
    standard: { swim: '1.5', bike: '40', run: '10' },
    half: { swim: '1.9', bike: '90', run: '21.0975' },
    king: { swim: '3.8', bike: '180', run: '42.195' }
  };

  // Distance presets for dropdown
  const distancePresets = [
    { category: 'running', icon: '🏃‍♂️', label: '달리기', distances: [
      { label: '5km', value: '5' },
      { label: '10km', value: '10' },
      { label: '21.0975km (하프)', value: '21.0975' },
      { label: '42.195km (풀)', value: '42.195' }
    ]},
    { category: 'cycling', icon: '🚴‍♂️', label: '사이클', distances: [
      { label: '20km', value: '20' },
      { label: '40km (표준)', value: '40' },
      { label: '90km (하프)', value: '90' },
      { label: '180km (킹)', value: '180' }
    ]},
    { category: 'swimming', icon: '🏊‍♂️', label: '수영', distances: [
      { label: '0.75km (스프린트)', value: '0.75' },
      { label: '1.5km (표준)', value: '1.5' },
      { label: '1.9km (하프)', value: '1.9' },
      { label: '3.8km (킹)', value: '3.8' }
    ]}
  ];

  // Register a user-input field into fixedPair.
  // Rules:
  //   - fixedPair is always exactly [anchorField, recentField] (max 2 slots)
  //   - Speed and pace are mutually exclusive
  //   - If field is already in fixedPair: keep structure, just recalculate (value updated via handler)
  //   - If field is a dependent (not in fixedPair): keep anchorField, replace recentField
  //   - If fixedPair not yet full: fill sequentially (first input → anchor, second → recent)
  const markFixed = (field) => {
    setFixedPair(prev => {
      const [anchor, recent] = prev;
      const conflicting = field === 'speed' ? 'pace' : field === 'pace' ? 'speed' : null;

      // --- Phase 1: building up (not yet 2 fields) ---
      if (!anchor && !recent) return [field, null];
      if (anchor && !recent) {
        if (anchor === field) return prev; // same field again
        // If conflicting with anchor, replace anchor
        if (conflicting && anchor === conflicting) return [field, null];
        // Second input arrives → anchor is now locked as the calculation-protecting basis
        return [anchor, field];
      }

      // --- Phase 2: both slots filled ---

      // Case A: field is already one of the fixed pair → keep structure, value updated via handler
      if (field === anchor || field === recent) {
        return prev;
      }

      // Case B: field conflicts with one of the pair (speed/pace mutual exclusion)
      // Note: speed and pace represent the same physical quantity in different expressions.
      // If anchor is speed and user inputs pace (or vice versa), the anchor is replaced
      // with the new expression. This is an intentional "same-meaning succession" —
      // the anchor's protective role is preserved because the physical basis hasn't changed.
      if (conflicting) {
        if (recent === conflicting) return [anchor, field];
        if (anchor === conflicting) return [field, recent];
      }

      // Case C: field is a dependent (not in fixedPair) → keep anchor, replace recent
      return [anchor, field];
    });
  };

  // Helper: normalize time/pace carry (ensure min/sec are 0-59)
  const normalizeHMS = (h, m, s) => {
    let totalSeconds = (parseInt(h) || 0) * 3600 + (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
    if (totalSeconds < 0) totalSeconds = 0;
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return { hours, mins, secs };
  };

  const normalizeMS = (m, s) => {
    let totalSeconds = (parseInt(m) || 0) * 60 + (parseInt(s) || 0);
    if (totalSeconds < 0) totalSeconds = 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return { mins, secs };
  };

  // Handle distance preset selection
  const handleDistanceSelect = (value) => {
    setShowDistanceDropdown(false);
    handleDistanceChange(value);
  };

  // Handle course mode change
  const handleCourseModeChange = (mode) => {
    setCourseMode(mode);
    const preset = coursePresets[mode];
    setSwimDistance(preset.swim);
    setBikeDistance(preset.bike);
    setRunDistance(preset.run);
  };

  // Helper to convert h:m:s to minutes
  const hmsToMinutes = (h, m, s) => {
    const hours = parseInt(h) || 0;
    const mins = parseInt(m) || 0;
    const secs = parseInt(s) || 0;
    return hours * 60 + mins + secs / 60;
  };

  // Convert time string (HH:MM:SS or MM:SS) to minutes
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / 60;
    } else if (parts.length === 2) {
      return parts[0] + parts[1] / 60;
    }
    return Number(timeStr) || 0;
  };

  // Convert minutes to MM:SS format (no hours)
  const minutesToTimeShort = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes % 1) * 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Convert minutes to HH:MM:SS format
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };



  // Calculator handlers - mark field as fixed (user direct input)
  // ONLY these handlers call markFixed.
  // Calculation results (useEffect setState) NEVER call markFixed.
  const handleDistanceChange = (value) => {
    setDistance(value);
    markFixed('distance');
    setCalcTrigger(c => c + 1);
  };

  const handleTimeChange = (h, m, s) => {
    setTimeHours(h);
    setTimeMinutes(m);
    setTimeSeconds(s);
    markFixed('time');
    setCalcTrigger(c => c + 1);
  };

  const handleSpeedChange = (value) => {
    setSpeed(value);
    markFixed('speed');
    setCalcTrigger(c => c + 1);
  };

  const handlePaceChange = (m, s) => {
    setPaceMinutes(m);
    setPaceSeconds(s);
    markFixed('pace');
    setCalcTrigger(c => c + 1);
  };
  
  // Auto-calculate dependent fields based on fixedPair.
  // - fixedPair = [anchorField, recentField]: the 2 user-input fields
  // - Only fields NOT in fixedPair are recalculated (dependent)
  // - Fixed fields (anchor + recent) are NEVER auto-changed
  useEffect(() => {
    const [anchor, recent] = fixedPair;
    if (!anchor || !recent) return;

    const fixedSet = new Set([anchor, recent]);

    const v = valuesRef.current;
    const dist = parseFloat(v.distance);
    const timeInMin = ((parseInt(v.timeHours) || 0) * 60) + (parseInt(v.timeMinutes) || 0) + ((parseInt(v.timeSeconds) || 0) / 60);
    const spd = parseFloat(v.speed);
    const rawPaceMin = (parseInt(v.paceMinutes) || 0) + ((parseInt(v.paceSeconds) || 0) / 60);
    const pacePerKm = v.paceUnit === '100m' ? rawPaceMin * 10 : rawPaceMin;
    const currentPaceUnit = v.paceUnit;

    const hasDist = fixedSet.has('distance') && !isNaN(dist) && dist > 0;
    const hasTime = fixedSet.has('time') && timeInMin > 0;
    const hasSpeed = fixedSet.has('speed') && !isNaN(spd) && spd > 0;
    const hasPace = fixedSet.has('pace') && pacePerKm > 0;

    // Helpers: set dependent fields with carry normalization
    const applyTime = (totalMinutes) => {
      const totalSec = Math.round(totalMinutes * 60);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setTimeHours(h > 0 ? h.toString() : '');
      setTimeMinutes(m > 0 ? m.toString() : (h > 0 ? '0' : ''));
      setTimeSeconds(s > 0 ? s.toString() : '');
    };

    const applyPace = (pacePerKmVal) => {
      const displayPace = currentPaceUnit === '100m' ? pacePerKmVal / 10 : pacePerKmVal;
      const totalSec = Math.round(displayPace * 60);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      setPaceMinutes(m > 0 ? m.toString() : '0');
      setPaceSeconds(s > 0 ? s.toString() : '0');
    };

    const applySpeed = (val) => setSpeed(val.toFixed(2));
    const applyDistance = (val) => setDistance(val.toFixed(2));

    // Calculate based on the fixed pair
    if (hasDist && hasTime) {
      const calcSpeed = dist / (timeInMin / 60);
      const calcPacePerKm = timeInMin / dist;
      if (!fixedSet.has('speed')) applySpeed(calcSpeed);
      if (!fixedSet.has('pace')) applyPace(calcPacePerKm);
    } else if (hasDist && hasSpeed) {
      const calcTimeMin = (dist / spd) * 60;
      const calcPacePerKm = calcTimeMin / dist;
      if (!fixedSet.has('time')) applyTime(calcTimeMin);
      if (!fixedSet.has('pace')) applyPace(calcPacePerKm);
    } else if (hasDist && hasPace) {
      const calcTimeMin = dist * pacePerKm;
      const calcSpeed = dist / (calcTimeMin / 60);
      if (!fixedSet.has('time')) applyTime(calcTimeMin);
      if (!fixedSet.has('speed')) applySpeed(calcSpeed);
    } else if (hasTime && hasSpeed) {
      const calcDist = (spd * timeInMin) / 60;
      const calcPacePerKm = timeInMin / calcDist;
      if (!fixedSet.has('distance')) applyDistance(calcDist);
      if (!fixedSet.has('pace')) applyPace(calcPacePerKm);
    } else if (hasTime && hasPace) {
      const calcDist = timeInMin / pacePerKm;
      const calcSpeed = calcDist / (timeInMin / 60);
      if (!fixedSet.has('distance')) applyDistance(calcDist);
      if (!fixedSet.has('speed')) applySpeed(calcSpeed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedPair, calcTrigger]);

  // Race calculations
  const calculateTotalRaceTime = () => {
    const swim = hmsToMinutes(swimHours, swimMinutes, swimSeconds);
    const t1 = hmsToMinutes(t1Hours, t1Minutes, t1Seconds);
    const bike = hmsToMinutes(bikeHours, bikeMinutes, bikeSeconds);
    const t2 = hmsToMinutes(t2Hours, t2Minutes, t2Seconds);
    const run = hmsToMinutes(runHours, runMinutes, runSeconds);
    
    const total = swim + t1 + bike + t2 + run;
    
    const swimDist = parseFloat(swimDistance) || 0;
    const bikeDist = parseFloat(bikeDistance) || 0;
    const runDist = parseFloat(runDistance) || 0;
    
    setTotalTime({
      total: minutesToTime(total),
      swim: {
        time: minutesToTime(swim),
        pace: swim && swimDist ? minutesToTimeShort((swim / swimDist) / 10) : '00:00'
      },
      bike: {
        time: minutesToTime(bike),
        speed: bike && bikeDist ? (bikeDist / (bike / 60)).toFixed(1) : '0.0'
      },
      run: {
        time: minutesToTime(run),
        pace: run && runDist ? minutesToTimeShort(run / runDist) : '00:00'
      },
      transitions: minutesToTime(t1 + t2)
    });
  };

  // Helper functions for race calculations
  const getSwimPace = () => {
    const time = hmsToMinutes(swimHours, swimMinutes, swimSeconds);
    const dist = parseFloat(swimDistance);
    if (time && dist) {
      return minutesToTimeShort((time / dist) / 10);
    }
    return '00:00';
  };

  const getBikeSpeed = () => {
    const time = hmsToMinutes(bikeHours, bikeMinutes, bikeSeconds);
    const dist = parseFloat(bikeDistance);
    if (time && dist) {
      return (dist / (time / 60)).toFixed(1);
    }
    return '0.0';
  };

  const getRunPace = () => {
    const time = hmsToMinutes(runHours, runMinutes, runSeconds);
    const dist = parseFloat(runDistance);
    if (time && dist) {
      return minutesToTimeShort(time / dist);
    }
    return '00:00';
  };

  // Save result as image
  const saveResultImage = () => {
    if (!eventTitle.trim() || !totalTime) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Ian's 철인계산기", canvas.width / 2, 50);

    // Event title
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#2563eb';
    ctx.fillText(eventTitle, canvas.width / 2, 100);

    // Results
    ctx.textAlign = 'left';
    ctx.fillStyle = '#374151';
    ctx.font = '20px Arial';

    let y = 180;
    const lineHeight = 50;

    // Swimming
    ctx.fillText(`수영`, 80, y);
    ctx.fillText(`${swimDistance}km`, 200, y);
    ctx.fillText(`${totalTime.swim.time}`, 320, y);
    ctx.fillText(`${totalTime.swim.pace}/100m`, 480, y);

    y += lineHeight;
    // Cycling
    ctx.fillText(`사이클`, 80, y);
    ctx.fillText(`${bikeDistance}km`, 200, y);
    ctx.fillText(`${totalTime.bike.time}`, 320, y);
    ctx.fillText(`${totalTime.bike.speed}km/h`, 480, y);

    y += lineHeight;
    // Running
    ctx.fillText(`달리기`, 80, y);
    ctx.fillText(`${runDistance}km`, 200, y);
    ctx.fillText(`${totalTime.run.time}`, 320, y);
    ctx.fillText(`${totalTime.run.pace}/km`, 480, y);

    y += lineHeight;
    // Transitions
    ctx.fillText(`T1+T2`, 80, y);
    ctx.fillText(`${totalTime.transitions}`, 320, y);

    y += lineHeight;
    // Total
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#dc2626';
    ctx.fillText(`총완주`, 80, y);
    ctx.fillText(`${totalTime.total}`, 320, y);

    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Made by Ian Kwon | Ver 1.0', canvas.width / 2, canvas.height - 30);

    // Download image
    const link = document.createElement('a');
    link.download = `${eventTitle}-철인3종기록.png`;
    link.href = canvas.toDataURL();
    link.click();

    setShowSaveDialog(false);
    setEventTitle('');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{backgroundColor: '#f9fafb', color: '#111827'}}>
      <div className="max-w-md mx-auto space-y-4 pt-6">
        {/* Title - Outside of any box */}
        <div className="flex items-center justify-center gap-2">
          <img 
            src="triathlon-logo.png" 
            alt="Triathlon" 
            className="w-12 h-12 object-contain rounded-full cursor-pointer"
            onClick={() => setShowLogoPopup(true)}
          />
          <h1 className="text-2xl font-bold text-gray-900">Ian's 철인계산기</h1>
        </div>

        {/* Tabs Box */}
        <div className="bg-white shadow-lg rounded-lg p-1">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 py-3 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gauge className="w-4 h-4" />
              속도/페이스
            </button>
            <button
              onClick={() => setActiveTab('race')}
              className={`flex-1 py-3 px-3 rounded-md text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'race'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Timer className="w-4 h-4" />
              경기기록
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white shadow-lg rounded-lg">
        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="p-4">
            {/* Distance Selection Dropdown */}
            <div className="mb-4 relative">
              <button
                onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">자주 사용하는 거리</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showDistanceDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDistanceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                  {distancePresets.map((category) => (
                    <div key={category.category} className="border-b border-gray-100 last:border-b-0">
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600 flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                      {category.distances.map((distance) => (
                        <button
                          key={distance.value}
                          onClick={() => handleDistanceSelect(distance.value)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors"
                        >
                          {distance.label}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Distance */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 w-12">거리</span>
                  <input
                    type="number"
                    step="0.01"
                    value={distance}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                    className="w-20 px-2 py-1.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-600">km</span>
                </div>
              </div>

              {/* Time */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700 w-12">시간</span>
                  <input
                    type="number"
                    value={timeHours}
                    onChange={(e) => {
                      setTimeHours(e.target.value);
                      handleTimeChange(e.target.value, timeMinutes, timeSeconds);
                    }}
                    className="w-14 px-1 py-1.5 text-base border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-lg text-gray-400">:</span>
                  <input
                    type="number"
                    value={timeMinutes}
                    onChange={(e) => {
                      setTimeMinutes(e.target.value);
                      handleTimeChange(timeHours, e.target.value, timeSeconds);
                    }}
                    className="w-14 px-1 py-1.5 text-base border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-lg text-gray-400">:</span>
                  <input
                    type="number"
                    value={timeSeconds}
                    onChange={(e) => {
                      setTimeSeconds(e.target.value);
                      handleTimeChange(timeHours, timeMinutes, e.target.value);
                    }}
                    className="w-14 px-1 py-1.5 text-base border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>

              {/* Speed */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-600 w-12">속도</span>
                  <input
                    type="number"
                    step="0.01"
                    value={speed}
                    onChange={(e) => handleSpeedChange(e.target.value)}
                    className="w-20 px-2 py-1.5 text-base border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-600">km/h</span>
                </div>
              </div>

              {/* Pace */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-green-600 w-12">페이스</span>
                  <input
                    type="number"
                    value={paceMinutes}
                    onChange={(e) => {
                      setPaceMinutes(e.target.value);
                      handlePaceChange(e.target.value, paceSeconds);
                    }}
                    className="w-12 px-1 py-1.5 text-base border border-green-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-lg text-gray-400">:</span>
                  <input
                    type="number"
                    value={paceSeconds}
                    onChange={(e) => {
                      setPaceSeconds(e.target.value);
                      handlePaceChange(paceMinutes, e.target.value);
                    }}
                    className="w-12 px-1 py-1.5 text-base border border-green-300 rounded-lg text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <div className="flex gap-1 ml-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (paceUnit === '100m' && (paceMinutes || paceSeconds)) {
                          // Convert 100m pace to 1km pace (multiply by 10)
                          const currentSec = (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0);
                          const newSec = currentSec * 10;
                          const m = Math.floor(newSec / 60);
                          const s = newSec % 60;
                          setPaceMinutes(m > 0 ? m.toString() : '0');
                          setPaceSeconds(s > 0 ? s.toString() : '0');
                        }
                        setPaceUnit('1km');
                      }}
                      className={`px-3 py-1 text-sm rounded border ${
                        paceUnit === '1km'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      /km
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (paceUnit === '1km' && (paceMinutes || paceSeconds)) {
                          // Convert 1km pace to 100m pace (divide by 10)
                          const currentSec = (parseInt(paceMinutes) || 0) * 60 + (parseInt(paceSeconds) || 0);
                          const newSec = Math.round(currentSec / 10);
                          const m = Math.floor(newSec / 60);
                          const s = newSec % 60;
                          setPaceMinutes(m > 0 ? m.toString() : '0');
                          setPaceSeconds(s > 0 ? s.toString() : '0');
                        }
                        setPaceUnit('100m');
                      }}
                      className={`px-1 py-1 text-sm rounded border ${
                        paceUnit === '100m'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      /100m
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-600 text-left">
                거리, 시간, 속도(페이스) 중 2개 값을 입력하면 나머지는 자동계산 됩니다.
              </p>
            </div>
          </div>
        )}

        {/* Race Timer Tab */}
        {activeTab === 'race' && (
          <div className="p-4">
            {/* Course Selection */}
            <div className="mb-4">
              <div className="flex justify-center gap-3">
                {[
                  { key: 'standard', label: '표준코스' },
                  { key: 'half', label: '하프코스' },
                  { key: 'king', label: '킹코스' }
                ].map((course) => (
                  <label key={course.key} className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="courseMode"
                      value={course.key}
                      checked={courseMode === course.key}
                      onChange={() => handleCourseModeChange(course.key)}
                      className="mr-2"
                    />
                    <span className="text-sm">{course.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Swimming */}
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">수영</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={swimDistance}
                  onChange={(e) => setSwimDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="1.5"
                />
                <span className="text-xs text-gray-700 ml-1">기록</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <input
                    type="number"
                    value={swimHours}
                    onChange={(e) => setSwimHours(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={swimMinutes}
                    onChange={(e) => setSwimMinutes(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={swimSeconds}
                    onChange={(e) => setSwimSeconds(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              {(swimHours || swimMinutes || swimSeconds) && swimDistance && (
                <div className="text-xs text-blue-700 mt-1.5">
                  페이스: {getSwimPace()}/100m
                </div>
              )}
            </div>

            {/* T1 */}
            <div className="mb-3 p-2">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-sm text-gray-800">T1</h3>
                <span className="text-xs text-gray-700">시간</span>
                <div className="flex items-center gap-0.5">
                  <input
                    type="number"
                    value={t1Hours}
                    onChange={(e) => setT1Hours(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={t1Minutes}
                    onChange={(e) => setT1Minutes(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={t1Seconds}
                    onChange={(e) => setT1Seconds(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            {/* Cycling */}
            <div className="mb-3 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-sm text-gray-800">사이클</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={bikeDistance}
                  onChange={(e) => setBikeDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="40"
                />
                <span className="text-xs text-gray-700 ml-1">기록</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <input
                    type="number"
                    value={bikeHours}
                    onChange={(e) => setBikeHours(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={bikeMinutes}
                    onChange={(e) => setBikeMinutes(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={bikeSeconds}
                    onChange={(e) => setBikeSeconds(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              {(bikeHours || bikeMinutes || bikeSeconds) && bikeDistance && (
                <div className="text-xs text-green-700 mt-1.5">
                  평속: {getBikeSpeed()} km/h
                </div>
              )}
            </div>

            {/* T2 */}
            <div className="mb-3 p-2">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-bold text-sm text-gray-800">T2</h3>
                <span className="text-xs text-gray-700">시간</span>
                <div className="flex items-center gap-0.5">
                  <input
                    type="number"
                    value={t2Hours}
                    onChange={(e) => setT2Hours(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={t2Minutes}
                    onChange={(e) => setT2Minutes(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={t2Seconds}
                    onChange={(e) => setT2Seconds(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            {/* Running */}
            <div className="mb-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-600 text-base">🏃‍♂️</span>
                <h3 className="font-bold text-sm text-gray-800">달리기</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={runDistance}
                  onChange={(e) => setRunDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="10"
                />
                <span className="text-xs text-gray-700 ml-1">기록</span>
                <div className="flex items-center gap-0.5 ml-1">
                  <input
                    type="number"
                    value={runHours}
                    onChange={(e) => setRunHours(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={runMinutes}
                    onChange={(e) => setRunMinutes(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                  <span className="text-sm text-gray-400">:</span>
                  <input
                    type="number"
                    value={runSeconds}
                    onChange={(e) => setRunSeconds(e.target.value)}
                    className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="00"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
              {(runHours || runMinutes || runSeconds) && runDistance && (
                <div className="text-xs text-orange-700 mt-1.5">
                  페이스: {getRunPace()}/km
                </div>
              )}
            </div>

            <button
              onClick={calculateTotalRaceTime}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors text-sm"
            >
              총 경기시간 계산
            </button>

            {/* Results */}
            {totalTime && (
              <div className="mt-4 space-y-3">
                <div className="text-center p-3 bg-blue-600 rounded-lg text-white">
                  <p className="text-sm">총 완주시간</p>
                  <p className="text-xl font-bold">{totalTime.total}</p>
                </div>

                <div className="space-y-2">
                  {/* Swimming */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-blue-800 w-12">수영</span>
                      <span className="text-sm font-bold text-blue-800 w-16">{totalTime.swim.time}</span>
                      <span className="text-xs text-gray-500">페이스 {totalTime.swim.pace} /100m</span>
                    </div>
                  </div>

                  {/* Cycling */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-green-800 w-12">사이클</span>
                      <span className="text-sm font-bold text-green-800 w-16">{totalTime.bike.time}</span>
                      <span className="text-xs text-gray-500">평속 {totalTime.bike.speed} km/h</span>
                    </div>
                  </div>

                  {/* Running */}
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-amber-800 w-12">달리기</span>
                      <span className="text-sm font-bold text-amber-800 w-16">{totalTime.run.time}</span>
                      <span className="text-xs text-gray-500">페이스 {totalTime.run.pace} /km</span>
                    </div>
                  </div>

                  {/* Transitions */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-800 w-12">T1+T2</span>
                      <span className="text-sm font-bold text-gray-800 w-16">{totalTime.transitions}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-sm mx-4 w-full">
              <h3 className="text-lg font-bold text-center mb-4">플랜 수립 완료!</h3>
              <p className="text-sm text-gray-600 text-center mb-4">이미지에 들어갈 제목을 적어주세요</p>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="예: 2024 부산 철인3종"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  취소
                </button>
                <button
                  onClick={saveResultImage}
                  disabled={!eventTitle.trim()}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 p-4">
          <p>Made by Ian Kwon | Ver 1.0</p>
        </div>
      </div>

      {/* Logo Popup Overlay */}
      {showLogoPopup && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowLogoPopup(false)}
        >
          <img
            src="/icon-1024-blue.png"
            alt="철인계산기"
            className="w-[70vw] max-w-sm h-auto rounded-2xl transition-all duration-300 ease-out animate-[fadeScaleIn_0.3s_ease-out]"
            style={{
              animation: 'fadeScaleIn 0.3s ease-out'
            }}
          />
          <style>{`
            @keyframes fadeScaleIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
