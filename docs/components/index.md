---
sidebar_position: 3
---

# Components

The components defined in the [RGNW toolbox](/docs/architecture/value_awareness_architecture)
 fall into three categories:

 - [C0 Components](/docs/components/C0): These components handle information extraction and
 task execution. They process data from the environment, forward this information to the C1
 components, and receive actions from C1 components to modify the environment. See the 
 [C0 components](/docs/components/C0) documentation for more details.

 - [C1 Components](/docs/components/C1): These components are responsible for integrating 
 and analyzing the information received from the C0 components and making decisions based 
 on that analysis. See the [C1 components](/docs/components/C1) documentation for more details.

 - [C2 Components](/docs/components/C2): This reflective layer analyzes the value alignment 
 of behavior. These components are a key innovation of VALAWAI, and they are where value-based 
 reasoning takes place. This involves capabilities such as value acquisition, value representation 
 and reasoning, value alignment mechanisms, and value-driven explainability. See the [C2 components](/docs/components/C2)
 documentation for more details.
