# Alignment calculator

This component computes the alignment of a set of norms $N$ with respect to the value
$v$ it has been initialized with. It calculates this alignment following the formalization
in Eq.  using Monte Carlo sampling. It simulates a set of paths for the model under examination
to extract their respective outcomes (i.e. their final states), evaluates them with the value
semantics function and averages the results. Mathematically:
$$
    \mathsf{Algn}_{N,v} = \frac{\sum\limits_{\mathbf{s}_f^i \in \mathbf{S}_f} f_v(\mathbf{s}_f^i) }{|\mathbf{S}_f|}
$$

An Alignment Calculator is initialized by providing (i) a representation of the model or
system being examined (i.e. the entity upon which norms apply to), and (ii) the semantics
function $f_v$ of the value of interest $v$ whose alignment is computed by the component.

![The alignment calculator component](/img/components/c2/alignment_calculator.png)