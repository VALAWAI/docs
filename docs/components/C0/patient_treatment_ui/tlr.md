---
sidebar_position: 4
---


# Technology Readiness Level (TLR)

The Patient Treatment UI is a web-based C0 component for a VALAWAI project demonstration. It simulates doctor interactions for patient management, treatment planning, and feedback, showcasing the VALAWAI architecture's potential in patient care. This component is a proof-of-concept, not for clinical use, designed to illustrate system capabilities and potential benefits without using real patient data, acting as a sensor and actuator within a simulated environment.
Given this, the Patient Treatment UI is at TRL 3: Analytical and experimental critical function and/or characteristic proof-of-concept. This level is based on its explicit design as a proof-of-concept that simulates core functionalities in a controlled, non-operational setting, proving basic feasibility.
To reach TRL 4: Component and/or breadboard validation in a laboratory environment, the UI must shift from pure simulation to basic integration with actual, nascent VALAWAI components. This involves defining stable APIs and communication protocols to genuinely interact with other VALAWAI modules, rather than just internal simulations. Additionally, using controlled, representative data is crucial. This data will be synthetic or thoroughly anonymized to address privacy concerns, accurately mimicking the structure, volume, and complexity of real patient data where obtaining permissions for actual hospital data is difficult. Testing needs to extend to integration tests within a "breadboard" laboratory setup, demonstrating the UI's functionality as part of a rudimentary, integrated VALAWAI system, along with implementing basic error handling for component interactions.
