# Simple Value-awarness application

** WORK IN PROGRESS **

In this tutorial, we are going to show how to use the VALAWAI Toolbox
to create a simple Value-awareness application. It will consist of an automatic
mail replier for customs queries and complaints. We want that the answers
must follow the values of the company. The workflow of the application
will start with a C0 component that obtains the received e-mails, a c1 component
that provides a reply to this email that is sent by the C0 actuator component. Also,
we need a c2 component that validates that the replies provided by the C1 component
follow the company values. If not the first time try to change the parameters
of the C1 and if it does not follow the values disable the connection
between the C1 and the C0 actuator.


## Components

That components that will be used on the example
This tutorial
Tutorial for basic example for a hello world example.

 - [C0 Email sensor](/docs/components/C0/email_sensor) to obtain information
 from received e-mails.

c0-mail actuator-

c1_mail-replier

c2_mail_analizer


## Docker-composer

how to join all into a docker compose


## Run example

