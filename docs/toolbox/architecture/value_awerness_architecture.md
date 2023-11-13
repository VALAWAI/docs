---
sidebar_position: 4
---

# VALAWAI's value awareness architecture

The VALAWAI architecture is divided into three layers, the C0, C1 and C2 layers.

The C0 layer contains components are the components that are concerned with information extraction
and task execution. They process the world and forward this information to the C1 components.
Their tasks will depend on the application, but some examples are components for face recognition, 
sentiment analysis, topic modelling, emotion recognition, etc. Many of these modules can already be
found on the AI on Demand (AIoD) platform (the successor to the [AI4EU platform](https://aiondemand.readthedocs.io/en/latest/))
and VALAWAI's focus will be on the integration of existing modules into the VALAWAI architecture,
along with the development of C0 components when needed.

The C1 layer contains components that are responsibles for integrating and analysing the information coming
from C0 components and making decisions accordingly. Unlike C0 components, we believe C1 components
that are ready to be reused will be minimal, as the functionality of these components heavily depends
on each pilot scenario. 

The C2 is the reflective layer analysing the value alignment of behaviour. These components constitute
the main novelty of VALAWAI, and it is here that the reasoning with values will manifest, requiring
capabilities such as value acquisition, value representation and reasoning, value-alignment mechanisms
and value-driven explainability. These components may influence this behaviour by:

 * directly modifying a system’s behaviour through:
   * modifying the internal behaviour of C0 and C1 components
   * modifying the topology between C0 and C1 components
 * indirectly modifying a system’s behaviour through providing feedback to C1 components that raises
  value awareness, with the idea that being value aware impacts behaviour.

This subsection presents the VALAWAI architecture by modelling the components of each layer and
the communication channels amongst them. However, since modelling the entire VALAWAI architecture
suffers from a lack of readability and clarity due to the increased number of communication channels
linking components, we present next each type of communication separately. 

First and foremost, we separate between data flow (represented through single-line arrows) and control
flow (represented through double-line arrows). Data flow describes the flow of information between components,
such as having a C0 component informing a C1 component of the detection of hate speech in a given text. Control
flow is the communication that allows for control over other entities, such as having a C1 component updating
the parameters of the adapter module that tunes the pretrained language model (PrLM) of the C0 component that
is responsible for detecting hate speech. This results in influencing the behaviour of the C0 component. Control,
however, is not only over other system components. Control may also happen over the topology itself. For example,
a C2 component may decide that a C1 component should switch from relying on one C0 component that detects hate
speech to another C0 component that incorporates users' feedback to adapt what is considered hate speech.
This may be implemented by disconnecting C1 from the first C0 component and connecting it to the second.
Control may also happen over the real-world. For example, a C0 component may act upon the real-world
by suspending a human user from a community for a given period of time because of its use of hate speech.
Of course, for one component to have control over a given entity (be it another system component,
the system topology, or the real-world), it first requires a representation of that entity to understand
its behaviour and how that behaviour may be modified. For example, for a C1 component to update the parameters
of the adapter module of a C0 component, that C1 component should first have the knowledge about the parameters
that define C0's behaviour.  This may be achieved, for example, by having C0 share its representation with C1.
Similarly, for a C2 component to update the topology, the C2 component should be capable of reading and
understanding the topology. For this reason, most control flow in this deliverable is represented through
bidirectional arrows, even when control is in one direction only.  

In what follows, we present the VALAWAI architecture by separating between data flow and control flow,
as well as separating between the different types of control flow.   
The architecture presented (see Figures ref fig:arch-data fig:arch-world) illustrates that
the C2 layer may have more than one C2 component, the C1 layer may have more than one C1 component, and
the C0 layer may have more than one C0 component (be it sensors or actuators, as we explain shortly).
We argue that, unlike the GNW, complex processing systems are not needed at the C0 layer, and we leave
this task to the C1 layer. As such, C0 components may either be sensors or actuators. More complex behaviour,
if deemed necessary, may be constructed by connecting C0 components through the data flow communication channels. 


## Data Flow

Figure ref fig:arch-data presents the data flow between components. 
Each component may communicate with other components at the same layer as well as with components at other layers. In other words, C2 components may communicate amongst themselves; for example, to share their reflection over the behaviour, and possibly to try to reach agreements over the results of their value-driven reasoning. They may communicate with C1 components; for example, to provide feedback to a C1 component on value alignment, resulting in raising value awareness at C1. They may also communicate with C0 components; for example, to receive information from a C0 component about relevant values. C1 components may also communicate amongst themselves; for example, to collaborate on decision making. They may also communicate with C0 components; for example, to receive from a C0 component the extracted features describing the world or to send information to a C0 component about which actions to perform next. C0 components may communicate amongst themselves as well; for example, to allow them to agree amongst themselves which extracted features may prevail and will later need to be shared with C1.  

In general, allowing components on the same layer to communicate amongst themselves opens the door to self-organisation and attention focusing, which is especially needed at the C1 and C2 layers. However, whether self-organisation and attention focusing is centralised or not is an implementation choice that we will analyse and make a decision on in future deliverables.  

%The only missing data link is between C2 and C0 components. We believe there is no need for C2 components reflecting on behaviour to directly communicate with C0 components. If needed, we argue that communication between C2 and C0 may happen indirectly through C1 components.



## Control Flow: Control over system components

Figure ref fig:arch-components presents the control over system components. 
We argue that C1 components, which are concerned with decision making, may have control over C0 components, allowing them to tune their behaviour as needed. Furthermore, C2 components that reflect on values and value alignment may also tune the functionalities of both C1 and C0 components to ensure value alignment. For the time being, we believe components on the same level should not control each other's behaviour, because self-organisation and attention focusing at each layer (especially the C1 and C2 layers) can be achieved through the data flow at that layer. 

In summary, components may only control those in the layers below them. This raises the question, how do C2 components evolve? That is, who has control over C2 components? Since C2 components are concerned with reasoning with human values, their behaviour is dictated by those values. Control over C2 components is achieved by controlling the values deemed relevant. We argue that this is purely a decision for humans to make. For the time being, we leave the selection/specification of the preferred value systems to be done manually, offline. In the future, we may investigate having users directly influence the relevant value system.  


![The VALAWAI architecture and the data flow](/img/toolbox/rgnw-arch-data.png)

![The VALAWAI architecture and the control flow over system components](/img/toolbox/rgnw-arch-control-comp.png)

![The VALAWAI architecture and the control flow over the topology](/img/toolbox/rgnw-arch-control-topology.png)

![The VALAWAI architecture and the control flow over the real world](/img/toolbox/rgnw-arch-control-world.png)


## Control Flow: Control over the topology

Figure ref fig:arch-top presents the control over the topology. 
For C2 components to have control over the behaviour of C1 and C0 components, an alternative approach is to control the topology between those components, allowing activating/inhibiting the data communication between them. 

We argue that data flow from/to C2 components, however, should not be affected. This is because we believe communication with the components that reflect on values should be open to all.



## Control Flow: Control over the world

Figure ref fig:arch-world presents the control over the world. 
Control over the world is manifested by having sensors at C0 observing the real world and registering their observations to be later shared with C1 (represented by the incoming control arrows), and having actuators at C0 performing actions in the real world (represented by the outgoing control arrow). 

This is the only possible interaction with the real world, and it can only happen through C0 components: C2 and C1 components may only impact the world through C0.

## Component

![The global neural workspace model (GNW)](/img/toolbox/component.png)

The image above illustrates the generic architecture for a system component. There are different component
types depending on their layer. The C$i$ tag specifies the component's type: C$i \in$ \{C0, C1, C2\}. 
Each component has a set of parameters that define and describe its behaviour. These are the parameters
presented at the top of the component in the previous image. Finally, there is the interaction
with the environment, both within and outside the system. 

The interaction with the environment falls into two main categories: 1) a component may communicate
with other system components, and 2) a component may have control over the behaviour of its environment
and/or have its own behaviour subject to the control of other system components. 

