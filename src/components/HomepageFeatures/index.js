import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Toolbox',
    Svg: require('@site/static/img/toolbox.svg').default,
    description: (
      <>
        Prototype, engineer and release a toolbox for value-aware AI.
      </>
    ),
  },
  {
    title: 'Components',
    Svg: require('@site/static/img/components.svg').default,
    description: (
      <>
        Create value-aware applications with the defined components.
      </>
    ),
  },
  {
    title: 'Use cases',
    Svg: require('@site/static/img/use_cases.svg').default,
    description: (
      <>
        Do studies with real users addind value-awareness.
      </>
    ),
  }
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
