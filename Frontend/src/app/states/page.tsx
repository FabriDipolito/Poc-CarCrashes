export const dynamic = 'force-dynamic';

import { DataTable } from './Table/datatable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StateCharts } from './Charts/charts';
import { getAvailableYears } from '@/lib/api';

const StatesPage = async () => {
  const arrayOfYears = await getAvailableYears();

  return (
    <div className="flex h-fit w-full min-w-370">
      <Accordion type="single" collapsible defaultValue="Table">
        <AccordionItem value="Charts">
          <AccordionTrigger>Accident Analysis Charts</AccordionTrigger>
          <AccordionContent className="border-1 border-gray-200">
            <StateCharts arrayOfYears={arrayOfYears} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="Table">
          <AccordionTrigger>Accident Data Table Overview</AccordionTrigger>
          <AccordionContent>
            <DataTable arrayOfYears={arrayOfYears} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StatesPage;
