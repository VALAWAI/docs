"use strict";(self.webpackChunkvalawai_docs=self.webpackChunkvalawai_docs||[]).push([[202],{193:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>i,metadata:()=>r,toc:()=>l});var o=n(5893),s=n(1151);const i={},a="LLM Reflection",r={id:"components/C2/llm_reflection",title:"LLM Reflection",description:"A reflection is a short text used to control other components. Specifically,",source:"@site/docs/components/C2/llm_reflection.md",sourceDirName:"components/C2",slug:"/components/C2/llm_reflection",permalink:"/docs/components/C2/llm_reflection",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"allSidebar",previous:{title:"Alignment calculator",permalink:"/docs/components/C2/alignment_calculator"},next:{title:"MFT Values Detection",permalink:"/docs/components/C2/mft_values_detection"}},c={},l=[];function u(e){const t={h1:"h1",p:"p",...(0,s.a)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"llm-reflection",children:"LLM Reflection"}),"\n",(0,o.jsx)(t.p,{children:"A reflection is a short text used to control other components. Specifically,\nthis component generates reflections on the dialogue messages it receives and\non a list of values modeled as text and fixed in the component configuration.\nIn the future it will be possible to explore scenarios with value preferences\nthat vary over time and depend on the interlocutor."}),"\n",(0,o.jsx)(t.p,{children:'Modeling values as text is justified, for example in the social robots application,\nfor two reasons. First, in the social robots application the chosen scenario is\nthe home environment, where the values are often expressed in the form of rules,\nsuch as "do not smoke in the house". Additionally, in this scenario the values\nat play do not involve complex concepts, such as "justice" or "freedom", and\nthe consequences of the system behaviour are not critical, such as in the case\nof a self-driving car. For this reason it is possible to avoid the complexity\nof modeling values as rules in a strict reasoning system.'}),"\n",(0,o.jsx)(t.p,{children:"Second, the values are modeled as text because the component uses a large language\nmodel to generate the reflections. If on one hand the home environment reduces\nthe stakes of the system behaviour, on the other hand it is a complex environment\nwhere the system must be able to deal with a wide range of situations and complex,\nunstructured interactions. Expressing values as text enables the system to understand\nvery complex situations and interactions, thanks to the underlying large language model."}),"\n",(0,o.jsx)(t.p,{children:"The choice of using text to influence the system behaviour is a consequence of\nthe choice of using a large language model as the C1 dialogue manager. In the future,\nit will be necessary to study the impact of this choice on the system behaviour,\nand explore alternative approaches if necessary."})]})}function h(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>r,a:()=>a});var o=n(7294);const s={},i=o.createContext(s);function a(e){const t=o.useContext(i);return o.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),o.createElement(i.Provider,{value:t},e.children)}}}]);