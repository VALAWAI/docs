---
sidebar_position: 1
---


# How to use

This component can be used to send e-mails. Thus, it can provide information to a user of
the value awareness application through an e-mail. These e-mails are generated from the messages
that this component receives on the channel **valawai/c0/email_actuator/data/e_mail**,
and delivered to an e-mail server for its publication. In this case, the [Master of VALAWAI (MOV)](/docs/architecture/implementations/mov)
will be responsible for redirecting the published messages by C1 components to this component and converted
to e-mails to be delivered to the users. In the [readme](https://github.com/VALAWAI/C0_email_actuator/blob/main/README.md),
you will find the version of the MOV that is necessary to use. Also, you must create the docker image of this component,
and you can deploy it individually or using a docker-compose. The following sections explain how to do these.
