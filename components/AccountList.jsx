export default function AccountList({ accounts }) {
  if (!accounts.length) {
    return <p className="text-gray-500">No accounts added yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-[#1e293b]">Your Accounts</h2>

      {accounts.map((acc) => (
        <div
          key={acc.id}
          className="border rounded-xl p-4 bg-[#f8fafc] shadow-sm space-y-1"
        >
          <p className="text-lg font-semibold">{acc.nickname || acc.type}</p>
          <p className="text-sm text-gray-600">
            {acc.institution || "No institution specified"}
          </p>

          <p className="font-bold text-[#1e293b]">
            Balance: ${acc.balance.toLocaleString()}
          </p>

          {acc.interestRate && (
            <p className="text-sm text-green-700">APY: {acc.interestRate}%</p>
          )}
        </div>
      ))}
    </div>
  );
}
