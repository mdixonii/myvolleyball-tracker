const { useState, createElement: e } = React;

function VolleyballTracker() {
  // ── MT state ──────────────────────────────────────────────
  const [teamSize, setTeamSize] = useState(6);
  const [rotationCount, setRotationCount] = useState(0);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState('court');

  // ── Opp state ─────────────────────────────────────────────
  const [oppTeamSize, setOppTeamSize] = useState(6);
  const [oppRotationCount, setOppRotationCount] = useState(0);
  const [oppEditingPlayer, setOppEditingPlayer] = useState(null);
  const [oppSelectedPlayer, setOppSelectedPlayer] = useState(null);
  const [oppDraggedPlayer, setOppDraggedPlayer] = useState(null);
  const [oppColor, setOppColor] = useState('red');

  const oppColorThemes = {
    red:    {frontColor:'bg-red-800',backColor:'bg-red-600',rotateColor:'bg-red-600 hover:bg-red-700',accentText:'text-red-400',accentBg:'bg-red-600',accentHover:'hover:bg-red-700',accentColor:'text-red-600',statAccent:'text-red-400',statBtnBg:'bg-red-600',statBtnHover:'hover:bg-red-500',courtGrad:'bg-gradient-to-br from-red-900/30 to-red-800/20',tabBorder:'border-red-400',swatch:'bg-red-500'},
    green:  {frontColor:'bg-green-800',backColor:'bg-green-600',rotateColor:'bg-green-600 hover:bg-green-700',accentText:'text-green-400',accentBg:'bg-green-600',accentHover:'hover:bg-green-700',accentColor:'text-green-600',statAccent:'text-green-400',statBtnBg:'bg-green-600',statBtnHover:'hover:bg-green-500',courtGrad:'bg-gradient-to-br from-green-900/30 to-green-800/20',tabBorder:'border-green-400',swatch:'bg-green-500'},
    yellow: {frontColor:'bg-yellow-700',backColor:'bg-yellow-500',rotateColor:'bg-yellow-500 hover:bg-yellow-600',accentText:'text-yellow-400',accentBg:'bg-yellow-500',accentHover:'hover:bg-yellow-600',accentColor:'text-yellow-600',statAccent:'text-yellow-400',statBtnBg:'bg-yellow-500',statBtnHover:'hover:bg-yellow-400',courtGrad:'bg-gradient-to-br from-yellow-900/30 to-yellow-800/20',tabBorder:'border-yellow-400',swatch:'bg-yellow-400'},
    purple: {frontColor:'bg-purple-800',backColor:'bg-purple-600',rotateColor:'bg-purple-600 hover:bg-purple-700',accentText:'text-purple-400',accentBg:'bg-purple-600',accentHover:'hover:bg-purple-700',accentColor:'text-purple-600',statAccent:'text-purple-400',statBtnBg:'bg-purple-600',statBtnHover:'hover:bg-purple-500',courtGrad:'bg-gradient-to-br from-purple-900/30 to-purple-800/20',tabBorder:'border-purple-400',swatch:'bg-purple-500'},
  };

  // ── Scoreboard state ───────────────────────────────────────
  const today = new Date().toISOString().slice(0,10);
  const [gameDate, setGameDate] = useState(today);
  const [opponent, setOpponent] = useState('');
  const [currentSet, setCurrentSet] = useState(1);
  const [teamsFlipped, setTeamsFlipped] = useState(false);
  const [scores, setScores] = useState({
    1:{home:0,visitor:0},2:{home:0,visitor:0},3:{home:0,visitor:0}
  });

  const initialStats = {
    serveAce:0,serveAttempt:0,serveError:0,
    receptionAttempt:0,receptionError:0,
    ballHandlingAttempt:0,ballHandlingError:0,ballHandlingAssist:0,
    dig:0,attackKill:0,attackAttempt:0,attackError:0,
    block:0,blockError:0,offensivePoint:0,defensivePoint:0
  };

  const [players, setPlayers] = useState({
    pos1:{id:1,number:'1',name:'Player 1',stats:{...initialStats}},
    pos2:{id:2,number:'2',name:'Player 2',stats:{...initialStats}},
    pos3:{id:3,number:'3',name:'Player 3',stats:{...initialStats}},
    pos4:{id:4,number:'4',name:'Player 4',stats:{...initialStats}},
    pos5:{id:5,number:'5',name:'Player 5',stats:{...initialStats}},
    pos6:{id:6,number:'6',name:'Player 6',stats:{...initialStats}},
    bench1:null,bench2:null,
  });

  const [oppPlayers, setOppPlayers] = useState({
    pos1:{id:1,number:'1',name:'Player 1',stats:{...initialStats}},
    pos2:{id:2,number:'2',name:'Player 2',stats:{...initialStats}},
    pos3:{id:3,number:'3',name:'Player 3',stats:{...initialStats}},
    pos4:{id:4,number:'4',name:'Player 4',stats:{...initialStats}},
    pos5:{id:5,number:'5',name:'Player 5',stats:{...initialStats}},
    pos6:{id:6,number:'6',name:'Player 6',stats:{...initialStats}},
    bench1:null,bench2:null,
  });

  const statLabels = {
    serveAce:'Serve Ace',serveAttempt:'Serve Attempt',serveError:'Serve Error',
    receptionAttempt:'Reception Attempt',receptionError:'Reception Error',
    ballHandlingAttempt:'Ball Handling Attempt',ballHandlingError:'Ball Handling Error',
    ballHandlingAssist:'Ball Handling Assist',dig:'Dig',
    attackKill:'Attack Kill',attackAttempt:'Attack Attempt',attackError:'Attack Error',
    block:'Block',blockError:'Block Error',offensivePoint:'Offensive Point',defensivePoint:'Defensive Point'
  };

  // ── Scoreboard helpers ─────────────────────────────────────
  const oppScoreTheme = {
    red:    {text:'text-red-400',    btnBg:'bg-red-600',    btnHover:'hover:bg-red-500',    swapBg:'bg-red-600/30',    swapText:'text-red-300',    swapHover:'hover:bg-red-600/50'},
    green:  {text:'text-green-400',  btnBg:'bg-green-600',  btnHover:'hover:bg-green-500',  swapBg:'bg-green-600/30',  swapText:'text-green-300',  swapHover:'hover:bg-green-600/50'},
    yellow: {text:'text-yellow-400', btnBg:'bg-yellow-500', btnHover:'hover:bg-yellow-400', swapBg:'bg-yellow-500/30', swapText:'text-yellow-300', swapHover:'hover:bg-yellow-500/50'},
    purple: {text:'text-purple-400', btnBg:'bg-purple-600', btnHover:'hover:bg-purple-500', swapBg:'bg-purple-600/30', swapText:'text-purple-300', swapHover:'hover:bg-purple-600/50'},
  }[oppColor];

  const setsWon=(team)=>[1,2,3].filter(s=>{const sc=scores[s];return team==='home'?sc.home>sc.visitor:sc.visitor>sc.home;}).length;

  const handleScoreChange=(side,delta)=>{
    setScores(prev=>({...prev,[currentSet]:{...prev[currentSet],[side]:Math.max(0,prev[currentSet][side]+delta)}}));
  };

  // ── MT handlers ───────────────────────────────────────────
  const handleRotate=()=>{
    if(teamSize===6)setPlayers(prev=>({pos1:prev.pos2,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.pos5,pos5:prev.pos6,pos6:prev.pos1,bench1:null,bench2:null}));
    else if(teamSize===7)setPlayers(prev=>({pos1:prev.bench1,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.pos5,pos5:prev.pos6,pos6:prev.pos1,bench1:prev.pos2,bench2:null}));
    else if(teamSize===8)setPlayers(prev=>({pos1:prev.bench1,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.bench2,pos5:prev.pos6,pos6:prev.pos1,bench1:prev.pos2,bench2:prev.pos5}));
    setRotationCount(prev=>prev+1);
  };

  const handleTeamSizeChange=(newSize)=>{
    setTeamSize(newSize);
    setPlayers(prev=>{
      const u={...prev};
      if(newSize===6){u.bench1=null;u.bench2=null;}
      else if(newSize===7){if(!prev.bench1)u.bench1={id:7,number:'7',name:'Player 7',stats:{...initialStats}};u.bench2=null;}
      else if(newSize===8){
        if(!prev.bench1)u.bench1={id:7,number:'7',name:'Player 7',stats:{...initialStats}};
        if(!prev.bench2)u.bench2={id:8,number:'8',name:'Player 8',stats:{...initialStats}};
      }
      return u;
    });
  };

  const handleEditPlayer=(position,player)=>setEditingPlayer({position,...player});

  const handleSavePlayer=()=>{
    if(editingPlayer){
      setPlayers(prev=>({...prev,[editingPlayer.position]:{...prev[editingPlayer.position],number:editingPlayer.number,name:editingPlayer.name}}));
      setEditingPlayer(null);
    }
  };

  const handleStatChange=(position,stat,delta)=>{
    setPlayers(prev=>{
      const ns={...prev[position].stats,[stat]:Math.max(0,prev[position].stats[stat]+delta)};
      if(stat==='serveAce'&&delta>0){ns.serveAttempt++;ns.offensivePoint++;}
      if(stat==='serveAce'&&delta<0){ns.serveAttempt=Math.max(0,ns.serveAttempt-1);ns.offensivePoint=Math.max(0,ns.offensivePoint-1);}
      if(stat==='serveError'&&delta>0)ns.serveAttempt++;
      if(stat==='serveError'&&delta<0)ns.serveAttempt=Math.max(0,ns.serveAttempt-1);
      if(stat==='attackKill'&&delta>0){ns.offensivePoint++;ns.attackAttempt++;}
      if(stat==='attackKill'&&delta<0){ns.offensivePoint=Math.max(0,ns.offensivePoint-1);ns.attackAttempt=Math.max(0,ns.attackAttempt-1);}
      if(stat==='attackError'&&delta>0)ns.attackAttempt++;
      if(stat==='attackError'&&delta<0)ns.attackAttempt=Math.max(0,ns.attackAttempt-1);
      if(stat==='block'&&delta>0)ns.defensivePoint++;
      if(stat==='block'&&delta<0)ns.defensivePoint=Math.max(0,ns.defensivePoint-1);
      const updated={...prev,[position]:{...prev[position],stats:ns}};
      if(selectedPlayer&&selectedPlayer.position===position)setSelectedPlayer({position,player:updated[position]});
      return updated;
    });
  };

  const handleDragStart=(position,player)=>setDraggedPlayer({position,player});

  const handleDrop=(targetPosition)=>{
    if(draggedPlayer&&draggedPlayer.position!==targetPosition){
      if(targetPosition.startsWith('pos')&&draggedPlayer.position.startsWith('pos')){
        setPlayers(prev=>{
          const temp=prev[targetPosition];
          const updated={...prev,[targetPosition]:prev[draggedPlayer.position],[draggedPlayer.position]:temp};
          if(selectedPlayer){
            if(selectedPlayer.position===draggedPlayer.position)setSelectedPlayer({position:targetPosition,player:updated[targetPosition]});
            else if(selectedPlayer.position===targetPosition)setSelectedPlayer({position:draggedPlayer.position,player:updated[draggedPlayer.position]});
          }
          return updated;
        });
      }
    }
    setDraggedPlayer(null);
  };

  const handlePlayerSelect=(position,player)=>setSelectedPlayer({position,player});

  // ── Opp handlers ──────────────────────────────────────────
  const handleOppRotate=()=>{
    if(oppTeamSize===6)setOppPlayers(prev=>({pos1:prev.pos2,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.pos5,pos5:prev.pos6,pos6:prev.pos1,bench1:null,bench2:null}));
    else if(oppTeamSize===7)setOppPlayers(prev=>({pos1:prev.bench1,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.pos5,pos5:prev.pos6,pos6:prev.pos1,bench1:prev.pos2,bench2:null}));
    else if(oppTeamSize===8)setOppPlayers(prev=>({pos1:prev.bench1,pos2:prev.pos3,pos3:prev.pos4,pos4:prev.bench2,pos5:prev.pos6,pos6:prev.pos1,bench1:prev.pos2,bench2:prev.pos5}));
    setOppRotationCount(prev=>prev+1);
  };

  const handleOppTeamSizeChange=(newSize)=>{
    setOppTeamSize(newSize);
    setOppPlayers(prev=>{
      const u={...prev};
      if(newSize===6){u.bench1=null;u.bench2=null;}
      else if(newSize===7){if(!prev.bench1)u.bench1={id:7,number:'7',name:'Player 7',stats:{...initialStats}};u.bench2=null;}
      else if(newSize===8){
        if(!prev.bench1)u.bench1={id:7,number:'7',name:'Player 7',stats:{...initialStats}};
        if(!prev.bench2)u.bench2={id:8,number:'8',name:'Player 8',stats:{...initialStats}};
      }
      return u;
    });
  };

  const handleOppEditPlayer=(position,player)=>setOppEditingPlayer({position,...player});

  const handleOppSavePlayer=()=>{
    if(oppEditingPlayer){
      setOppPlayers(prev=>({...prev,[oppEditingPlayer.position]:{...prev[oppEditingPlayer.position],number:oppEditingPlayer.number,name:oppEditingPlayer.name}}));
      setOppEditingPlayer(null);
    }
  };

  const handleOppStatChange=(position,stat,delta)=>{
    setOppPlayers(prev=>{
      const ns={...prev[position].stats,[stat]:Math.max(0,prev[position].stats[stat]+delta)};
      if(stat==='serveAce'&&delta>0){ns.serveAttempt++;ns.offensivePoint++;}
      if(stat==='serveAce'&&delta<0){ns.serveAttempt=Math.max(0,ns.serveAttempt-1);ns.offensivePoint=Math.max(0,ns.offensivePoint-1);}
      if(stat==='serveError'&&delta>0)ns.serveAttempt++;
      if(stat==='serveError'&&delta<0)ns.serveAttempt=Math.max(0,ns.serveAttempt-1);
      if(stat==='attackKill'&&delta>0){ns.offensivePoint++;ns.attackAttempt++;}
      if(stat==='attackKill'&&delta<0){ns.offensivePoint=Math.max(0,ns.offensivePoint-1);ns.attackAttempt=Math.max(0,ns.attackAttempt-1);}
      if(stat==='attackError'&&delta>0)ns.attackAttempt++;
      if(stat==='attackError'&&delta<0)ns.attackAttempt=Math.max(0,ns.attackAttempt-1);
      if(stat==='block'&&delta>0)ns.defensivePoint++;
      if(stat==='block'&&delta<0)ns.defensivePoint=Math.max(0,ns.defensivePoint-1);
      const updated={...prev,[position]:{...prev[position],stats:ns}};
      if(oppSelectedPlayer&&oppSelectedPlayer.position===position)setOppSelectedPlayer({position,player:updated[position]});
      return updated;
    });
  };

  const handleOppDragStart=(position,player)=>setOppDraggedPlayer({position,player});

  const handleOppDrop=(targetPosition)=>{
    if(oppDraggedPlayer&&oppDraggedPlayer.position!==targetPosition){
      if(targetPosition.startsWith('pos')&&oppDraggedPlayer.position.startsWith('pos')){
        setOppPlayers(prev=>{
          const temp=prev[targetPosition];
          const updated={...prev,[targetPosition]:prev[oppDraggedPlayer.position],[oppDraggedPlayer.position]:temp};
          if(oppSelectedPlayer){
            if(oppSelectedPlayer.position===oppDraggedPlayer.position)setOppSelectedPlayer({position:targetPosition,player:updated[targetPosition]});
            else if(oppSelectedPlayer.position===targetPosition)setOppSelectedPlayer({position:oppDraggedPlayer.position,player:updated[oppDraggedPlayer.position]});
          }
          return updated;
        });
      }
    }
    setOppDraggedPlayer(null);
  };

  const handleOppPlayerSelect=(position,player)=>setOppSelectedPlayer({position,player});

  // ── CSV exports ───────────────────────────────────────────
  const handleExportCSV=()=>{
    const headers=['Player Number','Player Name','Position',...Object.values(statLabels),'Game Date','Opponent','Set 1 Home','Set 1 Visitor','Set 2 Home','Set 2 Visitor','Set 3 Home','Set 3 Visitor'];
    const csvRows=[headers.join(',')];
    const positions={pos1:'Back Right',pos2:'Front Right',pos3:'Middle Front',pos4:'Front Left',pos5:'Back Left',pos6:'Middle Back',bench1:'Bench 1',bench2:'Bench 2'};
    Object.entries(players).forEach(([pos,player])=>{
      if(player){
        const row=[player.number,player.name,positions[pos],...Object.keys(statLabels).map(k=>player.stats[k]),gameDate,opponent||'N/A',scores[1].home,scores[1].visitor,scores[2].home,scores[2].visitor,scores[3].home,scores[3].visitor];
        csvRows.push(row.join(','));
      }
    });
    const blob=new Blob([csvRows.join('\n')],{type:'text/csv;charset=utf-8;'});
    const link=document.createElement('a');
    link.setAttribute('href',URL.createObjectURL(blob));
    link.setAttribute('download','volleyball_stats_'+gameDate+'.csv');
    link.style.visibility='hidden';
    document.body.appendChild(link);link.click();document.body.removeChild(link);
  };

  const handleExportOppCSV=()=>{
    const headers=['Player Number','Player Name','Position',...Object.values(statLabels),'Game Date','Opponent'];
    const csvRows=[headers.join(',')];
    const positions={pos1:'Back Right',pos2:'Front Right',pos3:'Middle Front',pos4:'Front Left',pos5:'Back Left',pos6:'Middle Back',bench1:'Bench 1',bench2:'Bench 2'};
    Object.entries(oppPlayers).forEach(([pos,player])=>{
      if(player){
        const row=[player.number,player.name,positions[pos],...Object.keys(statLabels).map(k=>player.stats[k]),gameDate,opponent||'N/A'];
        csvRows.push(row.join(','));
      }
    });
    const blob=new Blob([csvRows.join('\n')],{type:'text/csv;charset=utf-8;'});
    const link=document.createElement('a');
    link.setAttribute('href',URL.createObjectURL(blob));
    link.setAttribute('download','opp_stats_'+gameDate+'.csv');
    link.style.visibility='hidden';
    document.body.appendChild(link);link.click();document.body.removeChild(link);
  };

const handleExportScoreCSV = () => {
  const headers = [
    'Game Date', 'Opponent',
    'Set 1 Home', 'Set 1 Visitor', 'Set 1 Winner',
    'Set 2 Home', 'Set 2 Visitor', 'Set 2 Winner',
    'Set 3 Home', 'Set 3 Visitor', 'Set 3 Winner',
    'Sets Won Home', 'Sets Won Visitor'
  ];

  const rowValues = [gameDate, opponent || 'N/A'];

  [1, 2, 3].forEach(s => {
    const sc = scores[s];
    const winner = sc.home > sc.visitor ? 'Home' : sc.visitor > sc.home ? (opponent || 'Visitor') : 'Tied';
    rowValues.push(sc.home, sc.visitor, winner);
  });

  rowValues.push(setsWon('home'), setsWon('visitor'));

  const csvRows = [headers.join(','), rowValues.join(',')];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', 'volleyball_score_' + gameDate + '.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // ── Shared PlayerCircle ───────────────────────────────────
  const makePlayerCircle=(opts)=>{
    const {position,player,label,color,accentColor,isDraggable=true,
           selPlayer,onSelect,onEdit,draggedP,onDragStart,onDragEnd,onDrop}=opts;
    if(!player)return null;
    const isSelected=selPlayer&&selPlayer.position===position;
    const isDragging=draggedP&&draggedP.position===position;
    return e('div',{
      className:'flex flex-col items-center space-y-2',
      onDragOver:(ev)=>{if(isDraggable){ev.preventDefault();ev.dataTransfer.dropEffect='move';}},
      onDrop:(ev)=>{if(isDraggable){ev.preventDefault();onDrop(position);}}
    },
      e('div',{
        draggable:isDraggable,
        onDragStart:(ev)=>{if(isDraggable){ev.dataTransfer.effectAllowed='move';onDragStart(position,player);}},
        onDragEnd:onDragEnd,
        onClick:()=>onSelect(position,player),
        className:'w-20 h-20 '+color+' rounded-full shadow-lg flex items-center justify-center border-4 '+(isSelected?'border-yellow-400 ring-4 ring-yellow-300':'border-white')+' '+(isDraggable?'cursor-move hover:scale-105':'cursor-pointer')+' '+(isDragging?'opacity-50':'')+' transition-transform relative group'
      },
        e('span',{className:'text-2xl font-bold text-white'},player.number),
        e('button',{
          onClick:(ev)=>{ev.stopPropagation();onEdit(position,player);},
          className:'absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10'
        },
          e('svg',{className:'w-3 h-3 '+accentColor,fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
            e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'})
          )
        )
      ),
      e('div',{className:'text-center'},
        e('div',{className:'text-xs font-semibold text-gray-200'},player.name),
        e('div',{className:'text-xs text-gray-300'},label)
      )
    );
  };

  // ── Court panel renderer ───────────────────────────────────
  const renderCourt=(opts)=>{
    const {
      pl,ts,rc,selP,dragP,editP,
      onRotate,onTSChange,onExport,onSelect,onEdit,onSaveEdit,onCancelEdit,onStatChange,
      onDragStart,onDragEnd,onDrop,setSelP,setEditP,
      frontColor,backColor,rotateColor,accentText,accentBg,accentHover,accentColor,
      statAccent,statBtnBg,statBtnHover,courtGrad,exportLabel,extraToolbar
    }=opts;

    return e('div',{className:'grid grid-cols-1 lg:grid-cols-3 gap-6'},
      e('div',{className:'lg:col-span-2'},

        e('div',{className:'bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-4 mb-4'},
          e('div',{className:'flex items-center justify-between flex-wrap gap-4'},
            e('div',{className:'flex items-center space-x-3'},
              e('label',{className:'text-sm font-semibold text-gray-200'},'Team size:'),
              [6,7,8].map(size=>
                e('button',{
                  key:size,onClick:()=>onTSChange(size),
                  className:'px-3 py-1.5 rounded-lg font-semibold text-sm '+(ts===size?accentBg+' text-white':'bg-gray-600 text-gray-200 hover:bg-gray-500')
                },size+' players')
              )
            ),
            e('div',{className:'flex items-center space-x-3'},
              extraToolbar||null,
              e('div',{className:'text-sm font-semibold text-gray-200'},
                'Rotations: ',e('span',{className:accentText},rc)
              ),
              e('button',{
                onClick:onExport,
                className:'bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm'
              },
                e('svg',{className:'w-4 h-4',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
                  e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'})
                ),
                e('span',null,exportLabel||'Export CSV')
              )
            )
          )
        ),

        e('div',{className:courtGrad+' rounded-2xl shadow-2xl p-8 mb-4 border-4 border-white/20'},
          e('div',{className:'text-center mb-4'},
            e('span',{className:'text-sm font-bold text-gray-800 bg-white px-4 py-1 rounded-full'},'COURT')
          ),
          e('div',{className:'mb-6'},
            e('div',{className:'h-1 bg-gray-700 w-full mb-1'}),
            e('div',{className:'text-center text-xs text-gray-300 font-semibold'},'NET')
          ),
          e('div',{className:'grid grid-cols-3 gap-8 mb-12 justify-items-center'},
            makePlayerCircle({position:'pos4',player:pl.pos4,label:'Pos 4: Front Left',color:frontColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop}),
            makePlayerCircle({position:'pos3',player:pl.pos3,label:'Pos 3: Middle Front',color:frontColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop}),
            makePlayerCircle({position:'pos2',player:pl.pos2,label:'Pos 2: Front Right',color:frontColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop})
          ),
          e('div',{className:'grid grid-cols-3 gap-8 justify-items-center'},
            makePlayerCircle({position:'pos5',player:pl.pos5,label:'Pos 5: Back Left',color:backColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop}),
            makePlayerCircle({position:'pos6',player:pl.pos6,label:'Pos 6: Middle Back',color:backColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop}),
            makePlayerCircle({position:'pos1',player:pl.pos1,label:'Pos 1: Back Right',color:backColor,accentColor,isDraggable:true,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop})
          )
        ),

        e('button',{
          onClick:onRotate,
          className:'w-full '+rotateColor+' text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center space-x-3'
        },
          e('svg',{className:'w-6 h-6',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
            e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'})
          ),
          e('span',{className:'text-lg'},'ROTATE CLOCKWISE')
        ),

        ts>6&&e('div',{className:'bg-gray-700/50 rounded-2xl shadow-xl p-6 border-2 border-gray-600 mt-4'},
          e('div',{className:'text-center mb-4'},
            e('span',{className:'text-sm font-bold text-gray-300 bg-gray-600 px-4 py-1 rounded-full'},'BENCH')
          ),
          e('div',{className:'flex justify-center gap-12'},
            ts>=7&&makePlayerCircle({position:'bench1',player:pl.bench1,label:'Bench 1',color:'bg-gray-500',accentColor,isDraggable:false,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop}),
            ts>=8&&makePlayerCircle({position:'bench2',player:pl.bench2,label:'Bench 2',color:'bg-gray-500',accentColor,isDraggable:false,selPlayer:selP,onSelect,onEdit,draggedP:dragP,onDragStart,onDragEnd,onDrop})
          )
        )
      ),

      e('div',{className:'lg:col-span-1'},
        e('div',{className:'bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-4 sticky top-4'},
          selP?e('div',null,
            e('div',{className:'flex items-center justify-between mb-4'},
              e('h2',{className:'text-xl font-bold text-white'},'#'+selP.player.number+' '+selP.player.name),
              e('button',{onClick:()=>setSelP(null),className:'text-gray-400 hover:text-white'},
                e('svg',{className:'w-5 h-5',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
                  e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M6 18L18 6M6 6l12 12'})
                )
              )
            ),
            e('div',{className:'stats-scroll overflow-y-auto space-y-2',style:{maxHeight:'768px'}},
              Object.entries(statLabels).map(([key,label])=>
                e('div',{key,className:'bg-gray-700/60 rounded-lg p-3 flex items-center justify-between'},
                  e('div',null,
                    e('div',{className:'text-xs font-semibold text-gray-300'},label),
                    e('div',{className:'text-xl font-bold '+statAccent},selP.player.stats[key])
                  ),
                  e('div',{className:'flex items-center space-x-2'},
                    e('button',{onClick:()=>onStatChange(selP.position,key,-1),className:'bg-gray-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-sm'},'-1'),
                    e('button',{onClick:()=>onStatChange(selP.position,key,1),className:statBtnBg+' '+statBtnHover+' text-white font-bold px-3 py-1.5 rounded-lg text-sm'},'+1')
                  )
                )
              )
            )
          ):e('div',{className:'text-center py-12'},
            e('svg',{className:'w-14 h-14 text-gray-500 mx-auto mb-4',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
              e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'})
            ),
            e('p',{className:'text-gray-300 font-semibold'},'Select a player'),
            e('p',{className:'text-gray-500 text-sm mt-1'},'Click any player on the court')
          )
        )
      ),

      editP&&e('div',{className:'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'},
        e('div',{className:'bg-gray-800 border border-white/20 rounded-xl shadow-2xl p-6 w-80 mx-4'},
          e('h3',{className:'text-lg font-bold text-white mb-4'},'Edit player'),
          e('div',{className:'space-y-4'},
            e('div',null,
              e('label',{className:'block text-xs font-semibold text-gray-300 mb-1'},'Player number'),
              e('input',{type:'text',value:editP.number,onChange:(ev)=>setEditP({...editP,number:ev.target.value}),className:'w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500'})
            ),
            e('div',null,
              e('label',{className:'block text-xs font-semibold text-gray-300 mb-1'},'Player name'),
              e('input',{type:'text',value:editP.name,onChange:(ev)=>setEditP({...editP,name:ev.target.value}),className:'w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500'})
            ),
            e('div',{className:'flex space-x-3'},
              e('button',{onClick:onSaveEdit,className:'flex-1 '+accentBg+' '+accentHover+' text-white font-bold py-2 rounded-lg'},'Save'),
              e('button',{onClick:onCancelEdit,className:'flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg'},'Cancel')
            )
          )
        )
      )
    );
  };

  // ── Render ─────────────────────────────────────────────────
  return e('div',{className:'min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 p-4'},
    e('div',{className:'max-w-7xl mx-auto'},

      e('div',{className:'text-center mb-4'},
        e('div',{className:'flex items-center justify-center space-x-3 mb-1'},
          e('svg',{className:'w-7 h-7 text-blue-400',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
            e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'})
          ),
          e('h1',{className:'text-2xl font-bold text-white'},'Volleyball Rotation & Stats Tracker')
        )
      ),

      e('div',{className:'flex border-b border-white/20 mb-4'},
        [['court','Court & Stats'],['opp','Opp Stats'],['scoreboard','Scoreboard']].map(([tab,label])=>
          e('button',{
            key:tab,onClick:()=>setActiveTab(tab),
            className:'px-6 py-2 font-semibold text-sm transition-colors '+(activeTab===tab?'text-white border-b-2 '+(tab==='opp'?oppColorThemes[oppColor].tabBorder:'border-blue-400'):'text-gray-400 hover:text-gray-200')
          },label)
        )
      ),

      // ── Court & Stats tab ──────────────────────────────────
      activeTab==='court' && renderCourt({
        pl:players,ts:teamSize,rc:rotationCount,selP:selectedPlayer,dragP:draggedPlayer,editP:editingPlayer,
        onRotate:handleRotate,onTSChange:handleTeamSizeChange,onExport:handleExportCSV,
        onSelect:handlePlayerSelect,onEdit:handleEditPlayer,onSaveEdit:handleSavePlayer,
        onCancelEdit:()=>setEditingPlayer(null),onStatChange:handleStatChange,
        onDragStart:handleDragStart,onDragEnd:()=>setDraggedPlayer(null),onDrop:handleDrop,
        setSelP:setSelectedPlayer,setEditP:setEditingPlayer,
        frontColor:'bg-blue-800',backColor:'bg-blue-600',
        rotateColor:'bg-blue-600 hover:bg-blue-700',
        accentText:'text-blue-400',accentBg:'bg-blue-600',accentHover:'hover:bg-blue-700',
        accentColor:'text-blue-600',
        statAccent:'text-blue-400',statBtnBg:'bg-blue-600',statBtnHover:'hover:bg-green-500',
        courtGrad:'bg-gradient-to-br from-blue-900/30 to-blue-800/20',
        exportLabel:'Export CSV'
      }),

      // ── Opp Stats tab ──────────────────────────────────────
      activeTab==='opp' && renderCourt({
        pl:oppPlayers,ts:oppTeamSize,rc:oppRotationCount,selP:oppSelectedPlayer,dragP:oppDraggedPlayer,editP:oppEditingPlayer,
        onRotate:handleOppRotate,onTSChange:handleOppTeamSizeChange,onExport:handleExportOppCSV,
        onSelect:handleOppPlayerSelect,onEdit:handleOppEditPlayer,onSaveEdit:handleOppSavePlayer,
        onCancelEdit:()=>setOppEditingPlayer(null),onStatChange:handleOppStatChange,
        onDragStart:handleOppDragStart,onDragEnd:()=>setOppDraggedPlayer(null),onDrop:handleOppDrop,
        setSelP:setOppSelectedPlayer,setEditP:setOppEditingPlayer,
        ...oppColorThemes[oppColor],
        exportLabel:'Export CSV',
        extraToolbar: e('div',{className:'flex items-center gap-1.5'},
          e('span',{className:'text-xs font-semibold text-gray-400'},'Color:'),
          Object.entries(oppColorThemes).map(([key,theme])=>
            e('button',{
              key,
              onClick:()=>setOppColor(key),
              title:key.charAt(0).toUpperCase()+key.slice(1),
              className:'w-5 h-5 rounded-full '+theme.swatch+' transition-transform hover:scale-110 '+(oppColor===key?'ring-2 ring-white ring-offset-1 ring-offset-gray-800 scale-110':'opacity-60')
            })
          )
        )
      }),

      // ── Scoreboard tab ─────────────────────────────────────
      activeTab==='scoreboard' && e('div',{className:'space-y-4'},

        e('div',{className:'bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-5'},
          e('h2',{className:'text-lg font-bold text-white mb-4'},'Game info'),
          e('div',{className:'grid grid-cols-1 sm:grid-cols-2 gap-4'},
            e('div',null,
              e('label',{className:'block text-xs font-semibold text-gray-300 mb-1'},'Game date'),
              e('input',{type:'date',value:gameDate,onChange:(ev)=>setGameDate(ev.target.value),className:'w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'})
            ),
            e('div',null,
              e('label',{className:'block text-xs font-semibold text-gray-300 mb-1'},'Opponent'),
              e('input',{type:'text',value:opponent,placeholder:'e.g. Lincoln High',onChange:(ev)=>setOpponent(ev.target.value),className:'w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500'})
            )
          )
        ),

        e('div',{className:'bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-5'},
          e('div',{className:'flex items-center justify-between flex-wrap gap-3 mb-4'},
            e('h2',{className:'text-lg font-bold text-white'},'Score'),
            e('div',{className:'flex items-center gap-2 flex-wrap'},
              [1,2,3].map(s=>
                e('button',{key:s,onClick:()=>setCurrentSet(s),className:'px-4 py-1.5 rounded-lg text-sm font-bold transition-colors '+(currentSet===s?'bg-blue-600 text-white':'bg-gray-600 text-gray-300 hover:bg-gray-500')},'Set '+s)
              ),
              e('button',{onClick:handleExportScoreCSV,className:'bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-2 text-sm'},
                e('svg',{className:'w-4 h-4',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
                  e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'})
                ),
                e('span',null,'Export CSV')
              )
            )
          ),

          e('div',{className:'grid grid-cols-3 gap-4 items-center mb-6'},
            e('div',{className:'text-center'},
              e('div',{className:'text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center justify-center gap-1'},
                teamsFlipped?e('span',{className:oppScoreTheme.text},opponent||'Visitor'):e('span',{className:'text-blue-400'},'MT')
              ),
              e('div',{className:'text-7xl font-black text-white mb-3'},teamsFlipped?scores[currentSet].visitor:scores[currentSet].home),
              e('div',{className:'flex justify-center gap-2'},
                e('button',{onClick:()=>handleScoreChange(teamsFlipped?'visitor':'home',-1),className:'w-12 h-12 bg-gray-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors'},'-'),
                e('button',{onClick:()=>handleScoreChange(teamsFlipped?'visitor':'home',1),className:(teamsFlipped?'w-12 h-12 '+oppScoreTheme.btnBg+' '+oppScoreTheme.btnHover:'w-12 h-12 bg-blue-600 hover:bg-blue-500')+' text-white font-bold rounded-lg text-xl transition-colors'},'+')
              )
            ),
            e('div',{className:'text-center'},
              e('div',{className:'text-gray-500 text-3xl font-bold mb-2'},'vs'),
              e('div',{className:'text-xs text-gray-400 mb-1'},'Set wins'),
              e('div',{className:'flex justify-center gap-3 items-center mb-3'},
                e('span',{className:'text-2xl font-bold '+(teamsFlipped?oppScoreTheme.text:'text-blue-400')},setsWon(teamsFlipped?'visitor':'home')),
                e('span',{className:'text-gray-500 text-lg'},'-'),
                e('span',{className:'text-2xl font-bold '+(teamsFlipped?'text-blue-400':oppScoreTheme.text)},setsWon(teamsFlipped?'home':'visitor'))
              ),
              e('button',{
                onClick:()=>setTeamsFlipped(f=>!f),title:'Swap home and away',
                className:'mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors '+(teamsFlipped?oppScoreTheme.swapBg+' '+oppScoreTheme.swapText+' '+oppScoreTheme.swapHover:'bg-gray-600/50 text-gray-300 hover:bg-gray-600')
              },
                e('svg',{className:'w-3.5 h-3.5',fill:'none',stroke:'currentColor',viewBox:'0 0 24 24'},
                  e('path',{strokeLinecap:'round',strokeLinejoin:'round',strokeWidth:2,d:'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4'})
                ),
                teamsFlipped?'Away game':'Swap teams'
              )
            ),
            e('div',{className:'text-center'},
              e('div',{className:'text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide flex items-center justify-center gap-1'},
                teamsFlipped?e('span',{className:'text-blue-400'},'MT'):e('span',{className:oppScoreTheme.text},opponent||'Visitor')
              ),
              e('div',{className:'text-7xl font-black text-white mb-3'},teamsFlipped?scores[currentSet].home:scores[currentSet].visitor),
              e('div',{className:'flex justify-center gap-2'},
                e('button',{onClick:()=>handleScoreChange(teamsFlipped?'home':'visitor',-1),className:'w-12 h-12 bg-gray-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl transition-colors'},'-'),
                e('button',{onClick:()=>handleScoreChange(teamsFlipped?'home':'visitor',1),className:(teamsFlipped?'w-12 h-12 bg-blue-600 hover:bg-blue-500':'w-12 h-12 '+oppScoreTheme.btnBg+' '+oppScoreTheme.btnHover)+' text-white font-bold rounded-lg text-xl transition-colors'},'+')
              )
            )
          ),

          e('div',{className:'border-t border-white/10 pt-4'},
            e('div',{className:'text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide'},'All sets'),
            e('div',{className:'grid grid-cols-3 gap-3'},
              [1,2,3].map(s=>
                e('div',{key:s,onClick:()=>setCurrentSet(s),className:'bg-gray-700/50 rounded-xl p-3 text-center cursor-pointer transition-all '+(currentSet===s?'ring-2 ring-blue-500':'hover:bg-gray-700')},
                  e('div',{className:'text-xs text-gray-400 mb-1 font-semibold'},'Set '+s),
                  e('div',{className:'text-xl font-black text-white'},scores[s].home+' \u2013 '+scores[s].visitor)
                )
              )
            )
          )
        )
      )
    )
  );
}

ReactDOM.render(React.createElement(VolleyballTracker), document.getElementById('root'));