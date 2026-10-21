---
sidebar_position: 4
---

# Technology Readiness Level (TRL)

The **Patient Treatment UI** is a web-based C0 component developed for the VALAWAI project's
medical protocol demonstrator. It simulates clinician interactions for patient management,
personalized treatment planning, and outcome monitoring, illustrating the potential of the
VALAWAI architecture in healthcare environments. Operating as both a sensor and an actuator
within a simulated environment, the component relies exclusively on synthetic or thoroughly
anonymized data rather than real patient information to maintain strict privacy standards
while demonstrating core system capabilities.

Given its current stage, the Patient Treatment UI is classified at **TRL 3: 
Analytical and experimental critical function and/or characteristic proof-of-concept**.
This rating reflects its successful unit-level validation in controlled laboratory settings
and high-profile demonstrations, where its foundational capabilities were verified using
internal simulations.

To advance to **TRL 4: Component and/or breadboard validation in a laboratory environment**,
the component must transition from standalone simulation to basic system-level integration.
Key requirements for reaching
TRL 4 include:

* **API & Protocol Integration:** Establishing stable AsyncAPI communication protocols and
interfaces to enable direct, seamless interactions with C1 decision-making components
(such as the NIT Protocol Manager) and C2 reflective modules (such as treatment valuators).

* **Realistic Data Representation:** Employing controlled, representative synthetic data
that accurately mirrors the structure, volume, and complexity of actual clinical records
to bypass data-privacy barriers during initial testing.

* **Laboratory Integration Testing:** Conducting end-to-end integration tests within a
"breadboard" laboratory setup to evaluate component interaction, verify ethical value
calculus computations, and demonstrate robust error handling during component communication.
