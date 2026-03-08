(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();function H(e){return e[Math.floor(Math.random()*e.length)]}function G(e,t="O",n="X"){const r=e.length;if(r!==3)return null;function i(d){const u=[];for(let l=0;l<r;l+=1)for(let p=0;p<r;p+=1)d[l][p]||u.push([l,p]);return u}function a(d){const u=[];for(let l=0;l<3;l+=1)u.push([[l,0],[l,1],[l,2]]),u.push([[0,l],[1,l],[2,l]]);u.push([[0,0],[1,1],[2,2]]),u.push([[0,2],[1,1],[2,0]]);for(const l of u){const p=l.map(([m,g])=>d[m][g]);if(p[0]&&p.every(m=>m===p[0]))return p[0]}return i(d).length===0?"draw":null}function o(d,u){return d===t?10-u:d===n?u-10:0}function c(d,u,l){const p=a(d);if(p)return{score:o(p,l)};const m=i(d);let g={score:u?-1/0:1/0,move:null};for(const[h,y]of m){d[h][y]=u?t:n;const b=c(d,!u,l+1);d[h][y]="",u?b.score>g.score&&(g={score:b.score,move:[h,y]}):b.score<g.score&&(g={score:b.score,move:[h,y]})}return g}return c(e.map(d=>[...d]),!0,0).move}function R(e){const t=[];for(let n=0;n<e.length;n+=1)for(let r=0;r<e.length;r+=1)e[n][r]||t.push([n,r]);return t}function C(e,t,n,r,i,a){let o=0,c=t+r,f=n+i;for(;e[c]&&e[c][f]===a;)o+=1,c+=r,f+=i;return o}function X(e,t,n,r,i){const a=[[[0,1],[0,-1]],[[1,0],[-1,0]],[[1,1],[-1,-1]],[[1,-1],[-1,1]]];let o=0;for(const[c,f]of a){const d=1+C(e,t,n,c[0],c[1],i)+C(e,t,n,f[0],f[1],i);if(d>=r)return 1e5;o=Math.max(o,d)}return o*o}function J(e,t,n){let r=0;for(let o=Math.max(0,t-1);o<=Math.min(e.length-1,t+1);o+=1)for(let c=Math.max(0,n-1);c<=Math.min(e.length-1,n+1);c+=1)e[o][c]&&(r+=2);const i=(e.length-1)/2,a=Math.abs(t-i)+Math.abs(n-i);return r+=Math.max(0,e.length-a),r}function x(e,t,n="O",r="X"){const i=R(e);if(i.length===0)return null;let a=-1/0,o=[];for(const[c,f]of i){const d=X(e,c,f,t,n),u=X(e,c,f,t,r),l=J(e,c,f),p=d*1.15+u+l;p>a?(a=p,o=[[c,f]]):p===a&&o.push([c,f])}return H(o)}function j(e,t,n="O",r="X"){return e.length===3&&G(e,n,r)||x(e,t,n,r)}const O=[{key:"classic",label:"Classic 3x3",size:3,target:3},{key:"extended",label:"Extended 5x5",size:5,target:4},{key:"pro",label:"Pro 10x10",size:10,target:5}];function k(e){return Array.from({length:e},()=>Array.from({length:e},()=>""))}function q({mode:e="pvp",preset:t=O[0]}={}){return{screen:"menu",mode:e,preset:t,board:k(t.size),currentPlayer:"X",winner:null,moves:0,busy:!1,winningCells:[]}}function $(e,t="X"){e.board=k(e.preset.size),e.currentPlayer=t,e.winner=null,e.moves=0,e.busy=!1,e.winningCells=[]}function z(e,t,n){if(e.winner||e.busy||e.board[t][n])return!1;e.board[t][n]=e.currentPlayer,e.moves+=1;const r=_(e.board,e.preset.target);return r.winner?(e.winner=r.winner,e.winningCells=r.cells):e.moves>=e.preset.size*e.preset.size?(e.winner="draw",e.winningCells=[]):e.currentPlayer=e.currentPlayer==="X"?"O":"X",!0}function L(e,t,n){return t>=0&&n>=0&&t<e&&n<e}function _(e,t){const n=e.length,r=[[0,1],[1,0],[1,1],[1,-1]];for(let i=0;i<n;i+=1)for(let a=0;a<n;a+=1){const o=e[i][a];if(o)for(const[c,f]of r){const d=i-c,u=a-f;if(L(n,d,u)&&e[d][u]===o)continue;const l=[[i,a]];let p=i+c,m=a+f;for(;L(n,p,m)&&e[p][m]===o;){if(l.push([p,m]),l.length===t)return{winner:o,cells:l};p+=c,m+=f}}}return{winner:null,cells:[]}}const A="ttu_stats_v1",I={pvp:{x:0,o:0,draws:0,games:0},ai:{player:0,ai:0,draws:0,games:0}};function B(e,t){try{return e?JSON.parse(e):t}catch{return t}}function M(){const e=B(localStorage.getItem(A),I);return structuredClone?structuredClone(e):JSON.parse(JSON.stringify(e))}function T(e){localStorage.setItem(A,JSON.stringify(e))}function K(e,t){const n=M(),r=e==="pvp"?n.pvp:n.ai;return r.games+=1,t==="draw"?r.draws+=1:e==="pvp"?(t==="X"&&(r.x+=1),t==="O"&&(r.o+=1)):(t==="X"&&(r.player+=1),t==="O"&&(r.ai+=1)),T(n),n}function W(){return T(I),M()}const s=q(),E=document.querySelector("#app");function D(e){return`
    <button class="select-card ${s.preset.key===e.key?"active":""}" data-action="set-preset" data-preset="${e.key}">
      <span class="card-title">${e.label}</span>
      <span class="card-meta">Поле ${e.size}x${e.size} · собрать ${e.target}</span>
    </button>
  `}function S(e,t,n,r){return`
    <button class="mode-card ${s.mode===e?"active":""}" data-action="set-mode" data-mode="${e}">
      <span class="mode-icon">${r}</span>
      <span class="mode-copy">
        <span class="card-title">${t}</span>
        <span class="card-meta">${n}</span>
      </span>
    </button>
  `}function F(){const e=M();E.innerHTML=`
    <div class="shell">
      <section class="hero panel">
        <div>
          <div class="eyebrow">Local-first • GitHub Pages ready</div>
          <h1>TicTac Universe</h1>
          <p class="hero-text">Современные крестики-нолики для браузера: локальный PvP, игра против AI, большие поля и чистый адаптивный интерфейс.</p>
        </div>
        <div class="hero-actions">
          <button class="primary-btn" data-action="goto-setup">Играть</button>
          <button class="ghost-btn" data-action="show-stats">Статистика</button>
        </div>
      </section>

      <section class="grid two-up">
        <article class="panel">
          <div class="section-title">Режим игры</div>
          <div class="cards-stack">
            ${S("pvp","1 vs 1","Два игрока на одном устройстве","👥")}
            ${S("ai","vs Computer","Игрок против компьютера","🤖")}
          </div>
        </article>

        <article class="panel">
          <div class="section-title">Размер поля</div>
          <div class="cards-stack">
            ${O.map(D).join("")}
          </div>
        </article>
      </section>

      <section class="grid two-up compact-panels">
        <article class="panel stat-panel">
          <div class="section-title">Локальная статистика PvP</div>
          <div class="mini-stats">
            <div><span>X</span><strong>${e.pvp.x}</strong></div>
            <div><span>O</span><strong>${e.pvp.o}</strong></div>
            <div><span>Ничьи</span><strong>${e.pvp.draws}</strong></div>
            <div><span>Игр</span><strong>${e.pvp.games}</strong></div>
          </div>
        </article>

        <article class="panel stat-panel">
          <div class="section-title">Локальная статистика AI</div>
          <div class="mini-stats">
            <div><span>Игрок</span><strong>${e.ai.player}</strong></div>
            <div><span>AI</span><strong>${e.ai.ai}</strong></div>
            <div><span>Ничьи</span><strong>${e.ai.draws}</strong></div>
            <div><span>Игр</span><strong>${e.ai.games}</strong></div>
          </div>
        </article>
      </section>
    </div>
  `}function U(){return s.winner==="draw"?"Ничья":s.winner==="X"?s.mode==="ai"?"Победил игрок":"Победил X":s.winner==="O"?s.mode==="ai"?"Победил AI":"Победил O":s.mode==="ai"&&s.currentPlayer==="O"?"Ход компьютера…":`Ход: ${s.currentPlayer}`}function Y(){const e=s.preset.size>=10?"compact":s.preset.size>=5?"medium":"regular",t=s.board.map((n,r)=>n.map((i,a)=>{const o=s.winningCells.some(([c,f])=>c===r&&f===a);return`
          <button
            class="cell ${e} ${i?"filled":""} ${o?"winning":""}"
            data-action="move"
            data-row="${r}"
            data-col="${a}"
            ${i||s.winner||s.busy?"disabled":""}
          >${i}</button>
        `}).join("")).join("");E.innerHTML=`
    <div class="shell game-shell">
      <section class="panel game-topbar">
        <div>
          <div class="eyebrow">${s.mode==="ai"?"Player vs Computer":"Local 1 vs 1"}</div>
          <h2>${s.preset.label}</h2>
          <p class="hero-text small">${U()}</p>
        </div>
        <div class="toolbar">
          <button class="ghost-btn" data-action="back-menu">Меню</button>
          <button class="ghost-btn" data-action="restart">Рестарт</button>
          ${s.winner?'<button class="primary-btn" data-action="play-again">Еще раз</button>':""}
        </div>
      </section>

      <section class="panel board-panel">
        <div class="board" style="--size:${s.preset.size}">
          ${t}
        </div>
      </section>

      <section class="grid two-up compact-panels">
        <article class="panel note-panel">
          <div class="section-title">Правила матча</div>
          <p>Поле ${s.preset.size}x${s.preset.size}. Чтобы победить, нужно собрать ${s.preset.target} символа подряд по горизонтали, вертикали или диагонали.</p>
        </article>
        <article class="panel note-panel">
          <div class="section-title">Управление</div>
          <p>Кликни или тапни по свободной клетке. Игра оптимизирована под мобильный браузер и отлично подходит для GitHub Pages.</p>
        </article>
      </section>
    </div>
  `}function Q(){const e=M(),t=document.createElement("div");t.className="overlay",t.innerHTML=`
    <div class="modal panel">
      <div class="modal-header">
        <h3>Статистика</h3>
        <button class="icon-btn" data-action="close-modal">✕</button>
      </div>
      <div class="stats-grid">
        <div class="stats-card">
          <div class="section-title">PvP</div>
          <div class="stats-list">
            <div><span>Победы X</span><strong>${e.pvp.x}</strong></div>
            <div><span>Победы O</span><strong>${e.pvp.o}</strong></div>
            <div><span>Ничьи</span><strong>${e.pvp.draws}</strong></div>
            <div><span>Всего игр</span><strong>${e.pvp.games}</strong></div>
          </div>
        </div>
        <div class="stats-card">
          <div class="section-title">AI</div>
          <div class="stats-list">
            <div><span>Победы игрока</span><strong>${e.ai.player}</strong></div>
            <div><span>Победы AI</span><strong>${e.ai.ai}</strong></div>
            <div><span>Ничьи</span><strong>${e.ai.draws}</strong></div>
            <div><span>Всего игр</span><strong>${e.ai.games}</strong></div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="ghost-btn" data-action="reset-stats">Сбросить</button>
        <button class="primary-btn" data-action="close-modal">Закрыть</button>
      </div>
    </div>
  `,document.body.appendChild(t)}function w(){var e;(e=document.querySelector(".overlay"))==null||e.remove()}function v(){s.screen==="menu"||s.screen==="setup"?F():Y()}function V(){s.screen="game",$(s),v()}function Z(e){const t=O.find(n=>n.key===e);t&&(s.preset=t,v())}function ee(e){s.mode=e,v()}function N(){s.winner&&(K(s.mode,s.winner),v())}function P(){s.mode!=="ai"||s.currentPlayer!=="O"||s.winner||(s.busy=!0,v(),window.setTimeout(()=>{const[e,t]=j(s.board,s.preset.target,"O","X")||[];e!==void 0&&t!==void 0?(s.busy=!1,z(s,e,t),s.winner?N():v()):(s.busy=!1,v())},250))}function te(e,t){if(z(s,e,t)){if(s.winner){N();return}v(),P()}}function ne(){document.addEventListener("click",e=>{const t=e.target.closest("[data-action]");if(!t)return;const n=t.dataset.action;if(n==="goto-setup"){s.screen="setup",v();return}if(n==="set-mode"){ee(t.dataset.mode);return}if(n==="set-preset"){Z(t.dataset.preset);return}if(n==="show-stats"){Q();return}if(n==="close-modal"){w();return}if(n==="reset-stats"){W(),w(),v();return}if(n==="back-menu"){s.screen="menu",v();return}if(n==="restart"){$(s),v(),P();return}if(n==="play-again"){const r=s.winner==="draw"?"X":s.winner;$(s,r==="draw"?"X":r),v(),P();return}if(n==="move"){te(Number(t.dataset.row),Number(t.dataset.col));return}}),document.addEventListener("keydown",e=>{e.key==="Escape"&&w(),e.key.toLowerCase()==="n"&&s.screen==="game"&&($(s),v(),P())}),document.addEventListener("dblclick",e=>{e.target.classList.contains("overlay")&&w()})}ne();v();V();s.screen="menu";v();
