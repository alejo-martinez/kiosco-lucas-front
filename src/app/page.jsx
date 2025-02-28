import Payment from "@/components/Payment";
import NavBar from "@/components/NavBar";
import Sell from "@/components/Sell";
import Search from "@/components/Search";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row w-full">
        <div className="flex-grow">
          <Search />
        </div>

        <div className="flex flex-col gap-4 w-fit content-end flex-wrap">

            <NavBar />

            <Payment />

        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Sell />
        </div>
      </div>
    </div>
  );
}
