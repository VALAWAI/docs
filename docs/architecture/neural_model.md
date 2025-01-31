---
sidebar_position: 1
---

# Neural Models

The VALAWAI project draws inspiration from the Global Neuronal Workspace (GNW)
and Reflective Global Neuronal Workspace (RGNW) models. This section introduces
these models to provide context for the principles guiding the development of
the VALAWAI architecture.

## The Global Neuronal Workspace (GNW)

The Global Neuronal Workspace (GNW) model, originally proposed by Stanislas Dehaene
and Jean-Pierre Changeux [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW),
builds upon the earlier Global Workspace model (GW) of Baars [[Baars, 1997]](/references#Baars1997-BAAITT-2),
which itself was inspired by Blackboard Systems developed in AI in the late 1960s
[[Engelmore and Morgan, 1988]](/references#Engelmore:1988:BS). The term "Neuronal"
signifies that the GNW incorporates testable hypotheses about the neurophysiological
implementation of a Global Workspace. Dehaene, Changeux, et al. [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW)
suggest the existence of a network of widely distributed excitatory neurons in
the human brain (GNW neurons) with long-range axons. These axons can receive bottom-up 
information from and transmit top-down information to lower-level modules, enabling 
information selection and broadcasting.  The GNW theory also proposes the concept of 
"ignition," defined as a sudden, coherent, and exclusive activation of a subset of 
workspace neurons coding for the current conscious content, while the remaining 
workspace neurons are inhibited.

For the development of a computational cognitive architecture for modeling value 
awareness in AI, VALAWAI operationalizes the GNW by assuming a distributed bottom 
layer (corresponding to layer C0 in [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW)) 
of modules (agents in multi-agent systems, MAS). Each module performs a specific function, 
such as face recognition, sentiment analysis, topic modeling, emotion detection, semantic 
frame extraction, or value judgment.  These modules operate autonomously, using and 
producing information encapsulated within the module (hidden from other modules), and 
they operate in parallel.  Their bottom-up function is triggered by environmental or 
internal input, and they are potentially influenced by top-down contextual expectations 
and an attention system that focuses mental activity.

![The global neural workspace model (GNW)](/img/toolbox/gnw.png)

This bottom layer is augmented by a second layer, the global workspace (corresponding 
to layer C1 in [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW)). The global 
workspace facilitates information flow between modules and is governed by top-down and 
bottom-up loops.  Similar to the original Global Workspace model, VALAWAI assumes a 
winner-takes-all dynamic in which the outputs of different modules compete and are selected 
to reach a globally coherent hypothesis about the state of the world and necessary actions.

The global workspace can be operationalized as a data structure where low-level modules 
write and read information, along with a central supervisor that manages contradictory 
information flow and selects which hypotheses receive more attention. This centralized 
approach echoes the Blackboard architectures in AI, named after the metaphor of writing 
on a blackboard (the central data structure).  Alternatively, a self-organizing dynamical 
systems approach to information integration could be used, as proposed in the Dynamic Core 
hypothesis and Neuronal Group Selection theory of [[Tononi and Edelman, 1998]](/references#RN58).

## The Reflective Global Neuronal Workspace (RGNW)

To incorporate value awareness into the GNW model, VALAWAI introduces a reflective layer. 
The original GNW model addresses how the distributed cognitive processing in the workspace 
converges on a unified situation description and how decisions are subsequently made. However, 
consciousness also involves reflection and meta-level reasoning. This dual processing nature 
is evident in moral judgment, which involves both direct intuitive judgment and rational 
symbolic decision-making [[Haidt, 2013]](/references#haidt_2013).  Neuro-imaging studies 
have also confirmed this dual processing [[Greene et al., 2001]](/references#greene2001fmri).

Processing at layers C0 (information extraction) and C1 (information integration) is often 
termed primary consciousness and relates to Kahneman's "fast intuitive decision-making" (System 1). 
Processing at layer C2 is often referred to as higher-order consciousness and relates to 
Kahneman's "slow decision-making" (System 2). VALAWAI addresses the reflective aspect of 
consciousness by including a meta-layer (corresponding to layer C2), which monitors activity 
at C1 and engages in deliberation. The outcome of this deliberation can then be injected back 
into C1 through re-entrant processing. This approach is similar to the cognitive architecture 
for robot consciousness proposed by [[Chella et al., 2008]](/references#chella2008cognitive).  
VALAWAI's focus is on C2 components that reflect specifically on values. The technical capabilities 
described earlier will form the capabilities of these C2 components, and the achievements of 
value-awareness will manifest through C2's interaction with C1 and C0.

![The reflective global neural workspace model (RGNW)](/img/toolbox/rgnw.png)
