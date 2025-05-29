import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import Heading from "@theme/Heading";
import styles from "./index.module.css";

const FeatureList = [
  {
    title: "Documentation Complète",
    description: (
      <>
        Une documentation détaillée et structurée pour vous guider à travers
        tous les aspects du projet PFE.
      </>
    ),
  },
  {
    title: "Guide Pratique",
    description: (
      <>
        Des tutoriels étape par étape et des exemples concrets pour une mise en
        œuvre rapide et efficace.
      </>
    ),
  },
  {
    title: "Ressources Techniques",
    description: (
      <>
        Accédez aux spécifications techniques, APIs, et outils de développement
        nécessaires pour votre projet.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
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

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/guide-demarrage-rapide"
          >
            Guide de démarrage rapide ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg margin-left--md"
            to="/docs/intro"
          >
            Explorer la Documentation 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Accueil - ${siteConfig.title}`}
      description="Documentation officielle du projet PFE - Guide complet, tutoriels et ressources techniques"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className="padding-vert--lg">
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <div className="text--center">
                  <Heading as="h2">À propos de ce projet</Heading>
                  <p className="lead">
                    Cette documentation vous accompagne dans la découverte et
                    l'utilisation du projet PFE. Que vous soyez développeur,
                    utilisateur final ou contributeur, vous trouverez ici toutes
                    les informations nécessaires pour réussir.
                  </p>
                  <div className="margin-top--lg">
                    <Link
                      className="button button--primary button--lg"
                      to="/docs/intro"
                    >
                      Commencer maintenant →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
