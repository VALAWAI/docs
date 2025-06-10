---
sidebar_position: 1
---


# How to use

To get started with the Email Actuator (C0), you'll need an email account 
that the actuator can use to send messages. Make sure you have all the necessary 
connection details: the email server host, port, username, and password.

The Email Actuator is flexible; it supports SMTP servers, and you can establish 
either a plain or secure connection (SSL/TLS). For a comprehensive guide 
on configuring these settings, refer to the 
[Docker Image Environment Variables](/docs/components/C0/email_actuator/deploy#mail-connection)
section.

Once active, the Email Actuator receives instructions to send emails via the channel 
`valawai/co/email_actuator/data/e_mail`. This channel is specifically designed to notify 
the component about emails to be sent. These instructions typically include details 
like recipients (To, CC, BCC), subject, and content. The Master of VALAWAI (MOV) is 
responsible for routing these commands based on your active topology. You can find 
more details on this process in the 
[Send Email](/docs/components/C0/email_actuator/services#send-e-mail) section.

While the component is running, it processes requests to send emails and generates 
log messages for each operation. You can monitor these logs directly within the
[MOV user interface](/docs/architecture/implementations/mov/user_interface#manage-logs),
allowing you to keep track of its activity and delivery status.