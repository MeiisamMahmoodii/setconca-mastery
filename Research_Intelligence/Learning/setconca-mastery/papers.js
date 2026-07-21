window.CURRICULUM_DATA = {
  "title": "SetConCA Mastery Path",
  "subtitle": "From representation foundations to multi-view sparse autoencoders",
  "formula": "SetConCA = Sparse dictionary learning + Multi-view learning + Set representation + Contrastive coordination",
  "levels": [
    {
      "id": 1,
      "title": "What is a representation?",
      "weeks": "1–2",
      "checkpoint": "Run PCA, ICA, and CCA on the same Gemma activation bank. Compare reconstruction, dimensionality, cross-view correlation, and retrieval.",
      "papers": [
        {
          "id": "pca-shlens",
          "num": 1,
          "title": "A Tutorial on Principal Component Analysis",
          "authors": "Jonathon Shlens",
          "file": "1404.1100v1.pdf",
          "learn": [
            "Variance and covariance",
            "Eigenvectors and singular value decomposition",
            "Low-rank approximation and reconstruction error",
            "Explained variance and fraction of variance unexplained (FVU)",
            "Why PCA directions are orthogonal but not necessarily meaningful"
          ],
          "setconca": "Foundation for comparing SAE reconstruction with PCA baselines. Good reconstruction alone does not demonstrate interpretability.",
          "video": "https://www.youtube.com/watch?v=FgakZw6K1Q0",
          "optional": false,
          "abstract": "",
          "pages": 12,
          "pdfPath": "../../../RAW/1404.1100v1.pdf",
          "quiz": [
            {
              "q": "PCA finds directions that maximise ___?",
              "options": [
                "Variance",
                "Independence",
                "Cross-view correlation",
                "Sparsity"
              ],
              "a": 0,
              "explain": "PCA maximises variance captured by each successive orthogonal direction."
            },
            {
              "q": "High PCA reconstruction quality implies interpretable features?",
              "options": [
                "True",
                "False"
              ],
              "a": 1,
              "explain": "PCA optimises variance, not semantic meaning. Orthogonal directions need not align with concepts."
            }
          ]
        },
        {
          "id": "ica-shlens",
          "num": 2,
          "title": "A Tutorial on Independent Component Analysis",
          "authors": "Jonathon Shlens",
          "file": "1404.2986v1.pdf",
          "learn": [
            "Correlation vs statistical independence",
            "Source separation and linear unmixing",
            "Why changing coordinates reveals latent components",
            "Identifiability and assumptions for source recovery"
          ],
          "setconca": "Directly relevant to Concept Component Analysis (ConCA), which treats activations as mixtures of concept components.",
          "video": "https://www.youtube.com/watch?v=GD_IY1Xa7ko",
          "optional": false,
          "abstract": "",
          "pages": 13,
          "pdfPath": "../../../RAW/1404.2986v1.pdf",
          "quiz": [
            {
              "q": "ICA seeks statistically ___ components.",
              "options": [
                "Correlated",
                "Independent",
                "Identical",
                "Sparse only"
              ],
              "a": 1,
              "explain": "ICA separates sources by statistical independence, stronger than uncorrelatedness."
            },
            {
              "q": "ICA is most relevant to ConCA because both assume ___?",
              "options": [
                "Linear mixing of latent sources",
                "TopK sparsity",
                "Contrastive pairs",
                "Permutation invariance"
              ],
              "a": 0,
              "explain": "ConCA treats activations as linear mixtures of concept components — same unmixing intuition as ICA."
            }
          ]
        },
        {
          "id": "cca-uurtio",
          "num": 3,
          "title": "A Tutorial on Canonical Correlation Methods",
          "authors": "Uurtio et al.",
          "file": "1711.02391v1.pdf",
          "learn": [
            "Shared directions between two views",
            "Canonical variables and canonical correlations",
            "Shared vs view-specific information",
            "Regularized, kernel, sparse, and deep CCA",
            "Statistical significance and generalisation"
          ],
          "setconca": "After this: PCA preserves within-view variance; ICA recovers independent sources; CCA recovers cross-view correlation. Core baseline for multi-view SetConCA.",
          "optional": false,
          "abstract": "",
          "pages": 33,
          "pdfPath": "../../../RAW/1711.02391v1.pdf",
          "quiz": [
            {
              "q": "CCA maximises correlation between ___?",
              "options": [
                "Two views' canonical variables",
                "Within-view variance",
                "Reconstruction error",
                "Sparsity penalty"
              ],
              "a": 0,
              "explain": "CCA finds linear projections of two views that are maximally correlated."
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "title": "Sparse representations and dictionaries",
      "weeks": "3–4",
      "checkpoint": "Compare L1 vs TopK sparsity on matched reconstruction budget. Answer: why overcomplete latents need sparsity?",
      "questions": [
        "Why does an overcomplete latent representation need sparsity?",
        "What is the difference between L1, TopK, and L0-style sparsity?",
        "Can a sparse representation still be polysemantic?",
        "Why does good reconstruction not guarantee concept recovery?",
        "What assumptions make a latent variable identifiable?"
      ],
      "papers": [
        {
          "id": "ksparse",
          "num": 4,
          "title": "k-Sparse Autoencoders",
          "authors": "Makhzani and Frey",
          "file": "1312.5663v2.pdf",
          "learn": [
            "Overcomplete dictionaries",
            "Encoder-decoder factorisation",
            "Hard TopK activation",
            "L1 sparsity vs exact k-sparsity",
            "Why sparse codes can reconstruct dense inputs"
          ],
          "setconca": "Clearest bridge from classical sparse coding to modern TopK SAEs.",
          "optional": false,
          "abstract": "Recently, it has been observed that when rep- resentations are learnt in a way that encour- ages sparsity, improved performance is ob- tained on classiﬁcation tasks. These meth- ods involve combinations of activation func- tions, sampling steps and diﬀerent kinds of penalties. To investigate the eﬀectiveness of sparsity by itself, we propose the “k- sparse autoencoder”, which is an autoen- coder with linear activation function, where in hidden layers only the k highest activities are kept. When applied to the MNIST and NORB datasets, we ﬁnd that this method achieves better classiﬁcation results than de- noising autoencoders, networks trained with dropout, and RBMs. k-sparse autoencoders are simple to train and the encoding stage is very fast, making them well-suited to large problem sizes, where conventional sparse cod- ing algorithms cannot be applied.",
          "pages": 9,
          "pdfPath": "../../../RAW/1312.5663v2.pdf",
          "quiz": [
            {
              "q": "k-Sparse Autoencoders enforce sparsity via ___?",
              "options": [
                "L1 penalty only",
                "Exactly k active units",
                "Dropout",
                "Batch normalisation"
              ],
              "a": 1,
              "explain": "Hard TopK keeps exactly k largest activations — direct ancestor of TopK SAEs."
            },
            {
              "q": "Why can sparse codes still reconstruct dense inputs?",
              "options": [
                "Overcomplete dictionary",
                "No encoder needed",
                "PCA whitening",
                "BatchTopK only"
              ],
              "a": 0,
              "explain": "Many more dictionary atoms than input dimensions allow sparse combinations to span the input space."
            }
          ]
        },
        {
          "id": "vae",
          "num": 5,
          "title": "Auto-Encoding Variational Bayes",
          "authors": "Kingma and Welling",
          "file": "1312.6114v11.pdf",
          "learn": [
            "Latent-variable models",
            "Approximate posterior distributions",
            "Mean and variance parameterisation",
            "Reparameterisation trick",
            "Reconstruction vs regularisation; ELBO"
          ],
          "setconca": "Background for Gaussian set representations and product-of-experts aggregation.",
          "optional": false,
          "abstract": "How can we perform efﬁcient inference and learning in directed probabilistic models, in the presence of continuous latent variables with intractable posterior distributions, and large datasets? We introduce a stochastic variational inference and learning algorithm that scales to large datasets and, under some mild differ- entiability conditions, even works in the intractable case. Our contributions are two-fold. First, we show that a reparameterization of the variational lower bound yields a lower bound estimator that can be straightforwardly optimized using stan- dard stochastic gradient methods. Second, we show that for i.i.d. datasets with continuous latent variables per datapoint, posterior inference can be made espe- cially efﬁcient by ﬁtting an approximate inference model (also called a recogni- tion model) to the intractable posterior using the proposed lower bound estimator. Theoretical advantages are reﬂected in experimental results. 1",
          "pages": 14,
          "pdfPath": "../../../RAW/1312.6114v11.pdf",
          "quiz": [
            {
              "q": "The ELBO trades off reconstruction against ___?",
              "options": [
                "KL to prior",
                "TopK sparsity",
                "CKA alignment",
                "Probe accuracy"
              ],
              "a": 0,
              "explain": "VAEs regularise the approximate posterior toward the prior via KL divergence."
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "title": "Nonlinear multi-view representation learning",
      "weeks": "5–6",
      "checkpoint": "Implement shared/private latent decomposition. Visualise what gets aligned vs discarded.",
      "key_lesson": "Do not force all views to become identical. Distinguish shared information from view-specific information.",
      "papers": [
        {
          "id": "dcca",
          "num": 6,
          "title": "Deep Canonical Correlation Analysis",
          "authors": "Andrew et al.",
          "file": "andrew13.pdf",
          "learn": [
            "Nonlinear view encoders",
            "Correlation-maximising objectives",
            "Whitening and covariance constraints",
            "Maximising correlation while discarding useful information"
          ],
          "setconca": "Nonlinear extension of CCA — precursor to coordinating SAE views.",
          "optional": false,
          "abstract": "We introduce Deep Canonical Correlation Analysis (DCCA), a method to learn com- plex nonlinear transformations of two views of data such that the resulting representations are highly linearly correlated. Parameters of both transformations are jointly learned to maximize the (regularized) total correlation. It can be viewed as a nonlinear extension of the linear method canonical correlation analy- sis (CCA). It is an alternative to the nonpara- metric method kernel canonical correlation analysis (KCCA) for learning correlated non- linear transformations. Unlike KCCA, DCCA does not require an inner product, and has the advantages of a parametric method: train- ing time scales well with data size and the training data need not be referenced when computing the representations of unseen in- stances. In experiments on two real-world datasets, we ﬁnd that DCCA learns represen- tations with signiﬁcantly higher correlation than those learned by CCA and KCCA. We also introduce a novel non-saturating sigmoid function based on the cube root that may be useful more generally in feedforward neural networks. Proceedings of the 30 th International Conference on Ma- chine Learning, Atlanta, Georgia",
          "pages": 9,
          "pdfPath": "../../../RAW/andrew13.pdf",
          "quiz": [
            {
              "q": "DCCA can maximise correlation while discarding ___?",
              "options": [
                "View-specific information",
                "All information",
                "Gradients",
                "Parameters"
              ],
              "a": 0,
              "explain": "Correlation-only objectives may ignore useful private structure in each view."
            }
          ]
        },
        {
          "id": "dccae",
          "num": 7,
          "title": "On Deep Multi-View Representation Learning",
          "authors": "Wang et al.",
          "file": "1602.01024v1.pdf",
          "learn": [
            "DCCAE trade-offs",
            "Cross-view correlation vs within-view reconstruction",
            "Shared representation vs information preservation"
          ],
          "setconca": "Central difficulty: coordinate across views without destroying activation information.",
          "optional": false,
          "abstract": "We consider learning representations (features) in the setting in which we have access to multiple unlabeled views of the data for learning while only one view is available for downstream tasks. Previous work on this problem has proposed several techniques based on deep neural networks, typically involving either autoencoder-like networks with a reconstruction objective or paired feed- forward networks with a batch-style correlation-based objective. We analyze several techniques based on prior work, as well as new variants, and compare them empirically on image, speech, and text tasks. We ﬁnd an advantage for correlation-based representation learning, while the best results on most tasks are obtained with our new variant, deep canonically correlated autoencoders (DCCAE). We also explore a stochastic optimization procedure for minibatch correlation-based objectives and discuss the time/performance trade-offs for kernel-based and neural network-based implementations.",
          "pages": 34,
          "pdfPath": "../../../RAW/1602.01024v1.pdf"
        },
        {
          "id": "vcca",
          "num": 8,
          "title": "Deep Variational Canonical Correlation Analysis",
          "authors": "Wang et al.",
          "file": "1610.03454v3.pdf",
          "learn": [
            "Shared and private latent variables",
            "Generative multi-view modelling",
            "Missing views",
            "Probabilistic cross-view alignment"
          ],
          "setconca": "Directly relevant to probabilistic multi-view SetConCA experiments.",
          "optional": false,
          "abstract": "We present deep variational canonical correla- tion analysis (VCCA), a deep multi-view learn- ing model that extends the latent variable model interpretation of linear CCA to nonlinear obser- vation models parameterized by deep neural net- works. We derive variational lower bounds of the data likelihood by parameterizing the posterior probability of the latent variables from the view that is available at test time. We also propose a variant of VCCA called VCCA-private that can, in addition to the “common variables” underly- ing both views, extract the “private variables” within each view, and disentangles the shared and private information for multi-view data with- out hard supervision. Experimental results on real-world datasets show that our methods are competitive across domains.",
          "pages": 13,
          "pdfPath": "../../../RAW/1610.03454v3.pdf"
        },
        {
          "id": "dgcca",
          "num": 9,
          "title": "Deep Generalized Canonical Correlation Analysis",
          "authors": "Benton et al.",
          "file": "1702.02519v2.pdf",
          "learn": [
            "Extending CCA to arbitrary numbers of views",
            "Common representation across several views",
            "Multi-view information decomposition"
          ],
          "setconca": "Conceptual motivation for multi-view SetConCA.",
          "optional": false,
          "abstract": "We present Deep Generalized Canonical Correlation Analysis (DGCCA) – a method for learning nonlinear transformations of arbitrarily many views of data, such that the resulting transformations are maximally informative of each other. While methods for nonlinear two-view representation learning (Deep CCA, (An- drew et al., 2013)) and linear many-view representation learning (Generalized CCA (Horst, 1961)) exist, DGCCA is the ﬁrst CCA-style multiview representation learning technique that combines the ﬂexibility of nonlinear (deep) representation learning with the statistical power of incorporating information from many inde- pendent sources, or views. We present the DGCCA formulation as well as an efﬁcient stochastic optimization algorithm for solving it. We learn DGCCA repre- sentations on two distinct datasets for three downstream tasks: phonetic transcrip- tion from acoustic and articulatory measurements, and recommending hashtags and friends on a dataset of Twitter users. We ﬁnd that DGCCA representations soundly beat existing methods at phonetic transcription and hashtag recommenda- tion, and in general perform no worse than standard linear many-view techniques. 1",
          "pages": 14,
          "pdfPath": "../../../RAW/1702.02519v2.pdf"
        }
      ]
    },
    {
      "id": 4,
      "title": "Learning representations of sets",
      "weeks": "7",
      "checkpoint": "Compare mean pooling, Deep Sets, Set Transformer, and Gaussian product-of-experts on reconstruction, view removal, intruder robustness, set-size generalisation.",
      "papers": [
        {
          "id": "deepsets",
          "num": 10,
          "title": "Deep Sets",
          "authors": "Zaheer et al.",
          "file": "1703.06114v3.pdf",
          "learn": [
            "Permutation invariance and equivariance",
            "f(X)=ρ(Σφ(x)) form",
            "What mean/sum pooling preserves or loses",
            "Why ordering should not affect set representation"
          ],
          "setconca": "Essential for aggregating multiple activation views into one concept code.",
          "optional": false,
          "abstract": "We study the problem of designing models for machine learning tasks deﬁned on sets. In contrast to traditional approach of operating on ﬁxed dimensional vectors, we consider objective functions deﬁned on sets that are invariant to permutations. Such problems are widespread, ranging from estimation of population statistics [1], to anomaly detection in piezometer data of embankment dams [2], to cosmology [3, 4]. Our main theorem characterizes the permutation invariant functions and provides a family of functions to which any permutation invariant objective function must belong. This family of functions has a special structure which enables us to design a deep network architecture that can operate on sets and which can be deployed on a variety of scenarios including both unsupervised and supervised learning tasks. We also derive the necessary and sufﬁcient conditions for permutation equivariance in deep models. We demonstrate the applicability of our method on population statistic estimation, point cloud classiﬁcation, set expansion, and outlier detection. 1",
          "pages": 29,
          "pdfPath": "../../../RAW/1703.06114v3.pdf",
          "quiz": [
            {
              "q": "Deep Sets guarantees ___ to input order.",
              "options": [
                "Invariance",
                "Sensitivity",
                "Causality",
                "Sparsity"
              ],
              "a": 0,
              "explain": "f(X)=ρ(Σφ(x)) is unchanged under permutation of set members."
            }
          ]
        },
        {
          "id": "neural-stat",
          "num": 11,
          "title": "Towards a Neural Statistician",
          "authors": "Edwards and Storkey",
          "file": "1606.02185v2.pdf",
          "learn": [
            "Set as object with latent representation",
            "Reconstruct members vs distribution",
            "Set-level latent capturing shared structure"
          ],
          "setconca": "What should a set code represent for a group of related activations?",
          "optional": false,
          "abstract": "An efﬁcient learner is one who reuses what they already know to tackle a new problem. For a machine learner, this means understanding the similarities amongst datasets. In order to do this, one must take seriously the idea of working with datasets, rather than datapoints, as the key objects to model. Towards this goal, we demonstrate an extension of a variational autoencoder that can learn a method for computing representations, or statistics, of datasets in an unsupervised fash- ion. The network is trained to produce statistics that encapsulate a generative model for each dataset. Hence the network enables efﬁcient learning from new datasets for both unsupervised and supervised tasks. We show that we are able to learn statistics that can be used for: clustering datasets, transferring generative models to new datasets, selecting representative samples of datasets and classify- ing previously unseen classes. We refer to our model as a neural statistician, and by this we mean a neural network that can learn to compute summary statistics of datasets without supervision. 1",
          "pages": 13,
          "pdfPath": "../../../RAW/1606.02185v2.pdf"
        },
        {
          "id": "set-transformer",
          "num": 12,
          "title": "Set Transformer",
          "authors": "Lee et al.",
          "file": "1810.00825v3.pdf",
          "learn": [
            "Self-attention over set members",
            "Inducing points and attention pooling",
            "Expressivity vs computational complexity"
          ],
          "setconca": "When set meaning cannot be recovered from simple mean pooling.",
          "optional": false,
          "abstract": "Many machine learning tasks such as multiple instance learning, 3D shape recognition and few- shot image classiﬁcation are deﬁned on sets of in- stances. Since solutions to such problems do not depend on the order of elements of the set, mod- els used to address them should be permutation invariant. We present an attention-based neural network module, the Set Transformer, speciﬁcally designed to model interactions among elements in the input set. The model consists of an encoder and a decoder, both of which rely on attention mechanisms. In an effort to reduce computational complexity, we introduce an attention scheme in- spired by inducing point methods from sparse Gaussian process literature. It reduces computa- tion time of self-attention from quadratic to linear in the number of elements in the set. We show that our model is theoretically attractive and we evaluate it on a range of tasks, demonstrating in- creased performance compared to recent methods for set-structured data.",
          "pages": 17,
          "pdfPath": "../../../RAW/1810.00825v3.pdf"
        },
        {
          "id": "multi-set-transformer",
          "num": null,
          "title": "Learning Functions on Multiple Sets using Multi-Set Transformers",
          "authors": "Selby et al.",
          "file": "selby22a.pdf",
          "learn": [
            "Relationships between several sets",
            "Multi-set attention"
          ],
          "setconca": "Optional advanced reading for cross-set relationships.",
          "optional": true,
          "abstract": "We propose a general deep architecture for learning functions on multiple permutation-invariant sets. We also show how to generalize this architecture to sets of elements of any dimension by dimension equivariance. We demonstrate that our architecture is a universal approximator of these functions, and show superior results to existing methods on a va- riety of tasks including counting tasks, alignment tasks, distinguishability tasks and statistical dis- tance measurements. This last task is quite impor- tant in Machine Learning. Although our approach is quite general, we demonstrate that it can gener- ate approximate estimates of KL divergence and mutual information that are more accurate than previous techniques that are speciﬁcally designed to approximate those statistical distances. 1",
          "pages": 11,
          "pdfPath": "../../../RAW/selby22a.pdf"
        }
      ]
    },
    {
      "id": 5,
      "title": "Contrastive representation learning",
      "weeks": "8–9",
      "checkpoint": "Ablate positive definition, temperature, and projection head. Measure alignment vs uniformity.",
      "questions": [
        "Exactly what creates a positive pair?",
        "What semantic information do positives genuinely share?",
        "Can negatives be false negatives?",
        "Does low loss imply recovery of the intended concept?",
        "Is temperature changing geometry or merely optimisation?"
      ],
      "papers": [
        {
          "id": "cpc",
          "num": 13,
          "title": "Representation Learning with Contrastive Predictive Coding",
          "authors": "van den Oord et al.",
          "file": "1807.03748v2.pdf",
          "learn": [
            "Positive and negative pairs",
            "InfoNCE and density-ratio interpretation",
            "Mutual-information motivation",
            "Temperature and similarity functions"
          ],
          "setconca": "Conceptual foundation for contrastive coordination of SAE views.",
          "optional": false,
          "abstract": "While supervised learning has enabled great progress in many applications, unsu- pervised learning has not seen such widespread adoption, and remains an important and challenging endeavor for artiﬁcial intelligence. In this work, we propose a universal unsupervised learning approach to extract useful representations from high-dimensional data, which we call Contrastive Predictive Coding. The key in- sight of our model is to learn such representations by predicting the future in latent space by using powerful autoregressive models. We use a probabilistic contrastive loss which induces the latent space to capture information that is maximally useful to predict future samples. It also makes the model tractable by using negative sampling. While most prior work has focused on evaluating representations for a particular modality, we demonstrate that our approach is able to learn useful representations achieving strong performance on four distinct domains: speech, images, text and reinforcement learning in 3D environments. 1",
          "pages": 13,
          "pdfPath": "../../../RAW/1807.03748v2.pdf"
        },
        {
          "id": "simclr",
          "num": 14,
          "title": "A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)",
          "authors": "Chen et al.",
          "file": "2002.05709v3.pdf",
          "learn": [
            "Data augmentation",
            "Projection heads",
            "Batch size, normalisation, temperature",
            "Definition of positive pairs"
          ],
          "setconca": "Template for designing contrastive view generation.",
          "optional": false,
          "abstract": "This paper presents SimCLR: a simple framework for contrastive learning of visual representations. We simplify recently proposed contrastive self- supervised learning algorithms without requiring specialized architectures or a memory bank. In order to understand what enables the contrastive prediction tasks to learn useful representations, we systematically study the major components of our framework. We show that (1) composition of data augmentations plays a critical role in deﬁning effective predictive tasks, (2) introducing a learn- able nonlinear transformation between the repre- sentation and the contrastive loss substantially im- proves the quality of the learned representations, and (3) contrastive learning beneﬁts from larger batch sizes and more training steps compared to supervised learning. By combining these ﬁndings, we are able to considerably outperform previous methods for self-supervised and semi-supervised learning on ImageNet. A linear classiﬁer trained on self-supervised representations learned by Sim- CLR achieves 76.5% top-1 accuracy, which is a 7% relative improvement over previous state-of- the-art, matching the performance of a supervised ResNet-50. When ﬁne",
          "pages": 20,
          "pdfPath": "../../../RAW/2002.05709v3.pdf"
        },
        {
          "id": "supcon",
          "num": 15,
          "title": "Supervised Contrastive Learning",
          "authors": "Khosla et al.",
          "file": "2004.11362v5.pdf",
          "learn": [
            "Multiple-positive objectives",
            "Positive averaging",
            "Class-conditioned geometry",
            "Within-class compactness and between-class separation"
          ],
          "setconca": "Directly relevant to multi-view positives from the same semantic object.",
          "optional": false,
          "abstract": "Contrastive learning applied to self-supervised representation learning has seen a resurgence in recent years, leading to state of the art performance in the unsu- pervised training of deep image models. Modern batch contrastive approaches subsume or signiﬁcantly outperform traditional contrastive losses such as triplet, max-margin and the N-pairs loss. In this work, we extend the self-supervised batch contrastive approach to the fully-supervised setting, allowing us to effec- tively leverage label information. Clusters of points belonging to the same class are pulled together in embedding space, while simultaneously pushing apart clus- ters of samples from different classes. We analyze two possible versions of the supervised contrastive (SupCon) loss, identifying the best-performing formula- tion of the loss. On ResNet-200, we achieve top-1 accuracy of 81.4% on the Ima- geNet dataset, which is 0.8% above the best number reported for this architecture. We show consistent outperformance over cross-entropy on other datasets and two ResNet variants. The loss shows beneﬁts for robustness to natural corruptions, and is more stable to hyperparameter settings such as optimizers and data a",
          "pages": 23,
          "pdfPath": "../../../RAW/2004.11362v5.pdf",
          "quiz": [
            {
              "q": "SupCon differs from SimCLR by allowing ___?",
              "options": [
                "Multiple positives per anchor",
                "No negatives",
                "No projection head",
                "Kernel CKA loss"
              ],
              "a": 0,
              "explain": "All same-class samples are positives — key for multi-view concept groups."
            }
          ]
        },
        {
          "id": "align-unif",
          "num": 16,
          "title": "Understanding Contrastive Representation Learning through Alignment and Uniformity",
          "authors": "Wang and Isola",
          "file": "2005.10242v10.pdf",
          "learn": [
            "Alignment: positives should be close",
            "Uniformity: avoid representation collapse",
            "Decomposing contrastive objectives"
          ],
          "setconca": "Interpret positive/negative cosine and pos-minus-neg separation.",
          "optional": false,
          "abstract": "Contrastive representation learning has been out- standingly successful in practice. In this work, we identify two key properties related to the con- trastive loss: (1) alignment (closeness) of features from positive pairs, and (2) uniformity of the in- duced distribution of the (normalized) features on the hypersphere. We prove that, asymptotically, the contrastive loss optimizes these properties, and analyze their positive effects on downstream tasks. Empirically, we introduce an optimizable metric to quantify each property. Extensive exper- iments on standard vision and language datasets conﬁrm the strong agreement between both met- rics and downstream task performance. Directly optimizing for these two metrics leads to repre- sentations with comparable or better performance at downstream tasks than contrastive learning. Project Page: ssnl.github.io/hypersphere. Code: github.com/SsnL/align uniform. github.com/SsnL/moco align uniform.",
          "pages": 41,
          "pdfPath": "../../../RAW/2005.10242v10.pdf"
        },
        {
          "id": "vicreg",
          "num": 17,
          "title": "VICReg: Variance-Invariance-Covariance Regularization",
          "authors": "Bardes et al.",
          "file": "2105.04906v3.pdf",
          "learn": [
            "Invariance between related views",
            "Variance preservation against collapse",
            "Covariance reduction against redundancy"
          ],
          "setconca": "Useful regularisers when pure contrastive alignment damages reconstruction.",
          "optional": false,
          "abstract": "Recent self-supervised methods for image representation learning maximize the agreement between embedding vectors produced by encoders fed with different views of the same image. The main challenge is to prevent a collapse in which the encoders produce constant or non-informative vectors. We introduce VICReg (Variance-Invariance-Covariance Regularization), a method that explicitly avoids the collapse problem with two regularizations terms applied to both embeddings separately: (1) a term that maintains the variance of each embedding dimension above a threshold, (2) a term that decorrelates each pair of variables. Unlike most other approaches to the same problem, VICReg does not require techniques such as: weight sharing between the branches, batch normalization, feature-wise normalization, output quantization, stop gradient, memory banks, etc., and achieves results on par with the state of the art on several downstream tasks. In addition, we show that our variance regularization term stabilizes the training of other methods and leads to performance improvements. 1",
          "pages": 23,
          "pdfPath": "../../../RAW/2105.04906v3.pdf",
          "quiz": [
            {
              "q": "VICReg prevents collapse via a ___ term.",
              "options": [
                "Variance",
                "L0",
                "MDL",
                "Steering"
              ],
              "a": 0,
              "explain": "Variance preservation stops all representations collapsing to a point."
            }
          ]
        },
        {
          "id": "cl-inverts",
          "num": null,
          "title": "Contrastive Learning Inverts the Data Generating Process",
          "authors": "Zimmermann et al.",
          "file": "zimmermann21a.pdf",
          "learn": [
            "When contrastive objectives recover latent factors",
            "InfoNCE identifiability conditions"
          ],
          "setconca": "Optional: when does contrastive learning recover concepts vs retrieval geometry?",
          "optional": true,
          "abstract": "Contrastive learning has recently seen tremendous success in self-supervised learning. So far, how- ever, it is largely unclear why the learned represen- tations generalize so effectively to a large variety of downstream tasks. We here prove that feed- forward models trained with objectives belonging to the commonly used InfoNCE family learn to implicitly invert the underlying generative model of the observed data. While the proofs make cer- tain statistical assumptions about the generative model, we observe empirically that our ﬁndings hold even if these assumptions are severely vio- lated. Our theory highlights a fundamental con- nection between contrastive learning, generative modeling, and nonlinear independent component analysis, thereby furthering our understanding of the learned representations as well as providing a theoretical foundation to derive more effective contrastive losses.1",
          "pages": 12,
          "pdfPath": "../../../RAW/zimmermann21a.pdf"
        }
      ]
    },
    {
      "id": 6,
      "title": "Measuring and comparing representations",
      "weeks": "10",
      "checkpoint": "Build evaluation notebook: CKA, SVCCA, linear probe, MDL probe, and control tasks on your representations.",
      "metric_table": true,
      "papers": [
        {
          "id": "svcca",
          "num": 18,
          "title": "SVCCA: Singular Vector Canonical Correlation Analysis",
          "authors": "Raghu et al.",
          "file": "1706.05806v2.pdf",
          "learn": [
            "Combining dimensionality reduction with CCA",
            "Comparing subspaces across models/layers",
            "Affine-invariant representation comparison"
          ],
          "setconca": "Baseline for comparing SAE dictionaries across seeds and architectures.",
          "optional": false,
          "abstract": "We propose a new technique, Singular Vector Canonical Correlation Analysis (SVCCA), a tool for quickly comparing two representations in a way that is both invariant to afﬁne transform (allowing comparison between different layers and networks) and fast to compute (allowing more comparisons to be calculated than with previous methods). We deploy this tool to measure the intrinsic dimension- ality of layers, showing in some cases needless over-parameterization; to probe learning dynamics throughout training, ﬁnding that networks converge to ﬁnal representations from the bottom up; to show where class-speciﬁc information in networks is formed; and to suggest new training regimes that simultaneously save computation and overﬁt less. 1",
          "pages": 17,
          "pdfPath": "../../../RAW/1706.05806v2.pdf"
        },
        {
          "id": "cka",
          "num": 19,
          "title": "Similarity of Neural Network Representations Revisited (CKA)",
          "authors": "Kornblith et al.",
          "file": "1905.00414v4.pdf",
          "learn": [
            "Gram matrices",
            "Invariance to orthogonal transformations",
            "Linear vs kernel CKA",
            "Why coordinate-wise matching misleads"
          ],
          "setconca": "Essential for comparing multi-view SetConCA against pointwise SAEs.",
          "optional": false,
          "abstract": "Recent work has sought to understand the behav- ior of neural networks by comparing representa- tions between layers and between different trained models. We examine methods for comparing neu- ral network representations based on canonical correlation analysis (CCA). We show that CCA belongs to a family of statistics for measuring mul- tivariate similarity, but that neither CCA nor any other statistic that is invariant to invertible linear transformation can measure meaningful similari- ties between representations of higher dimension than the number of data points. We introduce a similarity index that measures the relationship between representational similarity matrices and does not suffer from this limitation. This simi- larity index is equivalent to centered kernel align- ment (CKA) and is also closely connected to CCA. Unlike CCA, CKA can reliably identify corre- spondences between representations in networks trained from different initializations.",
          "pages": 20,
          "pdfPath": "../../../RAW/1905.00414v4.pdf",
          "quiz": [
            {
              "q": "CKA is invariant to ___ transformations.",
              "options": [
                "Orthogonal",
                "Nonlinear",
                "Random noise",
                "Permutation of samples only"
              ],
              "a": 0,
              "explain": "CKA compares representation geometry, not individual neuron alignment."
            }
          ]
        },
        {
          "id": "probe-control",
          "num": 20,
          "title": "Designing and Interpreting Probes with Control Tasks",
          "authors": "Hewitt and Liang",
          "file": "1909.03368v1.pdf",
          "learn": [
            "Probe selectivity",
            "Control tasks",
            "Distinguishing extractability from organisation"
          ],
          "setconca": "Do not over-interpret high probe accuracy on SAE features.",
          "optional": false,
          "abstract": "Probes, supervised models trained to pre- dict properties (like parts-of-speech) from representations (like ELMo), have achieved high accuracy on a range of linguistic tasks. But does this mean that the representations encode linguistic structure or just that the probe has learned the linguistic task? In this paper, we propose control tasks, which associate word types with random outputs, to complement linguistic tasks. By construction, these tasks can only be learned by the probe itself. So a good probe, (one that reﬂects the representation), should be selective, achieving high linguistic task accuracy and low control task accuracy. The selectivity of a probe puts linguistic task accuracy in context with the probe’s capacity to memorize from word types. We construct control tasks for English part-of-speech tagging and dependency edge prediction, and show that popular probes on ELMo representations are not selective. We also ﬁnd that dropout, commonly used to control probe complexity, is ineffective for improving selectivity of MLPs, but that other forms of regularization are effective. Finally, we ﬁnd that while probes on the ﬁrst layer of ELMo yield slightly better part-of-speech",
          "pages": 11,
          "pdfPath": "../../../RAW/1909.03368v1.pdf",
          "quiz": [
            {
              "q": "High probe accuracy without control tasks may indicate ___?",
              "options": [
                "Probe memorisation",
                "Causal mechanism",
                "Monosemanticity",
                "Canonical decomposition"
              ],
              "a": 0,
              "explain": "Control tasks reveal whether the probe itself is doing the work."
            }
          ]
        },
        {
          "id": "mdl-probe",
          "num": 21,
          "title": "Information-Theoretic Probing with Minimum Description Length",
          "authors": "Voita and Titov",
          "file": "2003.12298v1.pdf",
          "learn": [
            "Description length vs accuracy",
            "Information organisation vs mere existence"
          ],
          "setconca": "High probe accuracy ≠ accessible concept structure.",
          "optional": false,
          "abstract": "To measure how well pretrained representa- tions encode some linguistic property, it is common to use accuracy of a probe, i.e. a classiﬁer trained to predict the property from the representations. Despite widespread adop- tion of probes, differences in their accuracy fail to adequately reﬂect differences in repre- sentations. For example, they do not substan- tially favour pretrained representations over randomly initialized ones. Analogously, their accuracy can be similar when probing for gen- uine linguistic labels and probing for random synthetic tasks. To see reasonable differences in accuracy with respect to these random base- lines, previous work had to constrain either the amount of probe training data or its model size. Instead, we propose an alternative to the standard probes, information-theoretic prob- ing with minimum description length (MDL). With MDL probing, training a probe to pre- dict labels is recast as teaching it to effectively transmit the data. Therefore, the measure of interest changes from probe accuracy to the de- scription length of labels given representations. In addition to probe quality, the description length evaluates ‘the amount of effort’ needed ",
          "pages": 14,
          "pdfPath": "../../../RAW/2003.12298v1.pdf"
        }
      ]
    },
    {
      "id": 7,
      "title": "Mechanistic interpretability foundations",
      "weeks": "11–12",
      "checkpoint": "Write mechanistic interpretation notes connecting superposition theory to your activation geometry.",
      "papers": [
        {
          "id": "transformer-circuits",
          "num": 22,
          "title": "A Mathematical Framework for Transformer Circuits",
          "authors": "Elhage et al.",
          "file": null,
          "learn": [
            "Residual-stream decomposition",
            "QK and OV circuits",
            "Paths through transformers",
            "Mechanistic vs correlational analysis"
          ],
          "setconca": "Context for where SAE features live in the residual stream.",
          "url": "https://transformer-circuits.pub/2021/framework/index.html",
          "optional": false,
          "missing_local": true,
          "abstract": ""
        },
        {
          "id": "superposition",
          "num": 23,
          "title": "Toy Models of Superposition",
          "authors": "Elhage et al. (Anthropic)",
          "file": "2209.pdf",
          "learn": [
            "Superposition: more features than dimensions via almost-orthogonal directions",
            "Polysemantic vs monosemantic neurons — both can coexist",
            "Feature benefit vs interference — two competing forces",
            "Phase changes: not learned → superposition → dedicated dimension",
            "Feature dimensionality D_i and sticky geometric points (½, ⅔, ¾…)",
            "Uniform polytopes: digons, triangles, pentagons, tetrahedra (Thomson problem)",
            "Linear model = PCA (no superposition); ReLU enables superposition",
            "Correlated features → orthogonal local bases; anti-correlated → negative interference",
            "Computation in superposition (absolute value circuit)",
            "Three ways out: no superposition, overcomplete basis (SAEs), hybrid",
            "Adversarial vulnerability increases >3× with superposition"
          ],
          "setconca": "Conceptual foundation for why SAEs are needed — SAEs are literally 'Approach 2: Finding an Overcomplete Basis' from this paper.",
          "url": "https://transformer-circuits.pub/2022/toy_model/index.html",
          "optional": false,
          "richContent": {
            "source": "2209.pdf",
            "published": "Sept 14, 2022",
            "venue": "Transformer Circuits Thread (Anthropic)",
            "url": "https://transformer-circuits.pub/2022/toy_model/index.html",
            "abstract": "Neural networks often pack many unrelated concepts into a single neuron — polysemanticity. This paper uses toy models (small ReLU networks on synthetic sparse features) to show that networks can represent more features than dimensions via superposition: almost-orthogonal directions in activation space, tolerating interference when features are sparse. Superposition is governed by phase changes, organizes features into geometric structures (digons, triangles, pentagons, tetrahedra), and may link to adversarial vulnerability.",
            "keyResults": [
              "Superposition is a real, observed phenomenon in toy ReLU models",
              "Both monosemantic and polysemantic neurons can coexist in the same model",
              "At least some computation (e.g. absolute value) can run in superposition",
              "Whether a feature is stored in superposition is governed by a phase change",
              "Superposition organizes features into geometric structures: digons, triangles, pentagons, tetrahedra",
              "Linear models (PCA-like) never superpose; adding ReLU enables radically different solutions",
              "Adversarial vulnerability increases sharply (>3×) as superposition forms"
            ],
            "hierarchy": [
              {
                "level": "Decomposability",
                "desc": "Activations decompose into independently understandable features"
              },
              {
                "level": "Linearity",
                "desc": "Features are directions: x = Σ x_i W_i"
              },
              {
                "level": "Superposition",
                "desc": "W^T W not invertible — more features than dimensions, with interference"
              },
              {
                "level": "Basis-aligned",
                "desc": "Features align with neurons (privileged basis) — monosemantic when achieved"
              }
            ],
            "forces": [
              {
                "name": "Feature benefit",
                "desc": "Representing more features reduces loss (weighted MSE by importance I_i)"
              },
              {
                "name": "Interference",
                "desc": "Non-orthogonal features cause cross-talk; sparse activations reduce cost"
              },
              {
                "name": "Privileged basis",
                "desc": "Activation functions break symmetry — encourages neuron alignment"
              },
              {
                "name": "Superposition",
                "desc": "Pushes features off basis directions into almost-orthogonal arrangements"
              }
            ],
            "models": [
              {
                "name": "Linear model",
                "eq": "h = Wx; x' = W^T h + b  →  x' = W^T W x + b",
                "behavior": "PCA-like: stores top-m most important features orthogonally. Never superposes."
              },
              {
                "name": "ReLU output model",
                "eq": "h = Wx; x' = ReLU(W^T h + b)",
                "behavior": "With sparse features, stores extra features non-orthogonally. Superposition emerges."
              },
              {
                "name": "ReLU hidden layer model",
                "eq": "h = ReLU(Wx); x' = ReLU(W^T h + b)",
                "behavior": "Privileged basis: W maps features→neurons directly. Monosemantic vs polysemantic neurons."
              }
            ],
            "syntheticData": [
              "Each x_i is a feature; zero with probability S_i (sparsity), else uniform [0,1]",
              "Importance I_i scales MSE contribution — higher I = more loss if misrepresented",
              "More features n than hidden dimensions m (n >> m)",
              "Uniform case: all S_i = S, all I_i = 1 for geometry analysis"
            ],
            "loss": "L = Σ_x Σ_i I_i (x_i − x'_i)²  — weighted reconstruction MSE",
            "featureDimensionality": {
              "formula": "D_i = ||W_i||² / Σ_j (Ŵ_i · W_j)²",
              "interpretation": "Numerator = how much feature i is represented. Denominator = how many features share its direction. D=1 dedicated dimension; D=½ antipodal pair; D=0 not learned.",
              "stickyPoints": [
                {
                  "dim": 1.0,
                  "geometry": "Dedicated dimension",
                  "color": "#7ee787"
                },
                {
                  "dim": 0.75,
                  "geometry": "Tetrahedron (3D Thomson)",
                  "color": "#6c9eff"
                },
                {
                  "dim": 0.667,
                  "geometry": "Triangle (equilateral)",
                  "color": "#a78bfa"
                },
                {
                  "dim": 0.5,
                  "geometry": "Antipodal pair (digon)",
                  "color": "#f0b060"
                },
                {
                  "dim": 0.4,
                  "geometry": "Pentagon",
                  "color": "#f07178"
                },
                {
                  "dim": 0.375,
                  "geometry": "Square antiprism",
                  "color": "#56d4dd"
                },
                {
                  "dim": 0.0,
                  "geometry": "Not learned",
                  "color": "#8b95a8"
                }
              ]
            },
            "phaseDiagram": {
              "description": "2 features in 1 dimension: three strategies — ignore extra feature W⊥[0,1], dedicated dimension W⊥[1,0], antipodal superposition W=[1,-1]. Optimal strategy discontinuously switches with sparsity and relative importance — first-order phase change.",
              "outcomes": [
                {
                  "id": "not_learned",
                  "label": "Not learned",
                  "color": "#8b95a8"
                },
                {
                  "id": "superposition",
                  "label": "Superposition (antipodal)",
                  "color": "#f0b060"
                },
                {
                  "id": "orthogonal",
                  "label": "Dedicated dimension",
                  "color": "#7ee787"
                }
              ]
            },
            "geometrySection": [
              "Uniform superposition → connection to uniform polytopes and Thomson problem",
              "Antipodal pairs (D=½) are sticky — model prefers them over wide sparsity range",
              "Features form feature geometry graphs: nodes=features, edges=|dot product|",
              "Non-uniform: pentagons deform smoothly until critical point, then snap to new polytope",
              "Correlated features prefer orthogonal arrangement (local almost-orthogonal bases)",
              "Anti-correlated features prefer same tegum factor with negative interference",
              "Correlated + capacity-limited → collapse to PCA principal component (a+b)/√2"
            ],
            "computationInSuperposition": [
              "Model computes y = |x| with ReLU: |x| = ReLU(x) + ReLU(−x)",
              "Without superposition: 2 neurons per feature (positive + negative side)",
              "With sparsity: neurons become polysemantic — primary + secondary features",
              "Asymmetric superposition motif: unequal weights W=[2,−½] with reciprocal outputs to control interference"
            ],
            "threeWaysOut": [
              {
                "approach": "1. Models without superposition",
                "desc": "L1 on activations works in toy models but likely hurts performance at scale. MoE may reduce superposition by recovering neuron sparsity as free FLOPs.",
                "saes": "Train with strong sparsity + wide dictionary — but performance tradeoff"
              },
              {
                "approach": "2. Find overcomplete basis (SAEs)",
                "desc": "Sparse coding / dictionary learning on activations. This is exactly the SAE research program. Challenge: no ground truth for feature count; interference already baked in.",
                "saes": "Core SetConCA / SAE approach — Approach 2 from the paper"
              },
              {
                "approach": "3. Hybrid",
                "desc": "Reduce superposition slightly (L1 reg) then decode remainder with SAE. Margin exists where d(loss)/d(superposition)=0.",
                "saes": "Practical pipeline: regularize then decompose"
              }
            ],
            "adversarial": "Superposition creates ε interference in W^T W off-diagonals → L2 adversarial attack surface. Vulnerability tracks features-per-dimension (1/D). Increases >3× as superposition forms.",
            "predictions": [
              "Polysemantic neurons increase with feature sparsity",
              "Later InceptionV1 layers more polysemantic (higher-level = sparser features)",
              "Early Transformer MLP neurons extremely polysemantic (token disambiguation = sparse)",
              "Mixture of Experts may show less superposition (eats sparsity gap)"
            ],
            "openQuestions": [
              "Statistical test for superposition in real models?",
              "Closed-form solutions for ReLU toy models?",
              "Feature importance and sparsity curves for real LMs?",
              "Does scaling eliminate superposition or keep constant fraction?",
              "How much computation is possible in superposition beyond storage?"
            ],
            "setconcaLinks": [
              "SAEs are explicitly 'Approach 2: Finding an Overcomplete Basis' from this paper",
              "Reconstruction quality alone does not prove monosemanticity — interference is tolerated",
              "Multi-view SetConCA must handle correlated features (local orthogonal bases) and anti-correlated features (negative interference preference)",
              "Phase changes explain why small hyperparameter changes suddenly alter feature geometry — relevant for SAE seed stability",
              "Feature dimensionality D_i is a metric you could track across SetConCA views",
              "PCA vs superposition tradeoff reappears when correlated views collapse to principal components"
            ],
            "comparisonTable": [
              [
                "Linear / PCA",
                "Max variance, orthogonal",
                "m features max",
                "No interference",
                "Not interpretable"
              ],
              [
                "Superposition (ReLU)",
                "Max weighted recon",
                ">> m features",
                "Tolerated when sparse",
                "Polysemantic neurons"
              ],
              [
                "SAE / dictionary learning",
                "Sparse recon of activations",
                "Overcomplete dict",
                "Explicit sparsity penalty",
                "More monosemantic features"
              ],
              [
                "SetConCA (your work)",
                "Sparse dict + multi-view alignment",
                "Overcomplete + set agg",
                "Sparsity + contrastive coord",
                "Goal: stable concept recovery"
              ]
            ],
            "sections": [
              "Definitions and Motivation: Features, Directions, Superposition",
              "Demonstrating Superposition (linear vs ReLU)",
              "Superposition as a Phase Change",
              "The Geometry of Superposition",
              "Superposition and Learning Dynamics",
              "Relationship to Adversarial Robustness",
              "Superposition in a Privileged Basis",
              "Computation in Superposition",
              "The Strategic Picture (3 ways out → SAEs)",
              "Discussion and Open Questions"
            ]
          },
          "abstract": "",
          "pdfPath": "../../../RAW/2209.pdf",
          "quiz": [
            {
              "q": "Superposition allows ___ features in ___ dimensions.",
              "options": [
                "Fewer; more",
                "More; fewer",
                "Equal; equal",
                "None; infinite"
              ],
              "a": 1,
              "explain": "Models can represent more sparse features than dimensions via interference."
            },
            {
              "q": "Linear models without ReLU can superpose features because of PCA.",
              "options": [
                "True",
                "False"
              ],
              "a": 1,
              "explain": "Linear models perform PCA — they never represent more than m orthogonal features. ReLU enables superposition."
            },
            {
              "q": "Feature dimensionality D_i = ½ corresponds to ___?",
              "options": [
                "Antipodal pair",
                "Dedicated dimension",
                "Not learned",
                "Pentagon"
              ],
              "a": 0,
              "explain": "Two features sharing one dimension equally → D_i = 1/(1+1) = ½."
            },
            {
              "q": "SAEs in this paper's framework are which 'way out'?",
              "options": [
                "Approach 2: overcomplete basis",
                "Approach 1: no superposition",
                "Ignore superposition",
                "Only adversarial training"
              ],
              "a": 0,
              "explain": "Sparse autoencoders / dictionary learning = finding an overcomplete basis after the fact."
            },
            {
              "q": "Adversarial vulnerability ___ as superposition forms.",
              "options": [
                "Increases >3×",
                "Decreases",
                "Stays constant",
                "Disappears"
              ],
              "a": 0,
              "explain": "Interference in W^T W creates attack surface; vulnerability tracks features-per-dimension."
            }
          ]
        },
        {
          "id": "monosemanticity",
          "num": 24,
          "title": "Towards Monosemanticity: Decomposing Language Models with Dictionary Learning",
          "authors": "Bricken et al.",
          "file": "Bricken - 2023 - Towards Monosemanticity Decomposing Language Mode.pdf",
          "learn": [
            "Features vs neurons",
            "Dictionary overcompleteness",
            "Feature splitting and polysemanticity",
            "Automated and manual interpretation"
          ],
          "setconca": "First large-scale dictionary learning on LM activations.",
          "optional": false,
          "abstract": "",
          "pages": 97,
          "pdfPath": "../../../RAW/Bricken - 2023 - Towards Monosemanticity Decomposing Language Mode.pdf"
        },
        {
          "id": "cunningham-sae",
          "num": 25,
          "title": "Sparse Autoencoders Find Highly Interpretable Features in Language Models",
          "authors": "Cunningham et al.",
          "file": "2309.08600v3.pdf",
          "learn": [
            "SAE architecture",
            "Reconstruction and sparsity objectives",
            "Feature interpretation and interventions",
            "Comparisons against neurons"
          ],
          "setconca": "Central academic SAE paper — core reference.",
          "optional": false,
          "abstract": "One of the roadblocks to a better understanding of neural networks’ internals is polysemanticity, where neurons appear to activate in multiple, semantically dis- tinct contexts. Polysemanticity prevents us from identifying concise, human- understandable explanations for what neural networks are doing internally. One hypothesised cause of polysemanticity is superposition, where neural networks represent more features than they have neurons by assigning features to an over- complete set of directions in activation space, rather than to individual neurons. Here, we attempt to identify those directions, using sparse autoencoders to re- construct the internal activations of a language model. These autoencoders learn sets of sparsely activating features that are more interpretable and monoseman- tic than directions identified by alternative approaches, where interpretability is measured by automated methods. Moreover, we show that with our learned set of features, we can pinpoint the features that are causally responsible for coun- terfactual behaviour on the indirect object identification task (Wang et al., 2022) to a finer degree than previous decompositions. This work indicates that i",
          "pages": 20,
          "pdfPath": "../../../RAW/2309.08600v3.pdf",
          "quiz": [
            {
              "q": "SAEs address polysemanticity by learning ___?",
              "options": [
                "Sparse dictionary features",
                "More neurons",
                "Bigger embeddings",
                "PCA components"
              ],
              "a": 0,
              "explain": "Overcomplete sparse dictionaries decompose superposed activations into interpretable features."
            }
          ]
        },
        {
          "id": "scaling-mono",
          "num": 26,
          "title": "Scaling Monosemanticity",
          "authors": "Templeton et al.",
          "file": "2605.29358v1.pdf",
          "learn": [
            "Scaling SAE dictionaries to large LMs",
            "Limitations at scale",
            "Completeness and uniqueness challenges"
          ],
          "setconca": "Scale alone does not guarantee canonical decomposition.",
          "optional": false,
          "abstract": "We demonstrate that sparse autoencoders can extract interpretable features from Claude 3 Sonnet, a production-scale language model, addressing the open question of whether dictionary learning methods scale beyond small transformers. We trained sparse autoencoders with up to 34 million features on the model’s middle layer residual stream, using scaling laws to guide hyperparameter selection. The resulting features are multilingual and multimodal (generalizing to images despite text-only training), respond to both concrete instances and abstract discussions of concepts, and can be used to steer model behavior in ways consistent with their interpretations. We find features corresponding to famous entities and locations, as well as more abstract concepts like sarcasm or errors in code. We also identify features relevant to ways in which language models might cause harm—including features representing deception, power-seeking, sycophancy, and bias—and show that these causally influence model outputs when manipulated. Additionally, we conduct analyses of feature interpretability, geometry, and computational function. However, significant limitations remain: our suite of features is incom",
          "pages": 71,
          "pdfPath": "../../../RAW/2605.29358v1.pdf"
        }
      ]
    },
    {
      "id": 8,
      "title": "Modern SAE architectures",
      "weeks": "13–14",
      "checkpoint": "Train L1, TopK, Gated, JumpReLU, BatchTopK, Matryoshka SAEs at matched reconstruction/sparsity. Plot Pareto curves.",
      "papers": [
        {
          "id": "topk-sae",
          "num": 27,
          "title": "Scaling and Evaluating Sparse Autoencoders",
          "authors": "Gao et al.",
          "file": "2406.04093v1.pdf",
          "learn": [
            "TopK SAEs",
            "Dictionary width and expansion factor",
            "Reconstruction-sparsity frontiers",
            "Compare at matched sparsity or fidelity"
          ],
          "setconca": "Main reference for TopK SAE training and evaluation.",
          "optional": false,
          "abstract": "Sparse autoencoders provide a promising unsupervised approach for extracting in- terpretable features from a language model by reconstructing activations from a sparse bottleneck layer. Since language models learn many concepts, autoencoders need to be very large to recover all relevant features. However, studying the proper- ties of autoencoder scaling is difficult due to the need to balance reconstruction and sparsity objectives and the presence of dead latents. We propose using k-sparse autoencoders [Makhzani and Frey, 2013] to directly control sparsity, simplifying tuning and improving the reconstruction-sparsity frontier. Additionally, we find modifications that result in few dead latents, even at the largest scales we tried. Us- ing these techniques, we find clean scaling laws with respect to autoencoder size and sparsity. We also introduce several new metrics for evaluating feature qual- ity based on the recovery of hypothesized features, the explainability of activation patterns, and the sparsity of downstream effects. These metrics all generally im- prove with autoencoder size. To demonstrate the scalability of our approach, we train a 16 million latent autoencoder on GPT-",
          "pages": 34,
          "pdfPath": "../../../RAW/2406.04093v1.pdf"
        },
        {
          "id": "gated-sae",
          "num": 28,
          "title": "Improving Dictionary Learning with Gated Sparse Autoencoders",
          "authors": "Rajamanoharan et al.",
          "file": "2404.16014v2.pdf",
          "learn": [
            "Separating activation gate from magnitude",
            "Addressing L1 shrinkage"
          ],
          "setconca": "Architecture choice affects feature quality at same sparsity.",
          "optional": false,
          "abstract": "",
          "pages": 37,
          "pdfPath": "../../../RAW/2404.16014v2.pdf"
        },
        {
          "id": "jumprelu",
          "num": 29,
          "title": "Jumping Ahead: Improving Reconstruction Fidelity with JumpReLU SAEs",
          "authors": "Rajamanoharan et al.",
          "file": "2407.14435v3.pdf",
          "learn": [
            "Learned activation threshold",
            "L0-style sparsity optimisation"
          ],
          "setconca": "Why L1 SAEs are no longer the default.",
          "optional": false,
          "abstract": "",
          "pages": 26,
          "pdfPath": "../../../RAW/2407.14435v3.pdf"
        },
        {
          "id": "batchtopk",
          "num": 30,
          "title": "BatchTopK Sparse Autoencoders",
          "authors": "Bussmann and Leask",
          "file": "2412.06410v1.pdf",
          "learn": [
            "Batch-level sparsity constraints",
            "Variable features per token"
          ],
          "setconca": "Flexible sparsity for heterogeneous activations.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) have emerged as a powerful tool for interpreting language model activations by decomposing them into sparse, interpretable features. A popular approach is the TopK SAE, that uses a fixed number of the most active latents per sample to reconstruct the model activations. We introduce BatchTopK SAEs, a training method that improves upon TopK SAEs by relaxing the top- k constraint to the batch-level, allowing for a variable number of latents to be active per sample. As a result, BatchTopK adaptively allocates more or fewer latents depending on the sample, improving reconstruction without sacrificing average sparsity. We show that BatchTopK SAEs consistently outperform TopK SAEs in reconstructing activations from GPT-2 Small and Gemma 2 2B, and achieve comparable performance to state-of-the-art JumpReLU SAEs. However, an advantage of BatchTopK is that the average number of latents can be directly specified, rather than approximately tuned through a costly hyperparameter sweep. We provide code for training and evaluating BatchTopK SAEs at https://github. com/bartbussmann/BatchTopK. 1",
          "pages": 6,
          "pdfPath": "../../../RAW/2412.06410v1.pdf"
        },
        {
          "id": "matryoshka",
          "num": 31,
          "title": "Learning Multi-Level Features with Matryoshka Sparse Autoencoders",
          "authors": "Bussmann et al.",
          "file": "2503.17547v1.pdf",
          "learn": [
            "Hierarchical features at multiple sparsity levels",
            "Atomic vs high-level concepts",
            "Nested representations"
          ],
          "setconca": "Relevant to multi-granularity concept structure in SetConCA.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) have emerged as a powerful tool for interpreting neural networks by extracting the concepts represented in their acti- vations. However, choosing the size of the SAE dictionary (i.e. number of learned concepts) cre- ates a tension: as dictionary size increases to cap- ture more relevant concepts, sparsity incentivizes features to be split or absorbed into more spe- cific features, leaving high-level features missing or warped. We introduce Matryoshka SAEs, a novel variant that addresses these issues by simul- taneously training multiple nested dictionaries of increasing size, forcing the smaller dictionaries to independently reconstruct the inputs without using the larger dictionaries. This organizes fea- tures hierarchically - the smaller dictionaries learn general concepts, while the larger dictionaries learn more specific concepts, without incentive to absorb the high-level features. We train Ma- tryoshka SAEs on Gemma-2-2B and TinyStories and find superior performance on sparse prob- ing and targeted concept erasure tasks, more dis- entangled concept representations, and reduced feature absorption. While there is a minor trade- off with reconstruction",
          "pages": 23,
          "pdfPath": "../../../RAW/2503.17547v1.pdf"
        }
      ]
    },
    {
      "id": 9,
      "title": "SAE evaluation and failure modes",
      "weeks": "15",
      "checkpoint": "Design evaluation protocol using SAEBench families. Document what each metric does and does not establish.",
      "papers": [
        {
          "id": "principled-eval",
          "num": 32,
          "title": "Towards Principled Evaluations of Sparse Autoencoders for Interpretability and Control",
          "authors": "Makelov et al.",
          "file": "2405.08366v3.pdf",
          "learn": [
            "Task-relevant approximation and control",
            "Why reconstruction/sparsity alone fail"
          ],
          "setconca": "Required reading before proposing new SAE methods.",
          "optional": false,
          "abstract": "Disentangling model activations into meaningful features is a central prob- lem in interpretability. However, the absence of ground-truth for these features in realistic scenarios makes validating recent approaches, such as sparse dictionary learning, elusive. To address this challenge, we propose a framework for evaluating feature dictionaries in the context of specific tasks, by comparing them against supervised feature dictionaries. First, we demonstrate that supervised dictionaries achieve excellent approximation, control, and interpretability of model computations on the task. Second, we use the supervised dictionaries to develop and contextualize evaluations of unsupervised dictionaries along the same three axes. We apply this framework to the indirect object identification (IOI) task using GPT-2 Small, with sparse autoencoders (SAEs) trained on either the IOI or OpenWebText datasets. We find that these SAEs capture interpretable fea- tures for the IOI task, but they are less successful than supervised features in controlling the model. Finally, we observe two qualitative phenomena in SAE training: feature occlusion (where a causally relevant concept is robustly overshadowed ",
          "pages": 51,
          "pdfPath": "../../../RAW/2405.08366v3.pdf"
        },
        {
          "id": "absorption",
          "num": 33,
          "title": "A is for Absorption: Studying Feature Splitting and Absorption in Sparse Autoencoders",
          "authors": "Chanin et al.",
          "file": "2409.14507v6.pdf",
          "learn": [
            "Feature splitting: one concept across features",
            "Feature absorption: one feature, many concepts"
          ],
          "setconca": "Challenges atomic concept assumption.",
          "optional": false,
          "abstract": "Sparse Autoencoders (SAEs) aim to decompose the activation space of large language models (LLMs) into human-interpretable latent directions or features. As we increase the number of features in the SAE, hierarchical features tend to split into finer features (“math” may split into “algebra”, “geometry”, etc.), a phenomenon referred to as feature splitting. However, we show that sparse decomposition and splitting of hierarchical features is not robust. Specifically, we show that seemingly monosemantic features fail to fire where they should, and instead get “absorbed” into their children features. We coin this phenomenon feature absorption, and show that it is caused by optimizing for sparsity in SAEs whenever the underlying features form a hierarchy. We introduce a metric to detect absorption in SAEs, and validate our findings empirically on hundreds of LLM SAEs. Our investigation suggests that varying SAE sizes or sparsity is insufficient to solve this issue. We discuss the implications of feature absorption in SAEs and some potential approaches to solve the fundamental theoretical issues before SAEs can be used for interpreting LLMs robustly and at scale. 1",
          "pages": 31,
          "pdfPath": "../../../RAW/2409.14507v6.pdf"
        },
        {
          "id": "non-canonical",
          "num": 34,
          "title": "Sparse Autoencoders Do Not Find Canonical Units of Analysis",
          "authors": "Leask et al.",
          "file": "2502.04878v1.pdf",
          "learn": [
            "Different decompositions at same quality",
            "Stitching and higher-level analysis"
          ],
          "setconca": "Critical for SetConCA research narrative.",
          "optional": false,
          "abstract": "A common goal of mechanistic interpretability is to decompose the activations of neural networks into features: interpretable properties of the input computed by the model. Sparse autoencoders (SAEs) are a popular method for finding these features in LLMs, and it has been postulated that they can be used to find a canon- ical set of units: a unique and complete list of atomic features. We cast doubt on this belief using two novel techniques: SAE stitching to show they are in- complete, and meta-SAEs to show they are not atomic. SAE stitching involves inserting or swapping latents from a larger SAE into a smaller one. Latents from the larger SAE can be divided into two categories: novel latents, which improve performance when added to the smaller SAE, indicating they capture novel in- formation, and reconstruction latents, which can replace corresponding latents in the smaller SAE that have similar behavior. The existence of novel features in- dicates incompleteness of smaller SAEs. Using meta-SAEs - SAEs trained on the decoder matrix of another SAE - we find that latents in SAEs often decom- pose into combinations of latents from a smaller SAE, showing that larger SAE latents are n",
          "pages": 23,
          "pdfPath": "../../../RAW/2502.04878v1.pdf",
          "quiz": [
            {
              "q": "Different SAEs with similar reconstruction may find ___?",
              "options": [
                "Different decompositions",
                "Identical features",
                "No features",
                "Only PCA directions"
              ],
              "a": 0,
              "explain": "There is no guaranteed canonical sparse decomposition — a key SetConCA narrative point."
            }
          ]
        },
        {
          "id": "saebench",
          "num": 35,
          "title": "SAEBench: A Comprehensive Benchmark for Sparse Autoencoders",
          "authors": "Karvonen et al.",
          "file": "2503.09532v4.pdf",
          "learn": [
            "Multiple evaluation families",
            "Feature detection, steering, reconstruction",
            "Proxy metrics vs downstream usefulness"
          ],
          "setconca": "Standard evaluation suite to replicate.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) are a popular tech- nique for interpreting language model activations, and there is extensive recent work on improving SAE effectiveness. However, most prior work evaluates progress using unsupervised proxy met- rics with unclear practical relevance. We in- troduce SAEBench, a comprehensive evaluation suite that measures SAE performance across eight diverse metrics, spanning interpretability, feature disentanglement and practical applications like unlearning. To enable systematic comparison, we open-source a suite of over 200 SAEs across seven recently proposed SAE architectures and training algorithms. Our evaluation reveals that gains on proxy metrics do not reliably translate to better practical performance. For instance, while Matryoshka SAEs slightly underperform on ex- isting proxy metrics, they substantially outper- form other architectures on feature disentangle- ment metrics; moreover, this advantage grows with SAE scale. By providing a standardized framework for measuring progress in SAE de- velopment, SAEBench enables researchers to study scaling trends and make nuanced compar- isons between different SAE architectures and training methodologie",
          "pages": 42,
          "pdfPath": "../../../RAW/2503.09532v4.pdf"
        },
        {
          "id": "bench-reliable",
          "num": 36,
          "title": "Are Sparse Autoencoder Benchmarks Reliable?",
          "authors": "Chanin",
          "file": "2605.18229v1.pdf",
          "learn": [
            "Auditing SAEBench assumptions",
            "Reseed noise and ground-truth correlation"
          ],
          "setconca": "Read after SAEBench — calibrate metric trust.",
          "optional": false,
          "abstract": "Sparse autoencoders (SAEs) are a core interpretability tool for large language models, and progress on SAE architectures depends on benchmarks that reliably distinguish better SAEs from worse ones. We audit the SAE quality metrics in SAEBench, the de-facto standard SAE evaluation suite, through three complemen- tary lenses: reseed noise on a fixed SAE, ground-truth correlation on synthetic SAEs, and discriminability across training trajectories. We find that two of these metrics, Targeted Probe Perturbation (TPP) and Spurious Correlation Removal (SCR), fail multiple lenses at their canonical settings and should not be used to eval- uate SAEs. The other metrics show higher reseed noise and lower discriminability than the field assumes. The sae-probes variant of k-sparse probing is the most reliable metric we tested, but even sae-probes struggles to separate variants of the same SAE architecture. Our results show the field needs better SAE benchmarks. 1",
          "pages": 32,
          "pdfPath": "../../../RAW/2605.18229v1.pdf"
        },
        {
          "id": "feature-hedging",
          "num": null,
          "title": "Feature Hedging: Correlated Features Break Narrow Sparse Autoencoders",
          "authors": "Chanin et al.",
          "file": "2505.11756v2.pdf",
          "learn": [
            "Correlated concepts merge in narrow dictionaries"
          ],
          "setconca": "Optional: dictionary width requirements.",
          "optional": true,
          "abstract": "It is assumed that sparse autoencoders (SAEs) decompose polysemantic activa- tions into interpretable linear directions, as long as the activations are composed of sparse linear combinations of underlying features. However, we find that if an SAE is more narrow than the number of underlying “true features” on which it is trained, and there is correlation between features, the SAE will merge compo- nents of correlated features together, thus destroying monosemanticity. In LLM SAEs, these two conditions are almost certainly true. This phenomenon, which we call feature hedging, is caused by SAE reconstruction loss, and is more severe the narrower the SAE. In this work, we introduce the problem of feature hedg- ing and study it both theoretically in toy models and empirically in SAEs trained on LLMs. We suspect that feature hedging may be one of the core reasons that SAEs consistently underperform supervised baselines. Finally, we use our under- standing of feature hedging to propose an improved variant of matryoshka SAEs. Importantly, our work shows that SAE width is not a neutral hyperparameter: nar- rower SAEs suffer more from hedging than wider SAEs. 1",
          "pages": 21,
          "pdfPath": "../../../RAW/2505.11756v2.pdf"
        },
        {
          "id": "geometric-wall",
          "num": null,
          "title": "The Geometric Wall: Manifold Structure Predicts Layerwise SAE Scaling Laws",
          "authors": "Zaher et al.",
          "file": "2605.09887v1.pdf",
          "learn": [
            "Intrinsic activation geometry limits SAE scaling"
          ],
          "setconca": "Optional: layer-wise scaling constraints.",
          "optional": true,
          "abstract": "Sparse autoencoders (SAEs) operationalise the linear representation hypothesis: they reconstruct model activations as sparse linear combinations of interpretable dictionary atoms, on the implicit assumption that activation space is well approx- imated by a globally linear structure. Their reconstruction error varies sharply across layers in ways that existing scaling laws, fitted at single layers, do not explain. We argue that this variation is the empirical trace of a geometric mis- match: where the activation manifold is curved and its intrinsic dimension varies across layers, no sparse linear dictionary can match it uniformly, and the SAE’s width-sparsity scaling becomes a layer-dependent function of manifold structure rather than a single universal law. We conduct the first cross-layer SAE scaling study, fitting and regressing on 844 residual-stream Gemma Scope SAE check- points across 68 layers of Gemma 2 2B and 9B. Stage 1 fits a per-layer scaling-law surface; Stage 2 regresses the fitted parameters and the derived per-layer width exponents on four layerwise geometric summaries. We find that manifold ge- ometry predicts the per-layer width exponent in both models, and that th",
          "pages": 27,
          "pdfPath": "../../../RAW/2605.09887v1.pdf"
        }
      ]
    },
    {
      "id": 10,
      "title": "Papers closest to SetConCA research",
      "weeks": "16",
      "checkpoint": "Write 3 research hypotheses: one assumption to challenge, one experiment to reproduce, one SetConCA extension.",
      "central_question": "Under what assumptions does multi-view supervision cause a sparse dictionary to recover more stable, complete, specific, or causally useful concepts than a pointwise SAE?",
      "papers": [
        {
          "id": "temporal-sae",
          "num": 37,
          "title": "Temporal Sparse Autoencoders",
          "authors": "Bhalla et al.",
          "file": "2511.05541v2.pdf",
          "learn": [
            "Temporal coordination between adjacent tokens",
            "Contrastive regularisation on SAE codes",
            "Sparsity vs temporal consistency"
          ],
          "setconca": "SetConCA generalises from temporal pairs to multi-view semantic objects.",
          "optional": false,
          "abstract": "Translating the internal representations and computations of models into concepts that humans can understand is a key goal of interpretability. While recent dic- tionary learning methods such as Sparse Autoencoders (SAEs) provide a promis- ing route to discover human-interpretable features, they often only recover token- specific, noisy, or highly local concepts. We argue that this limitation stems from neglecting the temporal structure of language, where semantic content typically evolves smoothly over sequences. Building on this insight, we introduce Tempo- ral Sparse Autoencoders (T-SAEs), which incorporate a novel contrastive loss en- couraging consistent activations of high-level features over adjacent tokens. This simple yet powerful modification enables SAEs to disentangle semantic from syn- tactic features in a self-supervised manner. Across multiple datasets and models, T-SAEs recover smoother, more coherent semantic concepts without sacrificing reconstruction quality. Strikingly, they exhibit clear semantic structure despite being trained without explicit semantic signal, offering a new pathway for unsu- pervised interpretability in language models. 1",
          "pages": 29,
          "pdfPath": "../../../RAW/2511.05541v2.pdf",
          "quiz": [
            {
              "q": "Temporal SAEs use ___ as related pairs.",
              "options": [
                "Adjacent token activations",
                "Random tokens",
                "Different models",
                "Dead features"
              ],
              "a": 0,
              "explain": "Sequential language structure provides natural positive pairs for contrastive coordination."
            },
            {
              "q": "SetConCA generalises temporal pairs to ___?",
              "options": [
                "Multi-view semantic objects",
                "Different models only",
                "PCA directions",
                "Dead features"
              ],
              "a": 0,
              "explain": "Your project coordinates multiple views of the same concept, not just adjacent tokens."
            }
          ]
        },
        {
          "id": "conca",
          "num": 38,
          "title": "Concept Component Analysis",
          "authors": "Liu et al.",
          "file": "2601.20420v2.pdf",
          "learn": [
            "Generative process for concept components",
            "Log-posterior representation",
            "Identifiability and linear unmixing"
          ],
          "setconca": "Alternative decomposition framework — direct competitor/complement.",
          "optional": false,
          "abstract": "Developing human understandable interpretation of large language models (LLMs) becomes in- creasingly critical for their deployment in essen- tial domains. Mechanistic interpretability seeks to mitigate the issues through extracts human- interpretable process and concepts from LLMs’ activations. Sparse autoencoders (SAEs) have emerged as a popular approach for extracting in- terpretable and monosemantic concepts by decom- posing the LLM internal representations into a dic- tionary. Despite their empirical progress, SAEs suffer from a fundamental theoretical ambiguity: the well-defined correspondence between LLM representations and human-interpretable concepts remains unclear. This lack of theoretical ground- ing gives rise to several methodological chal- lenges, including difficulties in principled method design and evaluation criteria. In this work, we show that, under mild assumptions, LLM repre- sentations can be approximated as a linear mix- ture of the log-posteriors over concepts given the input context, through the lens of a latent vari- able model where concepts are treated as latent variables. This motivates a principled framework for concept extraction, namely Concept Com",
          "pages": 36,
          "pdfPath": "../../../RAW/2601.20420v2.pdf",
          "quiz": [
            {
              "q": "ConCA recovers concepts via ___?",
              "options": [
                "Linear unmixing",
                "TopK SAE only",
                "Mean pooling",
                "SimCLR"
              ],
              "a": 0,
              "explain": "ConCA assumes a linear mixture generative model — closer to ICA than standard SAE training."
            }
          ]
        },
        {
          "id": "mv-causal",
          "num": 39,
          "title": "Multi-View Causal Representation Learning with Partial Observability",
          "authors": "Yao et al.",
          "file": "2311.04056v2.pdf",
          "learn": [
            "When multiple views permit latent recovery",
            "Partial observability",
            "Identifiability under explicit assumptions"
          ],
          "setconca": "Theoretical foundation for multi-view concept identifiability.",
          "optional": false,
          "abstract": "We present a unified framework for studying the identifiability of representations learned from simultaneously observed views, such as different data modalities. We allow a partially observed setting in which each view constitutes a nonlinear mixture of a subset of underlying latent variables, which can be causally related. We prove that the information shared across all subsets of any number of views can be learned up to a smooth bijection using contrastive learning and a single encoder per view. We also provide graphical criteria indicating which latent variables can be identified through a simple set of rules, which we refer to as identifiability algebra. Our general framework and theoretical results unify and extend several previous works on multi-view nonlinear ICA, disentanglement, and causal representation learning. We experimentally validate our claims on numerical, image, and multi- modal data sets. Further, we demonstrate that the performance of prior methods is recovered in different special cases of our setup. Overall, we find that access to multiple partial views enables us to identify a more fine-grained representation, under the generally milder assumption of partial",
          "pages": 32,
          "pdfPath": "../../../RAW/2311.04056v2.pdf"
        }
      ]
    }
  ],
  "metricTable": [
    [
      "Reconstruction / FVU",
      "Information preservation",
      "Interpretability or atomicity"
    ],
    [
      "L0, L1, active features",
      "Sparsity",
      "Monosemanticity"
    ],
    [
      "Dead-feature rate",
      "Dictionary utilisation",
      "Feature quality"
    ],
    [
      "CKA / SVCCA",
      "Subspace similarity",
      "Same individual concepts"
    ],
    [
      "Recall@1 / MRR",
      "Neighbourhood alignment",
      "Causal relevance or disentanglement"
    ],
    [
      "Pos-minus-neg cosine",
      "Contrastive separation",
      "Concept completeness"
    ],
    [
      "Linear probe",
      "Decodability",
      "Representation causally uses concept"
    ],
    [
      "k-sparse probe",
      "Sparse decodability",
      "SAE features are canonical"
    ],
    [
      "Steering / ablation",
      "Intervention effect",
      "Complete causal mechanism"
    ],
    [
      "Seed stability",
      "Repeatability",
      "Correct semantic decomposition"
    ]
  ],
  "schedule16Weeks": [
    {
      "weeks": "1–2",
      "topic": "PCA, ICA, CCA",
      "output": "Implement and compare decompositions"
    },
    {
      "weeks": "3–4",
      "topic": "Sparse AEs and VAEs",
      "output": "L1 vs TopK experiment"
    },
    {
      "weeks": "5–6",
      "topic": "DCCA, DCCAE, VCCA, DGCCA",
      "output": "Shared/private latent analysis"
    },
    {
      "weeks": "7",
      "topic": "Deep Sets, Set Transformer",
      "output": "Aggregator comparison"
    },
    {
      "weeks": "8–9",
      "topic": "CPC, SupCon, alignment, VICReg",
      "output": "Contrastive-loss ablations"
    },
    {
      "weeks": "10",
      "topic": "SVCCA, CKA, probing",
      "output": "Evaluation notebook"
    },
    {
      "weeks": "11–12",
      "topic": "Circuits and superposition",
      "output": "Mechanistic notes"
    },
    {
      "weeks": "13–14",
      "topic": "Modern SAE architectures",
      "output": "Matched Pareto comparison"
    },
    {
      "weeks": "15",
      "topic": "SAE failure modes",
      "output": "Evaluation protocol"
    },
    {
      "weeks": "16",
      "topic": "Temporal SAE, ConCA, MV causal",
      "output": "SetConCA research hypotheses"
    }
  ]
};
