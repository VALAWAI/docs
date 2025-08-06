---
sidebar_position: 1
---

# Web User interface

The Master of VALAWAI (MOV) provides a web-based user interface, allowing you to 
interact with its full range of features through your browser. After 
[deployment](/docs/architecture/implementations/mov/deploy) , you can access the interface 
by navigating to [http://localhost:8080](http://localhost:8080).

The dashboard, shown below, is the first thing you'll see. It gives you a quick overview 
of the MOV's status.

![Master Of VALAWAI dashboard](/img/mov/dashboard.png)


## Navigating the UI

The main menu, located at the top-left or bottom of the page, organizes the MOV's functionalities 
into distinct sections.


### General

* Dachboard: Access the main dashboard to get a quick overview of the system's overall health.
* Settings: Configure MOV preferences and adjust system-level configurations.
* Help: Find documentation and support resources for using the MOV.

### Live Topology

This section is dedicated to monitoring the real-time status and activity of your running topologies.

- View Live status: See a graphical representation of your active topologies, including component 
health and connection states, to observe their dynamic behavior.
- Active components: Inspect the individual components that are currently active within the
topology managed by the MOV.
- Live connections: View the current status of the connections defined in the topology
managed by the MOV.
- Execution logs: Access real-time and historical logs collected by the MOV from live components.


### Design Topology

This is where you define, build, and manage your topology blueprints.

- Editor:  A graphical tool that allows you to create new topology designs or modify existing ones.
- Defined Topologies: Search, view, and manage all your saved topology blueprints.
- Component Library: Explore and modify the types of components available for your topology designs. 
You also have the option to import new components from the official 
[VALAWAI GitHub](https://github.com/VALAWAI) repository.


## Deeper Dives

For more detailed information on specific functionalities, refer to these dedicated sections:

* [Live Topology](/docs/architecture/implementations/mov/wui/live): A comprehensive guide 
to interacting with the live topologies managed by the MOV.

* [Topology Designer](/docs/architecture/implementations/mov/wui/design): A detailed explanation 
of how to define and design topologies for execution.

* [HTTP API](/docs/architecture/implementations/mov/wui/api): Describes the programmatic interface 
for interacting with the MOV, which is useful for automation and integration.
