import Payment from "@/components/Payment";
import NavBar from "@/components/NavBar";
import Sell from "@/components/Sell";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="grid grid-cols-10">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="grid col-span-9 grid-cols-auto auto-rows-auto">
        <div className="">
          <NavBar />
        </div>
        <div className="grid grid-cols-5">
          <div className="col-span-4">
            <Sell />
          </div>
          <div className="col-span-1">
            <Payment />
          </div>
        </div>
      </div>
    </div>
  );
}
