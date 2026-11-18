---
sidebar_position: 4
---

# Technology Readiness Level (TRL)

The **Treatment Justice Valuator** is a C2 reflective component designed for the VALAWAI project's medical protocol demonstrator. Its primary function is to evaluate the fairness and equity of a proposed treatment plan, ensuring that clinical decisions are not biased and that resources are distributed justly. As part of the C2 reflective layer, it provides a value-based constraint that monitors for systemic biases or inequities, allowing the system to flag or inhibit decisions by the C1 NIT Protocol Manager that violate principles of distributive justice.

Given its current stage, the Treatment Justice Valuator is classified at **TRL 3: 
Analytical and experimental critical function and/or characteristic proof-of-concept**.
This rating is based on the successful implementation of the justice-value calculus in simulated environments, demonstrating that the component can detect disparities in treatment allocation across synthetic patient cohorts.

To advance to **TRL 4: Component and/or breadboard validation in a laboratory environment**,
the component must be integrated into the live reflective loop of the demonstrator.
Key requirements for reaching
TRL 4 include:

* **C1-C2 Interface Validation:** Verifying the seamless exchange of value-alignment requests and responses with the NIT Protocol Manager via the project's communication topology.

* **Reflective Feedback Loop Testing:** Demonstrating the ability of the valuator to trigger "inhibitory" signals when a proposed treatment plan deviates from established equity norms or exhibits bias.

* **Bias Detection Testing:** Testing the valuator against synthetic datasets containing intentional biases to verify its effectiveness in flagging unjust treatment recommendations.
