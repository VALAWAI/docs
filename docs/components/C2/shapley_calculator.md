# Shapley calculator


This component provides the functionality to compute the Shapley value of an individual
norm $n_i$ within a normative system $N$ (where $n_i \in N$), with respect to
a given value $v$. As explained in [Alignment calculator](/docs/components/C2/alignment_calculator),
given a normative system $N$ and a value $v$, it is possible to quantify the degree of alignment
$\mathsf{Algn}_{N,v}$ that the norms in $N$ have with respect to value $v$. The Shapley
value $\phi_i(v)$ of norm $n_i \in N$ quantifies the contribution that the specific norm
$n_i$ makes to that alignment. It is defined as:

$$
    \phi_{i}(v) = \sum\limits_{N'\subseteq N\setminus \{n_i\}} \frac{|N'|!\left(|N|-|N'|-1\right)!}{|N|!} \cdot \left( \mathsf{Algn}_{N'\cup \{n_i\}, v} - \mathsf{Algn}_{N', v} \right)
$$

In the previous equation, the summation is taken over all the subsets of
$N$ where $n_i$ is absent, $N \setminus \{n_i\}$. In general, given a normative system
$N$ and a set of norm $\{n_j, n_k, ...\} \subseteq N$, the removal of $\{n_j, n_k, ...\}$
from $N$ is represented by a normative system $N' = N \setminus \{n_j, n_k, ...\}$ where
the values of the normative parameters tied to $\{n_j, n_k, ...\}$ are substituted by their
**baseline** quantities. These baseline normative parameters are drawn from a 
**baseline normative system** $N_{bsl}$. This baseline normative system has the same norms as $N$,
tied to the same normative parameters, but the values that these baseline normative parameters
are selected in such a way that, when it is implemented on the model, it does not cause it
to evolve in any way. In other words, the baseline normative system $N_{\text{bsl}}$ causes
transitions to not lead to any change in system state,
$\mathbf{s} \xrightarrow{N_{\text{bsl}}} \mathbf{s}$.

A Shapley Calculator is initialized similarly to the Alignment Calculator, by providing
(i) a representation of the model or system being examined (i.e. the entity upon which
norms apply to), and (ii) the semantics function $f_v$ of the value of interest $v$
whose alignment is computed by the component.


![The Shapley calculator component](/img/components/c2/shapley_calculator.png) 