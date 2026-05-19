export default function Table({ headers, children }) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/80 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
            <tr>{headers.map((h, i) => <th key={i} className="p-5 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="text-gray-700 text-sm">{children}</tbody>
        </table>
      </div>
    );
  }
  