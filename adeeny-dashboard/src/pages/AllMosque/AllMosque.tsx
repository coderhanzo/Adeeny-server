import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import MosqueTable from './MosqueTable';

interface AllMosqueProps {
  token: string | null; 
}

const AllMosque: React.FC<AllMosqueProps> = ({ token }) => {
  return (
    <>
      <Breadcrumb pageName="All Mosque" />

      <div className="flex flex-col gap-10">
        {token ? (
          <MosqueTable token={token} />
        ) : (
          null
        )}
      </div>
    </>
  );
};

export default AllMosque;