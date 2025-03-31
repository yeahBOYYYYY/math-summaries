[tags: "wow!", "ron"]: #

## Definition

Let $S : \mathbb{N} \to \mathbb{N}$  be a function and let $L\subseteq \{0, 1\}^*$ then $L\in \size(S)$  iff there exists a family of circuits $\{\mathcal{C}_n\}$ such that $\size(\mathcal{C}_n) \le S(n)$ and $\{\mathcal{C}_n\}$ computes $L$.

## Claims

1. $\size(2^n) = \{0, 1\}^*$ ([Original paper](https://ia800405.us.archive.org/6/items/bstj28-1-59/bstj28-1-59.pdf)), moreover $\size(\Theta(\frac{2^n}{n}))=\{0,1\}^*$.
2. Let $S:\bbn\to\bbn$  be a function such that $n\le S(n)\le \frac{2^n}{n}$ then $\size(S)\subsetneq\size(S + 10n)$.

## Relations

...

# Size(poly)

## Definition

We define $\size(\poly)=\bigcup_{n=0}^{\infty}\size(n^c)$ where $\size(n^c)$ is the class [Size(...)](Size(...).md#Definition).

## Claims

...

## Relations

...