The first interaction type, the data flow between components, is represented by the single arrows
on the side of the component in the previous image. Communication is only possible with other
system components: the C$j$ tag represents the type of components to/from which data flow is allowed.

The second interaction type, the control of system components over each other and their environment,
is represented by double-lined arrows. The arrow incoming into a component's parameters at the top
of the component represents the power of controlling the behaviour of this component, which is achieved
by being able to modify the parameters that shape its behaviour. As illustrated in the previous image
, only a system component may control the behaviour of another system component. Furthermore, this double
arrow is bidirectional because any component that has control over another component should also be aware
of that component and its behaviour. This can be understood as the controlling component having a representation
of the other component's parameters. 

A system component, however, does not exclusively control other system components. The outgoing double-lined
arrow at the bottom of the component of the previous image illustrates that a component is capable
of controlling three different entity types: 1) other system components, represented by the C$j$ tag;
2) the topology of the system that links different components and contributes to the behaviour of that system,
represented by the data flow arrow; and 3) the environment outside that system, represented by a cloud that stands
for the real world. In all cases, a component controls other entities through some  **control parameters**.
For example, to control a robotic arm's movement, a system component may set the distance, speed, and displacement
parameters describing the arm's movement according to its requirements. To change a system's topology, parameters
that add or delete data flow links may be introduced. Again, the double-lined arrow representing the control
flow is also bidirectional here because controlling other entities requires being aware of those entities
and the parameters that define their behaviour.

## C0 component

The C0 layer is the  **information extraction**  layer, and C0 components are the components in touch with
the physical world. They extract information about that world through sensors, and they act upon that world 
through actuators. A set of parameters defines the behaviour of C0 components.

![The architecture of C0 components as sensor](/img/toolbox/componentC0_S.png)

A C0 component may be of two types, a sensor (see previous image) or an actuator (see next image).
More advanced components at C0 may also be imagined, such as having components that interpret sensory information
or interpret actuation commands, for example, the detection of sentiment in a linguistic utterance or a command
to execute a robot motion plan. 

![The architecture of C0 components as actuator](/img/toolbox/componentC0_A.png)


## C1 component

The C1 layer is the  **information integration**  layer, and C1 components are the decision making components
whose reasoning is based on processing information coming from C0 components. They observe the information
coming from level C0, they reason about this information and take decisions accordingly. A set of norms
defines the behaviour of C1 components (see next image). 

![The architecture of C1 components](/img/toolbox/componentC1.png)

## C2 component

C2 components are the components responsible for reflection. In VALAWAI, reflection is value driven. And hence,
it is the set of  **values**  that constitute C2 components' parameters, that is, the behaviour of C2 components
is driven by values (see next image). We must note however that the architecture is generic enough to be applied
for reflection driven by factors other than values. 

![The architecture of C2 components](/img/toolbox/componentC2.png)

