---
sidebar_position: 1
---


# How to use

To get started with the Email Sensor (C0), you'll need an email account that 
the sensor can access to extract information. Make sure you have all the necessary 
connection details: the email server host, port, username, and password.

The Email Sensor is flexible; it supports both POP3 and IMAP servers, and 
you can establish either a plain or secure connection (SSL/TLS). For a comprehensive 
guide on configuring these settings, refer to 
the [Docker Image Environment Variables](/docs/components/C0/email_sensor/deploy#docker-image-environment-variables)
section.

Once active, the Email Sensor extracts key details from emails, including sender, 
recipients (To, CC, BCC), subject, content, and received timestamp. This extracted 
information is then published to the channel `valawai/c0/email_sensor/data/e_mail*`. The Master 
of VALAWAI (MOV) is responsible for distributing this data based on your active 
topology. You can find more details on this process in the
[Publish e-mail](/docs/components/C0/email_sensor/services#publish-e-mail) section.

While the component is running, it regularly fetches new emails and sends log messages. 
You can monitor these logs directly within the 
[MOV user interface](/docs/architecture/implementations/mov/user_interface#manage-logs) 
allowing you to keep track of its activity.
