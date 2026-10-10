import { Link } from 'react-router-dom';
import EmailLink from '../components/EmailLink';
import ENCOUNTERS from '../data/game';
import { MAX_LIVES } from '../lib/game';

const AUTHOR = {
  name: 'Oleksandr Generalov',
  role: 'Senior AI developer',
  location: 'Poland',
  summary:
    'AI Engineer with 15+ years of experience in AI, Machine Learning, DevOps, MLOps and Full Stack Development. Proven expertise in CI/CD pipelines, cloud infrastructure (AWS, GCP, Azure), Kubernetes, Docker, Terraform, Jenkins, and automation with Python and ReactJS. Hands-on experience fine-tuning and deploying ML models, orchestrating complex environments and leading development teams. Passionate about AI, cloud-native solutions and infrastructure as code (IaC).',
  // Kept reversed so the address is not readable in the source; see EmailLink.
  email: { reversedUser: 'volareneho', reversedDomain: 'moc.liamg' },
  links: [
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/oleksandr-heneralov-82389640',
      href: 'https://www.linkedin.com/in/oleksandr-heneralov-82389640/',
    },
    {
      label: 'GitHub',
      text: 'github.com/oheneralov/main-website',
      href: 'https://github.com/oheneralov/main-website',
    },
  ],
  skills: [
    { area: 'Cloud', items: 'AWS, GCP, Azure' },
    { area: 'CI/CD', items: 'Jenkins, GitHub Actions, Airflow, Azure DevOps' },
    { area: 'Containers & Orchestration', items: 'Docker, Kubernetes, Helm' },
    { area: 'IaC & Automation', items: 'Terraform, Ansible, Bash, Python' },
    {
      area: 'Monitoring & Logging',
      items:
        'ELK, Prometheus, Grafana, CloudWatch, CloudTrail, LangSmith, Langfuse, Promptfoo, MLflow',
    },
    {
      area: 'ML/MLOps',
      items:
        'Amazon SageMaker, Vertex AI, Azure ML, Airflow, Keras, TensorFlow, PyTorch, GAN, RNN, Hugging Face, LangChain / LangGraph, LLM, NLP',
    },
    { area: 'Languages', items: 'Python, JavaScript/TypeScript, Node.js, React, Bash' },
    { area: 'Databases', items: 'MySQL, DynamoDB, MongoDB, Redis, Qdrant, ChromaDB' },
    { area: 'Other Tools', items: 'Nginx, Kafka, Flask, React Native, Jest, Mocha, Selenium' },
  ],
};

export default function AboutPage() {
  return (
    <>
      <header className="page-header">
        <span className="badge">About</span>
        <h1>About</h1>
        <p>The game on this site and the person who made it.</p>
      </header>

      <section className="about" aria-labelledby="about-game">
        <h2 id="about-game">The game: The way home</h2>
        <p>
          A short adventure for practising everyday Polish. A small boy is walking home, and{' '}
          {ENCOUNTERS.length} obstacles stand in his way — angry men, a hungry dog, fire, a river, a
          dragon and more.
        </p>
        <p>
          At each obstacle you read the situation and choose the Polish reaction that makes sense.
          The right answer lets the boy walk on; a wrong one costs one of his {MAX_LIVES} lives.
          Every option comes with an English translation, so you learn the phrases as you play.
        </p>
        <Link className="button" to="/game">
          Play the game
        </Link>
      </section>

      <section className="about" aria-labelledby="about-author">
        <h2 id="about-author">The author: {AUTHOR.name}</h2>
        <p className="about__role">
          {AUTHOR.role} · {AUTHOR.location}
        </p>
        <p>{AUTHOR.summary}</p>

        <dl className="about__list">
          <div>
            <dt>Email</dt>
            <dd>
              <EmailLink
                reversedUser={AUTHOR.email.reversedUser}
                reversedDomain={AUTHOR.email.reversedDomain}
              />
            </dd>
          </div>
          {AUTHOR.links.map((link) => (
            <div key={link.label}>
              <dt>{link.label}</dt>
              <dd>
                <a href={link.href}>{link.text}</a>
              </dd>
            </div>
          ))}
        </dl>

        <h3>Core skills</h3>
        <dl className="about__list">
          {AUTHOR.skills.map((skill) => (
            <div key={skill.area}>
              <dt>{skill.area}</dt>
              <dd>{skill.items}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
