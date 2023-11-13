# Topic detection model

This component identifies the main (sub-)topics from Twitter posts in Italian about immigration.
The core of the component is a BERTopic model fine-tuned on a comprehensive set of tweets
representing the information provided by both political entities and news sources on the immigration
subject during the 5-year period 2018-2022. The model includes a pointer towards the model
to be loaded in with SentenceTransformers, and returns as output the distribution(s) of the input
text(s) over the 36 topics identified through the fine-tuning process. We further relied on **OpenAI**
gpt-3.5-turbo to generate topic labels based on their best representing documents.

![The Topic detection component](/img/components/c0/topic_detection.png)