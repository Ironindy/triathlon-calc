import React, { useState } from 'react';
import { Calculator, Waves, Bike, PersonStanding, Clock, Gauge } from 'lucide-react';

export default function TriathlonCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  
  // Calculator state
  const [paceUnit, setPaceUnit] = useState('1km');
  const [distance, setDistance] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [timeSeconds, setTimeSeconds] = useState('');
  const [speed, setSpeed] = useState('');
  const [paceMinutes, setPaceMinutes] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');

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

  // Set pace from minutes to separate fields
  const setPaceFromMinutes = (totalMinutes) => {
    const mins = Math.floor(totalMinutes);
    const secs = Math.round((totalMinutes % 1) * 60);
    setPaceMinutes(mins > 0 ? mins.toString() : '');
    setPaceSeconds(secs > 0 ? secs.toString() : '');
  };

  // Set time from minutes to separate fields
  const setTimeFromMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.floor(totalMinutes % 60);
    const secs = Math.round((totalMinutes % 1) * 60);
    setTimeHours(hours > 0 ? hours.toString() : '');
    setTimeMinutes(mins > 0 ? mins.toString() : '');
    setTimeSeconds(secs > 0 ? secs.toString() : '');
  };

  // Calculator handlers
  const handleDistanceChange = (value) => {
    setDistance(value);
    const timeInMin = hmsToMinutes(timeHours, timeMinutes, timeSeconds);
    const dist = parseFloat(value);
    
    if (dist && timeInMin) {
      const calculatedSpeed = dist / (timeInMin / 60);
      setSpeed(calculatedSpeed.toFixed(2));
      
      const pacePerKm = timeInMin / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    } else if (dist && speed) {
      const calculatedTime = (dist / parseFloat(speed)) * 60;
      setTimeFromMinutes(calculatedTime);
      
      const pacePerKm = calculatedTime / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    } else if (dist && (paceMinutes || paceSeconds)) {
      const paceInMin = hmsToMinutes(0, paceMinutes, paceSeconds);
      const pacePerKm = paceUnit === '100m' ? paceInMin * 10 : paceInMin;
      const calculatedTime = dist * pacePerKm;
      setTimeFromMinutes(calculatedTime);
      
      const calculatedSpeed = dist / (calculatedTime / 60);
      setSpeed(calculatedSpeed.toFixed(2));
    }
  };

  const handleTimeChange = (h, m, s) => {
    const timeInMin = hmsToMinutes(h, m, s);
    const dist = parseFloat(distance);
    
    if (timeInMin && dist) {
      const calculatedSpeed = dist / (timeInMin / 60);
      setSpeed(calculatedSpeed.toFixed(2));
      
      const pacePerKm = timeInMin / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
  };

  const handleSpeedChange = (value) => {
    setSpeed(value);
    const dist = parseFloat(distance);
    const spd = parseFloat(value);
    
    if (spd && dist) {
      const calculatedTime = (dist / spd) * 60;
      setTimeFromMinutes(calculatedTime);
      
      const pacePerKm = calculatedTime / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
  };

  const handlePaceChange = (m, s) => {
    const dist = parseFloat(distance);
    const paceInMin = hmsToMinutes(0, m, s);
    
    if (paceInMin && dist) {
      const pacePerKm = paceUnit === '100m' ? paceInMin * 10 : paceInMin;
      const calculatedTime = dist * pacePerKm;
      setTimeFromMinutes(calculatedTime);
      
      const calculatedSpeed = dist / (calculatedTime / 60);
      setSpeed(calculatedSpeed.toFixed(2));
    }
  };

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
        pace: swim && swimDist ? minutesToTimeShort((swim / swimDist) * 0.1) : '-'
      },
      bike: {
        time: minutesToTime(bike),
        speed: bike && bikeDist ? (bikeDist / (bike / 60)).toFixed(2) : '-'
      },
      run: {
        time: minutesToTime(run),
        pace: run && runDist ? minutesToTimeShort(run / runDist) : '-'
      },
      transitions: minutesToTime(t1 + t2)
    });
  };

  // Get individual pace/speed
  const getSwimPace = () => {
    const swim = hmsToMinutes(swimHours, swimMinutes, swimSeconds);
    const swimDist = parseFloat(swimDistance) || 0;
    return swim && swimDist ? minutesToTimeShort((swim / swimDist) * 0.1) : '';
  };

  const getBikeSpeed = () => {
    const bike = hmsToMinutes(bikeHours, bikeMinutes, bikeSeconds);
    const bikeDist = parseFloat(bikeDistance) || 0;
    return bike && bikeDist ? (bikeDist / (bike / 60)).toFixed(2) : '';
  };

  const getRunPace = () => {
    const run = hmsToMinutes(runHours, runMinutes, runSeconds);
    const runDist = parseFloat(runDistance) || 0;
    return run && runDist ? minutesToTimeShort(run / runDist) : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Calculator className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Ian's 철인3종 계산기</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-2.5 px-2 rounded-md font-medium transition-colors text-sm ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Gauge className="w-4 h-4 inline mr-1" />
            속도/페이스 계산
          </button>
          <button
            onClick={() => setActiveTab('race')}
            className={`flex-1 py-2.5 px-2 rounded-md font-medium transition-colors text-sm ${
              activeTab === 'race'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-1" />
            경기기록 계산
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs text-gray-600 text-center mb-4">거리, 시간, 속도(페이스) 중 2개 값을 입력하면 나머지 자동 계산됩니다.</p>
            
            <div className="space-y-3">
              {/* Distance */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700 font-semibold">거리(km)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={distance}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                    className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Time */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700 font-semibold">시간</span>
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      value={timeHours}
                      onChange={(e) => {
                        setTimeHours(e.target.value);
                        handleTimeChange(e.target.value, timeMinutes, timeSeconds);
                      }}
                      className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                      placeholder="0"
                      min="0"
                    />
                    <span className="text-sm text-gray-400">:</span>
                    <input
                      type="number"
                      value={timeMinutes}
                      onChange={(e) => {
                        setTimeMinutes(e.target.value);
                        handleTimeChange(timeHours, e.target.value, timeSeconds);
                      }}
                      className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                      placeholder="00"
                      min="0"
                      max="59"
                    />
                    <span className="text-sm text-gray-400">:</span>
                    <input
                      type="number"
                      value={timeSeconds}
                      onChange={(e) => {
                        setTimeSeconds(e.target.value);
                        handleTimeChange(timeHours, timeMinutes, e.target.value);
                      }}
                      className="w-11 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                      placeholder="00"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>

              {/* Speed */}
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-700 font-semibold">속도(km/h)</span>
                  <input
                    type="number"
                    step="0.01"
                    value={speed}
                    onChange={(e) => handleSpeedChange(e.target.value)}
                    className="w-16 px-1 py-1.5 text-sm border border-blue-300 rounded text-center bg-white"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Pace */}
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-700 font-semibold">페이스</span>
                  <div className="flex items-center gap-0.5">
                    <input
                      type="number"
                      value={paceMinutes}
                      onChange={(e) => {
                        setPaceMinutes(e.target.value);
                        handlePaceChange(e.target.value, paceSeconds);
                      }}
                      className="w-11 px-1 py-1.5 text-sm border border-green-300 rounded text-center bg-white"
                      placeholder="0"
                      min="0"
                    />
                    <span className="text-sm text-green-400">:</span>
                    <input
                      type="number"
                      value={paceSeconds}
                      onChange={(e) => {
                        setPaceSeconds(e.target.value);
                        handlePaceChange(paceMinutes, e.target.value);
                      }}
                      className="w-11 px-1 py-1.5 text-sm border border-green-300 rounded text-center bg-white"
                      placeholder="00"
                      min="0"
                      max="59"
                    />
                  </div>
                  
                  {/* Pace unit buttons */}
                  <div className="flex gap-1.5 ml-auto">
                    <button
                      onClick={() => {
                        setPaceUnit('1km');
                        const timeInMin = hmsToMinutes(timeHours, timeMinutes, timeSeconds);
                        const dist = parseFloat(distance);
                        if (timeInMin && dist) {
                          const pacePerKm = timeInMin / dist;
                          setPaceFromMinutes(pacePerKm);
                        }
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                        paceUnit === '1km'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-green-700 border border-green-300'
                      }`}
                    >
                      /km
                    </button>
                    <button
                      onClick={() => {
                        setPaceUnit('100m');
                        const timeInMin = hmsToMinutes(timeHours, timeMinutes, timeSeconds);
                        const dist = parseFloat(distance);
                        if (timeInMin && dist) {
                          const pacePerKm = timeInMin / dist;
                          const displayPace = pacePerKm / 10;
                          setPaceFromMinutes(displayPace);
                        }
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        paceUnit === '100m'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-green-700 border border-green-300'
                      }`}
                    >
                      /100m
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Race Timer Tab */}
        {activeTab === 'race' && (
          <div className="bg-white rounded-xl shadow-lg p-4">
            {/* Course Selection */}
            <div className="mb-4">
              <div className="flex gap-4 justify-center">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="standard"
                    checked={courseMode === 'standard'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">표준코스</span>
                </label>
                
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="half"
                    checked={courseMode === 'half'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">하프코스</span>
                </label>
                
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="king"
                    checked={courseMode === 'king'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-3.5 h-3.5 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">킹코스</span>
                </label>
              </div>
            </div>
            
            {/* Swim */}
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Waves className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">수영</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={swimDistance}
                  onChange={(e) => setSwimDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="1.5"
                />
                <span className="text-xs text-gray-700 ml-2">기록</span>
                <div className="flex items-center gap-0.5">
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
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-800 w-8">T1</h3>
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

            {/* Bike */}
            <div className="mb-3 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="w-4 h-4 text-green-600" />
                <h3 className="font-bold text-sm text-gray-800">사이클</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={bikeDistance}
                  onChange={(e) => setBikeDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="40"
                />
                <span className="text-xs text-gray-700 ml-2">기록</span>
                <div className="flex items-center gap-0.5">
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
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-800 w-8">T2</h3>
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

            {/* Run */}
            <div className="mb-3 p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <PersonStanding className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-gray-800">달리기</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-700">거리(km)</span>
                <input
                  type="number"
                  step="0.01"
                  value={runDistance}
                  onChange={(e) => setRunDistance(e.target.value)}
                  className="w-16 px-1 py-1.5 text-sm border border-gray-300 rounded text-center"
                  placeholder="10"
                />
                <span className="text-xs text-gray-700 ml-2">기록</span>
                <div className="flex items-center gap-0.5">
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
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              총 경기시간 계산
            </button>

            {/* Results */}
            {totalTime && (
              <div className="mt-4 space-y-2">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                  <p className="text-xs opacity-90">총 완주시간</p>
                  <p className="text-2xl font-bold">{totalTime.total}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="p-2 bg-blue-50 rounded">
                    <span className="text-xs text-blue-800 font-semibold">수영</span>
                    <span className="inline-block w-4"></span>
                    <span className="text-sm font-bold text-blue-900">{totalTime.swim.time}</span>{' '}
                    <span className="text-xs text-gray-500">페이스 {totalTime.swim.pace} /100m</span>
                  </div>

                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-xs text-green-800 font-semibold">사이클</span>
                    <span className="inline-block w-2"></span>
                    <span className="text-sm font-bold text-green-900">{totalTime.bike.time}</span>{' '}
                    <span className="text-xs text-gray-500">평속 {totalTime.bike.speed} km/h</span>
                  </div>

                  <div className="p-2 bg-orange-50 rounded">
                    <span className="text-xs text-orange-800 font-semibold">달리기</span>
                    <span className="inline-block w-2"></span>
                    <span className="text-sm font-bold text-orange-900">{totalTime.run.time}</span>{' '}
                    <span className="text-xs text-gray-500">페이스 {totalTime.run.pace} /km</span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-700 font-semibold">T1+T2</span>
                    <span className="inline-block w-2"></span>
                    <span className="text-sm font-bold text-gray-900">{totalTime.transitions}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Made by Ian Kwon | Ver 1.0</p>
        </div>
      </div>
    </div>
  );
}
