---
sidebar_position: 4
---

# Technology Readiness Level (TRL)

The **NIT Protocol Manager** is a C1 decision-making component developed for the VALAWAI project's medical protocol demonstrator. It serves as the primary logic engine for verifying whether a proposed treatment plan adheres to the National Institute for Health and Care Excellence (NICE) or similar institutional treatment protocols. By analyzing data from C0 interfaces and integrating reflective constraints from C2 valuators, the component ensures that clinical decisions are both procedurally correct and ethically aligned.

Given its current stage, the NIT Protocol Manager is classified at **TRL 3: 
Analytical and experimental critical function and/or characteristic proof-of-concept**.
This rating reflects its successful unit-level validation in controlled laboratory settings, where its protocol-checking logic was verified using synthetic medical scenarios and simulated data flows.

To advance to **TRL 4: Component and/or breadboard validation in a laboratory environment**,
the component must transition from standalone logic verification to active system-level integration.
Key requirements for reaching
TRL 4 include:

* **API & Protocol Integration:** Establishing stable AsyncAPI communication channels to receive real-time patient data from the Patient Treatment UI (C0) and send/receive value-alignment queries to the C2 treatment valuators.

* **Protocol Library Expansion:** Integrating a more comprehensive and structured set of clinical protocol rules that mirror actual medical guidelines to test the robustness of the decision-making logic.

* **Laboratory Integration Testing:** Conducting end-to-end "breadboard" tests to verify the closed-loop interaction between C0 (UI) $\rightarrow$ C1 (Protocol Manager) $\rightarrow$ C2 (Valuators) $\rightarrow$ C1 $\rightarrow$ C0, ensuring that ethical constraints effectively modulate the protocol adherence logic.
