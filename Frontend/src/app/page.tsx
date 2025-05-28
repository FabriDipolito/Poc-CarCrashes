export const dynamic = 'force-dynamic';

import { DialogClient } from "@/components/Dialog/DialogClient";
import { getAvailableYears, getTotalRecords } from "@/lib/api";

export default async function Home() {
  const arrayOfYears = await getAvailableYears();
  const totalRecords = await getTotalRecords();
  
  return (
    <div className="w-full flex justify-center items-center h-fit">
      <DialogClient arrayOfYears={arrayOfYears} totalRecords={totalRecords}/>
    </div>
  );
}