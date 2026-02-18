import { format } from 'date-fns';

const ExpenseList = ({ expenses, loading }) => {
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="bg-white border rounded shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Description</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr><td colSpan="4" className="p-4 text-center text-gray-500">No expenses yet.</td></tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{format(new Date(exp.date), 'MMM dd')}</td>
                <td className="p-3">{exp.description}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {exp.category}
                  </span>
                </td>
                <td className="p-3 text-right font-bold">₹{exp.amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;