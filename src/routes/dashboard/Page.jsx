import React from 'react';
import TopCard from '../../components/TopCard';
import AdminProfitChart from '../../components/AdminProfitChart';


function Page() {
  return (
    <div >
      {/* Top Summary Cards */}
      <TopCard />

      {/* Grid for Charts */}
    
        <AdminProfitChart />
 
   
    </div>
  );
} 

export default Page;

