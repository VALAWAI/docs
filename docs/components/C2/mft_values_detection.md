# MFT Values Detection

This component identifies the presence of Moral Foundations Theory’s dyads and focuses,
from Twitter posts in Italian about immigration.
The core of the component is based on a BERT-based deep learning model, fine-tuned on
a dataset of 1,724 immigration-related tweets annotated for the expression of moral dyads
and focuses from the Moral Foundations Theory. Namely, limited to the immigration subject,
the model is capable to classify tweets according to both the moral dyad (*Authority/Subversion*,
*Care/Harm*, *Fairness/Cheating*, *Loyalty/Betrayal*, *Purity/Degradation*, and *No moral*)
and the focus concern (*Prescriptive*, if it highlights a virtue, *Prohibitive* if it blames misbehaviour,
or *No focus* otherwise) expressed.  To perform both the classification tasks at the same time,
the pre-trained model was modified by attaching two linear layers with a softmax activation
function at the output of these layers. 
Hence, instead of considering the poles of a moral dyad (e.g., *Care* and *Harm*)
as two separate labels, these are treated as a whole. Then, the focuses were evaluated
as an independent dimension.

Access to the fine-tuned model is provided through the [HuggingFace platform](https://huggingface.co/brema76/moral_immigration_it).

![The MFT values detection component](/img/components/c2/mft_values.png)
