---
sidebar_position: 2
---

# Design a topology

This section of the documentation describes how you can use the MOV to define the topology
that it has to manage. 


## Editor

The MOV editor allows you to graphically define a topology that the MOV has to follow instead
to automatic build it when the components are registered. You can create a graph where nodes 
represent components and edges represent the allowed connections between them. As you can see 
on the next image.

![An empty Topology editor](/img/mov/topology_editor_wp5_simple_example.png)

The editor is composed of several key parts:

* **The Canvas**: The main gray area where you define your topology. This is where you'll 
arrange and connect your components.
* **The Palette**: Located on the center-left, this section contains a set of draggable 
boxes (labeled C0, C1, C2, etc.) that you use to add new components to the canvas.
* **The Form**: On the right side of the screen, the form displays the properties of 
the currently selected component. You can use this to modify its attributes, such as its name 
or configuration settings.
* **The Toolbox**: Positioned at the top-right, this toolbar contains icons for various 
actions, such as zoom in/out, undoing, or open a menu.

The editor automatically saves your work at regular intervals, so you don't have to worry 
about losing your progress. In the next section, we'll explore each of these elements 
in more detail.


### Canvas

The canvas is the main part of the editor where you can create and connect components. Yiu can use 
the  palette or the menu to add a node to the canvas. after that you must select the component,
select the defined component that it represnts and on the bottom add a endpoint to be used a source of a connection. Then if oyu chick over the corner right of the endpoint you start to define a new connection that has to land or a component or in another end point. In the case of the node if it finds a compatible
endpoint it automatically make the conneciton if only exist a posible endpoint or found a compatible one, Otherwise it asked to choose one and if any is compatible it discarded the connection.
If you select and endpoint that connection is created. Otherwise the connection is discarded.


### Palette

### Toolbox


The last one (![More icon](/img/material/more_vert.svg)) to open a menu.do over
On the middle left you can see three boxes 
with the labels C0, C1 and C2 that is called the palette. On the top right you can see some 
icons that form the toolbar. The main part of the image is the canvas where you are going to define the topology and in the right will appear the form to change the 



### Edit topology properties


The name and the description.


### Edit a component

The component definition to use teh position and the end points of the component


### Edit a connection

The source of the conection the target of the connection

Enable disable notifications

### Settings

auto save time
max number of components


## Manage defined topologies

search topoogies, edit or remove

## Manage components library

Searhc for components view edit delete them

## Update components library

image of the update
and the process can take a whhile

