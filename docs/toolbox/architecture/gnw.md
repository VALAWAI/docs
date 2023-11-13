---
sidebar_position: 1
---

# The Global Neuronal Workspace (GNW)

The Global Neuronal Workspace (GNW) model was originally proposed by Stanislas Dehaene
and Jean-Pierre Changeux [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW) and inspired
by the earlier Global Workspace model (GW) of Baars [[Baars, 1997]](/references#Baars1997-BAAITT-2),
which was in turn inspired by the Blackboard Systems developed in AI in the late nineteen-sixties
[[Engelmore and Morgan, 1988]](/references#Engelmore:1988:BS). The term Neuronal
indicates that the GNW includes testable hypotheses about the neurophysiological implementation
 of a Global Workspace. Specifically, Dehaene, Changeux et al. [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW),
have suggested that there exists a network of widely distributed excitatory neurons in the human
 brain (called GNW neurons) with long-range axons that possess the ability to receive
bottom-up information from and transmit top-down information to any of the modules at a lower
level, thus selecting and broadcasting information. In addition, the GNW theory proposes the
notion of ‘ignition’ being a sudden, coherent, and exclusive activation of a subset of workspace
neurons coding for the current conscious content, with the remainder of the workspace neurons
being inhibited

To develop a computational cognitive architecture for modelling value awareness in AI, VALAWAI
proposes to first operationalise the GNW by assuming that there is a distributed bottom layer
(corresponding to layer C0 by  [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW)) of modules
(known as agents in multiagent systems, MAS) that perform each a specific function, for example,
face recognition, sentiment analysis, topic modelling, emotion detection, semantic frame extraction,
value judgement, etc. (See image below). These modules operate autonomously in the sense that they use and
produce information encapsulated inside the module, i.e. hidden from other modules, and they
operate in parallel. The modules function in a bottom-up fashion triggered by environmental or
internal input and they are potentially influenced by top-down contextual expectations and an
attention system that focuses mental activity.


![The global neural workspace model (GNW)](/img/toolbox/gnw.png)


This bottom layer is augmented with a second layer called the global workspace (corresponding
to layer C1 in the model of [[Dehaene et al., 2011]](/references#DehaeneStanislas2011TGNW)). The Global
Workspace enables information flow between modules and is governed by top-down and bottom-up loops.
As in the original Global Workspace model, we further assume there to be a winner-takes-all 
dynamics in which the outcome of the different modules gets driven, through a process of competition
and selection, to reach a globally coherent hypothesis about the state of the world and the actions that
need to be taken in the world.
The global workspace can be operationalised in terms of a data structure in which various low-level
modules write or read information and a central supervisor that manages contradictory
information flow and selects which hypotheses should receive more attention. This centralised
approach was the basic idea of the Blackboard architectures in AI, named after the metaphor
of writing on a blackboard (i.e. the central data structure). Alternatively, there could be a self-
organising dynamical systems approach to information integration as proposed already in the
Dynamic Core hypothesis and Neuronal Group Selection theory of [[Tononi and Edelman, 1998]](/references#RN58).

