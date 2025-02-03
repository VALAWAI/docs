---
sidebar_position: 1
---

# C0

C0 components are responsible for interacting with the physical world, handling 
both information extraction (including data processing) and task execution.
They act as the interface between VALAWAI and the environment, extracting 
information through sensors (or more complex feature extractors) and acting upon 
the world through actuators.

The following C0 components are defined in the RGNW toolbox:

*   **Furhat Interface:** The [Furhat interface](/docs/components/C0/furhat_interface) 
leverages the Furhat robot's capabilities to capture spoken text from conversations 
via its microphone.

*   **Text Interface:** The [Text interface](/docs/components/C0/text_interface) 
provides a user interface for text-based interaction with the social robots.

*   **Text Preprocessing:** The [Text preprocessing](/docs/components/C0/text_prepossessing) 
component preprocesses text from Twitter posts, preparing it for further analysis.

*   **Topic Detection Model:** The [Topic detection model](/docs/components/C0/topic_detection_model) 
extracts topics from Twitter posts.

*   **Email Sensor:** The [Email sensor](/docs/components/C0/email_sensor) retrieves 
information from received emails in a specified account.

*   **Email Actuator:** The [Email actuator](/docs/components/C0/email_actuator) 
sends emails outside the VALAWAI infrastructure.

*   **Patient Treatment UI:** The [Patient treatment UI](/docs/components/C0/patient_treatment_ui) 
provides a user interface for doctors to prescribe treatments to patients. It also 
receives feedback on whether the treatment follows the NIT protocol and retrieves 
the values associated with the treatment.
