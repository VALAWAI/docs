---
sidebar_position: 4
---

# Technology Readiness Level (TRL)

The **Treatment Non-maleficence Valuator** is a C2 reflective component designed for the VALAWAI project's medical protocol demonstrator. Its primary function is to evaluate the potential for harm associated with a proposed treatment plan, adhering to the fundamental clinical principle of *primum non nocere* (first, do no harm). As part of the C2 reflective layer, it provides a critical value-based constraint that can inhibit decisions made by the C1 NIT Protocol Manager if the risk of adverse effects outweighs the potential benefits or exceeds acceptable safety thresholds.

Given its current stage, the Treatment Non-maleficence Valuator is classified at **TRL 3: 
Analytical and experimental critical function and/or characteristic proof-of-concept**.
This rating is based on the successful implementation of the risk-assessment calculus in simulated environments, demonstrating that the component can identify high-risk contraindications and translate them into quantifiable ethical constraints.

To advance to **TRL 4: Component and/or breadboard validation in a laboratory environment**,
the component must be integrated into the live reflective loop of the demonstrator.
Key requirements for reaching
TRL 4 include:

* **C1-C2 Interface Validation:** Verifying the seamless exchange of value-alignment requests and responses with the NIT Protocol Manager via the project's communication topology.

* **Reflective Feedback Loop Testing:** Demonstrating the ability of the valuator to trigger "inhibitory" signals that force the C1 component to abandon or modify a high-risk treatment plan.

* **Synthetic Risk Modeling:** Testing the valuator against a wide array of synthetic contraindications and adverse reaction scenarios to verify the precision and sensitivity of the risk-value calculus.
