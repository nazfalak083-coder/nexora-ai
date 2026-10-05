import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Bot, Zap, ShieldCheck, MessageSquare, Send, Plus, Menu, X, Sparkles, ArrowUpRight, Building2, Headphones, Globe2, UserRound, CheckCircle2} from 'lucide-react';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const starter = [
  {icon: Building2, title:'Explore our services', prompt:'What services do you offer?'},
  {icon: Headphones, title:'Get customer support', prompt:'I need help with a product or service.'},
  {icon: Globe2, title:'Business information', prompt:'Tell me about your business and how you can help.'}
];

function App(){
 const [messages,setMessages]=useState([]);
 const [input,setInput]=useState('');
 const [busy,setBusy]=useState(false);
 const [drawer,setDrawer]=useState(false);
 const [leadOpen,setLeadOpen]=useState(false);
 const [lead,setLead]=useState({name:'',email:'',message:''});
 const [leadStatus,setLeadStatus]=useState('');
 const bottom=useRef(null);
 const inputRef=useRef(null);

 // FIXED: useEffect now returns nothing
 useEffect(()=>{
   bottom.current?.scrollIntoView({behavior:'smooth'});
 },[messages]);

 async function send(text=input){
   const value=text.trim();
   if(!value||busy)return;

   const next=[...messages,{role:'user',content:value}];

   setMessages([...next,{role:'assistant',content:''}]);
   setInput('');
   setBusy(true);

   try{
     const res=await fetch(`${API}/api/chat`,{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({messages:next})
     });

     if(!res.ok){
       let e='Unable to connect right now.';
       try{
         e=(await res.json()).detail||e;
       }catch{}
       throw new Error(e);
     }

     const reader=res.body.getReader();
     const decoder=new TextDecoder();
     let buffer='';
     let answer='';

     while(true){
       const {value,done}=await reader.read();
       if(done)break;

       buffer+=decoder.decode(value,{stream:true});

       const parts=buffer.split('\n\n');
       buffer=parts.pop()||'';

       for(const part of parts){
         const line=part.split('\n').find(x=>x.startsWith('data:'));
         if(!line)continue;

         const raw=line.slice(5).trim();

         if(raw==='[DONE]')continue;

         try{
           const data=JSON.parse(raw);

           if(data.error)throw new Error(data.error);

           if(data.content){
             answer+=data.content;

             setMessages([
               ...next,
               {
                 role:'assistant',
                 content:answer
               }
             ]);
           }
         }catch(err){
           if(err.message&&!err.message.includes('JSON')){
             throw err;
           }
         }
       }
     }

     if(!answer){
       setMessages([
         ...next,
         {
           role:'assistant',
           content:'I could not generate a response. Please try again.'
         }
       ]);
     }

   }catch(e){
     setMessages([
       ...next,
       {
         role:'assistant',
         content:`${e.message}\n\nPlease check that the NEXORA API is running and an LLM API key is configured.`
       }
     ]);
   }finally{
     setBusy(false);
     inputRef.current?.focus();
   }
 }

 async function submitLead(e){
   e.preventDefault();
   setLeadStatus('Sending…');

   try{
     const r=await fetch(`${API}/api/leads`,{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify(lead)
     });

     const d=await r.json();

     if(!r.ok)throw new Error(d.detail||'Could not submit');

     setLeadStatus('Thanks! Your details have been received.');
     setLead({name:'',email:'',message:''});

   }catch(err){
     setLeadStatus(err.message);
   }
 }

 function reset(){
   setMessages([]);
   setDrawer(false);
 }

 return <div className="app">

  <aside className={`sidebar ${drawer?'open':''}`}>

   <div className="brand">
    <div className="brand-mark">
     <Sparkles size={19}/>
    </div>

    <div>
     <b>NEXORA</b>
     <span>INTELLIGENCE</span>
    </div>

    <button
     className="mobile-close"
     onClick={()=>setDrawer(false)}
    >
     <X size={18}/>
    </button>
   </div>

   <button className="new-chat" onClick={reset}>
    <Plus size={17}/> New conversation
   </button>

   <div className="side-label">YOUR AI ASSISTANT</div>

   <div className="side-feature">
    <div className="side-icon">
     <Bot size={18}/>
    </div>

    <div>
     <b>Business assistant</b>
     <small>Always here to help</small>
    </div>

    <span className="online-dot"/>
   </div>

   <div className="side-bottom">

    <div className="secure">
     <ShieldCheck size={16}/>
     <span>Private by design</span>
    </div>

    <button
     className="lead-link"
     onClick={()=>setLeadOpen(true)}
    >
     <UserRound size={16}/>
     Leave your details
     <ArrowUpRight size={14}/>
    </button>

    <div className="version">
     NEXORA AI <span>v1.0</span>
    </div>

   </div>

  </aside>

  {drawer&&<div className="scrim" onClick={()=>setDrawer(false)}/>}

  <main className="main">

   <header className="topbar">

    <button
     className="menu-btn"
     onClick={()=>setDrawer(true)}
    >
     <Menu size={19}/>
    </button>

    <div className="crumb">
     <span>Workspace</span>
     <b>/</b>
     <strong>AI Assistant</strong>
    </div>

    <div className="top-right">
     <span className="live">
      <i/> SYSTEM ONLINE
     </span>

     <div className="avatar">N</div>
    </div>

   </header>

   <section className="content">

    {messages.length===0 ?

    <div className="welcome">

     <div className="eyebrow">
      <span className="sparkle-dot"/>
      YOUR BUSINESS, INTELLIGENTLY CONNECTED
     </div>

     <div className="hero-icon">
      <div className="hero-ring">
       <Bot size={32}/>
      </div>

      <span className="orbit orbit-a"/>
      <span className="orbit orbit-b"/>
     </div>

     <h1>
      How can I help<br/>
      <em>your business</em> today?
     </h1>

     <p className="intro">
      Your always-on AI assistant. Ask a question, explore services,
      or get the support you need — all in one place.
     </p>

     <div className="suggestions">

      {starter.map((s,i)=>
       <button
        key={i}
        className="suggestion"
        onClick={()=>send(s.prompt)}
       >

        <span className="suggest-icon">
         <s.icon size={17}/>
        </span>

        <span>
         <b>{s.title}</b>
         <small>{s.prompt}</small>
        </span>

        <ArrowUpRight size={15}/>

       </button>
      )}

     </div>

     <div className="trust-row">

      <span>
       <Zap size={14}/>
       Fast responses
      </span>

      <span>
       <ShieldCheck size={14}/>
       Business-focused
      </span>

      <span>
       <MessageSquare size={14}/>
       Natural conversations
      </span>

     </div>

    </div>

    :

    <div className="conversation">

     <div className="conversation-head">

      <div>
       <span className="eyebrow">
        NEXORA ASSISTANT
       </span>

       <h2>Your conversation</h2>
      </div>

      <button
       onClick={reset}
       className="clear-btn"
      >
       <Plus size={15}/>
       New chat
      </button>

     </div>

     {messages.map((m,i)=>

      <div
       className={`message ${m.role}`}
       key={i}
      >

       <div className="msg-avatar">
        {m.role==='assistant'
         ? <Sparkles size={16}/>
         : <UserRound size={16}/>
        }
       </div>

       <div className="msg-body">

        <div className="msg-name">
         {m.role==='assistant'
          ? 'NEXORA AI'
          : 'You'
         }
        </div>

        <div className="msg-text">
         {m.content}

         {busy &&
          i===messages.length-1 &&
          m.role==='assistant' &&
          <span className="cursor"/>
         }
        </div>

       </div>

      </div>

     )}

     <div ref={bottom}/>

    </div>

    }

   </section>

   <div className="composer-wrap">

    <div className="composer">

     <textarea
      ref={inputRef}
      rows="1"
      value={input}
      onChange={e=>setInput(e.target.value)}
      onKeyDown={e=>{
       if(e.key==='Enter'&&!e.shiftKey){
        e.preventDefault();
        send();
       }
      }}
      placeholder="Message NEXORA AI…"
      disabled={busy}
     />

     <div className="composer-actions">

      <span>
       AI can make mistakes. Verify important information.
      </span>

      <button
       className="send"
       onClick={()=>send()}
       disabled={!input.trim()||busy}
      >
       <Send size={17}/>
      </button>

     </div>

    </div>

    <div className="powered">
     POWERED BY ADVANCED LANGUAGE MODELS
     <span>·</span>
     BUILT FOR BUSINESS
    </div>

   </div>

  </main>

  {leadOpen&&

   <div
    className="modal-backdrop"
    onClick={()=>setLeadOpen(false)}
   >

    <form
     className="lead-modal"
     onSubmit={submitLead}
     onClick={e=>e.stopPropagation()}
    >

     <button
      type="button"
      className="modal-close"
      onClick={()=>setLeadOpen(false)}
     >
      <X size={18}/>
     </button>

     <div className="modal-symbol">
      <UserRound size={21}/>
     </div>

     <span className="eyebrow">
      LET'S CONNECT
     </span>

     <h2>Talk to our team</h2>

     <p>
      Leave your details and the team can follow up with you.
     </p>

     <label>
      Your name

      <input
       required
       value={lead.name}
       onChange={e=>setLead({...lead,name:e.target.value})}
       placeholder="Full name"
      />
     </label>

     <label>
      Email address

      <input
       required
       type="email"
       value={lead.email}
       onChange={e=>setLead({...lead,email:e.target.value})}
       placeholder="you@company.com"
      />
     </label>

     <label>
      How can we help?

      <textarea
       value={lead.message}
       onChange={e=>setLead({...lead,message:e.target.value})}
       placeholder="Tell us a little about what you need…"
      />
     </label>

     <button
      className="submit-lead"
      type="submit"
     >
      Send details
      <ArrowUpRight size={16}/>
     </button>

     {leadStatus&&

      <div className="lead-status">
       <CheckCircle2 size={15}/>
       {leadStatus}
      </div>

     }

    </form>

   </div>

  }

 </div>
}

createRoot(document.getElementById('root')).render(<App/>);