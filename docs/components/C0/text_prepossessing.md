# Text prepossessing


This C0 component preprocesses the textual part of a Twitter post to make it a suitable
input for the other different components involved, i.e., the [C0 Topic Detection Model](/docs/components/C0/topic_detection_model)
component and the [C2 MFT Values Detection](/docs/components/C2/mft_values_detection) component.
Since these components include pre-trained classification models that follow different standards,
the present component takes into account each specific preprocessing operation and returns
a dictionary of different output texts according to both tasks.


![The Text Preprocessing component](/img/components/c0/test_preprocessing.png)