# Value compatibility calculator

This component provides the functionality to compute the degree of **compatibility**
among a set of values. Given a set of values $V$ (each with its associated value semantics
function) and a normative system $N$, we state that the values in $V$ are
**compatible to degree $d$ under $N$** if $\mathsf{Algn}_{N, v_i} \leq d$, $\forall v_i \in V$.
Hence, the maximum degree of compatibility among the values in $V$ is
$d_{\text{max}} = \max\limits_{v_i \in V} \mathsf{Algn}_{N, v_i}$. This is the quantity
that this component is able to compute.

Consequently, a Compatibility Calculator is initialized by providing the set of value semantics
functions for which the degree of compatibility is computed. This differs from
the [Alignment calculator](/docs/components/C2/alignment_calculator) and 
the [Shapley calculator](/docs/components/C2/shapley_calculator)
which are initialized with a single value semantics function.

![The value compatibility calculator component](/img/components/c2/value_compatibility_calculator.png)