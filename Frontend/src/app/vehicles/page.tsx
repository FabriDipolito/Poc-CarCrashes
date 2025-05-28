export const dynamic = 'force-dynamic';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DataTable } from './Table/datatable';
import { getAvailableYears } from '@/lib/api';
import { VehiclesCharts } from './Charts/charts';

const VehiclesPage = async () => {
  const arrayOfYears = await getAvailableYears();

  return (
    <div className="flex h-fit w-full min-w-370">
      <Accordion type="single" collapsible defaultValue="Table">
        <AccordionItem value="Charts">
          <AccordionTrigger>Accident Analysis Charts by Vehicles</AccordionTrigger>
          <AccordionContent>
            <VehiclesCharts arrayOfYears={arrayOfYears} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Table">
          <AccordionTrigger>Accident Data Table Overview</AccordionTrigger>
          <AccordionContent>
            <div className="w-full flex flex-row gap-5 p-4 justify-between box-border">
              <DataTable />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default VehiclesPage;
