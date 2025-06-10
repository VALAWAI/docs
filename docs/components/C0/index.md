---
sidebar_position: 1
---

# C0

[**C0 components**](/docs/architecture/value_awareness_architecture#c0-component) 
serve as the bridge between VALAWAI and the physical world. They're responsible 
for both **extracting information** (including data processing) and **executing tasks**. 
Think of them as the interface: they gather information through **sensors** 
(or more sophisticated feature extractors) and act upon the world via **actuators**.

---

The RGNW toolbox currently defines the following C0 components:

* **Email Actuator:** The [Email actuator](/docs/components/C0/email_actuator) sends 
emails outside the VALAWAI infrastructure.

* **Email Sensor:** The [Email sensor](/docs/components/C0/email_sensor) retrieves 
information from emails received in a specified account.

* **Furhat Interface:** The [Furhat interface](/docs/components/C0/furhat_interface) uses 
the Furhat robot's microphone to capture spoken text from conversations.

* **Patient Treatment UI:** The [Patient treatment UI](/docs/components/C0/patient_treatment_ui) 
provides a user interface for doctors to prescribe treatments to patients. It also receives 
feedback on whether the treatment follows the NIT protocol and retrieves the values 
associated with the treatment.

* **Text Interface:** The [Text interface](/docs/components/C0/text_interface) offers 
a user interface for text-based interaction with social robots.

* **Text Preprocessing:** The [Text preprocessing](/docs/components/C0/text_prepossessing) 
component preprocesses text from Twitter posts, getting it ready for further analysis.

* **Topic Detection Model:** The [Topic detection model](/docs/components/C0/topic_detection_model)
 extracts topics from Twitter posts.