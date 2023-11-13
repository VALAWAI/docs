# Moral-topic similarity

This component evaluates how desirable a Twitter post is to a user, based
on the user’s preferences, in terms of topic and moral values, and on the topics
and moral values detected from the post.
While topics’ and moral information is provided by other components, such
as [Topic detection model](/docs/components/C0/topic_detection_model)
and [MFT values detection](/docs/components/C2/mft_values_detection),
the information $user_t \in \mathbb{R}^p$ and $user_m \in \mathbb{R}^q$ 
from the user is assumed to be defined as a parameter of the system to be
initialised to start the program. This setting is ideal to analyse a system
through simulation analyses, as it is possible to fully control the user specifics.
Indeed, possible modifications could enable the derivation of user information
using collaborative filtering methods. The similarity score $r \in [0,1]$ is defined
by the formula:

$\lambda \, S_C\! \left( \mathcal{D}(item_m, h_m), user_m \right) + (1-\lambda) \, S_C\! \left( \mathcal{D}(item_t, h_t), user_t \right)$

where:

 * $S_C$ is the cosine similarity, to measure the affinity of moral and
 topic content between the user and the item;
 * $\mathcal{D}(v, h)$, with $v \in \mathbb{R}^k$, is the output from a Dirichlet
 distribution with parameters $\alpha_i = 1+v_i k / (h+10^{-10})$ for $i=1,...,k$, 
 as way to introduce noise to the component inputs that is modulated in magnitude 
 by $h \geq 0$;
 * The values $h_t \geq 0$ and $h_m \geq 0$ modulates the magnitude of
 the noise artificially induced to the input variables $item_t$ and $item_m$
 respectively;
 * $\lambda \in [0,1]$ interpolates the importance attributed to the difference
 between user’s preference and post’s information about topics (larger $\lambda$)
 rather than moral values (smaller $\lambda$).

 
 ![The Moral-topic similarity component](/img/components/c1/moral_topic_similarity.png) 