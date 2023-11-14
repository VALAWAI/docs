"use strict";(self.webpackChunkvalawai_docs=self.webpackChunkvalawai_docs||[]).push([[248],{7577:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>d,frontMatter:()=>r,metadata:()=>s,toc:()=>c});var a=t(5893),o=t(1151);const r={sidebar_position:1},i="The Global Neuronal Workspace (GNW)",s={id:"toolbox/architecture/gnw",title:"The Global Neuronal Workspace (GNW)",description:"The Global Neuronal Workspace (GNW) model was originally proposed by Stanislas Dehaene",source:"@site/docs/toolbox/architecture/gnw.md",sourceDirName:"toolbox/architecture",slug:"/toolbox/architecture/gnw",permalink:"/docs/toolbox/architecture/gnw",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"allSidebar",previous:{title:"Architecture",permalink:"/docs/toolbox/architecture/"},next:{title:"Value Awareness",permalink:"/docs/toolbox/architecture/value_awareness"}},l={},c=[];function h(e){const n={a:"a",h1:"h1",img:"img",p:"p",...(0,o.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"the-global-neuronal-workspace-gnw",children:"The Global Neuronal Workspace (GNW)"}),"\n",(0,a.jsxs)(n.p,{children:["The Global Neuronal Workspace (GNW) model was originally proposed by Stanislas Dehaene\nand Jean-Pierre Changeux ",(0,a.jsx)(n.a,{href:"/references#DehaeneStanislas2011TGNW",children:"[Dehaene et al., 2011]"})," and inspired\nby the earlier Global Workspace model (GW) of Baars ",(0,a.jsx)(n.a,{href:"/references#Baars1997-BAAITT-2",children:"[Baars, 1997]"}),",\nwhich was in turn inspired by the Blackboard Systems developed in AI in the late nineteen-sixties\n",(0,a.jsx)(n.a,{href:"/references#Engelmore:1988:BS",children:"[Engelmore and Morgan, 1988]"}),". The term Neuronal\nindicates that the GNW includes testable hypotheses about the neurophysiological implementation\nof a Global Workspace. Specifically, Dehaene, Changeux et al. ",(0,a.jsx)(n.a,{href:"/references#DehaeneStanislas2011TGNW",children:"[Dehaene et al., 2011]"}),",\nhave suggested that there exists a network of widely distributed excitatory neurons in the human\nbrain (called GNW neurons) with long-range axons that possess the ability to receive\nbottom-up information from and transmit top-down information to any of the modules at a lower\nlevel, thus selecting and broadcasting information. In addition, the GNW theory proposes the\nnotion of \u2018ignition\u2019 being a sudden, coherent, and exclusive activation of a subset of workspace\nneurons coding for the current conscious content, with the remainder of the workspace neurons\nbeing inhibited"]}),"\n",(0,a.jsxs)(n.p,{children:["To develop a computational cognitive architecture for modelling value awareness in AI, VALAWAI\nproposes to first operationalise the GNW by assuming that there is a distributed bottom layer\n(corresponding to layer C0 by  ",(0,a.jsx)(n.a,{href:"/references#DehaeneStanislas2011TGNW",children:"[Dehaene et al., 2011]"}),") of modules\n(known as agents in multiagent systems, MAS) that perform each a specific function, for example,\nface recognition, sentiment analysis, topic modelling, emotion detection, semantic frame extraction,\nvalue judgement, etc. (See image below). These modules operate autonomously in the sense that they use and\nproduce information encapsulated inside the module, i.e. hidden from other modules, and they\noperate in parallel. The modules function in a bottom-up fashion triggered by environmental or\ninternal input and they are potentially influenced by top-down contextual expectations and an\nattention system that focuses mental activity."]}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.img,{alt:"The global neural workspace model (GNW)",src:t(6831).Z+"",width:"1024",height:"945"})}),"\n",(0,a.jsxs)(n.p,{children:["This bottom layer is augmented with a second layer called the global workspace (corresponding\nto layer C1 in the model of ",(0,a.jsx)(n.a,{href:"/references#DehaeneStanislas2011TGNW",children:"[Dehaene et al., 2011]"}),"). The Global\nWorkspace enables information flow between modules and is governed by top-down and bottom-up loops.\nAs in the original Global Workspace model, we further assume there to be a winner-takes-all\ndynamics in which the outcome of the different modules gets driven, through a process of competition\nand selection, to reach a globally coherent hypothesis about the state of the world and the actions that\nneed to be taken in the world.\nThe global workspace can be operationalised in terms of a data structure in which various low-level\nmodules write or read information and a central supervisor that manages contradictory\ninformation flow and selects which hypotheses should receive more attention. This centralised\napproach was the basic idea of the Blackboard architectures in AI, named after the metaphor\nof writing on a blackboard (i.e. the central data structure). Alternatively, there could be a self-\norganising dynamical systems approach to information integration as proposed already in the\nDynamic Core hypothesis and Neuronal Group Selection theory of ",(0,a.jsx)(n.a,{href:"/references#RN58",children:"[Tononi and Edelman, 1998]"}),"."]})]})}function d(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},6831:(e,n,t)=>{t.d(n,{Z:()=>a});const a=t.p+"assets/images/gnw-c86118a15a1478469d4d358d580880fa.png"},1151:(e,n,t)=>{t.d(n,{Z:()=>s,a:()=>i});var a=t(7294);const o={},r=a.createContext(o);function i(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);