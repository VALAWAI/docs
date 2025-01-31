---
sidebar_position: 3
---

# Robot Operating System (ROS2)


ROS 2 ([[Macenski, Foote, Gerkey, Lalancette, & Woodall, 2022]](/references#ROS2))
is a powerful, open-source framework for developing robotic systems.  It builds 
upon the original ROS framework, incorporating significant enhancements such as 
real-time control capabilities, improved security, and native support for multi-robot 
systems.  ROS 2 leverages a Data Distribution Service (DDS)-based middleware for 
communication between distributed components, promoting scalability and robustness 
in complex robotic environments.  Its modular design and rich ecosystem of tools 
and libraries make it well-suited for developing sophisticated autonomous systems, 
particularly in robotics.

For this project, ROS 2 is a natural fit due to its strong focus on robotics. 
It provides a comprehensive suite of libraries and tools specifically designed 
to manage the intricate aspects of robotic systems, including inter-component 
communication, sensor integration, and coordinated control.  Choosing ROS 2 not 
only allows us to leverage these existing resources but also positions us to 
contribute back to the community.  A key area of potential contribution lies 
in enhancing relevant packages, such as ROS4HRI ([[Mohamed & Lemaignan, 2021]](/references#ROS2-mohamed)), 
which focuses on human-robot interaction, and aligning it with the specific 
needs of our project.

The functionalities provided by the Master Of VALAWAI (MOV) implementation within
a centralized architecture can be effectively replicated within the ROS 2 framework.
ROS 2 offers equivalent mechanisms for communication, coordination, and data flow 
between VALAWAI components, ensuring seamless interoperability across all system 
layers.  The following sections detail how each capability of MOV is addressed 
within the ROS 2 framework

## Reliable Communication

ROS 2 leverages a Data Distribution Service (DDS) middleware designed for real-time, 
low-latency communication. This ensures reliable data transmission between components, 
even in dynamic environments, similar to the role of RabbitMQ in MOV.  ROS 2 supports 
both publish-subscribe and service-based communication patterns, catering to the diverse 
communication needs of VALAWAI components.

## Component Registration and Discovery

In ROS 2, components (nodes) are automatically registered upon launch.  A decentralized 
discovery mechanism, facilitated by the DDS middleware, allows each node to advertise 
its capabilities (topics, services, etc.) to the system. This automatic registration 
eliminates the need for manual intervention, simplifying component management.

## Registration Notification

ROS 2's publish-subscribe model enables automatic notification of new node registrations. 
When a node joins the system, it can publish messages announcing its presence and 
capabilities, informing other interested nodes.

## Component Unregistration

ROS 2 automatically unregisters components when they are shut down. The middleware
handles the cleanup, removing references to the terminated node from the discovery tables. 
This automatic deregistration simplifies system management compared to MOV, where manual 
unregistration might be required.

## Message Flow Notification

ROS 2's middleware efficiently handles message routing.  Tools like `ros2 topic echo`
and `ros2 topic list` provide mechanisms to monitor and log messages, offering visibility
into system communication and mirroring MOV's message flow tracking capabilities.

## Component Querying

ROS 2 provides straightforward mechanisms for querying registered components.  
Command-line tools like `ros2 node list`, `ros2 topic list`, and `ros2 service list`
allow developers to easily inspect the available nodes, topics, and services. 
This functionality mirrors MOV's component querying system.

## Topology Connection Creation

In ROS 2, topology connections are dynamically established when publishers and subscribers
are defined for the same topic. This dynamic connection establishment simplifies 
inter-component communication compared to MOV's explicit configuration.

## Topology Connection Modification

ROS 2 allows for dynamic modification of topology connections through runtime remapping
of topics, services, and parameters. This flexibility enables components to adapt to 
changing communication needs without requiring system restarts, providing a more dynamic
approach than MOV's topology modification capabilities.

## Topology Connection Querying

ROS 2 offers tools like `rqt_graph`, `ros2 topic info`, and `ros2 node info` for visualizing
the system topology and inspecting active connections. These tools provide a clear 
and interactive view of component relationships, analogous to MOV's topology querying 
mechanisms.

## Logging

ROS 2 incorporates a comprehensive logging framework, enabling developers to track 
system behavior and events at various log levels (debug, info, warning, error).  
Centralized logging facilitates easy access and analysis, providing a robust logging 
system comparable to MOV's.

## User Interface

ROS 2 supports diverse user interfaces, including command-line tools, graphical interfaces
like `rqt`, and custom interfaces built using ROSBridge. This flexibility empowers developers
to interact with the system at multiple levels, from debugging and visualization to 
real-time monitoring, similar to MOV's centralized UI.

## Deployment

ROS 2 offers strong support for deploying modular systems, including the ability to 
distribute nodes across multiple machines. Tools like Docker and ros2 launch facilitate 
coordinated launching and management of system components.  Containerization with Docker 
further simplifies deployment in isolated environments, aligning with MOV's deployment 
mechanisms.

## Conclusions

Both MOV and ROS 2 offer robust frameworks for building modular and distributed systems. 
However, ROS 2's inherent support for robotics, coupled with its dynamic communication 
capabilities, decentralized architecture, and extensive tooling, makes it a compelling 
alternative to MOV.  ROS 2 provides a more flexible and scalable solution for complex 
robotic applications, potentially replacing MOV while retaining and enhancing the core 
modularity and communication features.
