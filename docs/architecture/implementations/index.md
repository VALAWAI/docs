---
sidebar_position: 4
---

# Implementations

In the previous section, we described the [VALAWAI value awareness architecture](/docs/architecture/value_awareness_architecture),
outlining the core components and their interactions.  This section delves into 
the specific implementations of this architecture developed within the VALAWAI 
project.  These implementations provide concrete examples of how the abstract 
architecture can be realized in practice, each with its own strengths and target 
use cases.  Understanding these different implementations is crucial for choosing 
the right approach for a given value-aware AI application.

The following subsections provide detailed information about each implementation:

*   **[Component Definition](/docs/architecture/implementations/component):** 
This section serves as a developer guide, detailing how a VALAWAI component should 
be defined and structured.  It outlines the required interfaces, data formats, 
and communication protocols that components must adhere to in order to be seamlessly 
integrated into the VALAWAI ecosystem.  This standardization ensures interoperability 
and reusability of components across different implementations and projects.  
The section also provides best practices and examples for component development, f
acilitating the creation of robust and efficient components.

*   **[Master of VALAWAI (Centralized Implementation)](/docs/architecture/implementations/master):** 
This section describes a centralized implementation of the VALAWAI architecture, named "Master of VALAWAI."  
It focuses on using RabbitMQ as the central communication backbone between all components.  
This approach offers several advantages, including robust message queuing, reliable delivery, 
and centralized management of communication. The section explains how the different layers 
(C0, C1, C2) are instantiated as separate services communicating through RabbitMQ.  
It also discusses the benefits and limitations of this centralized approach, such 
as its suitability for complex systems with many interacting components but potential single 
points of failure.

*   **[Robot Operating System (ROS 2) Implementation](/docs/architecture/implementations/ros2):** 
This section describes an implementation of the VALAWAI architecture using the Robot Operating 
System (ROS 2).  ROS 2 is a widely used framework for robotics development, providing tools and 
libraries for communication, control, and simulation.  This implementation leverages the capabilities 
of ROS 2 to deploy VALAWAI in robotic environments.  The section explains how ROS 2 topics and services
are used to implement the communication and control flow between the different layers of the VALAWAI
architecture.  It also showcases how this implementation can be used to build value-aware robots
that can interact with humans and make decisions aligned with ethical guidelines.  This section 
highlights the advantages of using ROS 2 for robotics applications, such as its support for real-time 
performance and its extensive ecosystem of robotics tools.