import { grammarType } from '../propTypes';

export default function GrammarSection({ grammar }) {
  const { title, points, table } = grammar;
  return (
    <section>
      <h2>{title}</h2>
      <ul className="grammar-points">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <div className="table-scroll">
        <table className="table">
          <thead>
            <tr>
              {table.headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, column) => (
                  <td key={table.headers[column]}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

GrammarSection.propTypes = {
  grammar: grammarType.isRequired,
};
