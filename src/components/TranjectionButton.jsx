import { Banknote, Wallet } from "lucide-react";

export function TransactionButtons() {
  return (
    <>
      <div className="flex justify-around bg-white p-4  rounded-lg shadow-md">
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-3xl text-sm md:text-base md:px-4 md:py-2">
          <div className="bg-white rounded-3xl p-0.5 md:p-1">
            <Banknote color="black" size={16} md:size={20} />
          </div>
          Add Money
        </button>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-3xl text-sm md:text-base md:px-4 md:py-2">
          <div className="bg-white rounded-3xl p-0.5 md:p-1">
            <Wallet color="black" size={16} md:size={20} />
          </div>
          Withdrawal
        </button>
      </div>
    </>
  );
}
