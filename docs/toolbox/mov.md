---
sidebar_position: 3
---

# Master of VALAWAI

The main objective of the Master of VALAWAI (MOV) is to provide the most efficient
possible interactions for real-time scenarios for the VALAWAI architecture.
In this implementation, all the components, whether they are on layers C0,
C1 or C2, interact with the MOV , as illustrated in the next image. 
This component interacts with others using a publisher/subscriber pattern,
and it is responsible for maintaining the topology and guaranteeing communication
between the components. 

![The value compatibility calculator component](/img/toolbox/mov_schema.png)

