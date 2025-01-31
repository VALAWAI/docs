---
sidebar_position: 2
---

# Master of VALAWAI (MOV)

In the previous section, we detailed [VALAWAI's value awareness architecture](/docs/architecture/value_awareness_architecture),
focusing on a centralized implementation known as the Master Of VALAWAI (MOV). 
This innovative architecture is designed to optimize real-time interactions, 
providing a robust framework for seamless communication between distributed 
components across the C0, C1, and C2 layers. By centralizing all interactions 
through the MOV component, the architecture promotes both efficiency and 
reliability.  The communication flow within this centralized architecture 
is illustrated in the following figure.

![The value compatibility calculator component](/img/toolbox/mov_schema.png)

This diagram shows how different components across the C0, C1, and C2 layers 
interact with the MOV.  All communication is mediated by the MOV, which acts 
as a central message broker and decision-maker. This centralized approach 
simplifies system design and management, but it also introduces a single point 
of failure.

In this architecture, interactions among components are facilitated through
a publisher/subscriber pattern. The MOV functions as a central hub, orchestrating 
the communication flow and maintaining the overall topology of the system. This 
central role not only ensures reliability in message transmission but also promotes 
dynamic interaction capabilities. Each component remains isolated from the internal 
workings of others, fostering modularity and simplifying integration tasks.

To facilitate communication, components exchange messages through a message broker, 
such as RabbitMQ. The MOV is charged with the responsibility of routing these messages 
to their designated destinations based on the system's current topology. In practice, 
this involves the MOV subscribing to all relevant channels utilized by components for 
message publication. When a component publishes a message, the MOV assesses the topology 
and determines whether the message should also be forwarded to other components' channels. 
This capability greatly enhances the independence of each component, allowing them to 
function without needing to know the specifics of other components' implementations.

When a component is first activated, it begins the registration process by sending 
a message to the MOV. This registration message contains crucial information about 
the component, such as its type, name, version number, and the AsyncAPI documentation 
that outlines the specific services it offers. This process is essential for the MOV, 
which validates the accuracy and completeness of the incoming data. If the MOV confirms 
that the information is valid, it automatically establishes all possible connections 
for the new component with other registered components, aligning with the defined 
topology.

To create connections between two components effectively, the MOV performs a compatibility 
check. It verifies that the schema of the message published by the source component aligns 
with the subscription schema required by the target component. In instances where the connection 
involves components of different types, MOV takes the initiative to enable this connection, 
ensuring interoperability between diverse components. Additionally, it evaluates whether 
it should receive notifications during the registration process. If the newly registered 
component is classified as type C2, the MOV further checks if the component's specification 
includes a subscription message that can accept messages published on any established connections. 
Should this be the case, the MOV is tasked with notifying the component on its designated 
channel whenever a message is transmitted through that connection.

On the other hand, when a component decides to shut down or exit the system, it must notify t
he MOV to unregister. Once the MOV receives this message, it systematically removes all 
connections between the unregistered component and any other registered components, ensuring 
a clean disassociation from the network topology. This clean-up process is crucial for maintaining 
the integrity and reliability of the communication framework.

To effectively carry out these functions, the MOV relies on a comprehensive database that 
contains vital information regarding the components and their associated connections. 
This database enables components to inquire about registered entities and the established 
connections among them. Furthermore, it allows the MOV to provide real-time status updates 
regarding the components and their connections, enhancing system transparency and operational 
oversight.

In summary, the MOV component plays a pivotal role as the coordinator within the VALAWAI 
architecture, ensuring that real-time interactions are conducted seamlessly and efficiently. 
By enabling dynamic communication among all components while allowing them to remain independent, 
this design significantly boosts the architecture's modularity. It also simplifies the process 
of integrating new components into the system, making the ecosystem adaptable and resilient.

Crucially, it is important to note that the term "centralized" in this context does not imply 
that all components must operate on a single host. Instead, the adoption of RabbitMQ facilitates 
the distribution of components across various hosts, utilizing RabbitMQ's inherently distributed 
architecture. This capability empowers different components to operate on separate machines 
while maintaining continuous and seamless communication with one another.

Since all messages are routed through the MOV, it becomes entirely feasible for the components 
responsible for sending or receiving messages to be distributed across various servers. 
This strategic arrangement results in what can be described as a hybrid system that integrates 
both distributed and centralized characteristics, effectively combining the benefits of both 
architectures.

In light of this sophisticated distributed system architecture, we enhance the ability of 
components to dynamically interact while maintaining their independence, which is crucial 
for the performance and scalability of modern real-time applications. This design choice 
ultimately supports a robust and agile operational framework for the VALAWAI architecture.
