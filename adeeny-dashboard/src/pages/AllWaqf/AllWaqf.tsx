import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import WaqfTable from './WaqfTable';


const AllWaqf = () => {
  return (
    <>
      <Breadcrumb pageName="All Waqf"/>
      <div className="flex flex-col gap-10">
      
        <WaqfTable  />
    
      </div>
    </>
  );
};

export default AllWaqf;
