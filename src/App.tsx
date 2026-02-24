import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trophy, Shield, ShieldAlert, Rocket, Hammer, Swords, 
  Timer, Skull, ChevronUp, ChevronDown, Sword, Play, Lock,
  RefreshCw, Zap, Medal, Star, Target, Crown, User, ShoppingCart, 
  Flame, Clock, ArrowUpCircle
} from 'lucide-react';

const App = () => {
  // Estado de autenticación y modo admin
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginSelection, setLoginSelection] = useState("");
  const [userPinInput, setUserPinInput] = useState("");
  const [adminPinInput, setAdminPinInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [view, setView] = useState("general"); 
  const [loginError, setLoginError] = useState(false);

  // Estado del Modo Batalla
  const [battleState, setBattleState] = useState({
    active: false,
    players: [],
    problem: null,
    timeLeft: 5,
    winner: null,
    isRevealed: false,
    battleInput: ""
  });

  // Estado del juego (Entrenamiento)
  const [showGame, setShowGame] = useState(false);
  const [difficulty, setDifficulty] = useState("medium"); 
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [gameFeedback, setGameFeedback] = useState(null); 
  const [streak, setStreak] = useState(0); 
  const [attempts, setAttempts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10); 
  
  const timerRef = useRef(null);
  const battleTimerRef = useRef(null);

  // Base de datos de Agentes
  const [players, setPlayers] = useState([
    { id: 1, name: 'ALEXANDER FLORIN BOLACHE', pin: "4829", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 2, name: 'ARACELY MAGALI CABALLERO GALEANO', pin: "7135", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 3, name: 'SARA CASERO RODRIGUEZ', pin: "9021", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 4, name: 'LUIS ERNESTO CHINCHE OÑATE', pin: "3384", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 5, name: 'NAGORE CUEVAS GARCIA', pin: "5562", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 6, name: 'JUAN DIEGO DAZA CASTELLANOS', pin: "1987", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 7, name: 'DEREK YOHANSEL DE LEON SEPULVEDA', pin: "6643", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 8, name: 'CARMEN DIAZ ALCALDE', pin: "2210", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 9, name: 'SARA ETMAH', pin: "8834", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 10, name: 'JOSE DANIEL GAVILANES OSORTO', pin: "4471", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 11, name: 'IKER GIL BACHILLER', pin: "1056", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 12, name: 'GUILLERMO GUERRERO RODRIGUEZ', pin: "7729", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 13, name: 'BEATRIZ INACIO GOMES', pin: "3114", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 14, name: 'SEBASTIAN MARTINEZ TELLO', pin: "9902", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 15, name: 'HECTOR ANDRES MEZA DIAZ', pin: "5428", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 16, name: 'ALEJANDRO GABRIEL MORETA GUATO', pin: "2039", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 17, name: 'FELIX MUÑOZ HERRERA', pin: "6781", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 18, name: 'CATALINA ORTEGA LIZARRAGA', pin: "4155", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 19, name: 'OLIVER PALACIOS TUREGANO', pin: "8293", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 20, name: 'SOFIA SYLINA', pin: "1347", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 21, name: 'DINA YMASUMAQ VALVERDE PAREDES', pin: "5068", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 22, name: 'LIAH SOFIA VANEGAS GONZALEZ', pin: "2941", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
    { id: 23, name: 'JAVIER VILLA ESTEVES', pin: "9372", trainingPoints: 0, inventory: { x2: 0, shield: 0, extraTime: 0 } },
  ]);

  // Derivados seguros
  const activeUser = useMemo(() => {
    return players.find(p => p.id === currentUser?.id);
  }, [players, currentUser]);

  const isUserInCombat = currentUser && battleState.players.includes(currentUser.id);

  // Rangos basados en puntos
  const getRank = (pts = 0) => {
    if (pts >= 2000) return { name: "VENGADOR LEGENDARIO", color: "text-yellow-400", icon: <Crown className="w-4 h-4" /> };
    if (pts >= 1000) return { name: "HÉROE DE ÉLITE", color: "text-purple-400", icon: <Star className="w-4 h-4" /> };
    if (pts >= 500) return { name: "AGENTE DE CAMPO", color: "text-blue-400", icon: <Medal className="w-4 h-4" /> };
    if (pts >= 100) return { name: "RECLUTA AVANZADO", color: "text-green-400", icon: <Target className="w-4 h-4" /> };
    return { name: "RECLUTA S.H.I.E.L.D.", color: "text-slate-400", icon: <Shield className="w-4 h-4" /> };
  };

  // Temporizador Entrenamiento
  useEffect(() => {
    if (showGame && gameFeedback === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { handleTimeOut(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [showGame, gameFeedback]);

  // Temporizador Batalla (Duelo)
  useEffect(() => {
    if (battleState.active && battleState.isRevealed && !battleState.winner) {
      battleTimerRef.current = setInterval(() => {
        setBattleState(prev => {
          if (prev.timeLeft <= 1) { 
            clearInterval(battleTimerRef.current); 
            return { ...prev, timeLeft: 0 }; 
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else { clearInterval(battleTimerRef.current); }
    return () => clearInterval(battleTimerRef.current);
  }, [battleState.active, battleState.isRevealed, battleState.winner]);

  const handleTimeOut = () => {
    setStreak(0);
    setGameFeedback('reveal');
    setTimeout(() => generateProblem(difficulty), 3000);
  };

  const trainingRankedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.trainingPoints - a.trainingPoints);
  }, [players]);

  const startBattle = () => {
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 2);
    const types = ['mult', 'div', 'power'];
    const type = types[Math.floor(Math.random() * types.length)];
    let node, answer;

    if (type === 'mult') {
      const n1 = Math.floor(Math.random() * 20) + 11;
      const n2 = Math.floor(Math.random() * 9) + 2;
      node = <span>{n1} × {n2}</span>;
      answer = n1 * n2;
    } else if (type === 'div') {
      const ans = Math.floor(Math.random() * 15) + 5;
      const divisor = Math.floor(Math.random() * 12) + 3;
      node = <span>{ans * divisor} ÷ {divisor}</span>;
      answer = ans;
    } else {
      const base = Math.floor(Math.random() * 12) + 2;
      node = <span>{base}<sup>2</sup></span>;
      answer = base * base;
    }

    setBattleState({
      active: true,
      players: selected.map(p => p.id),
      problem: { node, answer },
      timeLeft: 5,
      winner: null,
      isRevealed: false,
      battleInput: ""
    });
  };

  const generateProblem = (mode) => {
    let questionNode = null;
    let answer = 0;
    let typeTag = "";

    if (mode === 'easy') {
      const types = ['sum', 'res', 'mult'];
      const type = types[Math.floor(Math.random() * types.length)];
      switch (type) {
        case 'mult':
          const m1 = Math.floor(Math.random() * 10) + 2;
          const m2 = Math.floor(Math.random() * 5) + 2;
          questionNode = <span>{m1} × {m2}</span>;
          answer = m1 * m2;
          break;
        case 'sum':
          const s1 = Math.floor(Math.random() * 20) + 5;
          const s2 = Math.floor(Math.random() * 20) + 5;
          questionNode = <span>{s1} + {s2}</span>;
          answer = s1 + s2;
          break;
        case 'res':
          const r1 = Math.floor(Math.random() * 30) + 10;
          const r2 = Math.floor(Math.random() * 10) + 1;
          questionNode = <span>{r1} - {r2}</span>;
          answer = r1 - r2;
          break;
      }
      setTimeLeft(8);
    } else if (mode === 'hardcore') {
      const types = ['mult2', 'divComplex', 'power', 'decSum', 'decRes', 'fracSum', 'fracRes'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      switch (type) {
        case 'mult2':
          const m1 = Math.floor(Math.random() * 50) + 11;
          const m2 = Math.floor(Math.random() * 19) + 2;
          questionNode = <span>{m1} × {m2}</span>;
          answer = m1 * m2;
          break;
        case 'divComplex':
          const divisor = Math.floor(Math.random() * 15) + 4;
          const res = Math.floor(Math.random() * 25) + 5;
          const dividend = divisor * res;
          questionNode = <span>{dividend} ÷ {divisor}</span>;
          answer = res;
          break;
        case 'power':
          const base = Math.floor(Math.random() * 14) + 2;
          const exp = Math.random() > 0.6 ? 3 : 2;
          questionNode = <span>{base}<sup>{exp}</sup></span>;
          answer = Math.pow(base, exp);
          break;
        case 'decSum':
          const ds1 = (Math.random() * 40 + 5).toFixed(1);
          const ds2 = (Math.random() * 40 + 5).toFixed(1);
          questionNode = <span>{ds1} + {ds2}</span>;
          answer = parseFloat((parseFloat(ds1) + parseFloat(ds2)).toFixed(1));
          break;
        case 'decRes':
          const dr1 = (Math.random() * 60 + 20).toFixed(1);
          const dr2 = (Math.random() * 19 + 1).toFixed(1);
          questionNode = <span>{dr1} - {dr2}</span>;
          answer = parseFloat((parseFloat(dr1) - parseFloat(dr2)).toFixed(1));
          break;
        case 'fracSum':
        case 'fracRes':
          typeTag = "fraction";
          const isSum = type === 'fracSum';
          let den1 = Math.floor(Math.random() * 5) + 2;
          let den2 = Math.floor(Math.random() * 5) + 2;
          while (den1 === den2) den2 = Math.floor(Math.random() * 5) + 2;
          let num1 = Math.floor(Math.random() * 6) + 1;
          let num2 = Math.floor(Math.random() * 6) + 1;
          questionNode = (
            <span className="inline-flex items-center gap-2">
              <span className="flex flex-col text-center"><span>{num1}</span><span className="border-t border-white">{den1}</span></span>
              <span>{isSum ? '+' : '-'}</span>
              <span className="flex flex-col text-center"><span>{num2}</span><span className="border-t border-white">{den2}</span></span>
            </span>
          );
          const finalNum = isSum ? (num1 * den2 + num2 * den1) : (num1 * den2 - num2 * den1);
          const finalDen = den1 * den2;
          answer = `${finalNum}/${finalDen}`;
          break;
      }
      setTimeLeft(45);
    } else { // Medium
      const types = ['multHigh', 'sumHigh', 'resHigh', 'divHigh'];
      const type = types[Math.floor(Math.random() * types.length)];
      switch (type) {
        case 'multHigh':
          const m1 = Math.floor(Math.random() * 15) + 2;
          const m2 = Math.floor(Math.random() * 15) + 2;
          questionNode = <span>{m1} × {m2}</span>;
          answer = m1 * m2;
          break;
        case 'sumHigh':
          const s1 = Math.floor(Math.random() * 90) + 10;
          const s2 = Math.floor(Math.random() * 90) + 10;
          questionNode = <span>{s1} + {s2}</span>;
          answer = s1 + s2;
          break;
        case 'resHigh':
          const r1 = Math.floor(Math.random() * 120) + 50;
          const r2 = Math.floor(Math.random() * 49) + 10;
          questionNode = <span>{r1} - {r2}</span>;
          answer = r1 - r2;
          break;
        case 'divHigh':
          const d2 = Math.floor(Math.random() * 12) + 2;
          const res = Math.floor(Math.random() * 12) + 1;
          const d1 = d2 * res;
          questionNode = <span>{d1} ÷ {d2}</span>;
          answer = res;
          break;
      }
      setTimeLeft(12);
    }
    
    if (activeUser?.inventory.extraTime > 0) {
      setTimeLeft(prev => prev + 10);
      setPlayers(prev => prev.map(p => p.id === currentUser.id ? { ...p, inventory: { ...p.inventory, extraTime: p.inventory.extraTime - 1 } } : p));
    }

    setCurrentProblem({ node: questionNode, answer, type: typeTag });
    setGameFeedback(null);
    setUserAnswer("");
    setAttempts(3);
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    if (gameFeedback === 'reveal') return;
    let isCorrect = false;
    if (currentProblem.type === 'fraction') {
      isCorrect = userAnswer.trim() === currentProblem.answer.toString();
    } else {
      isCorrect = Math.abs(parseFloat(userAnswer) - currentProblem.answer) < 0.01;
    }
    if (isCorrect) {
      setGameFeedback('correct');
      const newStreak = streak + 1;
      let basePoints = 5;
      if (difficulty === 'easy') basePoints = 2;
      if (difficulty === 'hardcore') basePoints = 15;
      
      const multiplier = activeUser?.inventory.x2 > 0 ? 2 : 1;
      const pointsEarned = (basePoints * Math.pow(2, Math.floor(newStreak / 10))) * multiplier;
      
      setStreak(newStreak);
      setPlayers(prev => prev.map(p => {
        if (p.id === currentUser.id) {
          const newInv = { ...p.inventory };
          if (multiplier > 1) newInv.x2 -= 1;
          return { ...p, trainingPoints: p.trainingPoints + pointsEarned, inventory: newInv };
        }
        return p;
      }));
      setTimeout(() => generateProblem(difficulty), 800);
    } else {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      if (newAttempts <= 0) {
        setStreak(0);
        setGameFeedback('reveal');
        setTimeout(() => generateProblem(difficulty), 3000);
      } else {
        setGameFeedback('incorrect');
        setTimeout(() => setGameFeedback(null), 800);
      }
    }
  };

  const handleBattleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(battleState.battleInput) === battleState.problem.answer) {
      setBattleState(prev => ({ ...prev, winner: currentUser.id }));
      setPlayers(prev => prev.map(p => p.id === currentUser.id ? { ...p, trainingPoints: p.trainingPoints + 100 } : p));
      setTimeout(() => setBattleState({ active: false, players: [], problem: null, timeLeft: 5, winner: null, isRevealed: false, battleInput: "" }), 3000);
    }
  };

  const buyItem = (itemKey, cost) => {
    if (activeUser && activeUser.trainingPoints >= cost) {
      setPlayers(prev => prev.map(p => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            trainingPoints: p.trainingPoints - cost,
            inventory: { ...p.inventory, [itemKey]: p.inventory[itemKey] + (itemKey === 'x2' ? 10 : 1) }
          };
        }
        return p;
      }));
    }
  };

  const promoteUser = (positions, cost) => {
    if (activeUser && activeUser.trainingPoints >= cost) {
      const currentIdx = players.findIndex(p => p.id === currentUser.id);
      if (currentIdx === 0) return; 

      const newIdx = Math.max(0, currentIdx - positions);
      const newPlayers = [...players];
      const [userToMove] = newPlayers.splice(currentIdx, 1);
      userToMove.trainingPoints -= cost;
      newPlayers.splice(newIdx, 0, userToMove);
      setPlayers(newPlayers);
    }
  };

  // Función exclusiva admin para mover puestos
  const movePlayerManual = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= players.length) return;
    
    const newPlayers = [...players];
    const [moved] = newPlayers.splice(index, 1);
    newPlayers.splice(newIdx, 0, moved);
    setPlayers(newPlayers);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = players.find(p => p.name === loginSelection);
    if (user && user.pin === userPinInput) {
      setCurrentUser(user);
      setLoginError(false);
      setUserPinInput("");
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleReload = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (battleTimerRef.current) clearInterval(battleTimerRef.current);
    setShowGame(false);
    setGameFeedback(null);
    setBattleState({ active: false, players: [], problem: null, timeLeft: 5, winner: null, isRevealed: false, battleInput: "" });
  };

  const adjustPoints = (id, amount) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, trainingPoints: Math.max(0, p.trainingPoints + amount) } : p));
  };

  if (!currentUser && !showAdminLogin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 font-sans uppercase overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent opacity-50" />
        <div className="max-w-md w-full bg-[#0f172a]/80 backdrop-blur-xl border-t-4 border-cyan-500 p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 onClick={() => setShowAdminLogin(true)} className="text-5xl font-black italic text-white cursor-pointer tracking-tighter">AVENGERS<span className="text-cyan-500">MATH</span></h1>
            <div className="text-cyan-400 text-[9px] tracking-[0.5em] font-black mt-2">TERMINAL DE ACCESO NIVEL ALPHA</div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <select 
              value={loginSelection} 
              onChange={(e) => setLoginSelection(e.target.value)} 
              required 
              className="w-full bg-slate-900 border-2 border-slate-800 p-4 text-cyan-100 font-bold outline-none focus:border-cyan-500 transition-all appearance-none"
            >
              <option value="">-- ELIGE TU IDENTIDAD --</option>
              {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
            <div className="relative">
              <input 
                type="password" 
                placeholder="____" 
                maxLength={4}
                required
                value={userPinInput}
                onChange={(e) => setUserPinInput(e.target.value.replace(/\D/g,''))}
                className={`w-full bg-slate-900 border-2 p-4 text-center text-2xl font-black tracking-[1em] outline-none transition-all ${loginError ? 'border-red-500 text-red-500 animate-shake' : 'border-slate-800 text-cyan-400 focus:border-cyan-500'}`}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
            </div>
            <button type="submit" className="w-full bg-cyan-600 text-white font-black py-5 hover:bg-cyan-400 hover:text-black transition-all flex items-center justify-center gap-2 group">
              <Rocket className="w-5 h-5 group-hover:translate-y--1 transition-transform" /> INICIAR PROTOCOLO
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0f172a] border-t-4 border-red-500 p-8 shadow-2xl">
          <h2 className="text-red-500 font-black text-center mb-6 tracking-widest flex items-center justify-center gap-2">
            <ShieldAlert /> ACCESO S.H.I.E.L.D.
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (adminPinInput === "0000") {
              setIsAdmin(true);
              setShowAdminLogin(false);
              if (!currentUser) setCurrentUser({ id: 'admin', name: 'DIRECTOR FURY', trainingPoints: 9999 });
            }
          }} className="space-y-4">
            <input type="password" maxLength={4} value={adminPinInput} onChange={(e) => setAdminPinInput(e.target.value)} className="w-full bg-black border-2 border-red-900 p-4 text-center text-2xl text-red-500 tracking-widest outline-none focus:border-red-500" placeholder="PIN" />
            <button type="submit" className="w-full bg-red-600 text-white font-black py-4">AUTENTICAR</button>
            <button onClick={() => setShowAdminLogin(false)} className="w-full text-slate-500 text-xs py-2 uppercase font-black">Abortar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-cyan-100 p-4 md:p-8 font-sans uppercase overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-stretch mb-8 gap-4">
          <div className="bg-slate-900/50 p-4 border-l-4 border-cyan-500 flex items-center gap-4 flex-1 backdrop-blur">
            <div className="w-12 h-12 bg-cyan-500/20 rounded flex items-center justify-center">
              <User className="text-cyan-400" />
            </div>
            <div>
              <p className="text-[9px] text-cyan-500 font-black tracking-widest flex items-center gap-1">
                {isAdmin ? <Crown className="w-3 h-3"/> : <Medal className="w-3 h-3"/>} 
                {isAdmin ? 'ESTADO: COMANDANTE' : `RANGO: ${getRank(activeUser?.trainingPoints).name}`}
              </p>
              <h3 className="font-black text-xl text-white italic">{currentUser?.name || "AGENTE DESCONOCIDO"}</h3>
              <div className="flex gap-2 mt-1">
                {activeUser?.inventory?.x2 > 0 && <span className="flex items-center gap-1 text-[8px] bg-orange-500/20 text-orange-400 px-1 border border-orange-500/30"><Flame size={10}/> x2 ({activeUser.inventory.x2})</span>}
                {activeUser?.inventory?.shield > 0 && <span className="flex items-center gap-1 text-[8px] bg-blue-500/20 text-blue-400 px-1 border border-blue-500/30"><Shield size={10}/> ESCUDO ({activeUser.inventory.shield})</span>}
                {activeUser?.inventory?.extraTime > 0 && <span className="flex items-center gap-1 text-[8px] bg-green-500/20 text-green-400 px-1 border border-green-500/30"><Clock size={10}/> +10S ({activeUser.inventory.extraTime})</span>}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 items-center bg-slate-900/30 p-2 rounded">
            {!showGame && (
              <div className="flex gap-2">
                <button onClick={() => setView(view === "general" ? "training" : "general")} className="px-4 py-3 bg-indigo-600/10 border border-indigo-500 text-indigo-400 text-[10px] font-black hover:bg-indigo-500 hover:text-white transition-all">
                  {view === "general" ? "ORDEN: ENTRENAMIENTO" : "ORDEN: LISTA AGENTES"}
                </button>
                <button onClick={() => setView(view === "store" ? "general" : "store")} className="px-4 py-3 bg-yellow-600/10 border border-yellow-500 text-yellow-500 text-[10px] font-black hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-2">
                  <ShoppingCart className="w-3 h-3"/> TIENDA
                </button>
                <button onClick={handleReload} className="p-3 border border-cyan-800 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
                {isAdmin && (
                  <button onClick={startBattle} className="px-4 py-3 bg-orange-600 border border-orange-400 text-white text-[10px] font-black hover:scale-105 transition-all flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                    <Swords className="w-4 h-4"/> INICIAR DUELO
                  </button>
                )}
              </div>
            )}
            <button onClick={() => { setCurrentUser(null); setIsAdmin(false); setShowGame(false); }} className="p-3 border border-red-900 text-red-500 hover:bg-red-600 hover:text-white transition-all">
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tienda de S.H.I.E.L.D. */}
        {view === "store" && !showGame && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-900 border-2 border-orange-500/30 p-6 flex flex-col items-center text-center">
                <Flame className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-black text-xl text-white">POTENCIADOR X2</h3>
                <p className="text-[10px] text-slate-400 mb-6 italic">DUPLICA LOS PUNTOS GANADOS DURANTE 10 EJERCICIOS CORRECTOS.</p>
                <button 
                  onClick={() => buyItem('x2', 150)}
                  disabled={!activeUser || activeUser.trainingPoints < 150}
                  className="w-full py-3 bg-orange-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black hover:bg-orange-500 transition-all"
                >
                  ADQUIRIR (150 XP)
                </button>
              </div>
              <div className="bg-slate-900 border-2 border-blue-500/30 p-6 flex flex-col items-center text-center">
                <Shield className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="font-black text-xl text-white">ESCUDO DE DUELO</h3>
                <p className="text-[10px] text-slate-400 mb-6 italic">EVITA PERDER PUNTOS EN TU PRÓXIMO DUELO SI PIERDES.</p>
                <button 
                  onClick={() => buyItem('shield', 300)}
                  disabled={!activeUser || activeUser.trainingPoints < 300}
                  className="w-full py-3 bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black hover:bg-blue-500 transition-all"
                >
                  ADQUIRIR (300 XP)
                </button>
              </div>
              <div className="bg-slate-900 border-2 border-green-500/30 p-6 flex flex-col items-center text-center">
                <Clock className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="font-black text-xl text-white">TIEMPO EXTRA</h3>
                <p className="text-[10px] text-slate-400 mb-6 italic">AÑADE +10 SEGUNDOS A TU PRÓXIMO EJERCICIO DE ENTRENAMIENTO.</p>
                <button 
                  onClick={() => buyItem('extraTime', 100)}
                  disabled={!activeUser || activeUser.trainingPoints < 100}
                  className="w-full py-3 bg-green-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black hover:bg-green-500 transition-all"
                >
                  ADQUIRIR (100 XP)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border-2 border-purple-500/30 p-6 flex flex-col items-center text-center">
                <ArrowUpCircle className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="font-black text-xl text-white uppercase tracking-tighter">HACKEO DE LISTA (LVL 1)</h3>
                <p className="text-[10px] text-slate-400 mb-6 italic">SUBE 1 PUESTO AUTOMÁTICAMENTE EN LA CLASIFICACIÓN GENERAL.</p>
                <button 
                  onClick={() => promoteUser(1, 1000)}
                  disabled={!activeUser || activeUser.trainingPoints < 1000 || players.findIndex(p => p.id === currentUser?.id) === 0}
                  className="w-full py-3 bg-purple-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black hover:bg-purple-500 transition-all"
                >
                  ADQUIRIR (1000 XP)
                </button>
              </div>
              <div className="bg-slate-950 border-2 border-indigo-500/30 p-6 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <ArrowUpCircle className="w-12 h-12 text-indigo-500" />
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[8px] font-black px-1 rounded">x5</span>
                </div>
                <h3 className="font-black text-xl text-white uppercase tracking-tighter">HACKEO DE LISTA (LVL 2)</h3>
                <p className="text-[10px] text-slate-400 mb-6 italic">SALTA 5 PUESTOS HACIA ARRIBA EN LA CLASIFICACIÓN GENERAL.</p>
                <button 
                  onClick={() => promoteUser(5, 4500)}
                  disabled={!activeUser || activeUser.trainingPoints < 4500 || players.findIndex(p => p.id === currentUser?.id) === 0}
                  className="w-full py-3 bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black hover:bg-indigo-500 transition-all"
                >
                  ADQUIRIR (4500 XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerta de Combate */}
        {battleState.active && (
          <div className="mb-10 p-8 bg-red-950/20 border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-red-500 bg-red-500/10">SISTEMA DE COMBATE ACTIVO</div>
            
            {isUserInCombat && (
              <div className="mb-6 bg-red-600 text-white p-4 font-black text-xl flex items-center justify-center gap-4 animate-bounce">
                <ShieldAlert className="w-8 h-8"/> ¡ERES EL OBJETIVO! DEFIENDE TU HONOR
              </div>
            )}

            <div className="text-center">
              <div className="flex items-center justify-center gap-6 mb-4">
                <div className="text-right">
                   <div className="text-white font-black text-lg">{players.find(p => p.id === battleState.players[0])?.name}</div>
                   <div className="text-red-500 text-[10px] font-black">AGENTE 01</div>
                </div>
                <div className="w-16 h-16 bg-red-600 flex items-center justify-center rotate-45 border-4 border-white">
                  <Swords className="-rotate-45 w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                   <div className="text-white font-black text-lg">{players.find(p => p.id === battleState.players[1])?.name}</div>
                   <div className="text-red-500 text-[10px] font-black">AGENTE 02</div>
                </div>
              </div>

              {battleState.isRevealed ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <div className="text-7xl font-black text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    {battleState.problem?.node}
                  </div>
                  <div className={`text-2xl font-black mb-6 ${battleState.timeLeft < 3 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                    00:0{battleState.timeLeft}
                  </div>
                  
                  {isUserInCombat && !battleState.winner && (
                    <form onSubmit={handleBattleSubmit} className="max-w-md mx-auto flex gap-2">
                      <input 
                        autoFocus
                        type="number"
                        value={battleState.battleInput}
                        onChange={(e) => setBattleState(prev => ({...prev, battleInput: e.target.value}))}
                        className="flex-1 bg-black border-2 border-red-600 p-4 text-3xl font-black text-white outline-none focus:border-white"
                        placeholder="RESPUESTA"
                      />
                      <button type="submit" className="bg-red-600 px-8 font-black hover:bg-red-500 transition-all">GOLPE</button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="py-6">
                  {isAdmin ? (
                    <button onClick={() => setBattleState(p => ({...p, isRevealed: true}))} className="px-12 py-4 bg-red-600 text-white font-black text-xl hover:scale-110 transition-all flex items-center gap-3 mx-auto shadow-2xl">
                      <Play className="w-6 h-6"/> LANZAR ATAQUE
                    </button>
                  ) : (
                    <div className="text-slate-500 italic font-black text-sm tracking-[0.3em] animate-pulse">SISTEMA BLOQUEADO POR COMANDANTE</div>
                  )}
                </div>
              )}

              {battleState.winner && (
                <div className="mt-8 bg-green-500 text-black p-6 font-black text-3xl italic animate-in slide-in-from-bottom duration-500">
                  ¡{players.find(p => p.id === battleState.winner)?.name} HA GANADO!
                  <div className="text-sm mt-1 uppercase tracking-widest">+100 XP ASIGNADOS</div>
                </div>
              )}
            </div>
          </div>
        )}

        {showGame ? (
          /* Juego */
          <div className="max-w-2xl mx-auto">
            <div className={`bg-slate-900 border-x-2 border-b-2 p-10 relative overflow-hidden ${difficulty === 'hardcore' ? 'border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.1)]'}`}>
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-800">
                <div className={`h-full transition-all duration-1000 ${timeLeft < 4 ? 'bg-red-500' : 'bg-cyan-500'}`} 
                     style={{ width: `${(timeLeft / (difficulty === 'hardcore' ? 45 : difficulty === 'easy' ? 8 : 12)) * 100}%` }} />
              </div>

              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setShowGame(false)} className="text-[10px] font-black text-slate-500 hover:text-white transition-colors border-b border-slate-700">RETIRADA</button>
                <div className="text-center">
                   <div className="text-[9px] text-cyan-600 font-black tracking-widest uppercase">STREAK ACTUAL</div>
                   <div className="text-4xl font-black italic text-cyan-400">{streak}</div>
                </div>
                <div className="text-right">
                   <div className={`text-2xl font-black ${timeLeft < 4 ? 'text-red-500 animate-pulse' : 'text-white'}`}>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</div>
                   <div className="flex gap-1 mt-1 justify-end">{[...Array(3)].map((_, i) => (<div key={i} className={`w-3 h-3 rotate-45 ${i < attempts ? 'bg-cyan-500' : 'bg-red-900'}`} />))}</div>
                </div>
              </div>

              <div className="text-center relative">
                 <div className="text-8xl font-black italic text-white mb-12 flex items-center justify-center drop-shadow-2xl min-h-[140px]">
                   {currentProblem?.node}
                 </div>
                 
                 <form onSubmit={checkAnswer} className="max-w-xs mx-auto relative">
                   <input 
                     autoFocus 
                     type={currentProblem?.type === 'fraction' ? "text" : "number"}
                     step="any" 
                     value={userAnswer} 
                     disabled={gameFeedback === 'reveal'} 
                     onChange={(e) => setUserAnswer(e.target.value)} 
                     className={`w-full bg-black border-4 p-6 text-center text-5xl font-black transition-all outline-none ${gameFeedback === 'correct' ? 'border-green-500 text-green-500' : gameFeedback === 'incorrect' ? 'border-red-500 text-red-500' : gameFeedback === 'reveal' ? 'border-yellow-500 text-yellow-500' : 'border-slate-800 text-white focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`} 
                     placeholder="???" 
                   />
                   {gameFeedback === 'reveal' && <div className="mt-4 text-yellow-500 font-black text-2xl animate-pulse">OBJETIVO: {currentProblem?.answer}</div>}
                   <button type="submit" className="w-full mt-4 py-4 bg-white text-black font-black text-lg hover:bg-cyan-400 transition-all uppercase italic tracking-tighter">CONFIRMAR IMPACTO</button>
                 </form>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => { setDifficulty("easy"); setShowGame(true); generateProblem("easy"); }} className="group relative px-8 py-6 bg-green-600/10 border-2 border-green-500/30 hover:border-green-500 transition-all overflow-hidden flex-1 min-w-[200px]">
                <div className="relative z-10 text-left">
                  <div className="text-green-500 font-black text-2xl italic tracking-tighter">RECLUTA</div>
                  <div className="text-[10px] text-green-700 font-black mt-1 uppercase">8 SEGUNDOS | +2 XP</div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><Shield className="w-12 h-12 text-green-500" /></div>
              </button>

              <button onClick={() => { setDifficulty("medium"); setShowGame(true); generateProblem("medium"); }} className="group relative px-8 py-6 bg-cyan-600/10 border-2 border-cyan-500/30 hover:border-cyan-500 transition-all overflow-hidden flex-1 min-w-[200px]">
                <div className="relative z-10 text-left">
                  <div className="text-cyan-500 font-black text-2xl italic tracking-tighter">AGENTE</div>
                  <div className="text-[10px] text-cyan-700 font-black mt-1 uppercase">12 SEGUNDOS | +5 XP</div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><Zap className="w-12 h-12 text-cyan-500" /></div>
              </button>

              <button onClick={() => { setDifficulty("hardcore"); setShowGame(true); generateProblem("hardcore"); }} className="group relative px-8 py-6 bg-red-600/10 border-2 border-red-500/30 hover:border-red-500 transition-all overflow-hidden flex-1 min-w-[200px]">
                <div className="relative z-10 text-left">
                  <div className="text-red-500 font-black text-2xl italic tracking-tighter">VENGADOR</div>
                  <div className="text-[10px] text-red-700 font-black mt-1 uppercase">45 SEGUNDOS | +15 XP</div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><Skull className="w-12 h-12 text-red-500" /></div>
              </button>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-lg overflow-hidden">
              <div className="p-4 bg-black/40 border-b border-slate-800 flex justify-between items-center">
                 <h2 className="text-2xl font-black italic text-white flex items-center gap-2">
                   <Trophy className="text-yellow-500 w-6 h-6" /> {view === "general" ? "SISTEMA DE LISTA ALPHA" : "RANKING DE ENTRENAMIENTO"}
                 </h2>
                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">SISTEMA EN LÍNEA</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] text-cyan-600 font-black uppercase tracking-widest bg-slate-900">
                    <tr>
                      <th className="p-5">POS</th>
                      <th className="p-5">IDENTIDAD DEL AGENTE</th>
                      <th className="p-5 text-center">NIVEL / CONTROLES</th>
                      <th className="p-5 text-right">EXPERIENCIA (XP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(view === "general" ? players : trainingRankedPlayers).map((p, idx) => {
                      const rank = getRank(p.trainingPoints);
                      return (
                        <tr key={p.id} className={`border-b border-slate-800/40 group transition-all hover:bg-cyan-500/5 ${currentUser?.id === p.id ? 'bg-cyan-500/10' : ''}`}>
                          <td className="p-5 font-black text-2xl italic text-slate-700 group-hover:text-cyan-500 transition-colors">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </td>
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded border border-slate-700 flex items-center justify-center ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-slate-800 text-slate-400'}`}>
                                {idx === 0 ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="font-black text-white text-sm tracking-tighter group-hover:translate-x-1 transition-transform">{p.name}</div>
                                <div className={`text-[10px] font-black flex items-center gap-1 ${rank.color}`}>
                                  {rank.icon} {rank.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-center">
                            {isAdmin ? (
                              <div className="flex flex-col items-center gap-2">
                                {/* Flechas para subir/bajar (solo en vista General) */}
                                {view === "general" && (
                                  <div className="flex gap-1 mb-1">
                                    <button 
                                      onClick={() => movePlayerManual(idx, 'up')} 
                                      disabled={idx === 0}
                                      className="p-1 bg-cyan-600 disabled:bg-slate-800 text-white rounded hover:bg-cyan-400 transition-colors"
                                    >
                                      <ChevronUp size={16} />
                                    </button>
                                    <button 
                                      onClick={() => movePlayerManual(idx, 'down')} 
                                      disabled={idx === players.length - 1}
                                      className="p-1 bg-cyan-600 disabled:bg-slate-800 text-white rounded hover:bg-cyan-400 transition-colors"
                                    >
                                      <ChevronDown size={16} />
                                    </button>
                                  </div>
                                )}
                                <div className="flex justify-center gap-1">
                                  <button onClick={() => adjustPoints(p.id, 50)} className="px-3 py-1 bg-green-600 text-white text-[9px] font-black hover:bg-green-400">+50</button>
                                  <button onClick={() => adjustPoints(p.id, -50)} className="px-3 py-1 bg-red-600 text-white text-[9px] font-black hover:bg-red-400">-50</button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-32 h-2 bg-slate-800 mx-auto rounded-full overflow-hidden">
                                <div className={`h-full ${rank.color.replace('text-', 'bg-')}`} style={{ width: `${Math.min(100, (p.trainingPoints % 500) / 5)}%` }} />
                              </div>
                            )}
                          </td>
                          <td className="p-5 text-right">
                            <div className={`text-3xl font-black italic tracking-tighter ${p.trainingPoints > 0 ? (idx === 0 ? 'text-yellow-400' : 'text-cyan-400') : 'text-slate-800'}`}>
                              {p.trainingPoints}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        body { 
          background: #020617; 
          background-image: radial-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 0);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default App;