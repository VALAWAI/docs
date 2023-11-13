---
sidebar_position: 2
---

# social robots

For the social robotics use case, several different scenarios will be studied. However,
as an illustrative and comprehensive case, we will consider the value of **discretion**.
For example, a robot in the home has access to some knowledge about an inhabitant of the house
or a visitor to the house and needs to decide whether or not to share this information.
In this case, for the robot to be value aware we need to implement a system that can tell
if a piece of information should be kept confidential and for whom it should be kept confidential.
This will require the robot to assess the consequences of sharing information, and based
on this divulge part of or all of the information it holds to selected users.
The system will make this decision based on the values it aligns with.
In particular, the system will be assumed to operate in a domestic environment
and will be familiar with all inhabitants of the home and their interpersonal relationships.


## Main aim

To achieve this, the effort will be focused on an embodied application, i.e. the robot is an AI
system situated in the dynamic and temporal social and physical reality, connected to the environment
through sensors and possibly able to take social and physical actions in the environment.
It is worth noting that in this instance the frame of reference for keeping information confidential
is **typical behaviour** as implemented by the rules in the system.


## Users

The users of the system will be people living in the house or visiting the house.


## Description

The system will be an application with an interactive embodied interface, for example,
a social robot such as the Furhat Robotics interactive robot.
The application will play the role of a robot that has been living in a home with
a family for a certain amount of time and has knowledge of the inhabitants, their relationship,
the layout of the house and various activities that occur in and out of the home.
Users will interact with the robot through verbal and non-verbal modalities.
The system will produce answers based on stored data and previous interactions and can,
if required, take actions in the social domain -- displaying non-verbal behaviour,
such as nodding or closing eyes.
When formulating responses or selecting actions, the C2 component will check the correct
alignment with the memorised values.


## User input

The users will predominantly interact with the application via a voice interface, although
the robot will have access to other modalities to build situational awareness of the physical
and social environment.


## Output

The system will initially respond to requests by the users, following a transactional model
of interaction. In our illustrative example, the robot's responses will be tailored to align
with the values contained within the robot's value system. If the requested information is deemed
sensitive, and depending on the recipient of the information, the robot can choose to reformulate
or withhold information. Later versions of the use case will explore unconstrained conversations
with the robot, rather than transactional interactions.
