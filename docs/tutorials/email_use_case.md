# E-mail Value-awarness application

** WORK IN PROGRESS **

In this tutorial, we are going to show how to use the VALAWAI Toolbox
to create a simple Value-awareness application. It will consist of an automatic
mail replier for customs queries and complaints. We want that the answers
must follow the values of the company. 

The workflow of the application will start with a C0 component that obtains 
the received e-mails, a c1 component that provides a reply to this email
that is sent by the C0 actuator component. Also, we need a c2 component
that validates that the replies provided by the C1 component follow 
the company values. If not the first time try to change the parameters
of the C1 and if it does not follow the values disable the connection
between the C1 and the C0 actuator. Concretely the components that will
be used are:

 - [C0 E-mail sensor](/docs/components/C0/email_sensor) This component is used
 to obtain information from received e-mails.
 - [C0 E-mail actuator](/docs/components/C0/email_actuator) This component
 is used to send e-mails.
 - [C1 E-mail replier](/docs/components/C1/llm_email_replier) This component
 is used to provide a reply message to a received e-mail.
 - [C2 E-mail analizer](/docs/components/C2/email_analizer) This component
 is used to check if an e-mail is aligned with some values.

## docker composer

how to join all into a docker compose


## Run example

