import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-header">
      <h1>Page not found</h1>
      <p>We could not find that page.</p>
      <Link className="button" to="/">
        Back to the course
      </Link>
    </section>
  );
}
