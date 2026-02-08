import React, { useState } from 'react';
import { Calculator, Waves, Bike, PersonStanding, Clock, Gauge, Route } from 'lucide-react';

export default function TriathlonCalculator() {
  const [activeTab, setActiveTab] = useState('calculator');
  
  // Calculator state
  const [paceUnit, setPaceUnit] = useState('1km'); // '100m' or '1km'
  const [distance, setDistance] = useState('');
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [timeSeconds, setTimeSeconds] = useState('');
  const [speed, setSpeed] = useState('');
  const [paceMinutes, setPaceMinutes] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');

  // Convert separate time fields to total minutes
  const getTimeInMinutes = () => {
    const h = parseInt(timeHours) || 0;
    const m = parseInt(timeMinutes) || 0;
    const s = parseInt(timeSeconds) || 0;
    return h * 60 + m + s / 60;
  };

  // Convert pace minutes/seconds to total minutes
  const getPaceInMinutes = () => {
    const m = parseInt(paceMinutes) || 0;
    const s = parseInt(paceSeconds) || 0;
    return m + s / 60;
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

  // Auto-calculate based on inputs
  const handleDistanceChange = (value) => {
    setDistance(value);
    const h = parseInt(timeHours) || 0;
    const m = parseInt(timeMinutes) || 0;
    const s = parseInt(timeSeconds) || 0;
    const timeInMin = h * 60 + m + s / 60;
    
    const dist = parseFloat(value);
    
    // If distance and time are set, calculate speed and pace
    if (dist && timeInMin) {
      const calculatedSpeed = dist / (timeInMin / 60);
      setSpeed(calculatedSpeed.toFixed(2));
      
      const pacePerKm = timeInMin / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
    // If distance and speed are set, calculate time and pace
    else if (dist && speed) {
      const calculatedTime = (dist / parseFloat(speed)) * 60;
      setTimeFromMinutes(calculatedTime);
      
      const pacePerKm = calculatedTime / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
    // If distance and pace are set, calculate time and speed
    else if (dist && (paceMinutes || paceSeconds)) {
      const paceInMin = getPaceInMinutes();
      const pacePerKm = paceUnit === '100m' ? paceInMin * 10 : paceInMin;
      const calculatedTime = dist * pacePerKm;
      setTimeFromMinutes(calculatedTime);
      
      const calculatedSpeed = dist / (calculatedTime / 60);
      setSpeed(calculatedSpeed.toFixed(2));
    }
  };

  const handleTimeHoursChange = (value) => {
    setTimeHours(value);
    const h = parseInt(value) || 0;
    const m = parseInt(timeMinutes) || 0;
    const s = parseInt(timeSeconds) || 0;
    const timeInMin = h * 60 + m + s / 60;
    
    const dist = parseFloat(distance);
    
    // If time and distance are set, calculate speed and pace
    if (timeInMin && dist) {
      const calculatedSpeed = dist / (timeInMin / 60);
      setSpeed(calculatedSpeed.toFixed(2));
      
      const pacePerKm = timeInMin / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
  };

  const handleTimeMinutesChange = (value) => {
    setTimeMinutes(value);
    const h = parseInt(timeHours) || 0;
    const m = parseInt(value) || 0;
    const s = parseInt(timeSeconds) || 0;
    const timeInMin = h * 60 + m + s / 60;
    
    const dist = parseFloat(distance);
    
    // If time and distance are set, calculate speed and pace
    if (timeInMin && dist) {
      const calculatedSpeed = dist / (timeInMin / 60);
      setSpeed(calculatedSpeed.toFixed(2));
      
      const pacePerKm = timeInMin / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
  };

  const handleTimeSecondsChange = (value) => {
    setTimeSeconds(value);
    const h = parseInt(timeHours) || 0;
    const m = parseInt(timeMinutes) || 0;
    const s = parseInt(value) || 0;
    const timeInMin = h * 60 + m + s / 60;
    
    const dist = parseFloat(distance);
    
    // If time and distance are set, calculate speed and pace
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
    
    // If speed and distance are set, calculate time and pace
    if (spd && dist) {
      const calculatedTime = (dist / spd) * 60;
      setTimeFromMinutes(calculatedTime);
      
      const pacePerKm = calculatedTime / dist;
      const displayPace = paceUnit === '100m' ? pacePerKm / 10 : pacePerKm;
      setPaceFromMinutes(displayPace);
    }
  };

  const handlePaceMinutesChange = (value) => {
    setPaceMinutes(value);
    const dist = parseFloat(distance);
    const m = parseInt(value) || 0;
    const s = parseInt(paceSeconds) || 0;
    const paceInMin = m + s / 60;
    
    if (paceInMin && dist) {
      const pacePerKm = paceUnit === '100m' ? paceInMin * 10 : paceInMin;
      const calculatedTime = dist * pacePerKm;
      setTimeFromMinutes(calculatedTime);
      
      const calculatedSpeed = dist / (calculatedTime / 60);
      setSpeed(calculatedSpeed.toFixed(2));
    }
  };

  const handlePaceSecondsChange = (value) => {
    setPaceSeconds(value);
    const dist = parseFloat(distance);
    const m = parseInt(paceMinutes) || 0;
    const s = parseInt(value) || 0;
    const paceInMin = m + s / 60;
    
    if (paceInMin && dist) {
      const pacePerKm = paceUnit === '100m' ? paceInMin * 10 : paceInMin;
      const calculatedTime = dist * pacePerKm;
      setTimeFromMinutes(calculatedTime);
      
      const calculatedSpeed = dist / (calculatedTime / 60);
      setSpeed(calculatedSpeed.toFixed(2));
    }
  };
  
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

  // Helper to convert h:m:s to minutes
  const hmsToMinutes = (h, m, s) => {
    const hours = parseInt(h) || 0;
    const mins = parseInt(m) || 0;
    const secs = parseInt(s) || 0;
    return hours * 60 + mins + secs / 60;
  };

  // Course presets
  const coursePresets = {
    standard: { swim: '1.5', bike: '40', run: '10' },
    half: { swim: '1.9', bike: '90', run: '21.0975' },
    king: { swim: '3.8', bike: '180', run: '42.195' },
    custom: { swim: '', bike: '', run: '' }
  };

  // Handle course mode change
  const handleCourseModeChange = (mode) => {
    setCourseMode(mode);
    const preset = coursePresets[mode];
    setSwimDistance(preset.swim);
    setBikeDistance(preset.bike);
    setRunDistance(preset.run);
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

  // Convert minutes to HH:MM:SS format
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.round((minutes % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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
        pace: swim && swimDist ? minutesToTime((swim / swimDist) * 0.1) : '-' // 100m per pace
      },
      bike: {
        time: minutesToTime(bike),
        speed: bike && bikeDist ? (bikeDist / (bike / 60)).toFixed(2) : '-'
      },
      run: {
        time: minutesToTime(run),
        pace: run && runDist ? minutesToTime(run / runDist) : '-'
      },
      transitions: minutesToTime(t1 + t2)
    });
  };

  // Calculate individual pace/speed for each sport
  const getSwimPace = () => {
    const swim = hmsToMinutes(swimHours, swimMinutes, swimSeconds);
    const swimDist = parseFloat(swimDistance) || 0;
    return swim && swimDist ? minutesToTime((swim / swimDist) * 0.1) : '-';
  };

  const getBikeSpeed = () => {
    const bike = hmsToMinutes(bikeHours, bikeMinutes, bikeSeconds);
    const bikeDist = parseFloat(bikeDistance) || 0;
    return bike && bikeDist ? (bikeDist / (bike / 60)).toFixed(2) : '-';
  };

  const getRunPace = () => {
    const run = hmsToMinutes(runHours, runMinutes, runSeconds);
    const runDist = parseFloat(runDistance) || 0;
    return run && runDist ? minutesToTime(run / runDist) : '-';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">철인3종 계산기</h1>
          </div>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <span>by Ian Kwon</span>
            <span className="text-gray-300">|</span>
            <span>Ver 1.0</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'calculator'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Gauge className="w-5 h-5 inline mr-2" />
            속도/페이스 계산
          </button>
          <button
            onClick={() => setActiveTab('race')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'race'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-5 h-5 inline mr-2" />
            경기 기록 계산
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Distance */}
              <div className="bg-gray-50 rounded-xl p-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  거리
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => handleDistanceChange(e.target.value)}
                    className="flex-1 text-3xl font-light border-0 bg-transparent focus:outline-none text-gray-800"
                    placeholder="0"
                  />
                  <span className="text-xl text-gray-400 font-light">km</span>
                </div>
              </div>

              {/* Time */}
              <div className="bg-gray-50 rounded-xl p-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  시간
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-baseline gap-1">
                    <input
                      type="number"
                      value={timeHours}
                      onChange={(e) => handleTimeHoursChange(e.target.value)}
                      className="w-16 text-3xl font-light border-0 bg-transparent focus:outline-none text-gray-800 text-center"
                      placeholder="0"
                      min="0"
                    />
                    <span className="text-sm text-gray-400">h</span>
                  </div>
                  <span className="text-2xl text-gray-300 font-light">:</span>
                  <div className="flex-1 flex items-baseline gap-1">
                    <input
                      type="number"
                      value={timeMinutes}
                      onChange={(e) => handleTimeMinutesChange(e.target.value)}
                      className="w-16 text-3xl font-light border-0 bg-transparent focus:outline-none text-gray-800 text-center"
                      placeholder="0"
                      min="0"
                      max="59"
                    />
                    <span className="text-sm text-gray-400">m</span>
                  </div>
                  <span className="text-2xl text-gray-300 font-light">:</span>
                  <div className="flex-1 flex items-baseline gap-1">
                    <input
                      type="number"
                      value={timeSeconds}
                      onChange={(e) => handleTimeSecondsChange(e.target.value)}
                      className="w-16 text-3xl font-light border-0 bg-transparent focus:outline-none text-gray-800 text-center"
                      placeholder="0"
                      min="0"
                      max="59"
                    />
                    <span className="text-sm text-gray-400">s</span>
                  </div>
                </div>
              </div>

              {/* Speed */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                  속도
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={speed}
                    onChange={(e) => handleSpeedChange(e.target.value)}
                    className="flex-1 text-4xl font-light border-0 bg-transparent focus:outline-none text-blue-900"
                    placeholder="0"
                  />
                  <span className="text-xl text-blue-600 font-light">km/h</span>
                </div>
              </div>

              {/* Pace */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                <label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-3">
                  페이스
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        value={paceMinutes}
                        onChange={(e) => handlePaceMinutesChange(e.target.value)}
                        className="w-16 text-4xl font-light border-0 bg-transparent focus:outline-none text-green-900 text-center"
                        placeholder="0"
                        min="0"
                      />
                      <span className="text-sm text-green-600">m</span>
                    </div>
                    <span className="text-3xl text-green-400 font-light ml-2">:</span>
                    <div className="flex items-baseline gap-1">
                      <input
                        type="number"
                        value={paceSeconds}
                        onChange={(e) => handlePaceSecondsChange(e.target.value)}
                        className="w-16 text-4xl font-light border-0 bg-transparent focus:outline-none text-green-900 text-center"
                        placeholder="00"
                        min="0"
                        max="59"
                      />
                      <span className="text-sm text-green-600">s</span>
                    </div>
                  </div>
                  
                  {/* Pace unit buttons - on same line */}
                  <div className="flex gap-4 ml-auto">
                    <button
                      onClick={() => {
                        setPaceUnit('1km');
                        const h = parseInt(timeHours) || 0;
                        const m = parseInt(timeMinutes) || 0;
                        const s = parseInt(timeSeconds) || 0;
                        const timeInMin = h * 60 + m + s / 60;
                        const dist = parseFloat(distance);
                        
                        if (timeInMin && dist) {
                          const pacePerKm = timeInMin / dist;
                          setPaceFromMinutes(pacePerKm);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
                        const h = parseInt(timeHours) || 0;
                        const m = parseInt(timeMinutes) || 0;
                        const s = parseInt(timeSeconds) || 0;
                        const timeInMin = h * 60 + m + s / 60;
                        const dist = parseFloat(distance);
                        
                        if (timeInMin && dist) {
                          const pacePerKm = timeInMin / dist;
                          const displayPace = pacePerKm / 10;
                          setPaceFromMinutes(displayPace);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

            {/* Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                2개의 값을 입력하면 나머지가 자동으로 계산됩니다
              </p>
            </div>
          </div>
        )}

        {/* Race Timer Tab */}
        {activeTab === 'race' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            
            {/* Course Selection */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-3">코스 선택</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="standard"
                    checked={courseMode === 'standard'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">표준코스</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="half"
                    checked={courseMode === 'half'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">하프코스</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="king"
                    checked={courseMode === 'king'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">킹코스</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="courseMode"
                    value="custom"
                    checked={courseMode === 'custom'}
                    onChange={(e) => handleCourseModeChange(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">사용자입력</span>
                </label>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {courseMode === 'standard' && '표준: 수영 1.5km, 사이클 40km, 달리기 10km'}
                {courseMode === 'half' && '하프: 수영 1.9km, 사이클 90km, 달리기 21.0975km'}
                {courseMode === 'king' && '킹: 수영 3.8km, 사이클 180km, 달리기 42.195km'}
                {courseMode === 'custom' && '원하는 거리를 직접 입력하세요'}
              </div>
            </div>
            
            {/* Swim */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Waves className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">수영</h3>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">거리 (km)</label>
                <input
                  type="number"
                  value={swimDistance}
                  onChange={(e) => setSwimDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="1.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기록</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={swimHours}
                      onChange={(e) => setSwimHours(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="시"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">시간</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={swimMinutes}
                      onChange={(e) => setSwimMinutes(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="분"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">분</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={swimSeconds}
                      onChange={(e) => setSwimSeconds(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="초"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">초</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2 bg-blue-100 rounded text-sm">
                <span className="font-medium text-blue-900">페이스: {(swimHours || swimMinutes || swimSeconds) && swimDistance ? `${getSwimPace()}/100m` : ''}</span>
              </div>
            </div>

            {/* Transition 1 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">전환 구역 1 (T1)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={t1Hours}
                      onChange={(e) => setT1Hours(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="시"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">시간</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={t1Minutes}
                      onChange={(e) => setT1Minutes(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="분"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">분</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={t1Seconds}
                      onChange={(e) => setT1Seconds(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="초"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">초</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bike */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Bike className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-800">사이클</h3>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">거리 (km)</label>
                <input
                  type="number"
                  value={bikeDistance}
                  onChange={(e) => setBikeDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기록</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={bikeHours}
                      onChange={(e) => setBikeHours(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="시"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">시간</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={bikeMinutes}
                      onChange={(e) => setBikeMinutes(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="분"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">분</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={bikeSeconds}
                      onChange={(e) => setBikeSeconds(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="초"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">초</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2 bg-green-100 rounded text-sm">
                <span className="font-medium text-green-900">평속: {(bikeHours || bikeMinutes || bikeSeconds) && bikeDistance ? `${getBikeSpeed()} km/h` : ''}</span>
              </div>
            </div>

            {/* Transition 2 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">전환 구역 2 (T2)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">시간</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={t2Hours}
                      onChange={(e) => setT2Hours(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="시"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">시간</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={t2Minutes}
                      onChange={(e) => setT2Minutes(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="분"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">분</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={t2Seconds}
                      onChange={(e) => setT2Seconds(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="초"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">초</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Run */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <PersonStanding className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-800">달리기</h3>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">거리 (km)</label>
                <input
                  type="number"
                  value={runDistance}
                  onChange={(e) => setRunDistance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">기록</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      value={runHours}
                      onChange={(e) => setRunHours(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="시"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">시간</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={runMinutes}
                      onChange={(e) => setRunMinutes(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="분"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">분</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={runSeconds}
                      onChange={(e) => setRunSeconds(e.target.value)}
                      className="w-full px-2 py-2 border border-gray-300 rounded-lg text-center"
                      placeholder="초"
                      min="0"
                      max="59"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">초</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-2 bg-orange-100 rounded text-sm">
                <span className="font-medium text-orange-900">페이스: {(runHours || runMinutes || runSeconds) && runDistance ? `${getRunPace()}/km` : ''}</span>
              </div>
            </div>

            <button
              onClick={calculateTotalRaceTime}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              총 경기 시간 계산
            </button>

            {/* Results */}
            {totalTime && (
              <div className="mt-6 space-y-3">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white">
                  <p className="text-sm opacity-90">총 완주 시간</p>
                  <p className="text-3xl font-bold">{totalTime.total}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">수영</p>
                    <p className="font-bold text-blue-900">{totalTime.swim.time}</p>
                    <p className="text-xs text-gray-600">페이스: {totalTime.swim.pace}/100m</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">사이클</p>
                    <p className="font-bold text-green-900">{totalTime.bike.time}</p>
                    <p className="text-xs text-gray-600">속도: {totalTime.bike.speed} km/h</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">달리기</p>
                    <p className="font-bold text-orange-900">{totalTime.run.time}</p>
                    <p className="text-xs text-gray-600">페이스: {totalTime.run.pace}/km</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">전환 구역 총 시간</p>
                  <p className="font-bold text-gray-900">{totalTime.transitions}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 시간 입력: 시/분/초 각각 입력</p>
          <p className="mt-1">예시: 올림픽 거리 - 수영 1.5km, 사이클 40km, 달리기 10km</p>
        </div>
      </div>
    </div>
  );
}