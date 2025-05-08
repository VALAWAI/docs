# Step 5: Component Deployment

dockerize the component



* __RABBITMQ_HOST__ is the host where the RabbitMQ is available. The default value is __mov-mq__.
* __RABBITMQ_PORT__ defines the port of the RabbitMQ. The default value is __5672__.
* __RABBITMQ_USERNAME__ contains the user's name that can access the RabbitMQ. The default value is __mov__.
* __RABBITMQ_PASSWORD__ is the password to authenticate the user that can access the RabbitMQ. The default value is __password__.
* __RABBITMQ_MAX_RETRIES__ represent the number of tries to connect to the RabbitMQ. The default value is __100__.
* __RABBITMQ_RETRY_SLEEP__ is the seconds that have to wait between retry to connect to the RabbitMQ. The default value is __3__.
* __LOG_CONSOLE_LEVEL__ defines the level of the log messages on the console. The default value is __INFO__.
* __LOG_FILE_LEVEL__ defines the level of the log messages to be stored in the file. The default value is __DEBUG__.
* __LOG_FILE_MAX_BYTES__ defines the maximum length, in bytes, for the log file. The default values is __1000000__
* __LOG_FILE_BACKUP_COUNT__ defines the maximum number of log files to maintain. the default value is __5__.
